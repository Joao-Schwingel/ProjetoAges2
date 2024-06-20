import Modal from 'react-modal';
import Image from 'next/image';
import ButtonComponent from './button';
import styles from '@/styles/components/productModal.module.css';
import { Item, UserType } from '@/types/prisma';
import stringTokens from '@/utils/stringTokens';

interface ProductModalProps extends Item {
  isOpen: boolean;
  type: string;
  onClose: () => void;
  handleCancel: () => void;
  handleRedeem: () => void;
  handleDelete?: () => void;
}

export default function ProductModal({
  itemId,
  image,
  name: title,
  price: value,
  description,
  isOpen,
  type,
  onClose,
  handleCancel,
  handleRedeem,
  handleDelete
}: ProductModalProps) {
  const getString = stringTokens();

  const handleOnDelete = () => {
    if (type === UserType.ADMIN && handleDelete) {
      handleDelete();
    }
  };

  return (
    <>
      <div className={isOpen ? styles.overlay : styles.empty} />

      <Modal
        id={itemId.toString()}
        className={styles.wrapper}
        isOpen={isOpen}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick={true}
      >
        <div className={styles.productImageWrapper}>
          <Image className={styles.imageBorder} src={image} alt={title} fill objectFit="cover" />
        </div>
        <div className={styles.contentWrapper}>
          <h3>{title}</h3>
          <div className={styles.clapsWrapper}>
            <div className={styles.clapsImageWrapper}>
              <Image src={'/ClapIcon.svg'} alt="Aplausos" fill />
            </div>
            <span>{value}</span>
          </div>
          <p>{description}</p>
          <div className={styles.buttonWrapper}>
            <ButtonComponent id="cancelButton" type="secondary" onClick={handleCancel} size={1}>
              {getString.buttonCancel}
            </ButtonComponent>
            {type === UserType.BASIC && (
              <ButtonComponent id="redeemButton" type="primary" onClick={handleRedeem} size={1}>
                {getString.buttonRedeem}
              </ButtonComponent>
            )}
            {type === UserType.ADMIN && (
              <ButtonComponent id="deleteButton" type="primary" onClick={handleOnDelete} size={1}>
                {getString.buttonDelete}
              </ButtonComponent>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
