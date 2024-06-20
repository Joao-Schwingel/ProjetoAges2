import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '@prisma/client';
import { RewardsService } from './rewards.service';
import { mockItem1 } from '../../../test/fixtures/item.mock';
import { mockBasicReq } from '../../../test/fixtures/request.mock';
import {
  mockRewardRedeemedDTO,
  mockTransaction1,
} from '../../../test/fixtures/transaction.mock';
import { mockBasicUser } from '../../../test/fixtures/user.mock';
import {
  mockBasicWallet,
  mockWallet,
} from '../../../test/fixtures/wallet.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { RewardsController } from './rewards.controller';

describe('RewardsController', () => {
  let rewardsService: RewardsService;
  let rewardsController: RewardsController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [RewardsController],
      providers: [RewardsService, PrismaService],
    }).compile();

    rewardsController = module.get<RewardsController>(RewardsController);
    rewardsService = module.get<RewardsService>(RewardsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Get transaction', () => {
    it('should get the transition done by the correct user', async () => {
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

    it('should throw an error if the user does not have enough claps', async () => {
      const mockEmptyWallet = mockWallet({
        userType: UserType.BASIC,
        claps: 0,
      });
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockBasicUser);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockEmptyWallet);
      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem1);
      jest.spyOn(prismaService.wallet, 'update').mockResolvedValue({
        ...mockEmptyWallet,
        claps: mockEmptyWallet.claps - mockItem1.price,
      });

      try {
        await rewardsController.makeTransaction(mockBasicReq, mockItem1.itemId);
      } catch (e) {
        expect(e).toBeInstanceOf(Exception);
        expect(e.getStatus()).toBe(HttpStatus.FAILED_DEPENDENCY);
        expect(e.message).toBe(
          `User with ID ${mockBasicUser.userId} does not have enough claps`,
        );
      }
    });

    describe('Get rewards redeemed', () => {
      it('should get rewards redeemed properly', async () => {
        jest
          .spyOn(rewardsService, 'getRewardsRedeemed')
          .mockResolvedValue(mockRewardRedeemedDTO);

        const result = await rewardsController.getRewardsRedeemed();

        expect(result).toEqual(mockRewardRedeemedDTO);
      });
    });

    // it('should create a new item', async () => {
    //   jest.spyOn(prismaService.item, 'create').mockResolvedValue(mockItem3);

    //   const item = await rewardsController.createReward(mockItem3);

    //   expect(item).toEqual(mockItem3);
    // });
    describe('editReward', () => {
      it('should call editReward service with correct parameters', async () => {
        const mockItem = {
          name: 'Test Reward',
          description: 'Test Description',
          file: {
            data: '/9j/anyBase64String',
            name: 'bone.png',
            type: 'image/png',
          },
          price: 50,
        };

        const itemId = 1;
        const mockPartialItem = {
          name: 'Test Reward',
          description: 'Test Description',
        };

        jest
          .spyOn(rewardsService, 'editReward')
          .mockResolvedValue(mockPartialItem);

        const result = await rewardsController.editReward(itemId, mockItem);

        expect(rewardsService.editReward).toHaveBeenCalledWith(
          itemId,
          mockItem,
        );
        expect(result).toEqual(mockPartialItem);
      });

      it('should handle exceptions correctly', async () => {
        const mockItem = {
          name: 'Test Reward',
          description: 'Test Description',
          file: {
            data: '/9j/anyBase64String',
            name: 'bone.png',
            type: 'image/png',
          },
          price: 50,
        };

        const itemId = 1;
        const error = new Error('Erro de serviço');

        jest.spyOn(rewardsService, 'editReward').mockRejectedValue(error);

        try {
          await rewardsController.editReward(itemId, mockItem);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });
});
