import { Feedback } from '@prisma/client';
import { FeedbackDTO } from 'src/api/feedback/DTO/FeedbackDTO.model';
import { FeedbacksSentByMeResponseDTO } from 'src/api/feedback/DTO/FeedbackResponseDTO.model';
import { mockBasicUser, mockBasicUser2 } from './user.mock';

export const mockFeedback: FeedbackDTO = {
  receiverId: mockBasicUser.userId,
  message: 'Mensagem padrão de envio',
  value: 20,
};

export const mockFeedbackResponse: Feedback = {
  feedbackID: 1,
  receiverId: mockBasicUser.userId,
  visibility: true,
  date: new Date(),
  message: 'Mensagem padrão de envio',
  value: 20,
  senderId: mockBasicUser2.userId,
};

export const mockInvalidFeedback: Feedback = {
  date: new Date(),
  message: 'Mensagem padrão de envio',
  value: -20,
  senderId: mockBasicUser2.userId,
  feedbackID: -1,
  receiverId: mockBasicUser.userId,
  visibility: false,
};

export const mockFeedbackWithEmptyMessage: Feedback = {
  date: new Date(),
  message: '',
  value: 10,
  senderId: mockBasicUser2.userId,
  feedbackID: 1,
  receiverId: mockBasicUser.userId,
  visibility: true,
};

export const mockFeedback2: Feedback = {
  feedbackID: 1,
  receiverId: mockBasicUser.userId,
  visibility: true,
  message: 'Mensagem padrão de envio',
  value: 20,
  date: new Date(),
  senderId: mockBasicUser2.userId,
};

export const mockFeedbackSentByMe: FeedbacksSentByMeResponseDTO = {
  receiverName: mockBasicUser.name,
  senderName: mockBasicUser.name,
  receiverProfilePicture: mockBasicUser.profilePicture,
  senderProfilePicture: mockBasicUser.profilePicture,
  message: 'Mensagem padrão de envio',
  value: 20,
};

export const mockAllSentFeedback: FeedbacksSentByMeResponseDTO = {
  receiverName: mockBasicUser.name,
  senderName: mockBasicUser.name,
  receiverProfilePicture: mockBasicUser.profilePicture,
  senderProfilePicture: mockBasicUser.profilePicture,
  message: 'Mensagem padrão de envio',
  value: 20,
};

export const mockFeedbacks = [mockFeedbackWithEmptyMessage, mockFeedback2];
