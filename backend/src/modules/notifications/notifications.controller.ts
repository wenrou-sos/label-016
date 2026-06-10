import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() dto: GetNotificationsDto,
  ) {
    return this.notificationsService.findAll(user, dto);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: User) {
    return this.notificationsService.getUnreadCount(user);
  }

  @Post('mark-read')
  markAsRead(
    @CurrentUser() user: User,
    @Body() dto: MarkReadDto,
  ) {
    return this.notificationsService.markAsRead(user, dto);
  }

  @Post('mark-all-read')
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllAsRead(user);
  }
}
