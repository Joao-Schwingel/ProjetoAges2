import {
  mockMyRewardsDTO,
  mockTransaction2,
} from './../../../test/fixtures/transaction.mock';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockInvalidItem, mockItem1 } from '../../../test/fixtures/item.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { StoreService } from './store.service';
import { mockTransaction1 } from '../../../test/fixtures/transaction.mock';
import { mockBasicUser } from '../../../test/fixtures/user.mock';
import { TransactionDTO } from './DTO/TransactionDTO.model';

describe('StoreService', () => {
  let storeService: StoreService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreService, PrismaService],
    }).compile();

    storeService = module.get<StoreService>(StoreService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(storeService).toBeDefined();
  });

  it('should throw an exception for invalid itemId', async () => {
    jest
      .spyOn(prismaService.item, 'findUnique')
      .mockRejectedValue(
        new Exception(
          `Item with ID ${mockInvalidItem.itemId} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );

    let exceptionThrown = false;

    try {
      await storeService.getStoreItem(mockInvalidItem.itemId);
    } catch (e) {
      exceptionThrown = true;
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(HttpStatus.NOT_FOUND);
      expect(e.message).toBe(
        `Item with ID ${mockInvalidItem.itemId} not found`,
      );
    }

    expect(exceptionThrown).toBe(true);
  });

  it('should return the correct itemId', async () => {
    jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
    const item = await storeService.getStoreItem(mockItem1.itemId);
    expect(item.itemId).toBe(mockItem1.itemId);
  });

  it('should return the correct name', async () => {
    jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
    const item = await storeService.getStoreItem(mockItem1.itemId);
    expect(item.name).toBe(mockItem1.name);
  });

  it('should return the correct description', async () => {
    jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
    const item = await storeService.getStoreItem(mockItem1.itemId);
    expect(item.description).toBe(mockItem1.description);
  });

  it('should return the correct price', async () => {
    jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
    const item = await storeService.getStoreItem(mockItem1.itemId);
    expect(item.price).toBe(mockItem1.price);
  });

  it('should return the correct image', async () => {
    jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
    const item = await storeService.getStoreItem(mockItem1.itemId);
    expect(item.image).toBe(mockItem1.image);
  });

  it('should return availaibility', async () => {
    jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
    const item = await storeService.getStoreItem(mockItem1.itemId);
    expect(item.available).toBe(mockItem1.available);
  });

  it('should throw an exception for an error in getMyRewards', async () => {
    const userId = 2;

    jest
      .spyOn(prismaService.transaction, 'findMany')
      .mockRejectedValue(
        new Exception(
          'Error fetching rewards',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

    let exceptionThrown = false;

    try {
      await storeService.getMyRewards(userId);
    } catch (e) {
      exceptionThrown = true;
      expect(e).toBeInstanceOf(Exception);
      expect(e.status).toBe(HttpStatus.NOT_FOUND);
      expect(e.message).toBe('Error fetching rewards');
    }

    expect(exceptionThrown).toBe(true);
  });

  it('should return the correct rewards for a user', async () => {
    jest.spyOn(prismaService.item, 'findMany').mockResolvedValue([mockItem1]);

    const now = new Date();
    const adjustedDatetime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
    );

    jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue([
      {
        ...mockTransaction1,
        item: {
          image: mockItem1.image,
          description: mockItem1.description,
          name: mockItem1.name,
        },
        datetime: adjustedDatetime,
      } as TransactionDTO,
      {
        ...mockTransaction2,
        item: {
          image: mockItem1.image,
          description: mockItem1.description,
          name: mockItem1.name,
        },
        datetime: adjustedDatetime,
      } as TransactionDTO,
    ]);

    const rewards = await storeService.getMyRewards(mockBasicUser.userId);
    expect(rewards).toEqual(mockMyRewardsDTO);
  });
});
