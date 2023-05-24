import * as http from "http";
import sqlite3 from "sqlite3";
import { AuthController } from "./controller/AuthController";
import { AuthService } from "./service/AuthService";
import { UserRepository } from "./repository/UserRepository";

const db = new sqlite3.Database("my-database.db");
const userRepository = new UserRepository(db);
userRepository.createTable();

const authController = new AuthController(
  new AuthService(new UserRepository(db))
);

const server = http.createServer((req, res) => {
  if (req.url === "/register" && req.method === "POST") {
    authController.register(req, res);
  } else if (req.url === "/authenticate" && req.method === "POST") {
    authController.authenticate(req, res);
  } else if (req.url === "/rota-autenticada" && req.method === "GET") {
    const cookie = req.headers.cookie;
    if (cookie) {
      res.write("Está rota é autenticada");
      console.log("Esta rota é autenticada");
    } else {
      res.writeHead(401);
      res.write("Acesso não autorizado");
    }

    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
