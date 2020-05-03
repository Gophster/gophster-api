import { User } from '../auth/entity/user.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => User)
  author: User;

  @ManyToOne(type => User)
  reciver: User;
}
