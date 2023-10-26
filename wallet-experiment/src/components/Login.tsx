import { Signer } from 'ethers';
import { FC, useState, MouseEvent } from 'react'
import styles from '../styles/Home.module.css';
import { Blocks } from 'react-loader-spinner';
import { connectToSmartWallet } from '../lib/wallet';

interface ILogin {
  isOpen: boolean;
  onClose: () => void;
} 

const Login: FC<ILogin> = ({
  isOpen,
  onClose
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signer, setSigner] = useState<Signer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose();
  }

  const connectWallet = async () => {
    if (!username || !password) return;

    try {
      setIsLoading(true);

      const wallet = await connectToSmartWallet(
        username,
        password,
        (status) => setLoadingStatus(status)
      );

      const signer = await wallet.getSigner();
      setSigner(signer);
      setIsLoading(false);
    }
    catch (error) {
      setIsLoading(false);
      console.error(error);
      setError((error as Error).message);
    }
  }

  const validAccount = username && signer;
 
  // return validAccount ? 
  // (
  //   <>If Connectect</>
  // )
  // :
  // isLoading ?
  // (
  //   <div className="">
  //     <p>Loading...</p>
  //   </div>
  // )
  // :
  // error ?
  // (
  //   <div className="">
  //     <p>Error</p>
  //     <button>Try Again</button>
  //   </div>
  // )
  // :
  // (
  //   <div onClick={handleOutsideClick}>
      
  //   </div>
  // );
  return username && signer ? (
    <p>
      Connected
    </p>
  ) : isLoading ? (
    <div className={styles.filler}>
      <Blocks
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
      />
      <p className={styles.label} style={{ textAlign: "center" }}>
        {loadingStatus}
      </p>
    </div>
  ) : error ? (
    <div className={styles.filler}>
      <p className={styles.label} style={{ textAlign: "center" }}>
        ❌ {error}
      </p>
      <button className={styles.button} onClick={() => setError("")}>
        Try again
      </button>
    </div>
  ) : (
    <>
      <div className={styles.row_center} style={{ marginTop: "2rem" }}>
        <a href="https://thirdweb.com">
          <img src="thirdweb.svg" className={styles.logo} alt="logo" />
        </a>
        <h1 className={styles.title}>Unilogin</h1>
      </div>
      <div className={styles.filler}>
        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} onClick={connectWallet}>
          Login
        </button>
      </div>
      {/* <Footer /> */}
    </>
  );
}



export default Login;