import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [],
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService],
})
export class FeedbackModule {}
