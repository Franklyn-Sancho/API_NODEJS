import { IncomingMessage, ServerResponse } from "http";
import { UserModel } from "../models/user";
import sqlite3 from "sqlite3";
import { createHash } from "../utils/hashUtils";

export function registerRoute(
  req: IncomingMessage,
  res: ServerResponse,
  db: sqlite3.Database
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const { email, password } = data;
    const userModel = new UserModel(db);

    const hashedPassword = createHash(password);

    userModel.insertUser(email, hashedPassword);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Usuário registrado com sucesso");
  });
}
