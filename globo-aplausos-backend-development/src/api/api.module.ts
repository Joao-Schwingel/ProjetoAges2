import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DevelopersModule } from './developers/developers.module';
import { UserModule } from './user/user.module';
import { FeedbackModule } from './feedback/feedback.module';
import { StoreModule } from './store/store.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [
    AuthModule,
    DevelopersModule,
    UserModule,
    StoreModule,
    RewardsModule,
    FeedbackModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
