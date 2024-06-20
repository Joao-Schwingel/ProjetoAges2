import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockBasicUser } from '../../../test/fixtures/user.mock';
import {
  mockFeedbackResponse,
  mockFeedback,
  mockInvalidFeedback,
  mockFeedback2,
  mockFeedbackWithEmptyMessage,
} from '../../../test/fixtures/feedback.mock';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { FeedbackService } from './feedback.service';
import { mockBasicReq } from '../../../test/fixtures/request.mock';

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService, PrismaService],
    }).compile();

    feedbackService = module.get<FeedbackService>(FeedbackService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(feedbackService).toBeDefined();
  });

  it('should throw an exception for invalid feedback', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockRejectedValue(
        new Exception(
          `Exception message for feedback`,
          HttpStatus.UNAUTHORIZED,
        ),
      );

    let exceptionThrown = false;

    try {
      await feedbackService.sendFeedback(mockBasicUser.userId, mockFeedback);
    } catch (e) {
      exceptionThrown = true;
      expect(e).toBeInstanceOf(Exception);
      expect(e.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(e.message).toBe(`Exception message for feedback`);
    }

    expect(exceptionThrown).toBe(true);
  });
  it('should delete feedback successfully', async () => {
    jest
      .spyOn(prismaService.feedback, 'findUnique')
      .mockResolvedValue(mockFeedbackResponse);
    jest.spyOn(prismaService.feedback, 'update').mockResolvedValue({
      ...mockFeedbackResponse,
      visibility: false,
    });
    const result = await feedbackService.deleteFeedback(
      mockBasicReq,
      mockFeedbackResponse.feedbackID,
    );

    expect(result).toStrictEqual({ status: true });
  });
  it('should throw an exception for visilibity already false', async () => {
    jest
      .spyOn(prismaService.feedback, 'findUnique')
      .mockResolvedValue(mockFeedback2);
    jest
      .spyOn(prismaService.feedback, 'update')
      .mockRejectedValue(
        new Exception(
          `Feedback visibility already false`,
          HttpStatus.BAD_REQUEST,
        ),
      );

    let exceptionThrown = false;

    try {
      await feedbackService.deleteFeedback(
        mockBasicReq,
        mockFeedbackResponse.feedbackID,
      );
    } catch (e) {
      exceptionThrown = true;
      expect(e).toBeInstanceOf(Exception);
      expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      expect(e.message).toBe(`Feedback visibility already false`);
    }
    expect(exceptionThrown).toBe(true);
  });
  it('should not allow negative values for feedback', async () => {
    try {
      await feedbackService.sendFeedback(
        mockBasicUser.userId,
        mockInvalidFeedback,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Exception);
      expect(e.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(e.message).toBe(`Value must be positive`);
    }
  });
  it('should not allow feedback without message', async () => {
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockBasicUser);

    try {
      await feedbackService.sendFeedback(
        mockBasicUser.userId,
        mockFeedbackWithEmptyMessage,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Exception);
      expect(e.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(e.message).toBe(`Message must not be empty`);
    }
  });
});
