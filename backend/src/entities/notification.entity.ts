import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Manuscript } from './manuscript.entity';

export enum NotificationType {
  SUBMISSION = 'submission',
  REVIEW = 'review',
  DECISION = 'decision',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column({ name: 'manuscript_id', nullable: true })
  manuscript_id: number | null;

  @Column({ name: 'is_read', type: 'tinyint', default: 0 })
  is_read: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  read_at: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Manuscript, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'manuscript_id' })
  manuscript: Manuscript | null;
}
