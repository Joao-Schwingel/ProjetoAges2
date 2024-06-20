import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class LoginDTO implements Pick<User, 'email' | 'password'> {
  @ApiProperty({ example: 'nome.sobrenome@g.globo.com' })
  email: string;

  @ApiProperty({ example: 'Senh@123' })
  password: string;
}
