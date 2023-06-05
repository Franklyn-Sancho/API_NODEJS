import { IncomingMessage, STATUS_CODES, ServerResponse } from "http";
import { AuthService } from "../service/AuthService";
import {
  ERROR_INTERNAL_ERROR,
  ERROR_USER_AUTHENTICATION,
  ERROR_VALIDATION_USER,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_ERROR,
  STATUS_NOT_FOUND,
  STATUS_OK,
  SUCCESS_AUTHENTICATION,
  SUCCESS_USER_REGISTERED,
} from "../utils/constants";
import { readRequestBody } from "../utils/readRequestBody";

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: IncomingMessage, res: ServerResponse) {
    const body = await readRequestBody(req);
    const data = JSON.parse(body);
    const { email, password } = data;

    if (!email || !password) {
      res.statusCode = STATUS_BAD_REQUEST;
      res.setHeader("Content-Type", "text/plain");
      res.end(ERROR_VALIDATION_USER);
      return;
    }

    try {
      await this.authService.register(email, password);
      res.statusCode = STATUS_OK;
      res.setHeader("Content-Type", "text/plain");
      res.end(SUCCESS_USER_REGISTERED);
    } catch (error) {
      console.log(error);
      res.statusCode = STATUS_INTERNAL_ERROR;
      res.setHeader("Content-Type", "text/plain");
      res.end(ERROR_INTERNAL_ERROR);
    }
  }

  async authenticate(req: IncomingMessage, res: ServerResponse) {
    const body = await readRequestBody(req);
    const data = JSON.parse(body);
    const { email, password } = data;

    if (!email || !password) {
      throw new Error(ERROR_VALIDATION_USER);
    }

    try {
      await this.authService.authenticate(email, password);

      res.statusCode = STATUS_OK;
      res.setHeader("Set-Cookie", "authenticate=true");
      res.end(
        JSON.stringify({
          message: SUCCESS_AUTHENTICATION,
        })
      );
    } catch (error) {
      /* console.log(error) */
      res.statusCode = STATUS_NOT_FOUND;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: ERROR_USER_AUTHENTICATION,
        })
      );
    }
  }
}
