import { Injectable } from '@nestjs/common';
import { ProductCategory } from 'src/core/models/product-category';
import { ProductCategoryRepository } from 'src/core/repositories/productCategory.repository';

@Injectable()
export class ProductCategoryService {
    constructor(private readonly productCategoryRepository: ProductCategoryRepository) {}

    private productCategoryBuilder = this.productCategoryRepository.createQueryBuilder('productCategory');

    async createOne(name: string): Promise<ProductCategory> {
        const productCategory = new ProductCategory();
        productCategory.name = name;
        return this.productCategoryRepository.save(productCategory);
    }

    async createMany(names: string[]): Promise<ProductCategory[]> {
        const productCategories = names.map((name) => {
            const productCategory = new ProductCategory();
            productCategory.name = name;
            return productCategory;
        });
        return this.productCategoryRepository.save(productCategories);
    }

    async filterProductCategories(name: string): Promise<ProductCategory[]> {
        const query = this.productCategoryBuilder;

        query.where('productCategory.name like :name', { name: `%${name}%` });

        return query.getMany();
    }

    async findMany(ids: string[]): Promise<ProductCategory[]> {
        return this.productCategoryBuilder.whereInIds(ids).getMany();
    }

    async findManyByNames(names: string[]): Promise<ProductCategory[]> {
        return this.productCategoryBuilder.where('productCategory.name IN (:...names)', { names }).getMany();
    }
}
