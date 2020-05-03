import { User } from '../auth/entity/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, { eager: true })
  author: User;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, { eager: true })
  reciver: User;

  @CreateDateColumn()
  created: Date;
}
