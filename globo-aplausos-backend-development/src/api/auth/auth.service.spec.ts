import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAdminUser } from '../../../test/fixtures/user.mock';
import {
  mockAdminLogin,
  mockInvalidLogin,
} from '../../../test/fixtures/auth.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('Login', () => {
    it('should return an access token for valid credentials', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockAdminUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockAccessToken');

      const result = await authService.login(mockAdminLogin);

      expect(result).toBeDefined();
      expect(result.access_token).toEqual('mockAccessToken');
    });

    it('should throw an exception for an invalid user', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      expect(async () => {
        await authService.login(mockInvalidLogin);
      }).rejects.toThrow(Exception);
    });

    it('should throw an exception for incorrect password', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockAdminUser);

      expect(async () => {
        await authService.login(mockInvalidLogin);
      }).rejects.toThrow(Exception);

      expect(jest.spyOn(jwtService, 'signAsync')).not.toHaveBeenCalled();
    });
  });
});
