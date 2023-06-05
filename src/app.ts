import * as http from "http";
import sqlite3 from "sqlite3";
import { AuthController } from "./controller/AuthController";
import { AuthService } from "./service/AuthService";
import { UserRepository } from "./repository/UserRepository";
import { ProductRepository } from "./repository/ProductRepository";
import { ProductController } from "./controller/ProductController";
import { ProductService } from "./service/ProductService";

const db = new sqlite3.Database("my-database.db");
const userRepository = new UserRepository(db);
const productRepository = new ProductRepository(db);
userRepository.createTableUser();
productRepository.createTableProduct();

const authController = new AuthController(
  new AuthService(new UserRepository(db))
);

const productController = new ProductController(
  new ProductService(new ProductRepository(db))
);

const server = http.createServer((req, res) => {
  if (req.url === "/register" && req.method === "POST") {
    authController.register(req, res);
  } else if (req.url === "/authenticate" && req.method === "POST") {
    authController.authenticate(req, res);
  } else if (req.url === "/rota-autenticada" && req.method === "GET") {
    const cookie = req.headers.cookie;
    if (cookie) {
      res.write("Está rota é autenticada");
      console.log("Esta rota é autenticada");
    } else {
      res.writeHead(401);
      res.write("Acesso não autorizado");
    }

    res.end();
  }
  else if(req.url === "/product/find" && req.method === "POST") {
    productController.findByBrand(req, res)
  }

  else if (req.url === "/product/new" && req.method === "POST") {
    productController.register(req, res)
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
