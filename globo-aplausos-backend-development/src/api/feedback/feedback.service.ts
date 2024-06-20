import { Feedback } from '@prisma/client';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { FeedbackDTO, AllFeedbacksDTO } from './DTO/FeedbackDTO.model';
import {
  FeedbackResponseDTO,
  FeedbacksSentByMeResponseDTO,
} from './DTO/FeedbackResponseDTO.model';
import { RequestWithUser } from '../auth/dto/RequestDTO.model';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async sendFeedback(
    reqUserId: number,
    { message, value, receiverId: _recieverId }: FeedbackDTO,
  ): Promise<Partial<Feedback>> {
    const receiverId = Number(_recieverId);

    if (value < 0) {
      throw new Exception(`Value must be positive`, HttpStatus.NOT_ACCEPTABLE);
    }

    const user = await this.prisma.user.findUnique({
      where: { userId: reqUserId },
      select: {
        userId: true,
        wallet: {
          select: {
            claps: true,
            coins: true,
          },
        },
      },
    });

    if (!message || message.length === 0) {
      throw new Exception(
        `Message must not be empty`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (reqUserId === receiverId) {
      throw new Exception(
        `User with cant send feedback to himself`,
        HttpStatus.CONFLICT,
      );
    }

    const receiver = await this.prisma.user.findUnique({
      where: { userId: receiverId },
      select: {
        userId: true,
        wallet: {
          select: {
            claps: true,
          },
        },
      },
    });

    if (!receiver) {
      throw new Exception(
        `User with ID ${receiverId} not found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    if (user.wallet.coins < value) {
      throw new Exception(
        `User doesn't have enough coins to send feedback`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.prisma.wallet.update({
      where: { userId: reqUserId },
      data: {
        coins: user.wallet.coins - value,
      },
    });

    await this.prisma.wallet.update({
      where: { userId: receiverId },
      data: {
        claps: receiver.wallet.claps + value,
      },
    });

    const feedback = await this.prisma.feedback.create({
      data: {
        senderId: reqUserId,
        receiverId: receiverId,
        message: message,
        value: value,
        visibility: true,
      },
    });

    if (!feedback) {
      await this.prisma.wallet.update({
        where: { userId: reqUserId },
        data: {
          coins: user.wallet.coins + value,
        },
      });

      await this.prisma.wallet.update({
        where: { userId: receiverId },
        data: {
          claps: receiver.wallet.claps - value,
        },
      });

      throw new Exception(
        `Error while sending feedback`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return feedback;
  }

  async getFeedback(req: RequestWithUser): Promise<FeedbackResponseDTO[]> {
    const userId = Number(req.user.userId);
    const feedbacks = await this.prisma.feedback.findMany({
      where: {
        AND: [{ visibility: true }, { receiverId: userId }],
      },
      select: {
        message: true,
        feedbackID: true,
        date: true,
        visibility: true,
        value: true,
        receiverId: true,
        sender: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return feedbacks.map(({ feedbackID, date, message, value, sender }) => {
      return {
        feedbackID,
        date,
        profilePicture: sender.profilePicture,
        name: sender.name,
        message,
        value,
      };
    });
  }

  async feedbacksSentByMe(
    userId: number,
  ): Promise<FeedbacksSentByMeResponseDTO[]> {
    const parsedUserId = Number(userId);

    const feedbacks = await this.prisma.feedback.findMany({
      where: { senderId: parsedUserId },
      select: {
        message: true,
        feedbackID: true,
        date: true,
        visibility: true,
        value: true,
        receiver: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
        sender: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!feedbacks) {
      throw new Exception(
        `User with ID ${userId} not found`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return feedbacks.map(
      ({ message, feedbackID, date, value, receiver, sender }) => {
        return {
          message,
          feedbackID,
          date,
          value,
          receiverProfilePicture: receiver.profilePicture,
          receiverName: receiver.name,
          senderProfilePicture: sender.profilePicture,
          senderName: sender.name,
        };
      },
    );
  }

  async deleteFeedback(req: RequestWithUser, id: number): Promise<object> {
    const userId = Number(req.user.userId);
    const feedbackId = Number(id);
    const feedbackUpdate = await this.prisma.feedback.findUnique({
      where: { feedbackID: feedbackId },
      select: {
        senderId: true,
        receiverId: true,
        visibility: true,
        value: true,
        feedbackID: true,
      },
    });
    if (!feedbackUpdate) {
      throw new Exception(`Feedback not found`, HttpStatus.NOT_FOUND);
    }

    if (feedbackUpdate.receiverId !== userId) {
      throw new Exception(
        `User not allowed to delete this feedback`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (feedbackUpdate.visibility === false) {
      throw new Exception(
        `Feedback visibility already false`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.feedback.update({
      where: { feedbackID: feedbackUpdate.feedbackID },
      data: {
        visibility: false,
      },
    });
    return { status: true };
  }

  async getAllFeedbacks(): Promise<Partial<AllFeedbacksDTO[]>> {
    const allFeedbacks = await this.prisma.feedback.findMany({
      select: {
        message: true,
        feedbackID: true,
        date: true,
        visibility: true,
        value: true,
        receiver: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
        sender: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return allFeedbacks.map(
      ({ message, feedbackID, date, value, receiver, sender }) => {
        return {
          message,
          feedbackID,
          date,
          value,
          receiverProfilePicture: receiver.profilePicture,
          receiverName: receiver.name,
          senderProfilePicture: sender.profilePicture,
          senderName: sender.name,
        };
      },
    );
  }
}
