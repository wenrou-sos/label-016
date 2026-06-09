import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(UserRole.EDITOR)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get()
  @Roles(UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  findAll(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.reviewsService.findAll(user, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles(UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.update(+id, updateReviewDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.remove(+id, user);
  }

  @Get('manuscript/:manuscriptId')
  @Roles(UserRole.EDITOR, UserRole.CHIEF_EDITOR, UserRole.AUTHOR)
  findByManuscriptId(
    @Param('manuscriptId') manuscriptId: string,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.findByManuscriptId(+manuscriptId, user);
  }
}
