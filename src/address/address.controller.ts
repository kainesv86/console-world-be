import { Controller, Req, UseGuards } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { AddAddressDTO } from './dto/addAddressDTO';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('address')
@Controller(AddressController.endPoint)
export class AddressController {
    static endPoint = '/api/address';
    constructor(private readonly addressService: AddressService) {}

    @Post('/')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create address by user' })
    async cCreateAddress(@Body() body: AddAddressDTO, @Req() req: Request) {
        const result = await this.addressService.createOne(body.location, body.phone, req.user);
        return result;
    }
}
