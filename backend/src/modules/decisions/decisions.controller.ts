import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { DecisionsService } from './decisions.service';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('decisions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DecisionsController {
  constructor(private readonly decisionsService: DecisionsService) {}

  @Post()
  @Roles(UserRole.CHIEF_EDITOR)
  create(
    @Body() createDecisionDto: CreateDecisionDto,
    @CurrentUser() user: User,
  ) {
    return this.decisionsService.create(createDecisionDto, user);
  }

  @Get()
  @Roles(UserRole.CHIEF_EDITOR, UserRole.EDITOR)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.decisionsService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.CHIEF_EDITOR, UserRole.EDITOR)
  findOne(@Param('id') id: string) {
    return this.decisionsService.findOne(+id);
  }

  @Get('manuscript/:manuscriptId')
  @Roles(UserRole.CHIEF_EDITOR, UserRole.EDITOR, UserRole.AUTHOR)
  findByManuscriptId(@Param('manuscriptId') manuscriptId: string) {
    return this.decisionsService.findByManuscriptId(+manuscriptId);
  }
}
