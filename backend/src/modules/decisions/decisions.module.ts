import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecisionsService } from './decisions.service';
import { DecisionsController } from './decisions.controller';
import { Decision } from '../../entities/decision.entity';
import { Manuscript } from '../../entities/manuscript.entity';
import { ManuscriptHistory } from '../../entities/manuscript-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Decision, Manuscript, ManuscriptHistory])],
  controllers: [DecisionsController],
  providers: [DecisionsService],
  exports: [DecisionsService],
})
export class DecisionsModule {}
