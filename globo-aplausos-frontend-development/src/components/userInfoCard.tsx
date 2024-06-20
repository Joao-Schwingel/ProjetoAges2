import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Tooltip from '@mui/material/Tooltip';
import styles from '@/styles/components/userInfoCard.module.css';
import { User, UserType } from '@/types/prisma';
import stringTokens from '@/utils/stringTokens';
import ButtonComponent from './button';
import UserMessageModal from './userMessageModal';
import { FeedbackModal } from './feedbackModal';
import { RewardModal } from './rewardModal';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/router';

interface UserInfoCardProps extends User {
  activateButton?: boolean;
}

export default function UserInfoCard({
  name,
  email,
  userType,
  profilePicture,
  wallet: { claps },
  activateButton
}: UserInfoCardProps) {
  const { user, userBalance, setUserBalance } = useUser();
  const [image, setImage] = useState<'success' | 'error' | 'question'>('question');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isOpenFeedbackModal, setIsOpenFeedbackModal] = useState(false);
  const [isOpenRewardModal, setIsOpenRewardModal] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isMouseOverButton, setIsMouseOverButton] = useState<boolean>(false);

  const handleMouseOver = () => {
    setIsMouseOverButton(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOverButton(false);
  };

  const handleFeedbackOnSuccessModal = () => {
    setImage('success');
    setMessage(getString.successFeedbackSentMessage);
    setTitle(getString.success);
    setIsSuccessModalOpen(true);
  };

  const handleFeedbackOnErrorModal = () => {
    setImage('error');
    setMessage(getString.unableToSendFeedback);
    setTitle(getString.error);
    setIsErrorModalOpen(true);
  };

  const handleRewardOnSuccessModal = () => {
    setImage('success');
    setMessage(getString.successRewardReedeemedMessage);
    setTitle(getString.success);
    setIsSuccessModalOpen(true);
  };

  const handleRewardOnErrorModal = () => {
    setImage('error');
    setMessage(getString.errorRewardRedeemedMessage);
    setTitle(getString.error);
    setIsErrorModalOpen(true);
  };

  const handleRewardAdminOnsuccessModal = () => {
    setImage('success');
    setMessage(getString.successRewardCreatedMessage);
    setTitle(getString.success);
    setIsSuccessModalOpen(true);
  };

  const handleRewardAdminOnErrorModal = () => {
    setImage('error');
    setMessage(getString.unableToCreateReward);
    setTitle(getString.error);
    setIsErrorModalOpen(true);
  };

  const getString = stringTokens();
  const isAdmin = userType === UserType.ADMIN;
  const displayName = name.split(' ')[0];
  const router = useRouter();
  const isOnAdminStorePage = router.pathname === '/admin/store';

  return (
    <>
      <UserMessageModal
        hasButton={false}
        img={image}
        isOpen={isSuccessModalOpen}
        message={message}
        title={title}
        setIsOpen={setIsSuccessModalOpen}
        onConfirm={() => setIsSuccessModalOpen(false)}
      />
      <UserMessageModal
        hasButton={false}
        img={image}
        isOpen={isErrorModalOpen}
        message={message}
        setIsOpen={setIsErrorModalOpen}
        onConfirm={() => setIsErrorModalOpen(false)}
      />
      {isOpenFeedbackModal && (
        <FeedbackModal
          closeFeedbackModal={() => setIsOpenFeedbackModal(false)}
          senderName={name}
          handleSuccessModal={handleFeedbackOnSuccessModal}
          handleErrorModal={handleFeedbackOnErrorModal}
        />
      )}
      {isOpenRewardModal && (
        <RewardModal
          closeRewardModal={() => setIsOpenRewardModal(false)}
          handleSuccessModal={
            isAdmin ? handleRewardAdminOnsuccessModal : handleRewardOnSuccessModal
          }
          handleErrorModal={isAdmin ? handleRewardAdminOnErrorModal : handleRewardOnErrorModal}
        />
      )}
      <div
        className={`
        ${styles.container}
        ${isAdmin ? styles.adminContainer : ''}  
      `}
      >
        <div className={`${styles.userImageWrapper} ${isAdmin ? styles.adminImageWrapper : ''}`}>
          <Image
            className={`
            ${styles.image}
            ${isAdmin ? styles.adminImage : ''}  
            `}
            src={profilePicture ? profilePicture : '/GloboIcon.svg'}
            alt="Foto de Perfil"
            fill
          />
        </div>
        <div className={styles.textWrapper}>
          <h2 title={name} className={styles.name}>
            {displayName}
          </h2>
          <span title={email}>{email}</span>
        </div>
        <div className={styles.bottomWrapper}>
          {!isAdmin && (
            <div className={styles.clapsContainer}>
              <Tooltip
                title={<p className={styles.tooltip}>{getString.toolTipMessage}</p>}
                placement="top"
              >
                <div className={styles.clapImageWrapper}>
                  <Image src={'/ClapIcon.svg'} fill alt="Aplausos" />
                </div>
              </Tooltip>
              <span className={styles.clapCount}>{claps}</span>
            </div>
          )}
          {activateButton && (
            <div className={styles.buttonContainer}>
              {!isAdmin ? (
                <ButtonComponent
                  id="userInfoCard"
                  type="primary"
                  size={2}
                  onClick={() => setIsOpenFeedbackModal((prev) => !prev)}
                  onMouseOver={handleMouseOver}
                  onMouseLeave={handleMouseLeave}
                  icon={
                    <div className={`${isMouseOverButton && styles['container-animation']}`}>
                      <Image
                        src={'/ClapCoinIcon.svg'}
                        alt="Moeda de Aplausos"
                        width={34}
                        height={34}
                      />
                    </div>
                  }
                >
                  {isMouseOverButton && (
                    <span className={`${styles['bottomWrapper']} ${styles['userCoinBalance']}`}>
                      {userBalance}
                    </span>
                  )}
                  <span className={`${isMouseOverButton && styles['buttonText']}`}>
                    {getString.buttonClap}
                  </span>
                </ButtonComponent>
              ) : (
                isOnAdminStorePage && (
                  <ButtonComponent
                    id="userInfoCard"
                    type="primary"
                    size={2}
                    onClick={() => setIsOpenRewardModal((prev) => !prev)}
                  >
                    <span>{getString.buttonReward}</span>
                  </ButtonComponent>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
