import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { Goerli as chain } from '@thirdweb-dev/chains';
import { Signer } from 'ethers';
import React, { FC } from 'react';
import { VITE_TEMPLATE_CLIENT_ID } from '../constant';

interface IConnected {
  username: string;
  signer: Signer;
}

const Connected: FC<IConnected> = ({
  username,
  signer
}) => {
  return (
    <ThirdwebSDKProvider
      signer={signer}
      activeChain={chain}
      clientId={VITE_TEMPLATE_CLIENT_ID}
    >
      
    </ThirdwebSDKProvider>
  )
}

export default Connected;