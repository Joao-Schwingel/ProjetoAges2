import { Module } from '@nestjs/common';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [],
  controllers: [DevelopersController],
  providers: [DevelopersService, PrismaService],
})
export class DevelopersModule {}
