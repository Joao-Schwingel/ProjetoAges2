import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockBasicUser,
  mockInvalidUser,
} from '../../../test/fixtures/user.mock';
import {
  mockAllSentFeedback,
  mockFeedback,
  mockFeedbackSentByMe,
  mockFeedbacks,
} from '../../../test/fixtures/feedback.mock';
import {
  mockBasicReq,
  mockInvalidReq,
} from '../../../test/fixtures/request.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

describe('FeedbackController', () => {
  let feedbackService: FeedbackService;
  let feedbackController: FeedbackController;
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
      controllers: [FeedbackController],
      providers: [FeedbackService, PrismaService],
    }).compile();

    feedbackController = module.get<FeedbackController>(FeedbackController);
    feedbackService = module.get<FeedbackService>(FeedbackService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Post feedback', () => {
    it('should post the feedback correctly', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockBasicUser);
      jest
        .spyOn(feedbackService, 'sendFeedback')
        .mockResolvedValue(mockFeedback);

      const result = await feedbackController.sendFeedback(
        mockBasicReq,
        mockFeedback,
      );

      expect(result).toBe(mockFeedback);
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
        await feedbackController.sendFeedback(mockInvalidReq, mockFeedback);
      } catch (e) {
        expect(e).toBeInstanceOf(Exception);
        expect(e.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(e.message).toBe(
          `User with ID ${mockInvalidUser.userId} not found`,
        );
      }
    });
  });

  describe('Get feedbacks sent by me', () => {
    it('should get feedbacks sent by me correctly', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockBasicUser);
      jest
        .spyOn(feedbackService, 'feedbacksSentByMe')
        .mockResolvedValue([mockFeedbackSentByMe]);

      const result = await feedbackController.feedbacksSentByMe(mockBasicReq);

      expect(result).toEqual([mockFeedbackSentByMe]);
    });
  });
  describe('Get all feedbacks', () => {
    it('should get feedbacks correctly', async () => {
      jest
        .spyOn(prismaService.feedback, 'findMany')
        .mockResolvedValue(mockFeedbacks);
      jest
        .spyOn(feedbackService, 'getAllFeedbacks')
        .mockResolvedValue([mockAllSentFeedback]);

      const result = await feedbackController.getAllFeedbacks();
      expect(result).toEqual([mockAllSentFeedback]);
    });
  });
});
