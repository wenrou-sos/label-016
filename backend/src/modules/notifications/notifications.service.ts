import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification, NotificationType } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { Manuscript } from '../../entities/manuscript.entity';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    user: User,
    title: string,
    content: string,
    type: NotificationType,
    manuscript?: Manuscript,
  ) {
    const notification = this.notificationRepository.create({
      user_id: user.id,
      title,
      content,
      type,
      manuscript_id: manuscript ? manuscript.id : null,
      is_read: 0,
    });

    return this.notificationRepository.save(notification);
  }

  async notifySubmission(manuscript: Manuscript, editor: User) {
    await this.createNotification(
      editor,
      '新稿件待审核',
      `您有新的稿件《${manuscript.title}》待审核`,
      NotificationType.SUBMISSION,
      manuscript,
    );
  }

  async notifyReview(manuscript: Manuscript, author: User) {
    await this.createNotification(
      author,
      '稿件已送审',
      `您的稿件《${manuscript.title}》已被编辑送审`,
      NotificationType.REVIEW,
      manuscript,
    );
  }

  async notifyDecision(manuscript: Manuscript, author: User, decision: 'accepted' | 'rejected') {
    const statusText = decision === 'accepted' ? '已录用' : '已退稿';
    await this.createNotification(
      author,
      `稿件${statusText}`,
      `您的稿件《${manuscript.title}》${statusText}`,
      NotificationType.DECISION,
      manuscript,
    );
  }

  async findAll(user: User, dto: GetNotificationsDto) {
    const { page = 1, pageSize = 20, isRead } = dto;
    const skip = (page - 1) * pageSize;

    const where: any = { user_id: user.id };
    if (isRead !== undefined) {
      where.is_read = isRead ? 1 : 0;
    }

    const [list, total] = await this.notificationRepository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip,
      take: pageSize,
      relations: ['manuscript'],
    });

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  async getUnreadCount(user: User) {
    const count = await this.notificationRepository.count({
      where: {
        user_id: user.id,
        is_read: 0,
      },
    });
    return { unreadCount: count };
  }

  async markAsRead(user: User, dto: MarkReadDto) {
    if (dto.all) {
      await this.notificationRepository.update(
        { user_id: user.id, is_read: 0 },
        { is_read: 1, read_at: new Date() },
      );
    } else if (dto.ids && dto.ids.length > 0) {
      await this.notificationRepository.update(
        { user_id: user.id, id: In(dto.ids) },
        { is_read: 1, read_at: new Date() },
      );
    }

    return { message: '标记成功' };
  }

  async markAllAsRead(user: User) {
    await this.notificationRepository.update(
      { user_id: user.id, is_read: 0 },
      { is_read: 1, read_at: new Date() },
    );
    return { message: '全部已读' };
  }
}
