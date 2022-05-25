import { Token } from "src/token/token.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({
    nullable: false,
  })
  password: string;
  @Column({
    default: false,
  })
  isActivated: boolean;
  @Column()
  activationLink: string;
  
}
