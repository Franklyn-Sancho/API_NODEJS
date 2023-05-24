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

  const user = await userModel.getUser(email);

  if (!user) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "Usuário não encontrado",
      })
    );
    return;
  }

  if (user.password !== hashedPassword) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "Senha incorreta",
      })
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader("Set-Cookie", "authenticated=true");
  console.log(res.setHeader)
  res.end(
    JSON.stringify({
      message: "Autenticado com sucesso",
    })
  );
}
