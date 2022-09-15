import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { addressValidateSchema } from 'src/core/models/address';

export class UpdateAddressDTO {
    @ApiProperty({ description: 'Location', example: 'HCM City' })
    location: string;

    @ApiProperty({ description: 'Phone', example: '0123456789' })
    phone: string;
}

export const vUpdateAddressDTO = joi.object<UpdateAddressDTO>({
    location: addressValidateSchema.location,
    phone: addressValidateSchema.phone,
});
