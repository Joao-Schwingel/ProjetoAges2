import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, UserType } from '@/types/prisma';
import { fetchUserData, getUserCoinBalance } from '@/pages/api/user';
import { getToken, isTokenValid, removeToken } from '@/utils/token';
import router from 'next/router';

interface UserContextType {
  user: User | null;
  loadingUserInformation: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userBalance: number;
  setUserBalance: React.Dispatch<React.SetStateAction<number>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [loadingUserInformation, setLoadingUserInformation] = useState<boolean>(true);

  const makeUserValidations = (userData: User | null, token: string | null) => {
    if (!token) {
      router.push('/login');
      return false;
    }

    if (!isTokenValid(token)) {
      removeToken();
      router.push('/login');
      return false;
    }

    if (!userData) {
      removeToken();
      router.push('/login');
      return false;
    }

    if (router.pathname.includes('/admin') && userData?.userType !== UserType.ADMIN) {
      removeToken();
      router.push('/login');
      return false;
    }

    if (!router.pathname.includes('/admin') && userData?.userType === UserType.ADMIN) {
      removeToken();
      router.push('/login');
      return false;
    }

    return true;
  };

  const getAllUserInformation = async () => {
    setLoadingUserInformation(true);
    const token = getToken();
    let userData = null;

    if (!user) {
      try {
        userData = await fetchUserData(token);
      } catch (error) {
        removeToken();
        router.push('/login');
        setLoadingUserInformation(false);
        return;
      }
    } else {
      userData = user;
    }

    if (!makeUserValidations(userData, token)) {
      setLoadingUserInformation(false);
      return;
    }
    setUser(userData);
    if (!userData || userData.userType === 'ADMIN') {
      setLoadingUserInformation(false);
      return;
    }
    const userBalance = await getUserCoinBalance(token, userData.userId);
    setUserBalance(userBalance.coins);
    setLoadingUserInformation(false);
  };

  useEffect(() => {
    getAllUserInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!loadingUserInformation && !user) {
      router.push('/login');
    }
  }, [loadingUserInformation, user]);

  return (
    <UserContext.Provider
      value={{ user, loadingUserInformation, setUser, userBalance, setUserBalance }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
