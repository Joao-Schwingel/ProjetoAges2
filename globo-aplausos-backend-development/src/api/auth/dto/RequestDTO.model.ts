import { User } from '@prisma/client';

export type RequestWithUser = Request & {
  user: Pick<User, 'userId' | 'userType' | 'name'>;
};
