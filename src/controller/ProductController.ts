import { IncomingMessage, ServerResponse } from "http";
import { ProductService } from "../service/ProductService";
import { readRequestBody } from "../utils/readRequestBody";
import { ERROR_INTERNAL_ERROR, ERROR_PRODUCT_NOT_FOUND, ERROR_VALIDATION_PRODUCT, STATUS_INTERNAL_ERROR, STATUS_NOT_FOUND, STATUS_OK, SUCCESS_PRODUCT_REGISTERED } from "../utils/constants";

export class ProductController {
  constructor(private productService: ProductService) {}

  async register(req: IncomingMessage, res: ServerResponse) {
    console.log("O Controlador esta rodando");

    const body = await readRequestBody(req)
    const data = JSON.parse(body);
    const { name, type, brand } = data;

    if (!name && !type && !brand) {
      throw new Error(ERROR_VALIDATION_PRODUCT);
    }

    try {
      await this.productService.register(name, type, brand);
      res.statusCode = STATUS_OK;
      res.setHeader("Content-Type", "text/plain");
      res.end(SUCCESS_PRODUCT_REGISTERED);
    } catch (error) {
      console.log(error);
      res.statusCode = STATUS_INTERNAL_ERROR;
      res.setHeader("Content-Type", "text/plain");
      res.end(ERROR_INTERNAL_ERROR);
    }
  }

  async findByBrand(req: IncomingMessage, res: ServerResponse) {
    
    const body = await readRequestBody(req)
    const data = JSON.parse(body);
    const { search } = data;

    try {
      const result = await this.productService.findProductByBrand(search);
      if (result === undefined || result === null) {
        res.statusCode = STATUS_NOT_FOUND
        res.setHeader("Content-Type", "application/json");
        res.end(ERROR_PRODUCT_NOT_FOUND);
      } else {
        res.statusCode = STATUS_OK;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result));
      }
    } catch (error) {
      console.log(error);
      res.statusCode = STATUS_INTERNAL_ERROR;
      res.setHeader("Content-Type", "text/plain");
      res.end(ERROR_INTERNAL_ERROR);
    }
  }
}
