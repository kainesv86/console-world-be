import { Controller, Post, Body, Get, UsePipes, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';
import { JoiValidatorPipe } from 'src/core/pipe/validator.pipe';
import { AddProductCategoryDTO, vAddProductCategoryDTO } from './dto/addProductCategoryDTO';
import { FilterProductCategoryDTO, vFilterProductCategoryDTO } from './dto/filterProductCategoryDTO';

import { ProductCategoryService } from './product-category.service';

@ApiTags('Product Category')
@ApiBearerAuth()
@Controller(ProductCategoryController.endPoint)
export class ProductCategoryController {
    static endPoint = '/product-category';
    constructor(private readonly productCategoryService: ProductCategoryService) {}

    @Get('')
    @UsePipes(new JoiValidatorPipe(vFilterProductCategoryDTO))
    @ApiOperation({ summary: 'Get all product category' })
    async cFilterProductCategories(@Query() queries: FilterProductCategoryDTO) {
        const { name } = queries;
        return this.productCategoryService.filterProductCategories(name);
    }

    @Post('/')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create product category' })
    async cCreateProductCategory(@Body(new JoiValidatorPipe(vAddProductCategoryDTO)) body: AddProductCategoryDTO) {
        const productCategories = await this.productCategoryService.createOne(body.name);
        return productCategories;
    }
}
