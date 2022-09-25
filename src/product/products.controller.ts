import { Controller, UseGuards, Get, Query, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductCategoryService } from 'src/product-category/product-category.service';
import { FilterProductsDTO, vFilterProductsDTO } from './dto/filterProducts.dto';
import { JoiValidatorPipe } from 'src/core/pipe/validator.pipe';
import { QueryJoiValidatorPipe } from 'src/core/pipe/queryValidator.pipe';

@ApiTags('products')
@Controller(ProductsController.endPoint)
@ApiBearerAuth()
export class ProductsController {
    static endPoint = '/api/products';
    constructor(private readonly productService: ProductService) {}

    @Get('')
    @UseGuards()
    @ApiOperation({ summary: 'Get products filter' })
    @UsePipes(new QueryJoiValidatorPipe(vFilterProductsDTO))
    async cFilterProducts(@Query() queries: FilterProductsDTO) {
        const { name, categories, minPrice, maxPrice, isSale, currentPage, pageSize, order } = queries;

        return await this.productService.filterProducts(name, categories, minPrice, maxPrice, isSale, currentPage, pageSize, order);
    }
}
