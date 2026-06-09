import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Decision } from '../../entities/decision.entity';
import { Manuscript } from '../../entities/manuscript.entity';
import { ManuscriptHistory } from '../../entities/manuscript-history.entity';
import { User } from '../../entities/user.entity';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { ManuscriptStatus } from '../../common/enums/manuscript-status.enum';
import { DecisionType } from '../../common/enums/decision-type.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class DecisionsService {
  constructor(
    @InjectRepository(Decision)
    private decisionRepository: Repository<Decision>,
    @InjectRepository(Manuscript)
    private manuscriptRepository: Repository<Manuscript>,
    @InjectRepository(ManuscriptHistory)
    private historyRepository: Repository<ManuscriptHistory>,
  ) {}

  async create(createDecisionDto: CreateDecisionDto, user: User) {
    const { manuscript_id, decision, comment } = createDecisionDto;

    const manuscript = await this.manuscriptRepository.findOne({
      where: { id: manuscript_id },
    });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (manuscript.status !== ManuscriptStatus.REVIEWING) {
      throw new BadRequestException('只有审核中的稿件才能进行终审决策');
    }

    const existingDecision = await this.decisionRepository.findOne({
      where: { manuscript_id },
    });

    if (existingDecision) {
      throw new BadRequestException('该稿件已进行过终审决策');
    }

    const newDecision = this.decisionRepository.create({
      manuscript_id,
      chief_editor_id: user.id,
      decision,
      comment,
    });

    const savedDecision = await this.decisionRepository.save(newDecision);

    const newStatus = decision === DecisionType.ACCEPTED
      ? ManuscriptStatus.ACCEPTED
      : ManuscriptStatus.REJECTED;

    await this.manuscriptRepository.update(manuscript_id, {
      status: newStatus,
      published_at: decision === DecisionType.ACCEPTED ? new Date() : null,
    });

    await this.addHistory(manuscript_id, manuscript.status, newStatus, user.id, comment || `主编${decision === DecisionType.ACCEPTED ? '录用' : '退稿'}稿件`);

    return savedDecision;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const skip = (page - 1) * pageSize;

    const [decisions, total] = await this.decisionRepository.findAndCount({
      skip,
      take: pageSize,
      relations: ['manuscript', 'chief_editor'],
      select: {
        manuscript: {
          id: true,
          title: true,
        },
        chief_editor: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      order: { created_at: 'DESC' },
    });

    return {
      list: decisions,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const decision = await this.decisionRepository.findOne({
      where: { id },
      relations: ['manuscript', 'chief_editor'],
      select: {
        manuscript: {
          id: true,
          title: true,
        },
        chief_editor: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    });

    if (!decision) {
      throw new NotFoundException('决策记录不存在');
    }

    return decision;
  }

  async findByManuscriptId(manuscriptId: number) {
    const manuscript = await this.manuscriptRepository.findOne({
      where: { id: manuscriptId },
    });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    const decision = await this.decisionRepository.findOne({
      where: { manuscript_id: manuscriptId },
      relations: ['chief_editor'],
      select: {
        chief_editor: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    });

    return decision;
  }

  private async addHistory(
    manuscriptId: number,
    oldStatus: ManuscriptStatus,
    newStatus: ManuscriptStatus,
    operatorId: number,
    remark: string,
  ) {
    const history = this.historyRepository.create({
      manuscript_id: manuscriptId,
      old_status: oldStatus,
      new_status: newStatus,
      operator_id: operatorId,
      remark,
    });

    await this.historyRepository.save(history);
  }
}
