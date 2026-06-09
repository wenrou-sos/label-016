import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ManuscriptStatus } from '../common/enums/manuscript-status.enum';
import { User } from './user.entity';
import { Review } from './review.entity';
import { Decision } from './decision.entity';
import { ManuscriptHistory } from './manuscript-history.entity';

@Entity('manuscripts')
export class Manuscript {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  summary: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ name: 'author_id' })
  author_id: number;

  @Column({
    type: 'enum',
    enum: ManuscriptStatus,
    default: ManuscriptStatus.PENDING,
  })
  status: ManuscriptStatus;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ name: 'view_count', type: 'int', default: 0 })
  view_count: number;

  @Column({ name: 'submitted_at', type: 'datetime', nullable: true })
  submitted_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updated_at: Date;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  published_at: Date;

  @ManyToOne(() => User, user => user.manuscripts)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Review, review => review.manuscript)
  reviews: Review[];

  @OneToMany(() => Decision, decision => decision.manuscript)
  decisions: Decision[];

  @OneToMany(() => ManuscriptHistory, history => history.manuscript)
  histories: ManuscriptHistory[];
}
