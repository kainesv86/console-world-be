import { Injectable } from '@nestjs/common';
import { Product } from 'src/core/models/product';
import { ProductRepository } from 'src/core/repositories/product.repository';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async createOne() {
        // const product = new Product();
        // return null;
    }
}
