import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { TokenService } from "src/token/token.service";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokenModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
