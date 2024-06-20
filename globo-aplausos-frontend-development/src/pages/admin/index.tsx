import Head from 'next/head';
import Layout from '@/components/layout';
import styles from '@/styles/pages/home.module.css';
import stringTokens from '@/utils/stringTokens';
import { getToken } from '@/utils/token';
import { GetAllSentFeedbacksResponse, getAllFeedbacksAsAdmin } from '../api/feedback';
import { SentFeedbackCard } from '@/components/sentFeedbackCard';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/userContext';

export default function AdminHome() {
  const getString = stringTokens();

  const [feedbacks, setFeedbacks] = useState<GetAllSentFeedbacksResponse[]>([]);
  const { loadingUserInformation, user } = useUser();

  useEffect(() => {
    if (loadingUserInformation || !user) {
      return;
    }
    getFeedbacks();
  }, [loadingUserInformation, user]);

  const getFeedbacks = async () => {
    const token = getToken();
    const response = await getAllFeedbacksAsAdmin(token);
    setFeedbacks(response);
  };

  return (
    <>
      <Head>
        <title>Globo Aplausos - Home Admin</title>
      </Head>
      <Layout>
        <div className={styles.feedbacks}>
          <h1 className={styles.myClaps}>{getString.clapsHistory}</h1>
          <div className={styles.contentBox}>
            <div>
              {!!feedbacks.length ? (
                feedbacks?.map((feedback) => (
                  <div key={feedback.feedbackID}>
                    <SentFeedbackCard
                      {...feedback}
                      date={new Date(feedback.date)}
                      initialStatus={'closed'}
                    />
                  </div>
                ))
              ) : (
                <div className={styles.noContent}>
                  <h3>{getString.noFeedbacksHistory}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
