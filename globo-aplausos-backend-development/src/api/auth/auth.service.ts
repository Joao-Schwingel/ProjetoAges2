import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { LoginDTO } from './dto/LoginDTO.model';
import { AccessTokenDTO } from './dto/AccessTokenDTO.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDTO): Promise<AccessTokenDTO> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new Exception('Usuário não encontrado', HttpStatus.NOT_FOUND);

    if (user.password !== password)
      throw new Exception('Senha incorreta', HttpStatus.UNAUTHORIZED);

    const payload = {
      userId: user.userId,
      name: user.name,
      userType: user.userType,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { access_token };
  }
}
