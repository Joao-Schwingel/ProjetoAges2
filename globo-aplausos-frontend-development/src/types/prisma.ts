// Types created to match the Prisma schema
// This file was manually created and should be updated if the schema changes
// The prisma schema can be found at: backend/prisma/schema.prisma, where backend is the root folder of the backend project (cloned from gitlab)

export type User = {
  userId: number;
  name: string;
  email: string;
  cpf: string;
  password: string;
  profilePicture: string;

  userType: UserType;

  walletId: number;
  wallet: Wallet;
};

export enum UserType {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC'
}

export type Wallet = {
  walletId: number;
  claps: number;
  coins: number;
  walletLimit: number;
  coinsMultiplier: number;

  userId: number;
};

export type Feedback = {
  feedbackID: number;

  senderId: number;
  sender: User;

  receiverId: number;
  receiver: User;

  value: number;
  date: Date;
  message: string;
  visibility: boolean;
};

export type Transaction = {
  transactionId: number;
  price: number;
  datetime: Date;

  userId: number;
  user: User;

  itemId: number;
  item: Item;
};

export type Item = {
  itemId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  updatedAt: Date | undefined;
  available: boolean;
};

export type redeemedItem = {
  name: string;
  itemId: number;
  userId: number;
  transactionId: number;
  price: number;
  datetime: string;
  item: {
    image: string;
    description: string;
    name: string;
  };
};

export type rewardHistory = {
  userId: string;
  userName: string;
  profilePicture: string;
  rewardName: string;
  image: string;
  price: number;
  dateTime: Date;
};

export type Developers = {
  id: number;
  name: string;
  url: string;
  image: string;
  title: string;
};
