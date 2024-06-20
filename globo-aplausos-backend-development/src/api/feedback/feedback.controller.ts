import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Feedback } from '@prisma/client';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IsAdmin, IsBasic } from '../decorators/role.decorator';
import { FeedbackDTO, AllFeedbacksDTO } from './DTO/FeedbackDTO.model';
import { FeedbackService } from './feedback.service';
import {
  FeedbackResponseDTO,
  FeedbacksSentByMeResponseDTO,
} from './DTO/FeedbackResponseDTO.model';
import { RequestWithUser } from '../auth/dto/RequestDTO.model';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(AuthGuard)
  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Post()
  sendFeedback(
    @Req() req: RequestWithUser,
    @Body() feedback: FeedbackDTO,
  ): Promise<Partial<Feedback>> {
    const reqUserId = req.user.userId;
    return this.feedbackService.sendFeedback(reqUserId, feedback);
  }

  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get()
  getFeedback(@Req() req: RequestWithUser): Promise<FeedbackResponseDTO[]> {
    return this.feedbackService.getFeedback(req);
  }

  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get('/sent/me')
  feedbacksSentByMe(
    @Req() req: RequestWithUser,
  ): Promise<FeedbacksSentByMeResponseDTO[]> {
    return this.feedbackService.feedbacksSentByMe(req.user.userId);
  }

  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Delete('/:id_feedback')
  deleteFeedback(
    @Req() req: RequestWithUser,
    @Param('id_feedback') id: number,
  ): Promise<object> {
    return this.feedbackService.deleteFeedback(req, id);
  }

  @IsAdmin()
  @ApiBearerAuth('Authorization')
  @Get('/sent/all')
  getAllFeedbacks(): Promise<Partial<AllFeedbacksDTO[]>> {
    return this.feedbackService.getAllFeedbacks();
  }
}
