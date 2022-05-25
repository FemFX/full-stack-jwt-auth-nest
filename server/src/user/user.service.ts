import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { TokenService } from "src/token/token.service";
import { UserDto } from "./dto/user-dto";
import { sendActivationLink } from "src/utils/sendMail";
import { ApiError } from "src/utils/api-error";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private tokenService: TokenService
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const candidate = await this.userRepository.findOne({ where: { email } });
      if (candidate) {
        throw new Error(
          `Пользователь с почтовым адресом ${email} уже существует`
        );
      }
      const hashedPass = await bcrypt.hash(password, 3);
      const activationLink = uuid.v4();
      const user = await this.userRepository
        .create({
          email,
          password: hashedPass,
          activationLink,
        })
        .save();
      const userDto = new UserDto(user);
      const tokens = await this.tokenService.generateToken({ ...userDto });
      await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
      // await sendActivationLink(
      //   email,
      //   `http://localhost:4000/user/activate/${activationLink}`
      // );
      return {
        ...tokens,
        user: userDto,
      };
    } catch (e) {}
  }

  async login(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new Error("User is not exists");
      }
      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) {
        throw new Error("Invalid password");
      }
      const userDto = new UserDto(user);
      const tokens = await this.tokenService.generateToken({ ...userDto });
      await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {
        ...tokens,
        user: userDto,
      };
    } catch (e) {}
  }
  async logout(refreshToken) {
    try {
      await this.tokenService.removeToken(refreshToken);
      return "ok";
    } catch (e) {}
  }
  async refresh(refreshToken: any) {
    try {
      if (!refreshToken) {
        throw new Error("Unauthorized user");
      }
      const userData: any = await jwt.verify(
        refreshToken,
        process.env.secret_refresh
      );
      const tokenFromDB = await this.tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDB) {
        throw new Error("Unauthorized user");
      }
      const user = await this.userRepository.findOne({
        where: { id: userData.id },
      });
      const userDto = new UserDto(user);
      const tokens = await this.tokenService.generateToken({ ...userDto });
      await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {
        ...tokens,
        user: userDto,
      };
      // if (!refreshToken) {
      //   throw ApiError.UnauthorizedError();
      // }
      // const userData: any = await jwt.verify(
      //   refreshToken,
      //   process.env.secret_refresh
      // );
      // const tokenFromDb = await this.tokenService.findToken(refreshToken);
      // if (!userData || !tokenFromDb) {
      //   throw ApiError.UnauthorizedError();
      // }

      // const user = await this.userRepository.findOne({
      //   where: { id: userData.id },
      // });
      // const userDto = new UserDto(user);
      // const tokens = await this.tokenService.generateToken({ ...userDto });

      // await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
      // return { ...tokens, user: userDto };
    } catch (e) {}
  }
  async activate(activationLink: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { activationLink },
      });
      if (!user) {
        throw new Error("Invalid link");
        // throw ApiError.BadRequest("Invalid link");
      }
      user.isActivated = true;
      await user.save();
    } catch (e) {}
  }

  async users() {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (e) {}
  }
}
