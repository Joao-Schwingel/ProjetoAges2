import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAdminUser } from '../../../test/fixtures/user.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should throw an exception for invalid userId', async () => {
    const invalidId = -1;

    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockRejectedValue(
        new Exception(
          `User with ID ${invalidId} not found`,
          HttpStatus.UNAUTHORIZED,
        ),
      );

    let exceptionThrown = false;

    try {
      await userService.getUserCard(invalidId);
    } catch (e) {
      exceptionThrown = true;
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(e.message).toBe(`User with ID ${invalidId} not found`);
    }

    expect(exceptionThrown).toBe(true);
  });

  it('should return the correct userId', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockAdminUser);
    const userId = mockAdminUser.userId;
    const user = await userService.getUserCard(userId);
    expect(user.userId).toBe(userId);
  });

  it('should return the correct name', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockAdminUser);
    const name = mockAdminUser.name;
    const user = await userService.getUserCard(mockAdminUser.userId);
    expect(user.name).toBe(name);
  });

  it('should return the correct email', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockAdminUser);
    const email = mockAdminUser.email;
    const user = await userService.getUserCard(mockAdminUser.userId);
    expect(user.email).toBe(email);
  });

  it('should return the correct cpf', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockAdminUser);
    const cpf = mockAdminUser.cpf;
    const user = await userService.getUserCard(mockAdminUser.userId);
    expect(user.cpf).toBe(cpf);
  });

  it('should return the correct password', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockAdminUser);
    const password = mockAdminUser.password;
    const user = await userService.getUserCard(mockAdminUser.userId);
    expect(user.password).toBe(password);
  });

  it('should return the correct userType', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockAdminUser);
    const userType = mockAdminUser.userType;
    const user = await userService.getUserCard(mockAdminUser.userId);
    expect(user.userType).toBe(userType);
  });

  it('should return the correct walletId', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockAdminUser);
    const walletId = mockAdminUser.walletId;
    const user = await userService.getUserCard(mockAdminUser.userId);
    expect(user.walletId).toBe(walletId);
  });

  it('should return the correct profilePicture', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockAdminUser);

    const user = await userService.getUserCard(mockAdminUser.userId);
    expect(user.profilePicture).toBe(mockAdminUser.profilePicture);
  });

  it('should return inactive users', async () => {
    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

    const users = await userService.getInactiveUsers('Teste');
    expect(users).toEqual([]);
  });
});
