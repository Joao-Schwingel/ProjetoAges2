import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '@/styles/pages/home.module.css';
import stringTokens from '@/utils/stringTokens';
import { getToken } from '@/utils/token';
import InactiveUserCard from '@/components/inactiveCard';
import { getInactiveUsers } from '../../api/user/index';
import Layout from '@/components/layout';
import TextFieldComponent from '@/components/textFieldComponent';
import { useUser } from '@/contexts/userContext';

interface InactiveUser {
  name: string;
  userId: number;
  profilePicture: string;
  lastActivity: Date;
}

export default function AdminHome() {
  const { user, loadingUserInformation } = useUser();
  const getString = stringTokens();
  const [inactiveUsers, setInactiveUsers] = useState<InactiveUser[]>([]);
  const [inactiveUsersName, setInactiveUsersName] = useState<string>('');
  let inactiveMsg = '';
  const token = getToken();

  function formatLastActivity(lastActivity: Date): Date {
    const activityDate = new Date(lastActivity);

    const formattedLastActivity = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth(),
      activityDate.getDate(),
      activityDate.getHours(),
      activityDate.getMinutes()
    );

    if (formattedLastActivity.getUTCFullYear() < 2023) {
      inactiveMsg = getString.inactiveMsg;
    }

    return formattedLastActivity;
  }

  useEffect(() => {
    if (loadingUserInformation || !user) {
      return;
    }
    getInactiveUsers(token).then((response) => {
      setInactiveUsers(response);
    });
  }, [token, loadingUserInformation, user]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inactiveUsersName.length >= 3) {
        const response = await getInactiveUsers(token, inactiveUsersName);
        setInactiveUsers(response);
        return;
      }

      if (inactiveUsersName.length === 0) {
        const response = await getInactiveUsers(token);
        setInactiveUsers(response);
        return;
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [inactiveUsersName, token]);

  return (
    <>
      <Head>
        <title>Globo Aplausos - Usuários Inativos</title>
      </Head>
      <Layout>
        <div className={styles.feedbacks}>
          <h1 className={styles.myClaps}>{getString.inactiveUsers}</h1>
          <div className={styles.searchBoxWrapper}>
            <TextFieldComponent
              id="inactiveUsersText"
              type="text"
              label={getString.inactiveUsersLabel}
              placeholder={getString.inactiveUsersLabel}
              errorText=""
              onChange={setInactiveUsersName}
              required={false}
            />
          </div>
          <div className={styles.contentBox}>
            <div className={styles.sentFeedbacksBox}>
              {!!inactiveUsers.length ? (
                inactiveUsers?.map((inactive: InactiveUser) => (
                  <InactiveUserCard
                    key={inactive.userId}
                    userProfilePicture={inactive.profilePicture}
                    userName={inactive.name}
                    date={formatLastActivity(inactive.lastActivity)}
                    msg={inactiveMsg}
                  />
                ))
              ) : (
                <div className={styles.noContent}>
                  <h3>{getString.noInactiveUsers}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
