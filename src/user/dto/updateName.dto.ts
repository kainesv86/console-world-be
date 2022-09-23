import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { userValidateSchema } from '../../core/models';
export class UpdateUserDTO {
    @ApiProperty({ description: 'Name', example: 'Tai Vinh' })
    name: string;

    @ApiProperty({ description: 'Phone', example: '0123456789' })
    phone: string;

}

export const vUpdateUserDTO = joi.object<UpdateUserDTO>({
    name: userValidateSchema.name,
    phone: userValidateSchema.phone,
});
