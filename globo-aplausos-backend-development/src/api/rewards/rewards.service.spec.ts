import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockInvalidItem,
  mockInvalidItemDescriptionReq,
  mockInvalidItemNameReq,
  mockInvalidItemPriceReq,
  mockItem1,
} from '../../../test/fixtures/item.mock';
import { mockTransaction1 } from '../../../test/fixtures/transaction.mock';
import { mockAdminUser, mockBasicUser } from '../../../test/fixtures/user.mock';
import {
  mockBasicWallet,
  mockWallet,
} from '../../../test/fixtures/wallet.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { RewardsService } from './rewards.service';

describe('RewardsService', () => {
  let rewardsService: RewardsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardsService, PrismaService],
    }).compile();

    rewardsService = module.get<RewardsService>(RewardsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return error when itemId is invalid', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockBasicUser);
    jest
      .spyOn(prismaService.wallet, 'findUnique')
      .mockResolvedValue(mockBasicWallet);
    jest
      .spyOn(prismaService.item, 'findUnique')
      .mockRejectedValue(
        new Exception(
          `Item with ID ${mockInvalidItem.itemId} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );

    try {
      await rewardsService.makeTransaction(
        mockBasicUser.userId,
        mockInvalidItem.itemId,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Exception);
      expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(e.message).toBe(
        `Item with ID ${mockInvalidItem.itemId} not found`,
      );
    }
  });

  it('should return error when user is invalid', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockRejectedValue(
        new Exception(
          `User with ID ${mockAdminUser.userId} is invalid`,
          HttpStatus.UNAUTHORIZED,
        ),
      );
    jest.spyOn(prismaService.wallet, 'findUnique').mockResolvedValue(
      mockWallet({
        walletId: mockAdminUser.userId,
      }),
    );

    try {
      await rewardsService.makeTransaction(
        mockAdminUser.userId,
        mockItem1.itemId,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Exception);
      expect(e.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect(e.message).toBe(`User with ID ${mockAdminUser.userId} is invalid`);
    }
  });

  it('should be a successful transaction', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockBasicUser);
    jest
      .spyOn(prismaService.wallet, 'findUnique')
      .mockResolvedValue(mockBasicWallet);
    jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
    jest.spyOn(prismaService.wallet, 'update').mockResolvedValue({
      ...mockBasicWallet,
      claps: mockBasicWallet.claps - mockItem1.price,
    });
    jest
      .spyOn(prismaService.transaction, 'create')
      .mockResolvedValue(mockTransaction1);

    const transaction = await rewardsService.makeTransaction(
      mockBasicUser.userId,
      mockItem1.itemId,
    );

    expect(transaction).toEqual({
      itemId: mockItem1.itemId,
      price: mockItem1.price,
      userId: mockBasicUser.userId,
      transactionId: expect.any(Number),
      datetime: expect.any(Date),
    });
  });

  // it('should create new item', async () => {
  //   const fileData = await new Promise<string>((resolve, reject) => {
  //     try {
  //       const file = readFileSync(`${__dirname}/bagMock.png`, {
  //         encoding: 'base64',
  //       });
  //       resolve(file);
  //     } catch (err) {
  //       return reject(err);
  //     }
  //   });

  //   const mockItemReq: RewardDTO = {
  //     ...mockItemReq5,
  //     file: {
  //       ...mockItemReq5.file,
  //       data: fileData,
  //     },
  //   };
  //   jest.spyOn(prismaService.item, 'create').mockResolvedValue(mockItem5);
  //   const sucesso = await rewardsService.createReward(mockItemReq);
  //   expect(sucesso).toEqual(mockItem5);
  // });

  it('should return error when price is negative', async () => {
    jest
      .spyOn(prismaService.item, 'create')
      .mockRejectedValue(
        new Exception('Price cannot be negative', HttpStatus.BAD_REQUEST),
      );

    try {
      await rewardsService.createReward(mockInvalidItemPriceReq);
    } catch (e) {
      expect(e).toBeInstanceOf(Exception);
      expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(e.message).toBe(`Price cannot be negative`);
    }
  });

  it('should return error when name is empty', async () => {
    jest
      .spyOn(prismaService.item, 'create')
      .mockRejectedValue(
        new Exception('Name cannot be empty', HttpStatus.BAD_REQUEST),
      );

    try {
      await rewardsService.createReward(mockInvalidItemNameReq);
    } catch (e) {
      expect(e).toBeInstanceOf(Exception);
      expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(e.message).toBe(`Name cannot be empty`);
    }
  });

  it('should return error when description is empty', async () => {
    jest
      .spyOn(prismaService.item, 'create')
      .mockRejectedValue(
        new Exception('Description cannot be empty', HttpStatus.BAD_REQUEST),
      );

    try {
      await rewardsService.createReward(mockInvalidItemDescriptionReq);
    } catch (e) {
      expect(e).toBeInstanceOf(Exception);
      expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(e.message).toBe(`Description cannot be empty`);
    }
  });

  it('should edit a reward when valid itemId is provided', async () => {
    const itemId = 1;
    const mockRewardDTO = {
      name: 'Updated Reward',
      description: 'Updated Description',
      image: 'bagMock.png',
      price: 100,
    };

    const mockReward = {
      itemId: 1,
      name: 'Reward',
      description: 'Description',
      price: 50,
      image: 'bagMock.png',
      updatedAt: new Date(),
      available: true,
    };

    jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockReward);
    jest
      .spyOn(prismaService.item, 'update')
      .mockResolvedValue({ ...mockReward, ...mockRewardDTO });

    const result = await rewardsService.editReward(itemId, mockRewardDTO);

    expect(prismaService.item.findUnique).toHaveBeenCalledWith({
      where: { itemId },
    });
    expect(prismaService.item.update).toHaveBeenCalledWith({
      where: { itemId },
      data: mockRewardDTO,
    });
    expect(result).toEqual({ ...mockReward, ...mockRewardDTO });
  });

  it('should return null when no rewards have been redeemed', async () => {
    jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue([]);
    const rewardsRedeemed = await rewardsService.getRewardsRedeemed();
    expect(rewardsRedeemed).toBe(null);
  });
});
