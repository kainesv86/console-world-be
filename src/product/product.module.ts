import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from 'src/core/repositories/product.repository';
import { Connection } from 'typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule)],
    controllers: [ProductController],
    providers: [ProductService, { provide: ProductRepository, useFactory: (connection: Connection) => connection.getCustomRepository(ProductRepository), inject: [Connection] }],
})
export class ProductModule {}
