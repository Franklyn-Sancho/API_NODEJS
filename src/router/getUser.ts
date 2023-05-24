import { IncomingMessage, ServerResponse } from "http";
import sqlite3 from "sqlite3";
import { UserModel } from "../models/user";

export function getAllUsers(
  req: IncomingMessage,
  res: ServerResponse,
  db: sqlite3.Database
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const userModel = new UserModel(db);


    userModel.getAllUser();

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(db);
  });
}
