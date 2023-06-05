import sqlite3 from "sqlite3";
import crypto from "crypto";

interface User {
  id: string;
  email: string;
  password: string;
}


//Classe Repositório
export class UserRepository {
  constructor(private db: sqlite3.Database) {}

  //função para criar tabela.
  async createTableUser() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS User (id TEXT, email TEXT UNIQUE, password TEXT)"
    );
  }


  //função de inserir usuários na tabela
  async insertUser(
    email: string,
    password: string,
  ): Promise<User> {
    const id = crypto.randomBytes(16).toString("hex");
    const sql = `INSERT INTO User (id, email, password) values (?, ?, ?)`;
    const params = [id, email, password];

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        }
        resolve({ id, email, password });
      });
    });
  }


  //função de encontrar e autenticar usuários
  getUserByEmail(email: string): Promise<User> {
    const sql = `SELECT * FROM User WHERE email = ?`;
    const params = [email];

    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row as User);
      });
    });
  }
}
