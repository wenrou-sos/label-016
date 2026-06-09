import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Manuscript } from '../../entities/manuscript.entity';
import { ManuscriptHistory } from '../../entities/manuscript-history.entity';
import { Review } from '../../entities/review.entity';
import { Decision } from '../../entities/decision.entity';
import { User } from '../../entities/user.entity';
import { CreateManuscriptDto } from './dto/create-manuscript.dto';
import { UpdateManuscriptDto } from './dto/update-manuscript.dto';
import { SearchManuscriptDto } from './dto/search-manuscript.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ReviewManuscriptDto } from './dto/review-manuscript.dto';
import { DecisionManuscriptDto } from './dto/decision-manuscript.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { ManuscriptStatus } from '../../common/enums/manuscript-status.enum';
import { DecisionType } from '../../common/enums/decision-type.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ManuscriptsService {
  constructor(
    @InjectRepository(Manuscript)
    private manuscriptRepository: Repository<Manuscript>,
    @InjectRepository(ManuscriptHistory)
    private historyRepository: Repository<ManuscriptHistory>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Decision)
    private decisionRepository: Repository<Decision>,
  ) {}

  async create(createManuscriptDto: CreateManuscriptDto, user: User) {
    const manuscript = this.manuscriptRepository.create({
      ...createManuscriptDto,
      author_id: user.id,
      status: ManuscriptStatus.PENDING,
      submitted_at: new Date(),
    });

    const savedManuscript = await this.manuscriptRepository.save(manuscript);

    await this.addHistory(savedManuscript.id, null, ManuscriptStatus.PENDING, user.id, '提交稿件');

    return savedManuscript;
  }

  async findAll(user: User, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.manuscriptRepository
      .createQueryBuilder('manuscript')
      .leftJoinAndSelect('manuscript.author', 'author')
      .select([
        'manuscript.id',
        'manuscript.title',
        'manuscript.summary',
        'manuscript.status',
        'manuscript.tags',
        'manuscript.view_count',
        'manuscript.submitted_at',
        'manuscript.updated_at',
        'manuscript.published_at',
        'author.id',
        'author.username',
        'author.avatar',
      ]);

    if (user.role === UserRole.AUTHOR) {
      queryBuilder.where('manuscript.author_id = :authorId', { authorId: user.id });
    } else if (user.role === UserRole.EDITOR) {
      queryBuilder.where('manuscript.status IN (:...statuses)', {
        statuses: [ManuscriptStatus.PENDING, ManuscriptStatus.REVIEWING],
      });
    } else if (user.role === UserRole.CHIEF_EDITOR) {
      queryBuilder.where('manuscript.status = :status', { status: ManuscriptStatus.REVIEWING });
    }

    const [manuscripts, total] = await queryBuilder
      .orderBy('manuscript.submitted_at', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      list: manuscripts,
      total,
      page,
      pageSize,
    };
  }

  async findPublished(searchDto: SearchManuscriptDto) {
    const { page, pageSize, keyword, tags } = searchDto;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.manuscriptRepository
      .createQueryBuilder('manuscript')
      .leftJoinAndSelect('manuscript.author', 'author')
      .select([
        'manuscript.id',
        'manuscript.title',
        'manuscript.summary',
        'manuscript.content',
        'manuscript.tags',
        'manuscript.view_count',
        'manuscript.published_at',
        'author.id',
        'author.username',
        'author.avatar',
        'author.bio',
      ])
      .where('manuscript.status = :status', { status: ManuscriptStatus.ACCEPTED })
      .andWhere('manuscript.published_at IS NOT NULL');

    if (keyword) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('manuscript.title LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('manuscript.summary LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('author.username LIKE :keyword', { keyword: `%${keyword}%` });
        }),
      );
    }

    if (tags && tags.length > 0) {
      queryBuilder.andWhere('JSON_CONTAINS(manuscript.tags, :tags)', {
        tags: JSON.stringify(tags),
      });
    }

    const [manuscripts, total] = await queryBuilder
      .orderBy('manuscript.published_at', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      list: manuscripts,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number, user: User) {
    const manuscript = await this.manuscriptRepository.findOne({
      where: { id },
      relations: ['author', 'reviews', 'reviews.editor'],
      select: {
        author: {
          id: true,
          username: true,
          avatar: true,
          bio: true,
        },
        reviews: {
          id: true,
          score: true,
          comment: true,
          created_at: true,
          editor: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (user.role === UserRole.AUTHOR && manuscript.author_id !== user.id) {
      throw new ForbiddenException('无权查看此稿件');
    }

    return manuscript;
  }

  async findPublishedOne(id: number) {
    const manuscript = await this.manuscriptRepository.findOne({
      where: { id, status: ManuscriptStatus.ACCEPTED },
      relations: ['author'],
      select: {
        author: {
          id: true,
          username: true,
          avatar: true,
          bio: true,
        },
      },
    });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在或未发布');
    }

    await this.manuscriptRepository.increment({ id }, 'view_count', 1);
    manuscript.view_count += 1;

    return manuscript;
  }

  async update(id: number, updateManuscriptDto: UpdateManuscriptDto, user: User) {
    const manuscript = await this.manuscriptRepository.findOne({ where: { id } });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (user.role === UserRole.AUTHOR && manuscript.author_id !== user.id) {
      throw new ForbiddenException('无权修改此稿件');
    }

    if (manuscript.status !== ManuscriptStatus.PENDING && user.role === UserRole.AUTHOR) {
      throw new BadRequestException('稿件已进入审核流程，无法修改');
    }

    await this.manuscriptRepository.update(id, updateManuscriptDto);
    return this.findOne(id, user);
  }

  async reviewManuscript(id: number, reviewDto: ReviewManuscriptDto, user: User) {
    const manuscript = await this.manuscriptRepository.findOne({ where: { id } });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (manuscript.status !== ManuscriptStatus.PENDING && manuscript.status !== ManuscriptStatus.REVIEWING) {
      throw new BadRequestException('稿件状态不允许评审');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { manuscript_id: id, editor_id: user.id },
    });

    if (existingReview) {
      throw new BadRequestException('您已对该稿件进行过评审');
    }

    const review = this.reviewRepository.create({
      manuscript_id: id,
      editor_id: user.id,
      score: reviewDto.score,
      comment: reviewDto.comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    if (manuscript.status === ManuscriptStatus.PENDING) {
      await this.manuscriptRepository.update(id, {
        status: ManuscriptStatus.REVIEWING,
      });
      await this.addHistory(id, ManuscriptStatus.PENDING, ManuscriptStatus.REVIEWING, user.id, '编辑开始评审');
    }

    return savedReview;
  }

  async decisionManuscript(id: number, decisionDto: DecisionManuscriptDto, user: User) {
    const manuscript = await this.manuscriptRepository.findOne({ where: { id } });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (manuscript.status !== ManuscriptStatus.REVIEWING) {
      throw new BadRequestException('只有审核中的稿件才能进行终审决策');
    }

    const existingDecision = await this.decisionRepository.findOne({
      where: { manuscript_id: id },
    });

    if (existingDecision) {
      throw new BadRequestException('该稿件已进行过终审决策');
    }

    const decision = this.decisionRepository.create({
      manuscript_id: id,
      chief_editor_id: user.id,
      decision: decisionDto.decision,
      comment: decisionDto.comment,
    });

    const savedDecision = await this.decisionRepository.save(decision);

    const newStatus = decisionDto.decision === DecisionType.ACCEPTED
      ? ManuscriptStatus.ACCEPTED
      : ManuscriptStatus.REJECTED;

    await this.manuscriptRepository.update(id, {
      status: newStatus,
      published_at: decisionDto.decision === DecisionType.ACCEPTED ? new Date() : null,
    });

    await this.addHistory(id, manuscript.status, newStatus, user.id, decisionDto.comment || `主编${decisionDto.decision === DecisionType.ACCEPTED ? '录用' : '退稿'}稿件`);

    return savedDecision;
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto, user: User) {
    const manuscript = await this.manuscriptRepository.findOne({ where: { id } });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    const oldStatus = manuscript.status;
    const newStatus = updateStatusDto.status;

    if (user.role === UserRole.EDITOR) {
      if (oldStatus !== ManuscriptStatus.PENDING && oldStatus !== ManuscriptStatus.REVIEWING) {
        throw new ForbiddenException('编辑只能处理待审核和审核中的稿件');
      }
      if (newStatus !== ManuscriptStatus.REVIEWING) {
        throw new ForbiddenException('编辑只能将稿件状态改为审核中');
      }
    } else if (user.role === UserRole.AUTHOR && manuscript.author_id !== user.id) {
      throw new ForbiddenException('无权操作此稿件');
    }

    await this.manuscriptRepository.update(id, { status: newStatus });

    if (newStatus === ManuscriptStatus.ACCEPTED) {
      await this.manuscriptRepository.update(id, { published_at: new Date() });
    }

    await this.addHistory(id, oldStatus, newStatus, user.id, updateStatusDto.remark || '状态更新');

    return { message: '状态更新成功' };
  }

  async remove(id: number, user: User) {
    const manuscript = await this.manuscriptRepository.findOne({ where: { id } });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (user.role === UserRole.AUTHOR && manuscript.author_id !== user.id) {
      throw new ForbiddenException('无权删除此稿件');
    }

    if (manuscript.status !== ManuscriptStatus.PENDING && user.role !== UserRole.CHIEF_EDITOR) {
      throw new BadRequestException('稿件已进入审核流程，无法删除');
    }

    await this.manuscriptRepository.delete(id);
    return { message: '删除成功' };
  }

  async getHistory(id: number, user: User) {
    const manuscript = await this.manuscriptRepository.findOne({ where: { id } });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (user.role === UserRole.AUTHOR && manuscript.author_id !== user.id) {
      throw new ForbiddenException('无权查看此稿件的历史记录');
    }

    const history = await this.historyRepository.find({
      where: { manuscript_id: id },
      relations: ['operator'],
      select: {
        operator: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      order: { created_at: 'DESC' },
    });

    return history;
  }

  private async addHistory(
    manuscriptId: number,
    oldStatus: ManuscriptStatus | null,
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
