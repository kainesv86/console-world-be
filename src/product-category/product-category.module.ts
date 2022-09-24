import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryRepository } from 'src/core/repositories/productCategory.repository';
import { Connection } from 'typeorm';
import { forwardRef } from '@nestjs/common/utils';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule)],
    controllers: [ProductCategoryController],
    providers: [
        ProductCategoryService,
        { provide: ProductCategoryRepository, useFactory: (connection: Connection) => connection.getCustomRepository(ProductCategoryRepository), inject: [Connection] },
    ],
    exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
