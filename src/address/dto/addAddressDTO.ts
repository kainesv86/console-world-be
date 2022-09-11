import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { addressValidateSchema } from 'src/core/models/address';

export class AddAddressDTO {
    @ApiProperty({ description: 'Location', example: 'Ha Noi' })
    location: string;

    @ApiProperty({ description: 'Phone', example: '0123456789' })
    phone: string;
}

export const vAddAddressDTO = joi.object<AddAddressDTO>({
    location: addressValidateSchema.location,
    phone: addressValidateSchema.phone,
});
