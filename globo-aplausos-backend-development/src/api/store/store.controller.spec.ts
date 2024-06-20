import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockInvalidItem,
  mockItem1,
  mockItems,
} from '../../../test/fixtures/item.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { mockBasicUser } from '../../../test/fixtures/user.mock';
import { mockBasicReq } from '../../../test/fixtures/request.mock';

import { mockTransactionDTO1 } from '../../../test/fixtures/transaction.mock';

describe('StoreController', () => {
  let storeService: StoreService;
  let storeController: StoreController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
      ],
      controllers: [StoreController],
      providers: [StoreService, PrismaService],
    }).compile();

    storeController = module.get<StoreController>(StoreController);
    storeService = module.get<StoreService>(StoreService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Get Items', () => {
    it('should get all Items', async () => {
      jest.spyOn(prismaService.item, 'findMany').mockResolvedValue(mockItems);
      jest.spyOn(storeService, 'getStoreItems').mockResolvedValue(mockItems);

      const result = await storeController.getStoreItems();

      expect(result).toBe(mockItems);
    });
  });

  describe('Get Item', () => {
    it('should get the correct Item', async () => {
      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
      jest.spyOn(storeService, 'getStoreItem').mockResolvedValue(mockItem1);

      const result = await storeController.getStoreItem(mockItem1.itemId);

      expect(result).toBe(mockItem1);
    });

    it('should throw an exception for invalid ItemId', async () => {
      jest
        .spyOn(prismaService.item, 'findUnique')
        .mockRejectedValue(
          new Exception(
            `Item with ID ${mockInvalidItem.itemId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await storeController.getStoreItem(mockInvalidItem.itemId);
      } catch (e) {
        expect(e).toBeInstanceOf(Exception);
        expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe(
          `Item with ID ${mockInvalidItem.itemId} not found`,
        );
      }
    });
  });

  describe('Get rewards redeemed by me', () => {
    it('should get rewards redeemed by me correctly', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockBasicUser);
      const service = jest
        .spyOn(storeService, 'getMyRewards')
        .mockResolvedValue(mockTransactionDTO1);

      const result = await storeController.getMyRewards(mockBasicReq);

      expect(result).toEqual(mockTransactionDTO1);

      service.mockRestore();
    });
  });

  describe('Delete Item', () => {
    it('should delete Item successfully', async () => {
      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
      jest.spyOn(prismaService.item, 'update').mockResolvedValue({
        ...mockItem1,
        available: false,
      });
      const result = await storeController.deleteStoreItem(mockItem1.itemId);

      expect(result.available).toStrictEqual(mockItem1.available);
    });
    it('should delete invalid Item', async () => {
      jest
        .spyOn(prismaService.item, 'findUnique')
        .mockResolvedValue(mockInvalidItem);
      jest
        .spyOn(prismaService.item, 'update')
        .mockRejectedValue(
          new Exception(
            `Item with ID ${mockInvalidItem.itemId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      let exceptionThrown = false;

      try {
        await storeController.deleteStoreItem(mockInvalidItem.itemId);
      } catch (e) {
        exceptionThrown = true;
        expect(e).toBeInstanceOf(Exception);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe(
          `Item with ID ${mockInvalidItem.itemId} not found`,
        );
      }
      expect(exceptionThrown).toBe(true);
    });
  });
});
