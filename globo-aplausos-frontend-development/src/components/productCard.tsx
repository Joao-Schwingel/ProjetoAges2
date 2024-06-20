import styles from '@/styles/components/productCard.module.css';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import * as React from 'react';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import { User, UserType } from '@/types/prisma';
import { formatDateToString } from '@/utils/dateFormatter';

interface CardProductProps {
  type: string;
  img: string;
  name: string;
  description: string;
  applauses: number;
  date?: string;
  onClick: () => void;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  id: string;
}

export default function ProductCard({
  type,
  img,
  name,
  description,
  applauses,
  date,
  onClick,
  onClickEdit,
  onClickDelete,
  id
}: CardProductProps) {
  const formattedDate = date ? new Date(date) : null;
  return (
    <div className={styles.divide}>
      <div id={id} className={styles.card} onClick={onClick}>
        <div className={styles.cardArea}>
          <CardMedia image={img} component={'img'} className={styles.cardMedia} />
          <div className={styles.divLeft}>
            <div className={styles.text}>
              <div className={styles.title}>{name}</div>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
          <div className={styles.divRight}>
            <div className={styles.clap}>
              <Image src={'/ClapIcon.svg'} alt="Aplausos" width={45} height={45} />
              <h2 className={applauses > 999 ? styles.clapsText : styles.clapsBigText}>
                {applauses}
              </h2>
            </div>
            {type === UserType.ADMIN && (
              <div className={styles.containerButton}>
                <div>
                  <IconButton onClick={onClickDelete}>
                    <DeleteIcon className={styles.button} />
                  </IconButton>
                  <IconButton onClick={onClickEdit}>
                    <EditIcon className={styles.button} />
                  </IconButton>
                </div>
              </div>
            )}
            <div className={styles.date} style={{ display: formattedDate ? 'block' : 'none' }}>
              {formattedDate ? formatDateToString(formattedDate) : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
