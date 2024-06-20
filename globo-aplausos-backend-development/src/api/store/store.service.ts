import { HttpStatus, Injectable } from '@nestjs/common';
import { Item } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { TransactionDTO } from './DTO/TransactionDTO.model';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getStoreItems(): Promise<Partial<Item>[]> {
    const items = await this.prisma.item.findMany({
      where: { available: true },
      select: {
        itemId: true,
        image: true,
        name: true,
        description: true,
        available: true,
        price: true,
      },
    });

    return items;
  }

  async getStoreItem(itemId: number): Promise<Partial<Item>> {
    const item = await this.prisma.item.findUnique({
      where: { itemId: Number(itemId) },
      select: {
        itemId: true,
        image: true,
        name: true,
        description: true,
        price: true,
      },
    });

    if (!item) {
      throw new Exception(
        `Item with ID ${itemId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return item;
  }

  async getMyRewards(userId: number): Promise<TransactionDTO[]> {
    try {
      const myRewards = await this.prisma.transaction.findMany({
        where: { userId: userId },
        select: {
          itemId: true,
          userId: true,
          transactionId: true,
          price: true,
          datetime: true,
          item: {
            select: {
              image: true,
              name: true,
              description: true,
            },
          },
        },
      });
      return myRewards;
    } catch (error) {
      throw new Exception(`Error fetching rewards`, HttpStatus.NOT_FOUND);
    }
  }

  async deleteStoreItem(itemId: number): Promise<Partial<Item>> {
    const item = await this.prisma.item.findUnique({
      where: { itemId: Number(itemId) },
      select: {
        available: true,
      },
    });

    if (!item)
      throw new Exception(
        `Item with ID ${itemId} not found`,
        HttpStatus.NOT_FOUND,
      );

    await this.prisma.item.update({
      where: { itemId: Number(itemId) },
      data: { available: false },
    });

    return item;
  }
}
