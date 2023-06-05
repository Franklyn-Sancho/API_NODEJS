/* import { IncomingMessage, ServerResponse, createServer } from "http";
import request from "supertest";
import sqlite3 from "sqlite3";
import { AuthController } from "../src/controller/AuthController";
import { AuthService } from "../src/service/AuthService";
import { UserRepository } from "../src/repository/UserRepository";

describe("Teste do método register do controlador", () => {
  let server: ReturnType<typeof createServer>;
  let db: sqlite3.Database;

  beforeAll(async() => {
    db = await open({ filename: "my-database.db", driver: sqlite3.Database });
    const userRepository = new UserRepository(db);
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      authController.register(req, res);
    });
  });

  afterAll(() => {
    server.close();
  });

  it("Deve registrar um usuário com sucesso", async () => {
    const response = await request(server).post("/register").send({
      email: "test@example.com",
      password: "password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Usuário registrado com sucesso");
  });
});
 */