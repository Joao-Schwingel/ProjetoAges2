import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Developers } from '@prisma/client';
import { IsAdmin, IsBasic } from '../decorators/role.decorator';
import { DevelopersService } from './developers.service';

@ApiTags('Developers')
@Controller('developers')
export class DevelopersController {
  constructor(private readonly rewardsService: DevelopersService) {}

  @IsAdmin()
  @IsBasic()
  @ApiBearerAuth('Authorization')
  @Get()
  getAll(): Promise<Developers[]> {
    return this.rewardsService.getAll();
  }
}
