import Header from '@/components/header';
import UserInfoCard from '@/components/userInfoCard';
import styles from '@/styles/pages/home.module.css';
import { useUser } from '@/contexts/userContext';
import Loading from '@/components/loading';
import router from 'next/router';
import { getToken, isTokenValid, removeToken } from '@/utils/token';
import { useEffect, useState } from 'react';
import { UserType } from '@/types/prisma';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loadingUserInformation } = useUser();

  if (loadingUserInformation || !user) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <div className={styles.home}>
        <div className={styles.userInfo}>
          {user && <UserInfoCard {...user} activateButton={true} />}
        </div>
        {children}
      </div>
    </>
  );
};

export default Layout;
