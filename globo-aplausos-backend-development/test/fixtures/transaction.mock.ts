import { Transaction } from '@prisma/client';
import { mockBasicUser } from './user.mock';
import { mockItem1 } from './item.mock';
import { TransactionDTO } from 'src/api/store/DTO/TransactionDTO.model';
import { RewardRedeemedDTO } from 'src/api/rewards/DTO/rewardDTO.model';

export const mockTransaction = ({
  transactionId,
  userId,
  itemId,
  price,
  datetime = new Date(),
}: Partial<Transaction>): Transaction => ({
  transactionId,
  userId,
  itemId,
  price,
  datetime,
});

export const mockTransaction1 = mockTransaction({
  transactionId: 1,
  userId: mockBasicUser.userId,
  itemId: mockItem1.itemId,
  price: mockItem1.price,
});

export const mockTransaction2 = mockTransaction({
  transactionId: 2,
  userId: mockBasicUser.userId,
  itemId: mockItem1.itemId,
  price: mockItem1.price,
});

export const mockTransactionDTO = ([
  {
    itemId,
    userId,
    transactionId,
    price,
    item: { image, description, name },
    datetime,
  },
]: Partial<TransactionDTO[]>): TransactionDTO[] => [
  {
    itemId,
    userId,
    transactionId,
    price,
    item: { image, description, name },
    datetime,
  },
];

export const mockTransactionDTO1 = mockTransactionDTO([
  {
    itemId: mockTransaction1.itemId,
    userId: mockTransaction1.userId,
    transactionId: mockTransaction1.transactionId,
    price: mockTransaction1.price,
    item: {
      image: mockItem1.image,
      description: mockItem1.description,
      name: mockItem1.name,
    },
    datetime: mockTransaction1.datetime,
  },
]);

const now = new Date();

export const mockMyRewards: Transaction[] = [
  {
    transactionId: 1,
    userId: mockBasicUser.userId,
    itemId: mockItem1.itemId,
    price: mockItem1.price,
    datetime: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
    ),
  },
  {
    transactionId: 2,
    userId: mockBasicUser.userId,
    itemId: mockItem1.itemId,
    price: mockItem1.price,
    datetime: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
    ),
  },
];

export const mockMyRewardsDTO: TransactionDTO[] = mockMyRewards.map(
  (transaction) => ({
    ...transaction,
    item: {
      image: mockItem1.image,
      description: mockItem1.description,
      name: mockItem1.name,
    },
  }),
);

export const mockRewardRedeemedDTO: RewardRedeemedDTO[] = [
  {
    userId: mockBasicUser.userId,
    userName: mockBasicUser.name,
    profilePicture: mockBasicUser.profilePicture,
    rewardName: mockItem1.name,
    image: mockItem1.image,
    price: mockItem1.price,
    dateTime: new Date(),
  },
];
