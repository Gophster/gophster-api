import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { Goph } from '../goph/goph.entity';

@Entity()
export class Reply extends BaseEntity {
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
    { eager: false },
  )
  author: User;

  @ManyToOne(
    type => Goph,
    goph => goph.replies,
    { eager: false },
  )
  goph: Goph;
}
