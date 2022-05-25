import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { Token } from "./token.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private tokenService: Repository<Token>
  ) {}
  async generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.secret_access, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.secret_refresh, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await this.tokenService
      .createQueryBuilder("token")
      .leftJoinAndSelect("token.user", "user")
      .where("token.user = :userId", { userId })
      .getOne();

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await this.tokenService
      .create({
        user: userId,
        refreshToken,
      })
      .save();
    return token;
  }
  async removeToken(refreshToken: string) {
    const tokenData = await this.tokenService.delete({ refreshToken });
    return tokenData;
  }
  // async validateAccessToken(token) {
  //   try {
  //     const userData = await jwt.verify(token, process.env.secret_access);
  //     if (!userData) {
  //       return null;
  //     }
  //     return userData;
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }
  // async validateRefreshToken(token) {
  //   try {
  //     const userData = await jwt.verify(token, process.env.secret_refresh);
  //     if (!userData) {
  //       return null;
  //     }
  //     return userData;
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }
  async findToken(refreshToken: string) {
    const tokenData = await this.tokenService.findOne({
      where: { refreshToken },
    });
    return tokenData;
  }
}
