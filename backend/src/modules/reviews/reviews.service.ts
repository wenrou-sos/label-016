import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Manuscript } from '../../entities/manuscript.entity';
import { User } from '../../entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ManuscriptStatus } from '../../common/enums/manuscript-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Manuscript)
    private manuscriptRepository: Repository<Manuscript>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    const { manuscript_id, score, comment } = createReviewDto;

    const manuscript = await this.manuscriptRepository.findOne({
      where: { id: manuscript_id },
    });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (manuscript.status !== ManuscriptStatus.PENDING && manuscript.status !== ManuscriptStatus.REVIEWING) {
      throw new BadRequestException('稿件状态不允许评审');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { manuscript_id, editor_id: user.id },
    });

    if (existingReview) {
      throw new BadRequestException('您已对该稿件进行过评审');
    }

    const review = this.reviewRepository.create({
      manuscript_id,
      editor_id: user.id,
      score,
      comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    if (manuscript.status === ManuscriptStatus.PENDING) {
      await this.manuscriptRepository.update(manuscript_id, {
        status: ManuscriptStatus.REVIEWING,
      });
    }

    return savedReview;
  }

  async findAll(user: User, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.manuscript', 'manuscript')
      .leftJoinAndSelect('review.editor', 'editor')
      .select([
        'review.id',
        'review.score',
        'review.comment',
        'review.created_at',
        'review.updated_at',
        'manuscript.id',
        'manuscript.title',
        'editor.id',
        'editor.username',
        'editor.avatar',
      ]);

    if (user.role === UserRole.EDITOR) {
      queryBuilder.where('review.editor_id = :editorId', { editorId: user.id });
    }

    const [reviews, total] = await queryBuilder
      .orderBy('review.created_at', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      list: reviews,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number, user: User) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['manuscript', 'editor'],
      select: {
        manuscript: {
          id: true,
          title: true,
        },
        editor: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    });

    if (!review) {
      throw new NotFoundException('评审记录不存在');
    }

    if (user.role === UserRole.EDITOR && review.editor_id !== user.id) {
      throw new ForbiddenException('无权查看此评审记录');
    }

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, user: User) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('评审记录不存在');
    }

    if (review.editor_id !== user.id) {
      throw new ForbiddenException('无权修改此评审记录');
    }

    await this.reviewRepository.update(id, updateReviewDto);
    return this.findOne(id, user);
  }

  async remove(id: number, user: User) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('评审记录不存在');
    }

    if (user.role !== UserRole.CHIEF_EDITOR && review.editor_id !== user.id) {
      throw new ForbiddenException('无权删除此评审记录');
    }

    await this.reviewRepository.delete(id);
    return { message: '删除成功' };
  }

  async findByManuscriptId(manuscriptId: number, user: User) {
    const manuscript = await this.manuscriptRepository.findOne({
      where: { id: manuscriptId },
    });

    if (!manuscript) {
      throw new NotFoundException('稿件不存在');
    }

    if (user.role === UserRole.AUTHOR && manuscript.author_id !== user.id) {
      throw new ForbiddenException('无权查看此稿件的评审记录');
    }

    const reviews = await this.reviewRepository.find({
      where: { manuscript_id: manuscriptId },
      relations: ['editor'],
      select: {
        editor: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      order: { created_at: 'DESC' },
    });

    return reviews;
  }
}
