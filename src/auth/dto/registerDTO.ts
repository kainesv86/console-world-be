import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { userValidateSchema } from '../../core/models';
import JoiMessage from 'joi-message';
import { ResponseMessage } from 'src/core/interface';

export class RegisterDTO {
    @ApiProperty({ description: 'Username', example: 'kainesv86@gmail.com' })
    email: string;

    @ApiProperty({ description: 'Name', example: 'Pham Vinh Tai' })
    name: string;

    @ApiProperty({ description: 'Password', example: '123456Aa' })
    password: string;

    @ApiProperty({ description: 'Confirm password', example: '123456Aa' })
    confirmPassword: string;
}

export const vRegisterDTO = joi.object<RegisterDTO>({
    name: userValidateSchema.name,
    email: userValidateSchema.email,
    password: userValidateSchema.password,
    confirmPassword: joi
        .string()
        .required()
        .valid(joi.ref('password'))
        .messages({ ...JoiMessage.createStringMessages({ field: 'Confirm password' }), 'any.only': ResponseMessage.INVALID_CONFIRM_PASSWORD }),
});
