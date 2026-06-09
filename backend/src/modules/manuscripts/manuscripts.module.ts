import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManuscriptsService } from './manuscripts.service';
import { ManuscriptsController } from './manuscripts.controller';
import { Manuscript } from '../../entities/manuscript.entity';
import { ManuscriptHistory } from '../../entities/manuscript-history.entity';
import { Review } from '../../entities/review.entity';
import { Decision } from '../../entities/decision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manuscript, ManuscriptHistory, Review, Decision])],
  controllers: [ManuscriptsController],
  providers: [ManuscriptsService],
  exports: [ManuscriptsService],
})
export class ManuscriptsModule {}
