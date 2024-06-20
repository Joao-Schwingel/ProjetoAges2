import { api } from '@/utils/api';
import { AccessToken } from '@/types/auth';
import { baseApi } from '@/utils/api';
import { AxiosResponse } from 'axios';

export interface GetSentFeedbacksResponse {
  message: string;
  feedbackID: number;
  date: string;
  value: number;
  receiverProfilePicture: string;
  receiverName: string;
  senderProfilePicture: string;
  senderName: string;
}

export async function getSentFeedbacks(token: string): Promise<GetSentFeedbacksResponse[]> {
  const response = await api(token).get<any, AxiosResponse<GetSentFeedbacksResponse[]>>(
    `/feedback/sent/me`
  );
  return response.data;
}

export interface GetAllSentFeedbacksResponse {
  message: string;
  feedbackID: number;
  date: string;
  value: number;
  receiverProfilePicture: string;
  receiverName: string;
  senderProfilePicture: string;
  senderName: string;
}

export async function getAllFeedbacksAsAdmin(
  token: string
): Promise<GetAllSentFeedbacksResponse[]> {
  const response = await api(token).get<any, AxiosResponse<GetAllSentFeedbacksResponse[]>>(
    '/feedback/sent/all'
  );
  return response.data;
}

export async function sendFeedback(receiverId: number, message: string, value: number) {
  const data = { receiverId, message, value };
  type Body = typeof data;
  const response = await baseApi.post<Body, AxiosResponse<AccessToken>>('/feedback', data);
  return response;
}

export interface FeedbackResponse {
  date: Date;
  feedbackID: number;
  message: string;
  name: string;
  profilePicture: string;
  value: number;
}
export async function getReceivedFeedbacks(token: string): Promise<FeedbackResponse[]> {
  const response = await api(token).get<any, AxiosResponse<FeedbackResponse[]>>('/feedback');
  return response.data;
}

export async function deleteFeedback(token: string, feedbackId: number) {
  const response = await api(token).delete(`feedback/${feedbackId}`);
  return response;
}
