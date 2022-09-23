import { Injectable } from '@nestjs/common';
import { Product } from 'src/core/models/product';
import { ProductRepository } from 'src/core/repositories/product.repository';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async createOne(product: Product): Promise<Product> {
        return this.productRepository.save(product);
    }
}
