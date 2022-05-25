import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "./user.guard";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto, @Res() res) {
    const userData = await this.userService.register(createUserDto);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOne: true,
    });
    return res.json(userData);
  }
  @Post("login")
  async login(@Body() createUserDto: CreateUserDto, @Res() res) {
    const userData = await this.userService.login(createUserDto);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOne: true,
    });
    return res.json(userData);
  }
  @Post("logout")
  async logout(@Req() req, @Res() res) {
    const { refreshToken } = req.cookies;
    await this.userService.logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json("ok");
  }
  @Get("activate/:link")
  activate(@Param("link") link: string, @Res() res) {
    this.userService.activate(link);
    return res.redirect("http://localhost:3000");
  }
  @Get("refresh")
  async refresh(@Req() req, @Res() res) {
    const userData = await this.userService.refresh(req.cookies.refreshToken);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOne: true,
    });
    return res.json(userData);
  }
  @UseGuards(AuthGuard)
  @Get("users")
  users(@Req() req) {
    console.log(req.user);
    return this.userService.users();
  }
}
