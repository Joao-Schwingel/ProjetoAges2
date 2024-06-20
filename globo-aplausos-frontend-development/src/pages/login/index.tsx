import Image from 'next/image';
import Head from 'next/head';
import router from 'next/router';
import { useState } from 'react';
import ButtonComponent from '@/components/button';
import TextFieldComponent from '@/components/textFieldComponent';
import styles from '@/styles/pages/login.module.css';
import stringTokens from '@/utils/stringTokens';
import { signIn } from '../api/auth/login';
import { UserType } from '@/types/prisma';
import { decodeToken, isTokenValid, setToken } from '@/utils/token';
import { useUser } from '@/contexts/userContext';
import { fetchUserData, getUserCoinBalance } from '../api/user';

export default function Login() {
  const { setUser, setUserBalance } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const getString = stringTokens();

  const imageSettings = {
    width: 450,
    height: 150
  };

  const handleLogin = async () => {
    try {
      const { access_token } = await signIn(email, password);

      if (!access_token) {
        throw new Error('Token not found');
      }

      setToken(access_token);

      const token = decodeToken(access_token);

      if (!token || !isTokenValid(access_token)) {
        throw new Error('Token is invalid or expired');
      }

      const userData = await fetchUserData(access_token);
      if (!userData) {
        throw new Error("Couldn't fetch user data");
      }

      setUser(userData);

      const route = token.userType === UserType.ADMIN ? '/admin' : '/';

      if (token.userType !== UserType.ADMIN) {
        const userBalance = await getUserCoinBalance(access_token, userData.userId);
        setUserBalance(userBalance.coins);
      }

      router.push(route);
    } catch (e) {
      setLoginError(true);
    }
  };

  return (
    <>
      <Head>
        <title>Globo Aplausos - Login</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.imagesContainer}>
          <div className={styles.imageWrapper}>
            <Image alt="Globo Aplausos" src={'/GloboAplausosLoginImage.svg'} fill />
          </div>
          <div className={styles.imageWrapper}>
            <Image alt="Globo Marcas" src={'/GloboMarcasImage.svg'} fill />
          </div>
        </div>
        <form className={styles.formContainer} style={{ maxWidth: imageSettings.width }}>
          <div className={styles.inputWrapper}>
            <div className={styles.textFieldEmail}>
              <TextFieldComponent
                id="email"
                type="email"
                label={getString.loginEmailLabel}
                placeholder={getString.loginEmailPlaceHolder}
                errorText={getString.loginEmailErrorMessage}
                onChange={setEmail}
                required
              />
            </div>
            <div className={styles.textFieldPassword}>
              <TextFieldComponent
                id="password"
                type="password"
                label={getString.loginPasswordLabel}
                placeholder={getString.loginPasswordPlaceHolder}
                errorText={getString.loginPasswordErrorMessage}
                onChange={setPassword}
                required
              />
            </div>
          </div>
          <div className={styles.submitContainer}>
            <ButtonComponent type="primary" onClick={handleLogin} size={3} id="loginButton">
              {getString.loginButtonContinueLabel}
            </ButtonComponent>
            {loginError && (
              <p className={styles.errorContainer}>{getString.loginButtonErrorMessage}</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
