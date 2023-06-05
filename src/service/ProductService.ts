import { ProductRepository } from "../repository/ProductRepository";


export class ProductService {
    constructor (private productRepository: ProductRepository) {}

    async register(name: string, type: string, brand: string) {
        await this.productRepository.insertProduct(name, type, brand)
    }

    async findProductByBrand(search: any) {
        console.log("service está rodando")
        return await this.productRepository.getProductByDynamicSearch(search)
    }
}