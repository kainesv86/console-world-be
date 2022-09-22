import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation } from '@nestjs/swagger';
import { storage } from 'firebase-admin';

import _ from 'lodash';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @UseGuards()
    @ApiOperation({ summary: 'Create product' })
    async cCreateProduct() {
        const imageId = _.uniqueId();

        await storage().bucket().file(`${imageId}.txt`).createWriteStream().end('Hello world! wtf');

        const url = await storage().bucket().file(`${imageId}.txt`).getSignedUrl({ expires: '03-09-2023', action: 'read' });

        console.log(url);

        return url;
    }
}
