import { HttpStatus, Injectable } from '@nestjs/common';
import { User, UserType, Wallet } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(reqUserId: number): Promise<Partial<User>[]> {
    const users = await this.prisma.user.findMany({
      where: {
        userId: { not: reqUserId },
        userType: { not: UserType.ADMIN },
      },
      select: {
        userId: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });

    return users;
  }

  async getUserCard(userId: number): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { userId: Number(userId) },
      select: {
        userId: true,
        name: true,
        email: true,
        userType: true,
        profilePicture: true,
        wallet: {
          select: {
            claps: true,
          },
        },
      },
    });

    if (!user) {
      throw new Exception(
        `User with ID ${userId} not found`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async getUserWalletCoins(
    reqUserId: number,
    userId: number,
  ): Promise<Pick<Wallet, 'coins'>> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: { userId: true },
    });

    if (!user)
      throw new Exception(
        `User with ID ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );

    if (reqUserId !== user.userId)
      throw new Exception(
        `You are not authorized to access this user's wallet.`,
        HttpStatus.UNAUTHORIZED,
      );

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { coins: true },
    });

    if (!wallet)
      throw new Exception(
        `Wallet from user with ID ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );

    return wallet;
  }

  async getInactiveUsers(name: string): Promise<Partial<User>[]> {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const users = await this.prisma.user.findMany({
      where: {
        userType: UserType.BASIC,
        name: {
          contains: name,
        },
        sentFeedbacks: {
          every: {
            date: {
              lt: twoMonthsAgo,
            },
          },
        },
        transactions: {
          every: {
            datetime: {
              lt: twoMonthsAgo,
            },
          },
        },
      },
      select: {
        name: true,
        userId: true,
        profilePicture: true,
        sentFeedbacks: {
          select: {
            date: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
        transactions: {
          select: {
            datetime: true,
          },
          orderBy: {
            datetime: 'desc',
          },
        },
      },
    });

    return users.map((user) => {
      if (user.sentFeedbacks.length === 0 && user.transactions.length === 0) {
        return {
          ...user,
          lastActivity: null,
        };
      }
      if (user.sentFeedbacks[0].date > user.transactions[0].datetime)
        return {
          ...user,
          lastActivity: user.sentFeedbacks[0].date,
        };
      else
        return {
          ...user,
          lastActivity: user.transactions[0].datetime,
        };
    });
  }
}
