import { IncomingMessage, ServerResponse } from "http";
import { UserModel } from "../models/user";
import sqlite3 from "sqlite3";
import crypto from 'crypto'

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

    const hash = crypto.createHash('sha256')
    hash.update(password)
    const hashedPassword = hash.digest('hex')

    userModel.insertUser(email, hashedPassword);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Usuário registrado com sucesso");
  });
}
