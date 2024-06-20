import { Developers } from '@/types/prisma';
import { api } from '@/utils/api';

export async function getDevelopers(token: string) {
  const response = await api(token).get<Developers[]>('/developers');
  return response.data;
}
