import * as http from "http";
import sqlite3 from "sqlite3";
import { UserModel } from "./models/user";
import { registerRoute } from "./router/register";
import { authenticateRouter } from "./router/autenticate";
import { isAuthenticated } from "./middleware/isAuthenticated";

/* const db = new sqlite3.Database(":memory:"); */
const db = new sqlite3.Database("./users.sqlite3");
const userModel = new UserModel(db);
userModel.createTable();

const server: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse): void => {
    if (req.url === "/register" && req.method === "POST") {
      registerRoute(req, res, db);
    }
    if (req.url === "/login" && req.method === "POST") {
      authenticateRouter(req, res, db);
    }
    if (req.url === "/rota-autenticada") {
      if (isAuthenticated(req)) {
        res.write("Está rota é autenticada");
        console.log("Esta rota é autenticada");
      } else {
        res.writeHead(401);
        res.write("Acesso não autorizado");
      }

      res.end()
    }
    else {
      res.writeHead(404);
      res.write("Página não encontrada")
      res.end()
    }
  }
);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
