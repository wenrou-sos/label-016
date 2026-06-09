import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { User } from '../../entities/user.entity';
import { Manuscript } from '../../entities/manuscript.entity';
import { Review } from '../../entities/review.entity';
import { Decision } from '../../entities/decision.entity';
import { ManuscriptHistory } from '../../entities/manuscript-history.entity';
import { Tag } from '../../entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Manuscript, Review, Decision, ManuscriptHistory, Tag])],
  controllers: [BackupController],
  providers: [BackupService],
  exports: [BackupService],
})
export class BackupModule {}
