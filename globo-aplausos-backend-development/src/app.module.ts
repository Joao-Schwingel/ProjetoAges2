import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { AuthGuard } from './api/auth/guards/auth.guard';
import { RoleGuard } from './api/auth/guards/role.guard';

@Module({
  imports: [ApiModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
