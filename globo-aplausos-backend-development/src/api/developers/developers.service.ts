import { Injectable } from '@nestjs/common';
import { Developers } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DevelopersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<Developers[]> {
    return this.prismaService.developers.findMany();
  }
}
