import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DecisionType } from '../common/enums/decision-type.enum';
import { Manuscript } from './manuscript.entity';
import { User } from './user.entity';

@Entity('decisions')
export class Decision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'manuscript_id' })
  manuscript_id: number;

  @Column({ name: 'chief_editor_id' })
  chief_editor_id: number;

  @Column({
    type: 'enum',
    enum: DecisionType,
  })
  decision: DecisionType;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @ManyToOne(() => Manuscript, manuscript => manuscript.decisions)
  @JoinColumn({ name: 'manuscript_id' })
  manuscript: Manuscript;

  @ManyToOne(() => User, user => user.decisions)
  @JoinColumn({ name: 'chief_editor_id' })
  chief_editor: User;
}
