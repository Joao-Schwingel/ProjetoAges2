import Image from 'next/image';
import { Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import styles from '@/styles/components/feedbackCard.module.css';
import { formatDateToString } from '@/utils/dateFormatter';

interface FeedbackCardProps {
  onButtonClick: (feedbackId: number) => void;
  date: Date;
  feedbackID: number;
  message: string;
  name: string;
  profilePicture: string;
  value: number;
  id: string;
}

export function FeedbackCard({ onButtonClick, id, ...feedback }: FeedbackCardProps) {
  return (
    <div className={styles.divide}>
      <div id={id} className={styles.card}>
        <div className={styles.imageBox}>
          <Avatar className={styles.senderImage}>
            <Image src={feedback.profilePicture} fill alt="Avatar" />
          </Avatar>
        </div>
        <div className={styles.nameBox}>
          <p className={styles.senderName}>{feedback.name}</p>
        </div>
        <p className={styles.message}>{feedback.message}</p>
        <div className={styles.clapBox}>
          <Image src={'/ClapIcon.svg'} width={40} height={50} alt="Clap" />
          <div className={styles.count}>{feedback.value}</div>
        </div>
        <div className={styles.buttonBox} onClick={() => onButtonClick(feedback.feedbackID)}>
          <DeleteIcon className={styles.button} />
        </div>
        <div className={styles.dateBox}>{formatDateToString(feedback.date)}</div>
      </div>
    </div>
  );
}
