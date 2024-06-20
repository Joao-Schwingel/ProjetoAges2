import Image from 'next/image';
import { useState } from 'react';
import styles from '@/styles/components/sentFeedbackCard.module.css';
import { formatDateToString } from '@/utils/dateFormatter';
import { Feedback } from '@/types/prisma';

export interface SentFeedbackCardProps
  extends Pick<Feedback, 'feedbackID' | 'date' | 'value' | 'message'> {
  senderProfilePicture: Pick<Feedback['sender'], 'profilePicture'>['profilePicture'];
  senderName: Pick<Feedback['sender'], 'name'>['name'];
  receiverProfilePicture: Pick<Feedback['receiver'], 'profilePicture'>['profilePicture'];
  receiverName: Pick<Feedback['receiver'], 'name'>['name'];
  initialStatus: 'opened' | 'closed';
}

export function SentFeedbackCard({
  senderProfilePicture,
  senderName,
  receiverProfilePicture,
  receiverName,
  value: clapCount,
  date,
  message: feedback,
  initialStatus
}: SentFeedbackCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(initialStatus === 'opened');

  return (
    <div className={styles.divide}>
      <div className={styles.wrapper} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <div className={styles.openedWrapper}>
            <div className={styles.headerWrapper}>
              <div className={styles.userInfo}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.roundImage}
                    src={senderProfilePicture}
                    fill
                    alt={`Foto de ${senderName}`}
                  />
                </div>
                <span className={styles.nameTitle}>{senderName}</span>
              </div>
              <div className={styles.imageWrapper}>
                <Image src={'/ClapIcon.svg'} fill alt="Imagem de aplausos" />
              </div>
              <div className={styles.userInfo}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.roundImage}
                    src={receiverProfilePicture}
                    fill
                    alt={`Foto de ${receiverName}`}
                  />
                </div>
                <span className={styles.nameTitle}>{receiverName}</span>
              </div>
            </div>
            <div className={styles.contentWrapper}>
              <p className={styles.feedbackText}>{feedback}</p>
              <div className={styles.clapsWrapper}>
                <div className={styles.openClapImageWrapper}>
                  <Image src={'/ClapIcon.svg'} fill alt="Imagem de aplausos" />
                </div>
                <span className={styles.clapCount}>{clapCount}</span>
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
                      src={senderProfilePicture}
                      fill
                      alt={`Foto de ${senderName}`}
                    />
                  </div>
                  <span className={styles.nameTitle}>{senderName}</span>
                </div>
                <Image
                  className={styles.clapImage}
                  src={'/ClapIcon.svg'}
                  width={30}
                  height={30}
                  alt="Imagem de aplausos"
                />
                <div className={styles.userInfo}>
                  <div className={styles.imageWrapper}>
                    <Image
                      className={styles.roundImage}
                      src={receiverProfilePicture}
                      fill
                      alt={`Foto de ${receiverName}`}
                    />
                  </div>
                  <span className={styles.nameTitle}>{receiverName}</span>
                </div>
              </div>
              <div className={styles.closedClapsWrapper}>
                <div className={styles.imageWrapper}>
                  <Image src={'/ClapIcon.svg'} fill alt="Imagem de aplausos" />
                </div>
                <span className={styles.clapCount}>{clapCount}</span>
              </div>
            </div>
            <div className={styles.closedFooterWrapper}>{formatDateToString(date)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
