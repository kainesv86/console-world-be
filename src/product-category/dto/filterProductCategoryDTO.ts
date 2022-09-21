import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class FilterProductCategoryDTO {
    @ApiProperty({ description: 'Name', example: 'Play', nullable: true })
    name: string;
}

export const vFilterProductCategoryDTO = joi.object<FilterProductCategoryDTO>({ name: joi.string().required().failover('') });
