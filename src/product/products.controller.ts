import { Controller, UseGuards, Get, Query, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterProductsDTO, vFilterProductsDTO } from './dto/filterProducts.dto';
import { QueryJoiValidatorPipe } from 'src/core/pipe/queryValidator.pipe';
import { serialize } from 'src/core/interceptors/serialization.interception';
import { Product } from 'src/core/models/product';
import { ResponseList } from 'src/core/common/class/response.class';

@ApiTags('products')
@Controller(ProductsController.endPoint)
@ApiBearerAuth()
export class ProductsController {
    static endPoint = 'products';
    constructor(private readonly productService: ProductService) {}

    @Get('')
    @UseGuards()
    @ApiOperation({ summary: 'Get products filter' })
    @serialize(ResponseList<Product>)
    @UsePipes(new QueryJoiValidatorPipe(vFilterProductsDTO))
    async cFilterProducts(@Query() queries: FilterProductsDTO) {
        const { name, categories, minPrice, maxPrice, isSale, currentPage, pageSize, order } = queries;
        const categoriesArr: string[] = categories ? (Array.isArray(categories) ? categories : [categories]) : [];
        return await this.productService.filterProducts(name, categoriesArr, minPrice, maxPrice, isSale, currentPage, pageSize, order);
    }
}
