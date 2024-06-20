import { Controller, Get, Param, Req, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, Wallet } from '@prisma/client';
import { RequestWithUser } from '../auth/dto/RequestDTO.model';
import { IsAdmin, IsBasic } from '../decorators/role.decorator';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get()
  getAll(@Req() req: RequestWithUser): Promise<Partial<User>[]> {
    const reqUserId = Number(req.user.userId);
    return this.userService.getAll(reqUserId);
  }

  @IsAdmin()
  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get('/card/:id')
  getUserCard(@Param('id') id: number): Promise<Partial<User>> {
    return this.userService.getUserCard(id);
  }

  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get('/wallet/coins/:id')
  getUserWalletCoins(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Pick<Wallet, 'coins'>> {
    const reqUserId = Number(req.user.userId);
    const userId = Number(id);
    return this.userService.getUserWalletCoins(reqUserId, userId);
  }

  @IsAdmin()
  @ApiBearerAuth('Authorization')
  @Get('/inactive')
  getInactiveUsers(@Query('name') name: string): Promise<Partial<User>[]> {
    return this.userService.getInactiveUsers(name);
  }
}
