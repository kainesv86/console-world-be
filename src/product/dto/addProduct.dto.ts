import { ApiProperty } from "@nestjs/swagger";
import * as joi from "joi";
import { productValidateSchema } from "src/core/models/product";
import { File } from "winston/lib/winston/transports";

export class AddProductDTO {
    @ApiProperty({ description: 'Name', example: 'The Death' })
    name: string;
    
    @ApiProperty({ description: 'Price', example: 5 })
    price: number;
    
    @ApiProperty({ description: 'Description', example: 'The Death' })
    description: string;

    @ApiProperty({ description: 'categories', format: 'array', items: { type: 'string' }, example: ['id1','id2','or empty'] ,default:[]})
    categories: string[];

    @ApiProperty({ description: 'details', example: '<div>somthing</div>' })
    details: string;

    @ApiProperty({ description: 'quantity', example: 99 })
    quantity: number;

    @ApiProperty({ description: 'is sale', example: true })
    isSale: boolean;

    @ApiProperty({ type: 'string', format: 'binary'  })   
    image:Express.Multer.File;
}

export const vAddProductDTO = joi.object<AddProductDTO>({
    name: productValidateSchema.name,
    price: productValidateSchema.price,
    description: productValidateSchema.description,
    categories: joi.array().items(joi.string()).failover([]),
    details: productValidateSchema.details,
    quantity: productValidateSchema.quantity,
    isSale: productValidateSchema.isSale,
});
