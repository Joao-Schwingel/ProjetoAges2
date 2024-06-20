import { Module } from '@nestjs/common';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [],
  controllers: [RewardsController],
  providers: [RewardsService, PrismaService],
})
export class RewardsModule {}
