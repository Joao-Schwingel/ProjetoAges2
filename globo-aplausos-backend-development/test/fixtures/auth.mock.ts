import { User } from '@prisma/client';
import { mockAdminUser } from './user.mock';
import { AccessTokenDTO } from 'src/api/auth/dto/AccessTokenDTO.model';
import { LoginDTO } from 'src/api/auth/dto/LoginDTO.model';

const mockLogin = ({
  email,
  password,
}: Pick<User, 'email' | 'password'>): LoginDTO => ({
  email,
  password,
});

export const mockAdminLogin = mockLogin({
  email: mockAdminUser.email,
  password: mockAdminUser.password,
});

export const mockInvalidLogin = mockLogin({
  email: mockAdminLogin.email,
  password: 'S&nha123',
});

export const mockAccessToken: AccessTokenDTO = {
  access_token: 'mockAccessToken',
};
