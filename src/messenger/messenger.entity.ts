import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../auth/entity/user.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({ nullable: false, default: false })
  read: boolean;

  @Column()
  message: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, { eager: true })
  author: User;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, { eager: true })
  reciver: User;
}
