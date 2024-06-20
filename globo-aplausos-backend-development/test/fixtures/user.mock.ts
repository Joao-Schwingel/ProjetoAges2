import { User, UserType } from '@prisma/client';

export function mockUser({
  userId,
  name,
  email,
  cpf,
  userType,
}: Partial<User>): User {
  return {
    userId,
    name,
    email,
    cpf,
    password: 'Senh@123',
    userType,
    profilePicture: 'https://thispersondoesnotexist.com/',
    walletId: userId,
  };
}

export const mockInvalidUser: User = mockUser({
  userId: 0,
  name: 'Invalid User',
  email: 'invalid.user@not.valid.com',
  cpf: '12345678900',
  userType: UserType.BASIC,
});

export const mockAdminUser: User = mockUser({
  userId: 1,
  name: 'Luciane Fortes',
  email: 'luciane.fortes@g.globo.com',
  cpf: '12345678901',
  userType: UserType.ADMIN,
});

export const mockBasicUser: User = mockUser({
  userId: 2,
  name: 'Alessandra Dutra',
  email: 'alessandra.dutra@pucrs.br',
  cpf: '12345678902',
  userType: UserType.BASIC,
});

export const mockBasicUser2: User = mockUser({
  userId: 3,
  name: 'Eduarda Keller',
  email: 'eduarda.k@edu.pucrs.br',
  cpf: '12345678903',
  userType: UserType.BASIC,
});
