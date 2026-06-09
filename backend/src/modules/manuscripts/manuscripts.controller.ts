import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ManuscriptsService } from './manuscripts.service';
import { CreateManuscriptDto } from './dto/create-manuscript.dto';
import { UpdateManuscriptDto } from './dto/update-manuscript.dto';
import { SearchManuscriptDto } from './dto/search-manuscript.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ReviewManuscriptDto } from './dto/review-manuscript.dto';
import { DecisionManuscriptDto } from './dto/decision-manuscript.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('manuscripts')
export class ManuscriptsController {
  constructor(private readonly manuscriptsService: ManuscriptsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR)
  create(
    @Body() createManuscriptDto: CreateManuscriptDto,
    @CurrentUser() user: User,
  ) {
    return this.manuscriptsService.create(createManuscriptDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.manuscriptsService.findAll(user, paginationDto);
  }

  @Get('published')
  findPublished(@Query() searchDto: SearchManuscriptDto) {
    return this.manuscriptsService.findPublished(searchDto);
  }

  @Get('published/:id')
  findPublishedOne(@Param('id') id: string) {
    return this.manuscriptsService.findPublishedOne(+id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.manuscriptsService.findOne(+id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.CHIEF_EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateManuscriptDto: UpdateManuscriptDto,
    @CurrentUser() user: User,
  ) {
    return this.manuscriptsService.update(+id, updateManuscriptDto, user);
  }

  @Post(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EDITOR)
  reviewManuscript(
    @Param('id') id: string,
    @Body() reviewDto: ReviewManuscriptDto,
    @CurrentUser() user: User,
  ) {
    return this.manuscriptsService.reviewManuscript(+id, reviewDto, user);
  }

  @Post(':id/decision')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CHIEF_EDITOR)
  decisionManuscript(
    @Param('id') id: string,
    @Body() decisionDto: DecisionManuscriptDto,
    @CurrentUser() user: User,
  ) {
    return this.manuscriptsService.decisionManuscript(+id, decisionDto, user);
  }

  @Post(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.manuscriptsService.updateStatus(+id, updateStatusDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.CHIEF_EDITOR)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.manuscriptsService.remove(+id, user);
  }

  @Get(':id/history')
  @UseGuards(JwtAuthGuard)
  getHistory(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.manuscriptsService.getHistory(+id, user);
  }
}
