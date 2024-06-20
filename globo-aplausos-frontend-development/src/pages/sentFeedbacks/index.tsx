import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GetSentFeedbacksResponse, getSentFeedbacks } from '../api/feedback';
import { SentFeedbackCard } from '@/components/sentFeedbackCard';
import styles from '@/styles/pages/home.module.css';
import stringTokens from '@/utils/stringTokens';
import { getToken } from '@/utils/token';
import Layout from '@/components/layout';
import { useUser } from '@/contexts/userContext';

export default function SentFeedbacks() {
  const { user, loadingUserInformation } = useUser();
  const getString = stringTokens();
  const [feedbacks, setFeedbacks] = useState<GetSentFeedbacksResponse[]>([]);
  const token = getToken();

  useEffect(() => {
    if (loadingUserInformation || !user) {
      return;
    }
    getSentFeedbacks(token).then(setFeedbacks);
  }, [user, loadingUserInformation, token]);

  return (
    <>
      <Head>
        <title>Globo Aplausos - Feedbacks enviados</title>
      </Head>
      <Layout>
        <div className={styles.feedbacks}>
          <h1 className={styles.myClaps}>{getString.menuFeedbacks}</h1>
          <div className={styles.contentBox}>
            <div>
              {!!feedbacks.length ? (
                feedbacks.map((feedback) => (
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
                  <h3>{getString.noSentFeedbacks}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
