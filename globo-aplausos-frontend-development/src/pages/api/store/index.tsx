import { AccessToken } from '@/types/auth';
import { api } from '@/utils/api';
import { AxiosResponse } from 'axios';

export async function getRewardHistory(token: string) {
  const response = await api(token).get('rewards/redeemed/all');
  return response.data;
}

export async function getListProducts(token: string) {
  const response = await api(token).get('/store');
  return response.data;
}

export async function redeemProduct(itemId: number, token: string) {
  const response = await api(token).post(`/rewards/redeem/${itemId}`, { itemId });
  return response;
}

export async function getRedeemedProducts(token: string) {
  const response = await api(token).get(`/store/redeemed/me`);
  return response.data;
}

export async function sendReward(
  token: string,
  name: string,
  description: string,
  price: number,
  file: (Pick<File, 'name' | 'type'> & { data: string }) | undefined
) {
  const data = { name, description, price, file };
  const response = await api(token).post<Body, AxiosResponse<AccessToken>>('/rewards', data);
  return response;
}

export async function editReward(
  token: string,
  id: number,
  name: string,
  description: string,
  price: number,
  file: (Pick<File, 'name' | 'type'> & { data: string }) | undefined
) {
  const data = { name, description, price, file };
  const response = await api(token).patch<Body, AxiosResponse<AccessToken>>(`/rewards/${id}`, data);
  return response;
}

export async function deleteReward(token: string, selectedProductId: number) {
  const response = await api(token).delete(`store/${selectedProductId}`);
  return response;
}
