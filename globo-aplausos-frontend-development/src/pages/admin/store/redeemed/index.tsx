import Head from 'next/head';
import { useEffect, useState } from 'react';
import { rewardHistory } from '@/types/prisma';
import { getToken } from '@/utils/token';
import { getRewardHistory } from '@/pages/api/store';
import stringTokens from '@/utils/stringTokens';
import Layout from '@/components/layout';
import styles from '@/styles/pages/home.module.css';
import { RedeemedReward } from '@/components/redeemedRewardCard';

export default function RewardHistory() {
  const getString = stringTokens();
  const [products, setProducts] = useState<rewardHistory[]>([]);

  useEffect(() => {
    retrieveRewardtList();
  }, []);

  const retrieveRewardtList = async () => {
    const token = getToken();
    if (!token) return;
    const response = await getRewardHistory(token);
    setProducts(response);
  };

  return (
    <>
      <Head>
        <title>Globo Aplausos - Histórico de Recompensas</title>
      </Head>
      <Layout>
        <div className={styles.feedbacks}>
          <h1 className={styles.myClaps}>{getString.menuAdminRewardsHistory}</h1>
          <div className={styles.contentBox}>
            <div>
              {products && products.length ? (
                products.map((product, index) => (
                  <div key={product.userId}>
                    <RedeemedReward
                      profilePicture={product.profilePicture}
                      senderName={product.userName}
                      date={product.dateTime}
                      price={product.price}
                      redeemedReward=" "
                      redeemedRewardPicture={product.image}
                      feedback={product.rewardName}
                      initialStatus="closed"
                      id={`product${index}`}
                    />
                  </div>
                ))
              ) : (
                <div className={styles.noContent}>
                  <h3>{getString.noRewardsRedeemed}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
