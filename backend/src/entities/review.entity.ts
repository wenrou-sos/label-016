import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Manuscript } from './manuscript.entity';
import { User } from './user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'manuscript_id' })
  manuscript_id: number;

  @Column({ name: 'editor_id' })
  editor_id: number;

  @Column({ type: 'int', width: 1 })
  score: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Manuscript, manuscript => manuscript.reviews)
  @JoinColumn({ name: 'manuscript_id' })
  manuscript: Manuscript;

  @ManyToOne(() => User, user => user.reviews)
  @JoinColumn({ name: 'editor_id' })
  editor: User;
}
