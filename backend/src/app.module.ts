import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { databaseConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ManuscriptsModule } from './modules/manuscripts/manuscripts.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DecisionsModule } from './modules/decisions/decisions.module';
import { TagsModule } from './modules/tags/tags.module';
import { BackupModule } from './modules/backup/backup.module';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        limit: 100,
        ttl: 60000,
      },
    ]),
    AuthModule,
    UsersModule,
    ManuscriptsModule,
    ReviewsModule,
    DecisionsModule,
    TagsModule,
    BackupModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
