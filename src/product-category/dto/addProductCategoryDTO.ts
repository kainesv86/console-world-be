import { ApiProperty } from '@nestjs/swagger';
import { productCategoryValidateSchema } from 'src/core/models/product-category';
import * as joi from 'joi';

export class AddProductCategoryDTO {
    @ApiProperty({ description: 'Name', example: 'Play Station 4' })
    name: string;
}

export const vAddProductCategoryDTO = joi.object<AddProductCategoryDTO>({ name: productCategoryValidateSchema.name });
