import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DbModule } from './module.config';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { ProductCategoryModule } from './product-category/product-category.module';

@Module({
    imports: [DbModule, UserModule, AuthModule, AddressModule, ProductCategoryModule],
})
export class AppModule {}
