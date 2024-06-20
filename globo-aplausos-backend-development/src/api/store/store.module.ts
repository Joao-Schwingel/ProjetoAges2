import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [],
  controllers: [StoreController],
  providers: [StoreService, PrismaService],
})
export class StoreModule {}
