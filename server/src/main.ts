import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(errorMiddleware);
  await app.listen(4000);
}
bootstrap();
