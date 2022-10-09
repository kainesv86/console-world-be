import { Injectable } from '@nestjs/common';
import { SortOrder } from 'src/core/interface';
import { Product } from 'src/core/models/product';
import { ProductCategory } from 'src/core/models/product-category';
import { ProductRepository } from 'src/core/repositories/product.repository';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    productBuilder = this.productRepository.createQueryBuilder('product').leftJoinAndSelect('product.categories', 'category');

    async saveOne(product: Product): Promise<Product> {
        return this.productRepository.save(product);
    }

    async getOneByField(field: keyof Product, value: any): Promise<Product> {
        return this.productBuilder.where(`product.${field} = :value`, { value }).getOne();
    }

    async filterProducts(
        name: string,
        categories: string | string[],
        minPrice: number,
        maxPrice: number,
        isSale: boolean,
        currentPage: number,
        pageSize: number,
        order: SortOrder,
    ): Promise<{ data: Product[]; count: number }> {
        try {
            let query = this.productBuilder
                .where('product.name LIKE :name', { name: `%${name}%` })
                .andWhere('product.price >= :minPrice', { minPrice })
                .andWhere('product.price <= :maxPrice', { maxPrice })
                .andWhere('product.isSale = :isSale', { isSale })
                .orderBy('product.updateAt', order)
                .skip(currentPage * pageSize)
                .take(pageSize);

            if (categories.length > 0) {
                query = query.andWhere('category.id IN (:...categories)', { categories });
            }

            const products = await query.getMany();
            const count = await query.getCount();

            return { data: products, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
