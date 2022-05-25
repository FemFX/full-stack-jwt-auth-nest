import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { TokenService } from "src/token/token.service";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      if (!token) {
        throw new UnauthorizedException({
          message: "Пользователь не авторизован",
        });
      }

      const user = jwt.verify(token, process.env.secret_access);
      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: "Пользователь не авторизован",
      });
    }
  }
}
