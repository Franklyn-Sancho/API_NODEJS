import { IncomingMessage, ServerResponse } from "http";
import sqlite3 from "sqlite3";
import { UserModel } from "../models/user";
import { createHash } from "../utils/hashUtils";

export async function authenticateRouter(
  req: IncomingMessage & { session?: any },
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
    userModel.getUser(email, hashedPassword);

    req.session = {};
    req.session.user;

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Usuário autenticado com sucesso");
  } catch (error) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "text/plain");
    res.end("Credenciais Inválidas");
  }
}
