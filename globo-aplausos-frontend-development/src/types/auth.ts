import { User } from './prisma';

export type AccessToken = {
  access_token: string;
};

export type AccessTokenDecoded = Pick<User, 'userId' | 'name' | 'userType'> & {
  iat: number;
  exp: number;
};
