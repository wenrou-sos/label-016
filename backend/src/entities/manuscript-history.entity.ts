import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ManuscriptStatus } from '../common/enums/manuscript-status.enum';
import { Manuscript } from './manuscript.entity';
import { User } from './user.entity';

@Entity('manuscript_histories')
export class ManuscriptHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'manuscript_id' })
  manuscript_id: number;

  @Column({ name: 'old_status', type: 'enum', enum: ManuscriptStatus, nullable: true })
  old_status: ManuscriptStatus;

  @Column({ name: 'new_status', type: 'enum', enum: ManuscriptStatus })
  new_status: ManuscriptStatus;

  @Column({ name: 'operator_id' })
  operator_id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @ManyToOne(() => Manuscript, manuscript => manuscript.histories)
  @JoinColumn({ name: 'manuscript_id' })
  manuscript: Manuscript;

  @ManyToOne(() => User, user => user.operated_histories)
  @JoinColumn({ name: 'operator_id' })
  operator: User;
}
