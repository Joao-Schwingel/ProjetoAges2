import { useTranslation } from 'react-i18next'

const StringTokens = () => {
  const { t } = useTranslation('common');

  return {
    errorCoinsRewardMessage: t('errorCoinsRewardMessage'),
    errorClapsFeedbackMessage: t('errorClapsFeedbackMessage'),
    successRewardMessage: t('successRewardMessage'),
    successFeedbackSentMessage: t('successFeedbackSentMessage'),
    questionFeedbackMessage: t('questionFeedbackMessage'),
    toolTipMessage: t('toolTipMessage'),
    buttonConfirm: t('buttonConfirm'),
    buttonCancel: t('buttonCancel'),
    buttonRegister: t('buttonRegister'),
    buttonRedeem: t('buttonRedeem'),
    buttonClap: t('buttonClap'),
    buttonDelete: t('buttonDelete'),
    loginEmailLabel: t('loginEmailLabel'),
    loginEmailPlaceHolder: t('loginEmailPlaceHolder'),
    loginEmailErrorMessage: t('loginEmailErrorMessage'),
    loginPasswordLabel: t('loginPasswordLabel'),
    loginPasswordPlaceHolder: t('loginPasswordPlaceHolder'),
    loginPasswordErrorMessage: t('loginPasswordErrorMessage'),
    menuHome: t('menuHome'),
    menuRewards: t('menuRewards'),
    pageTitleRewards: t('pageTitleRewards'),
    menuFeedbacks: t('menuFeedbacks'),
    menuRewardsRedeemed: t('menuRewardsRedeemed'),
    menuLogout: t('menuLogout'),
    menuAdminRewardsHistory: t('menuAdminRewardsHistory'),
    menuAdminInactiveProfile: t('menuAdminInactiveProfile'),
    loginButtonErrorMessage: t('loginButtonErrorMessage'),
    loginButtonContinueLabel: t('loginButtonContinueLabel'),
    userClaps: t('userClaps'),
    loadingMessage: t('loadingMessage'),
    recipient: t('recipient'),
    selectRecipientPlaceholder: t('selectRecipientPlaceholder'),
    pleaseSelectRecipient: t('pleaseSelectRecipient'),
    message: t('message'),
    messagePlaceholder: t('messagePlaceholder'),
    pleaseFillMessage: t('pleaseFillMessage'),
    pleaseSelectApplauses: t('pleaseSelectApplauses'),
    applauses: t('applauses'),
    insufficientBalance: t('insufficientBalance'),
    buttonSend: t('buttonSend'),
    successProductMessageTitle: t('successProductMessageTitle'),
    errorProductMessageTitle: t('errorProductMessageTitle'),
    errorMessageTooLarge: t('errorMessageTooLarge'),
    unableToSendFeedback: t('unableToSendFeedback'),
    buttonReward: t('buttonReward'),
    editButtonReward: t('editButtonReward'),
    buttonCreate: t('buttonCreate'),
    rewardNameError: t('rewardNameError'),
    rewardDescriptionError: t('rewardDescriptionError'),
    rewardPriceError: t('rewardPriceError'),
    rewardImageError: t('rewardImageError'),
    rewardNamePlaceholder: t('rewardNamePlaceholder'),
    rewardDescriptionPlaceholder: t('rewardDescriptionPlaceholder'),
    rewardNameLabel: t('rewardNameLabel'),
    rewardDescriptionLabel: t('rewardDescriptionLabel'),
    clapsHistory: t('clapsHistory'),
    inactiveUsers: t('inactiveUsers'),
    inactiveMsg: t('inactiveMsg'),
    image: t('image'),
    noSentFeedbacks: t('noSentFeedbacks'),
    noFeedbacks: t('noFeedbacks'),
    noInactiveUsers: t('noInactiveUsers'),
    noRewards: t('noRewards'),
    noRewardsRedeemed: t('noRewardsRedeemed'),
    unableToCreateReward: t('unableToCreateReward'),
    inactiveUsersPlaceHolder: t('inactiveUsersPlaceHolder'),
    inactiveUsersLabel: t('inactiveUsersLabel'),
    successRewardCreatedMessage: t('successRewardCreatedMessage'),
    successRewardReedeemedMessage: t('successRewardReedeemedMessage'),
    errorRewardRedeemedMessage: t('errorRewardRedeemedMessage'),
    redeemed: t('redeemed'),
    uplodedImage: t('uplodedImage'),
    helperExchangeCoinsMessage: t('helperExchangeCoinsMessage'),
    helperExchangeCoinsTitle: t('helperExchangeCoinsTitle'),
    coinsBalance: t('coinsBalance'),
    success: t('success'),
    error: t('error'),
    rewardDeleteErrorMessage: t('rewardDeleteErrorMessage'),
    rewardDeleteSuccessMessage: t('rewardDeleteSuccessMessage'),
    rewardDeleteQuestionMessage: t('rewardDeleteQuestionMessage'),
    feedbackDeleteErrorMessage: t('feedbackDeleteErrorMessage'),
    feedbackDeleteSuccessMessage: t('feedbackDeleteSuccessMessage'),
    feedbackDeleteQuestionMessage: t('feedbackDeleteQuestionMessage'),
    noFeedbacksHistory: t('noFeedbacksHistory'),
  };
};

export default StringTokens;