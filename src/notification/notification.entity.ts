import { User } from '../auth/entity/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, { eager: true })
  initiator: User;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, { eager: true })
  user: User;

  @Column({ nullable: false, default: false })
  read: boolean;

  @Column()
  text: string;

  @Column()
  link: string;
}
