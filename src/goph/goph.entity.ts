import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { Reply } from 'src/reply/reply.entity';

@Entity()
export class Goph extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column()
  text: string;

  @ManyToOne(
    type => User,
    user => user.gophs,
    { eager: false },
  )
  author: User;

  @OneToMany(
    type => Reply,
    replies => replies.goph,
    { eager: false },
  )
  replies: Promise<Reply[]>;
}
