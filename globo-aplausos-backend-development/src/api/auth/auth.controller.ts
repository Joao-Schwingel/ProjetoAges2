import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/LoginDTO.model';
import { AccessTokenDTO } from './dto/AccessTokenDTO.model';
import { IsPublic } from '../decorators/isPublic.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() login: LoginDTO): Promise<AccessTokenDTO> {
    return this.appService.login(login);
  }
}
