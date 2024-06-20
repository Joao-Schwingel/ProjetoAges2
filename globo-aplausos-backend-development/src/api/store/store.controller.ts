import { Controller, Get, Param, Req, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Item } from '@prisma/client';
import { IsAdmin, IsBasic } from '../decorators/role.decorator';
import { StoreService } from './store.service';
import { TransactionDTO } from './DTO/TransactionDTO.model';
import { RequestWithUser } from '../auth/dto/RequestDTO.model';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get('/redeemed/me')
  getMyRewards(@Req() req: RequestWithUser): Promise<TransactionDTO[]> {
    const reqUserId = Number(req.user.userId);
    return this.storeService.getMyRewards(reqUserId);
  }

  @IsAdmin()
  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get()
  getStoreItems(): Promise<Partial<Item>[]> {
    return this.storeService.getStoreItems();
  }

  @IsAdmin()
  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get('/:id_recompensa')
  getStoreItem(@Param('id_recompensa') id: number): Promise<Partial<Item>> {
    return this.storeService.getStoreItem(id);
  }

  @IsAdmin()
  @ApiBearerAuth('Authorization')
  @Delete('/:id')
  deleteStoreItem(@Param('id') itemId: number): Promise<Partial<Item>> {
    return this.storeService.deleteStoreItem(itemId);
  }
}
