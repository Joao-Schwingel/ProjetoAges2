import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

const mockPrismaClient = {
  $connect: jest.fn(),
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(function () {
      this.$connect = mockPrismaClient.$connect;
      return this;
    }),
  };
});

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', async () => {
    expect(prismaService).toBeDefined();
  });

  it('should connect to the database on module initialization', async () => {
    await prismaService.onModuleInit();
    expect(mockPrismaClient.$connect).toHaveBeenCalled();
  });
});
