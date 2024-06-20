import { User } from '@/types/prisma';
import { api } from '@/utils/api';
import { decodeToken, isTokenValid, removeToken } from '@/utils/token';
import router from 'next/router';

export default async function getData(token: string, userId: number) {
  const response = await api(token).get(`/user/card/${userId}`);
  return response.data;
}

export async function getUserReceiver(token: string) {
  const response = await api(token).get('/user');
  return response.data;
}

export async function getUserCoinBalance(token: string, userId: number) {
  const response = await api(token).get(`/user/wallet/coins/${userId}`);
  return response.data;
}

export async function fetchUserData(token: string): Promise<User | null> {
  if (!token || !isTokenValid(token)) {
    removeToken();
    router.push('/login');
    return null;
  }

  const { userId } = decodeToken(token);
  if (!userId) {
    removeToken();
    router.push('/login');
    return null;
  }

  const user = await getData(token, userId);
  return user;
}

export async function getInactiveUsers(token: string, name?: string) {
  const response = await api(token).get('/user/inactive', {
    params: {
      name
    }
  });
  return response.data;
}
