import { UserType, Wallet } from '@prisma/client';
import { mockAdminUser, mockBasicUser } from './user.mock';

type MockWallet = Omit<Partial<Wallet>, 'walletId' | 'userId'> &
  // This & ({ ... } | { ... }) is a TypeScript utility type called "conditional type"
  // It is used to create a type that is either one or the other (simulates lacking overloading in TypeScript)
  // So this type is either Wallet + { userType: 'ADMIN' | 'BASIC' } or Wallet + { walletId: number }
  // This is used to create a mockWallet function that can either receive a userType or a walletId
  ({ userType: UserType } | { walletId: Wallet['walletId'] });

export const mockWallet = ({
  coins = 50,
  claps = 50,
  coinsMultiplier = 1.0,
  walletLimit = 100,
  ...props
}: MockWallet): Wallet => {
  let id = -1;
  if ('walletId' in props) id = props.walletId;
  else if ('userType' in props)
    id =
      props.userType === UserType.BASIC
        ? mockBasicUser.userId
        : mockAdminUser.userId;
  return {
    walletId: id,
    userId: id,
    coins,
    claps,
    coinsMultiplier,
    walletLimit,
  };
};

export const mockAdminWallet: Wallet = mockWallet({
  userType: UserType.ADMIN,
  coins: 0,
  claps: 0,
});

export const mockBasicWallet: Wallet = mockWallet({
  userType: UserType.BASIC,
  coins: 100,
  claps: 50,
});
