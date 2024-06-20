import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockBasicReq,
  mockInvalidReq,
} from '../../../test/fixtures/request.mock';
import {
  mockAdminUser,
  mockBasicUser,
  mockBasicUser2,
  mockInvalidUser,
} from '../../../test/fixtures/user.mock';
import { mockBasicWallet } from '../../../test/fixtures/wallet.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userService: UserService;
  let userController: UserController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Get all', () => {
    it('should get all non-admin users', async () => {
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValue([mockBasicUser]);
      jest.spyOn(userService, 'getAll').mockResolvedValue([mockBasicUser]);

      const result = await userController.getAll(mockBasicReq);

      expect(result.length).toBe(1);
      expect(result[0]).toBe(mockBasicUser);
    });
  });

  describe('Get user card', () => {
    it('should get the correct user', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockAdminUser);
      jest.spyOn(userService, 'getUserCard').mockResolvedValue(mockAdminUser);

      const result = await userController.getUserCard(mockAdminUser.userId);

      expect(result).toBe(mockAdminUser);
    });

    it('should throw an exception for invalid userId', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockRejectedValue(
          new Exception(
            `User with ID ${mockInvalidUser.userId} not found`,
            HttpStatus.UNAUTHORIZED,
          ),
        );

      try {
        await userController.getUserCard(mockInvalidUser.userId);
      } catch (e) {
        expect(e).toBeInstanceOf(Exception);
        expect(e.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(e.message).toBe(
          `User with ID ${mockInvalidUser.userId} not found`,
        );
      }
    });
  });

  describe('getUserWalletCoins', () => {
    it('should get the correct user wallet', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockBasicUser);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockBasicWallet);

      const result = await userController.getUserWalletCoins(
        mockBasicReq,
        mockBasicUser.userId,
      );

      expect(result.coins).toEqual(mockBasicWallet.coins);
    });

    it('should throw an exception for invalid userId', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockRejectedValue(
          new Exception(
            `User with ID ${mockInvalidUser.userId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockRejectedValue(
          new Exception(
            `Wallet from user with ID ${mockInvalidUser.userId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await userController.getUserWalletCoins(
          mockInvalidReq,
          mockInvalidUser.userId,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(Exception);
        expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe(
          `User with ID ${mockInvalidUser.userId} not found`,
        );
      }
    });

    it('should throw an exception for unauthorized user', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockBasicUser2);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockBasicWallet);

      try {
        await userController.getUserWalletCoins(
          mockBasicReq,
          mockBasicUser.userId,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(Exception);
        expect(e.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(e.message).toBe(
          `You are not authorized to access this user's wallet.`,
        );
      }
    });
  });

  describe('Get inactive users', () => {
    it('should get all inactive users', async () => {
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValue([mockBasicUser]);
      jest
        .spyOn(userService, 'getInactiveUsers')
        .mockResolvedValue([mockBasicUser]);

      const result = await userController.getInactiveUsers('Teste');

      expect(result.length).toBe(1);
      expect(result[0]).toBe(mockBasicUser);
    });
  });
});
