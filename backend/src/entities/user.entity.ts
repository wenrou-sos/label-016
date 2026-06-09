import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { Manuscript } from './manuscript.entity';
import { Review } from './review.entity';
import { Decision } from './decision.entity';
import { ManuscriptHistory } from './manuscript-history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AUTHOR,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Manuscript, manuscript => manuscript.author)
  manuscripts: Manuscript[];

  @OneToMany(() => Review, review => review.editor)
  reviews: Review[];

  @OneToMany(() => Decision, decision => decision.chief_editor)
  decisions: Decision[];

  @OneToMany(() => ManuscriptHistory, history => history.operator)
  operated_histories: ManuscriptHistory[];
}
