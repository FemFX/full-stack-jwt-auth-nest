import { User } from "src/user/user.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("token")
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  refreshToken: string;
  @JoinColumn()
  @OneToOne(() => User)
  user: User;
}
