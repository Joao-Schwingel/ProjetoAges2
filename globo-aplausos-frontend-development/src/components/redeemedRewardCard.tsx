import Image from 'next/image';
import { useState } from 'react';
import styles from '@/styles/components/sentFeedbackCard.module.css';
import { formatDateToString } from '@/utils/dateFormatter';
import stringTokens from '@/utils/stringTokens';

export interface RedeemedRewardProps {
  profilePicture: string;
  senderName: string;
  redeemedRewardPicture: string;
  redeemedReward: string;
  price: number;
  date: Date;
  feedback: string;
  initialStatus: 'opened' | 'closed';
  id: string;
}

export function RedeemedReward({
  profilePicture,
  senderName,
  redeemedRewardPicture,
  redeemedReward,
  price,
  date,
  feedback,
  initialStatus,
  id
}: RedeemedRewardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(initialStatus === 'opened');
  const getString = stringTokens();

  return (
    <div className={styles.divide}>
      <div id={id} className={styles.wrapper} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <div className={styles.openedWrapper}>
            <div className={styles.headerWrapper}>
              <div className={styles.userInfo}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.roundImage}
                    src={profilePicture}
                    fill
                    alt={`Foto de ${senderName}`}
                  />
                </div>
                <span className={styles.nameTitle}>{senderName}</span>
              </div>
              <p>{getString.redeemed}</p>
              <div className={styles.userInfo}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.roundImage}
                    src={redeemedRewardPicture}
                    fill
                    alt={`Foto de ${redeemedReward}`}
                  />
                </div>
                <span className={styles.nameTitle}>{redeemedReward}</span>
              </div>
            </div>
            <div className={styles.contentWrapper}>
              <p className={styles.feedbackText}>{feedback}</p>
              <div className={styles.clapsWrapper}>
                <div className={styles.openClapImageWrapper}>
                  <Image src={'/ClapIcon.svg'} fill alt="Imagem de aplausos" />
                </div>
                <span className={styles.price}>{price}</span>
              </div>
            </div>
            <div className={styles.footerWrapper}>{formatDateToString(date)}</div>
          </div>
        ) : (
          <div className={styles.closedWrapper} onClick={() => setIsOpen(!isOpen)}>
            <div className={styles.closedContentWrapper}>
              <div className={styles.peopleWrapper}>
                <div className={styles.userInfo}>
                  <div className={styles.imageWrapper}>
                    <Image
                      className={styles.roundImage}
                      src={profilePicture}
                      fill
                      alt={`Foto de ${senderName}`}
                    />
                  </div>
                  <span className={styles.nameTitle}>{senderName}</span>
                </div>
                <span className={styles.nameTitle}>{getString.redeemed}</span>
                <div className={styles.userInfo}>
                  <div className={styles.imageWrapper}>
                    <Image
                      className={styles.roundImage}
                      src={redeemedRewardPicture}
                      fill
                      alt={`Foto de ${redeemedReward}`}
                    />
                  </div>
                  <span className={styles.nameTitle}>{redeemedReward}</span>
                </div>
              </div>
              <div className={styles.closedClapsWrapper}>
                <div className={styles.imageWrapper}>
                  <Image src={'/ClapIcon.svg'} fill alt="Imagem de aplausos" />
                </div>
                <span className={styles.price}>{price}</span>
              </div>
            </div>
            <div className={styles.closedFooterWrapper}>{formatDateToString(date)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
