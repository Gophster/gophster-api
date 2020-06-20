import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => User,
    user => user.gophs,
    { eager: true },
  )
  author: User;

  @OneToMany(
    type => Reply,
    replies => replies.goph,
    { eager: false, cascade: true },
  )
  replies: Promise<Reply[]>;

  repliesAmount: number;

  @AfterLoad()
  async getReplayAmount() {
    this.repliesAmount = (await this.replies).length;
  }
}
