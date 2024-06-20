import Image from 'next/image';
import HighlightOff from '@mui/icons-material/HighlightOff';
import ButtonComponent from '@/components/button';
import styles from '@/styles/components/userMessageModal.module.css';
import stringTokens from '@/utils/stringTokens';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hasButton: boolean;
  img: 'success' | 'error' | 'question';
  message: string;
  title?: string;
  onConfirm?: () => void;
}

export default function UserMessageModal({
  isOpen,
  setIsOpen,
  hasButton,
  img,
  message,
  title,
  onConfirm
}: ModalProps) {
  const getString = stringTokens();

  if (!isOpen) return <></>;

  function getIconSrc(img: string) {
    switch (img) {
      case 'success':
        return '/SuccessIcon.svg';
      case 'error':
        return '/DeniedIcon.svg';
      case 'question':
        return '/QuestionMarkIcon.svg';
      default:
        return '/QuestionMarkIcon.svg';
    }
  }

  function handleConfirm() {
    setIsOpen(false);
    onConfirm?.();
  }

  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <div className={styles.img}>
          <Image src={getIconSrc(img)} fill alt="Imagem de status da modal" />
        </div>
        {!hasButton && <h2 className={styles.title}>{title}</h2>}
        <p className={styles.description}>{message}</p>

        <HighlightOff
          classes={styles.close}
          fontSize="large"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            top: '3%',
            right: '3%',
            color: '#c8c8c8'
          }}
        ></HighlightOff>

        {hasButton && (
          <div className={styles.btnGroup}>
            <ButtonComponent
              id="buttonCancelar"
              type="secondary"
              onClick={() => setIsOpen(!isOpen)}
              size={1}
            >
              {getString.buttonCancel}
            </ButtonComponent>
            <ButtonComponent id="buttonConfirmar" type="primary" onClick={handleConfirm} size={1}>
              {getString.buttonConfirm}
            </ButtonComponent>
          </div>
        )}
      </div>
    </div>
  );
}
