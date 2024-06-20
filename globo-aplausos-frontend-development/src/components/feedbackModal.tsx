import { useEffect, useRef, useState } from 'react';
import ButtonComponent from './button';
import Image from 'next/image';
import stringTokens from '@/utils/stringTokens';
import SelectComponent from './select';
import TextFieldComponent from './textFieldComponent';
import styles from '@/styles/components/feedbackModal.module.css';
import { getUserReceiver } from '@/pages/api/user';
import { sendFeedback } from '@/pages/api/feedback';
import { getToken } from '@/utils/token';
import { useUser } from '@/contexts/userContext';

interface FeedbackModalProps {
  senderName: string;
  closeFeedbackModal: () => void;
  handleSuccessModal: () => void;
  handleErrorModal: () => void;
}

interface User {
  userId: number;
  name: string;
}

export function FeedbackModal({
  senderName,
  closeFeedbackModal,
  handleErrorModal,
  handleSuccessModal
}: FeedbackModalProps) {
  const getString = stringTokens();
  const [message, setMessage] = useState('');
  const [applauses, setApplauses] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isApplauseValid, setIsApplauseValid] = useState(true);
  const [errorText, setErrorText] = useState(getString.insufficientBalance);
  const [firstSend, setFirstSend] = useState(false);
  const token = getToken();
  const { userBalance, setUserBalance } = useUser();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getUserReceiver(token).then((response) => {
        setUsers(response);
      });
    }
    isFirstRender.current = false;
  }, [token]);

  const handleSendFeedback = async () => {
    setFirstSend(true);

    let isValid = true;
    let newMessage = message == '' ? `${senderName} aplaudiu você.` : message;

    if (applauses <= 0 || applauses > userBalance) {
      isValid = false;
      setIsApplauseValid(false);
      if (applauses <= 0) {
        setErrorText(getString.pleaseSelectApplauses);
      } else {
        setErrorText(getString.insufficientBalance);
      }
    } else {
      setIsApplauseValid(true);
    }

    if (selectedUser && isValid) {
      try {
        await sendFeedback(selectedUser.userId, newMessage, applauses);

        setUserBalance(userBalance - applauses);
        handleCloseFeedbackModal();
        handleSuccessModal();
      } catch (error) {
        handleCloseFeedbackModal();
        handleErrorModal();
      }
    }
  };

  const handleCloseFeedbackModal = () => {
    closeFeedbackModal();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseFeedbackModal();
    }
  };

  const handleMessage = (newValue: string) => {
    setMessage(newValue);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    event.target.value = newValue.replace(/^0+/, '');
    newValue = newValue.replace(/^0+/, '');
    setApplauses(Number(newValue || '0'));
  };

  const handleSelectedUser = (newValue?: number) => {
    if (!newValue) return;
    setSelectedUser(users.find((user) => user.userId === newValue));
  };

  return (
    <>
      <div className={styles.overlay} onClick={(event) => handleOverlayClick(event)}>
        <div className={styles.modalWrapper}>
          <div className={styles.recipientWrapper}>
            <SelectComponent
              id="feedbackRecipientWrapper"
              values={users.map((user: User) => ({ value: user.userId, label: user.name }))}
              value={
                selectedUser && {
                  value: selectedUser.userId,
                  label: selectedUser.name
                }
              }
              errorText={firstSend && !selectedUser ? getString.pleaseSelectRecipient : ''}
              required={true}
              label={getString.recipient}
              placeholder={getString.selectRecipientPlaceholder}
              customUserInput={true}
              isLoading={false}
              handleChange={handleSelectedUser}
            />
          </div>
          <div className={styles.messageWrapper}>
            <TextFieldComponent
              type="modalDescription"
              id="message"
              label={getString.message}
              placeholder={getString.messagePlaceholder}
              errorText={getString.pleaseFillMessage}
              onChange={handleMessage}
              required={true}
            />
          </div>
          <p className={styles.recipientTitleWrapper}>{getString.helperExchangeCoinsTitle}</p>
          <div className={styles.sendClapWrapper}>
            <div className={styles.sendClapContentWrapper}>
              <div className={styles.applauseWrapper}>
                <span>{getString.applauses}: </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={applauses}
                  onChange={handleInput}
                />
              </div>
              <div className={styles.balanceWrapper}>
                <span>
                  {getString.coinsBalance} {userBalance}
                </span>
                <Image src={'/ClapCoinIcon.svg'} width={36} height={36} alt="Moeda de Aplausos" />
              </div>
            </div>
            <div className={styles.sendClapFooterWrapper}>
              <h1 className={styles.recipientExplainWrapper}>
                {getString.helperExchangeCoinsMessage}
              </h1>
              {firstSend && !isApplauseValid && errorText && (
                <span className={styles.errorText}>{errorText}</span>
              )}
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <ButtonComponent
              id="cancelButton"
              type="secondary"
              onClick={handleCloseFeedbackModal}
              size={1}
            >
              <span>{getString.buttonCancel}</span>
            </ButtonComponent>
            <ButtonComponent
              id="sendFeedbackButton"
              type="primary"
              onClick={handleSendFeedback}
              size={1}
            >
              {getString.buttonSend}
            </ButtonComponent>
          </div>
        </div>
      </div>
    </>
  );
}
