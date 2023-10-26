import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "./styles/Home.module.css";
import { useCallback, useState } from "react";
import Login from "./components/Login";
import { VITE_TEMPLATE_CLIENT_ID } from "./constant";

const ENV = import.meta.env;

const parseENV = Object.entries(ENV).map((env) => {
  if (env[0].includes('VITE')) return env;
})

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModalHandler = useCallback(() => {
    setIsModalOpen((prevToggle) => !prevToggle);
  }, [isModalOpen]);

  return (
    <div
      className={styles.container}
    >
      {
        !isModalOpen &&
        (
          <div className={styles.card}>
            <h1>Onchain Login</h1>
            <p>Login with only a username and password.</p>
            <button
              className={styles.loginButton}
              onClick={toggleModalHandler}
            >
              Login
            </button>
          </div>
        )
      }
      <Login 
        isOpen={isModalOpen}
        onClose={toggleModalHandler}
      />
    </div>
  );
}
