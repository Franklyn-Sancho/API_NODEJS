import { IncomingMessage, ServerResponse } from "http";
import { AuthService } from "../service/AuthService";

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: IncomingMessage, res: ServerResponse) {
    console.log("O Controlador esta rodando");
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    await new Promise((resolve) => {
      req.on("end", resolve);
    });

    const data = JSON.parse(body);
    const { email, password } = data;

    try {
      await this.authService.register(email, password);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Usuário registrado com sucesso");
    } catch (error) {
      console.error(error);
    }
  }

  async authenticate(req: IncomingMessage, res: ServerResponse) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    await new Promise((resolve) => {
      req.on("end", resolve);
    });

    const data = JSON.parse(body);
    const { email, password } = data;

    try {
      await this.authService.authenticate(email, password);

      res.statusCode = 200;
      res.setHeader("Set-Cookie", "authenticate=true");
      res.end(
        JSON.stringify({
          message: "Autenticado com sucesso",
        })
      );
    } catch (error) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: error.message,
        })
      );
    }
  }
}
