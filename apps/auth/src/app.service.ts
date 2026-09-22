import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
  getTest(): string {
    return {
      statusCode: 201,
      message: "Hello World!",
    } as unknown as string;
  }
}
