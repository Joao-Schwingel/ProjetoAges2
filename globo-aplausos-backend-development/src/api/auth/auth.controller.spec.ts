import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAccessToken,
  mockAdminLogin,
  mockInvalidLogin,
} from '../../../test/fixtures/auth.mock';
import { PrismaService } from '../../database/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, PrismaService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('Login', () => {
    it('should return an access token for valid login credentials', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockAccessToken);

      const result = await authController.login(mockAdminLogin);

      expect(result).toEqual(mockAccessToken);
    });

    it('should return an error for invalid login credentials', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Senha incorreta'));

      expect(async () => {
        await authController.login(mockInvalidLogin);
      }).rejects.toThrowError('Senha incorreta');
    });
  });
});
