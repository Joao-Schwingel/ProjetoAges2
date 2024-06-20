import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '@/styles/pages/home.module.css';
import stringTokens from '@/utils/stringTokens';
import { FeedbackCard } from '@/components/feedbackCard';
import { getToken } from '@/utils/token';
import UserMessageModal from '@/components/userMessageModal';
import { FeedbackResponse, deleteFeedback, getReceivedFeedbacks } from './api/feedback';
import Layout from '@/components/layout';
import { useUser } from '@/contexts/userContext';

export default function Home() {
  const getString = stringTokens();
  const token = getToken();
  const { loadingUserInformation, user } = useUser();

  const [feedbacks, setFeedback] = useState<FeedbackResponse[]>([]);
  const [feedbackToDelete, setFeedbackToDelete] = useState<number>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleDeleteFeedbackConfirm = async () => {
    if (!feedbackToDelete) {
      return;
    }

    try {
      await deleteFeedback(token, feedbackToDelete);
      setSuccessModal(true);
      setDeleteModal(false);
      setFeedbackToDelete(undefined);
    } catch (error) {
      setErrorModal(true);
      setDeleteModal(false);
      setFeedbackToDelete(undefined);
    }

    try {
      const feedbackData = await getReceivedFeedbacks(token);
      setFeedback([...feedbackData]);
    } catch (error) {}
  };

  const handleDeleteFeedback = (feedbackID: number) => {
    setFeedbackToDelete(feedbackID);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (loadingUserInformation || !user) {
      return;
    }
    getFeedbacks();
  }, [loadingUserInformation, user]);

  const getFeedbacks = async () => {
    const token = getToken();
    if (!token) return;
    getReceivedFeedbacks(token).then((feedbackData) => {
      setFeedback([...feedbackData]);
    });
  };

  return (
    <>
      <Head>
        <title>Globo Aplausos - Home</title>
      </Head>
      <Layout>
        <div className={styles.feedbacks}>
          <h1 className={styles.myClaps}>{getString.userClaps}</h1>
          <div className={styles.contentBox}>
            <div>
              {!!feedbacks.length ? (
                feedbacks?.map((feedback, index) => (
                  <FeedbackCard
                    key={feedback.feedbackID}
                    {...feedback}
                    onButtonClick={handleDeleteFeedback}
                    id={`feedback${index}`}
                  />
                ))
              ) : (
                <div className={styles.noContent}>
                  <h3>{getString.noFeedbacks}</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        <UserMessageModal
          isOpen={deleteModal}
          setIsOpen={setDeleteModal}
          hasButton={true}
          img="question"
          onConfirm={handleDeleteFeedbackConfirm}
          message={getString.feedbackDeleteQuestionMessage}
        />
        <UserMessageModal
          isOpen={errorModal}
          setIsOpen={setErrorModal}
          hasButton={false}
          img="error"
          title={getString.error}
          message={getString.feedbackDeleteErrorMessage}
        />
        <UserMessageModal
          isOpen={successModal}
          setIsOpen={setSuccessModal}
          hasButton={false}
          img="success"
          title={getString.success}
          message={getString.feedbackDeleteSuccessMessage}
        />
      </Layout>
    </>
  );
}
