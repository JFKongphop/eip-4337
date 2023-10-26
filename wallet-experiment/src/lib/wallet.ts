import { Goerli as chain } from '@thirdweb-dev/chains';
import { VITE_FACTORY_ADDRESS, VITE_TEMPLATE_CLIENT_ID } from '../constant';
import { LocalWallet, SmartWallet } from '@thirdweb-dev/wallets';
import { ThirdwebSDK, isContractDeployed, resolveEns } from '@thirdweb-dev/sdk';

export const createSmartWallet = (): SmartWallet => {
  return new SmartWallet({
    chain,
    factoryAddress: VITE_FACTORY_ADDRESS,
    gasless: true,
    clientId: VITE_TEMPLATE_CLIENT_ID
  });
};

export async function getWalletAddressForUser(
  sdk: ThirdwebSDK,
  username: string
): Promise<string> {
  const factory = await sdk.getContract(VITE_FACTORY_ADDRESS);
  const smartWalletAddress: string = await factory.call(
    'accountOfUsername', 
    [username]);
  return smartWalletAddress;
};

export const connectToSmartWallet = async (
  username: string,
  pwd: string,
  statusCallback?: (status: string) => void,
): Promise<SmartWallet> => {
  statusCallback?.('Checking if user has a wallet...');

  const sdk = new ThirdwebSDK(
    chain, 
    {
      clientId: VITE_TEMPLATE_CLIENT_ID,
    }
  );

  const smartWalletAddress = await getWalletAddressForUser(sdk, username);

  const isDeployed = await isContractDeployed(
    smartWalletAddress,
    sdk.getProvider(),
  );

  const smartWallet = createSmartWallet();
  const personalWallet = new LocalWallet();

  if (isDeployed) {
    statusCallback?.('Username exist, accessing onChain data...');

    const contract = await sdk.getContract(smartWalletAddress);
    const metadata = await contract.metadata.get();

    const encryptedWallet = metadata.encryptedWallet;

    if (!encryptedWallet) {
      throw new Error('No encrypted wallet found');
    }

    statusCallback?.('Decrypting wallet...');

    await new Promise((resolve) => setTimeout(resolve, 300));
    await personalWallet.import({
      encryptedJson: encryptedWallet,
      password: pwd
    });

    statusCallback?.('Connecting...');
    await smartWallet.connect({
      personalWallet
    });

    return smartWallet;
  }
  else {
    statusCallback?.('New username, generating personal wallet...');

    await personalWallet.generate();
    const encryptedWallet =  await personalWallet.export({
      strategy: 'encryptedJson',
      password: pwd
    });

    await smartWallet.connect({
      personalWallet
    });

    statusCallback?.('Uploading and registering username onchain...');

    await smartWallet.deploy();

    const contract = await smartWallet.getAccountContract();

    const encryptedWalletUri = await sdk.storage.upload({
      name: username,
      encryptedWallet
    });

    await contract.call(
      'register',
      [username, encryptedWalletUri]
    );

    return smartWallet;
  }
};
