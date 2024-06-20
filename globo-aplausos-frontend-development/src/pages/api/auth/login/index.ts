import { AccessToken } from '@/types/auth';
import { baseApi } from '@/utils/api';
import { AxiosResponse } from 'axios';

export async function signIn(email: string, password: string) {
  const data = { email, password };
  type Body = typeof data;
  const response = await baseApi.post<Body, AxiosResponse<AccessToken>>('/auth/login', data);
  return response.data;
}
