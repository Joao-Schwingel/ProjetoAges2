import { useState } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { editReward, sendReward } from '@/pages/api/store';
import styles from '@/styles/components/feedbackModal.module.css';
import theme from '@/styles/materialTheme';
import stringTokens from '@/utils/stringTokens';
import { getToken } from '@/utils/token';
import ButtonComponent from './button';
import TextFieldComponent from './textFieldComponent';
import { Item } from '@/types/prisma';

interface FeedbackModalProps {
  product?: Item;
  isEdit?: boolean;
  closeRewardModal: () => void;
  handleSuccessModal: () => void;
  handleErrorModal: () => void;
}

export function RewardModal({
  product,
  isEdit = false,
  closeRewardModal: closeFeedbackModal,
  handleErrorModal,
  handleSuccessModal
}: FeedbackModalProps) {
  const getString = stringTokens();
  const [rewardName, setRewardName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [image, setImage] = useState<File | null>(null);
  const [applauses, setApplauses] = useState<number>(product?.price ?? 1);
  const [descriptionError, setDescriptionError] = useState('');
  const [applausesError, setApplausesError] = useState('');
  const [imageError, setImageError] = useState('');
  const [rewardNameError, setRewardNameError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleSaveReward = async () => {
    let isValid = true;
    const methods = [setRewardNameError, setDescriptionError, setApplausesError, setImageError];
    methods.forEach((method) => method(''));

    if (rewardName.length === 0) {
      setRewardNameError(getString.rewardNameError);
      isValid = false;
    }

    if (description.length === 0 || description.length > 300) {
      setDescriptionError(getString.rewardDescriptionError);
      isValid = false;
    }

    if (applauses < 0) {
      setApplausesError(getString.rewardPriceError);
      isValid = false;
    }

    let file = undefined;

    if (!isEdit || !!image) {
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
      if (image && image.size > MAX_IMAGE_SIZE) {
        setImageError(getString.rewardImageError);
        return;
      }
      if (image) {
        const imageAsBase64 = await toBase64(image);
        file = {
          name: image.name,
          type: image.type,
          data: imageAsBase64
        };
      }
    }

    if (!isValid) {
      return;
    }

    try {
      if (isEdit && product?.itemId)
        await editReward(getToken(), product.itemId, rewardName, description, applauses, file);
      else await sendReward(getToken(), rewardName, description, applauses, file);
      handleSuccessModal();
    } catch (error) {
      handleErrorModal();
    }
    handleCloseRewardModal();
  };

  const handleCloseRewardModal = () => {
    closeFeedbackModal();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseRewardModal();
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    event.target.value = newValue.replace(/^0+/, '');
    newValue = newValue.replace(/^0+/, '');
    setApplauses(Number(newValue || '0'));
  };

  const handleInputImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
      setSelectedFileName((event.target.files[0] as File).name);
    }
  };

  function toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className={styles.overlay} onClick={(event) => handleOverlayClick(event)}>
          <div className={styles.modalWrapper}>
            <div className={styles.recipientWrapper}>
              <TextFieldComponent
                id="rewardName"
                value={rewardName}
                onChange={setRewardName}
                errorText={rewardNameError}
                isValid={rewardNameError.length === 0}
                required={true}
                label={getString.rewardNameLabel}
                placeholder={getString.rewardNamePlaceholder}
                type="text"
              />
            </div>
            <div className={styles.messageWrapper}>
              <TextFieldComponent
                id="description"
                value={description}
                onChange={setDescription}
                errorText={descriptionError}
                isValid={descriptionError.length === 0}
                required={true}
                label={getString.rewardDescriptionLabel}
                placeholder={getString.rewardDescriptionPlaceholder}
                type="modalDescription"
              />
            </div>
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
                  <span>{getString.image}: </span>

                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    color="secondary"
                  >
                    Upload
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleInputImage}
                      accept="image/png, image/jpg, image/jpeg, image/webp"
                    />
                  </Button>
                  {selectedFileName && (
                    <span className={styles.uploadWrapper}>
                      {getString.uplodedImage}
                      {selectedFileName}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.sendClapFooterWrapper}>
                {applausesError && <span className={styles.errorText}>{applausesError}</span>}
                {imageError && <span className={styles.errorText}>{imageError}</span>}
              </div>
            </div>
            <div className={styles.buttonReward}>
              <ButtonComponent
                id="cancelButton"
                type="secondary"
                onClick={handleCloseRewardModal}
                size={1}
              >
                <span>{getString.buttonCancel}</span>
              </ButtonComponent>
              <ButtonComponent
                id="sendRewardButton"
                type="primary"
                onClick={handleSaveReward}
                size={1}
              >
                {isEdit ? getString.editButtonReward : getString.buttonReward}
              </ButtonComponent>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
