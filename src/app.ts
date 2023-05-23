import * as http from "http";
import sqlite3 from "sqlite3";
import { UserModel } from "./models/user";
import { registerRoute } from "./router/register";

/* const db = new sqlite3.Database(":memory:"); */
const db = new sqlite3.Database("./users.sqlite3");
const userModel = new UserModel(db);
userModel.createTable();

const server: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse): void => {
    if (req.url === "/register" && req.method === "POST") {
      registerRoute(req, res, db);
    }
  }
);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
