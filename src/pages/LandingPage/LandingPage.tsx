import { Flex } from '@mantine/core';
import { Link } from 'react-router-dom';

import styles from './LandingPage.module.scss';

function LandingPage() {
  return (
    <>
      <Flex gap="md" justify="center" align="center" direction="column">
        <span className={styles.title}>Добро пожаловать в Hitscord!</span>
        <div className={styles.buttonContainer}>
          <Link to="/auth">
            <button className={styles.loginButton}>Войти</button>
          </Link>
          <Link to="/register">
            <button className={styles.registerButton}>
              Зарегистрироваться
            </button>
          </Link>
        </div>
      </Flex>
    </>
    /*<div className={styles.mainContainer}>
      <span className={styles.title}>Добро пожаловать в Hitscord!</span>
      <div className={styles.buttonContainer}>
        <Link to="/login">
          <button className={styles.loginButton}>Войти</button>
        </Link>
        <button className={styles.registerButton}>Зарегистрироваться</button>
      </div>
    </div>*/
  );
}

export default LandingPage;
