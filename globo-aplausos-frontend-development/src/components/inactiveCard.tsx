import Image from 'next/image';
import styles from '@/styles/components/inactiveCard.module.css';
import { formatDateToString } from '@/utils/dateFormatter';

export interface InactiveUserCardProps {
  userProfilePicture: string;
  userName: string;
  date: Date;
  msg?: string;
}

export default function InactiveUserCard({
  userProfilePicture,
  userName,
  date,
  msg
}: InactiveUserCardProps) {
  const formattedDate = msg!.length > 0 ? msg : formatDateToString(date);
  return (
    <div className={styles.divide}>
      <div className={styles.wrapper}>
        <div className={styles.inactiveWrapper}>
          <div className={styles.userInfo}>
            <div className={styles.imageWrapper}>
              <Image
                className={styles.roundImage}
                src={userProfilePicture}
                fill
                alt={`Foto de ${userName}`}
              />
            </div>
            <span className={styles.nameTitle}>{userName}</span>
          </div>

          <div className={styles.inactiveDate}>{formattedDate}</div>
        </div>
      </div>
    </div>
  );
}
