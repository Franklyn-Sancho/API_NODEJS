import { IncomingMessage, ServerResponse } from "http";
import { UserModel } from "../models/user";
import sqlite3 from "sqlite3";
import { createHash } from "../utils/hashUtils";

export async function registerRoute(
  req: IncomingMessage,
  res: ServerResponse,
  db: sqlite3.Database
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  await new Promise((resolve) => {
    req.on("end", resolve);
  });

  const data = JSON.parse(body);
  const { email, password } = data;
  const userModel = new UserModel(db);

  const hashedPassword = createHash(password);

  try {
    userModel.insertUser(email, hashedPassword);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Usuário registrado com sucesso");
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Verifique seus dados");
  }
}
