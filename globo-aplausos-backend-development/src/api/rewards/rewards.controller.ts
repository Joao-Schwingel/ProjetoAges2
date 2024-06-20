import { Controller, Post, Param, Req, Body, Patch, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Transaction, Item } from '@prisma/client';
import { IsAdmin, IsBasic } from '../decorators/role.decorator';
import { RequestWithUser } from '../auth/dto/RequestDTO.model';
import { RewardsService } from './rewards.service';
import { RewardDTO, RewardRedeemedDTO } from './DTO/rewardDTO.model';

@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Post('/redeem/:id')
  makeTransaction(
    @Req() req: RequestWithUser,
    @Param('id') itemId: number,
  ): Promise<Partial<Transaction>> {
    const reqUserId = Number(req.user.userId);
    return this.rewardsService.makeTransaction(reqUserId, itemId);
  }

  @IsAdmin()
  @ApiBearerAuth('Authorization')
  @Post()
  createReward(@Body() item: RewardDTO): Promise<Partial<Item>> {
    return this.rewardsService.createReward(item);
  }

  @IsAdmin()
  @ApiBearerAuth('Authorization')
  @Patch(':id')
  editReward(
    @Param('id') itemId: number,
    @Body() item: RewardDTO,
  ): Promise<Partial<Item>> {
    return this.rewardsService.editReward(itemId, item);
  }

  @IsAdmin()
  @ApiBearerAuth('Authorization')
  @Get('/redeemed/all')
  getRewardsRedeemed(): Promise<RewardRedeemedDTO[]> {
    return this.rewardsService.getRewardsRedeemed();
  }
}
