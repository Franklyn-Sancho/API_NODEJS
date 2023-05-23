import sqlite3 from "sqlite3";

export class UserModel {
  db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  //criação da tabela usuário
  createTable() {
    this.db.run("CREATE TABLE IF NOT EXISTS User (email TEXT, password TEXT)");
  }

  //função que adiciona o usuário na tabela
  insertUser(email: string, password: string) {
    this.db.run("INSERT INTO User (email, password) VALUES (?, ?)", [
      email,
      password,
    ]);
  }
}
