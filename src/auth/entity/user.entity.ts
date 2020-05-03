import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

import { Goph } from '../../goph/goph.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 25, unique: true })
  handle: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  name: string;

  @Column({ length: 30, nullable: true })
  location: string;

  @Column({ nullable: true })
  birthdate: Date;

  @Column({ nullable: true, default: 'default-avatar.png' })
  avatar: string;

  @CreateDateColumn()
  created: Date;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @OneToMany(
    type => Goph,
    goph => goph.author,
  )
  gophs: Promise<Goph[]>;

  @BeforeInsert()
  async hashPasswordAndGenSalt() {
    this.salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, this.salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
