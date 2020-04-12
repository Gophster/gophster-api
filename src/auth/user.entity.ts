import * as bcrypt from 'bcrypt';
import { Goph } from '../goph/goph.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({ unique: true })
  email: string;

  @Column({ length: '25', unique: true })
  handle: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(
    type => Goph,
    goph => goph.author,
    { eager: false },
  )
  gophs: Goph[];

  @Column({
    nullable:true
  })
  resetToken:string

  @Column({
    nullable:true
  })
  resetTokenExpiration: Date;

  @BeforeInsert()
  async hashPasswordAndGenSalt() {
    this.salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, this.salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
