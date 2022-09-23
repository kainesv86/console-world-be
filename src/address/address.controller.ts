import { Controller, Req, Res, UseGuards, Body, Post, Get, UsePipes, Put, Param, Delete, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { AddAddressDTO, vAddAddressDTO, UpdateAddressDTO, vUpdateAddressDTO } from './dto';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { JoiValidatorPipe } from 'src/core/pipe/validator.pipe';
import { ResponseMessage } from 'src/core/interface';
import { HttpException } from '@nestjs/common/exceptions';
import { StatusCodes } from 'http-status-codes';
import { Address } from 'src/core/models/address';

@ApiTags('Address')
@ApiBearerAuth()
@Controller(AddressController.endPoint)
export class AddressController {
    static endPoint = '/api/address';
    constructor(private readonly addressService: AddressService) {}

    @Get('')
    @UseGuards(AuthGuard)
    async cGetAddresses(@Req() req: Request) {
        return this.addressService.getAddresses(req.user);
    }

    @Post('/')
    @UseGuards(AuthGuard)
    @UsePipes(new JoiValidatorPipe(vAddAddressDTO))
    @ApiOperation({ summary: 'Create address by user' })
    async cCreateAddress(@Body() body: AddAddressDTO, @Req() req: Request, @Res() res: Response) {
        const address = await this.addressService.createOne(body.location, body.phone, req.user);

        const addresses = await this.addressService.getAddresses(req.user);
        if (addresses.length <= 1) {
            address.isDefault = true;
            this.addressService.saveAddress(address);
        }

        return res.send(address);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: '4042bde3-6017-4ea6-bc81-91b9d80d6bf6' })
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update address by user' })
    async cUpdateAddress(@Body(new JoiValidatorPipe(vUpdateAddressDTO)) body: UpdateAddressDTO, @Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const address = await this.addressService.getAddressByField('id', id);

        if (!address) {
            throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        }

        if (address.user.id !== req.user.id) {
            throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
        }

        address.location = body.location;
        address.phone = body.phone;

        const result = this.addressService.saveAddress(address);
        return res.send(result);
    }

    @Delete('/:id')
    @ApiParam({ name: 'id', example: '4042bde3-6017-4ea6-bc81-91b9d80d6bf6' })
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete address by user' })
    async cDeleteAddress(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const address = await this.addressService.getAddressByField('id', id);

        if (!address) {
            throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        }

        if (address.user.id !== req.user.id) {
            throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
        }

        const result = this.addressService.deleteAddress(address);
        return res.send(result);
    }

    @Put('/default/:id')
    @ApiParam({ name: 'id', example: '4042bde3-6017-4ea6-bc81-91b9d80d6bf6' })
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Set default address by user' })
    async cSetDefaultAddress(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const addresses = await this.addressService.getAddresses(req.user);

        const address = addresses.find((address) => address.id === id);

        if (!address) {
            throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        }

        addresses.forEach((address) => {
            if (address.id !== id) {
                return (address.isDefault = false);
            }
            address.isDefault = true;
        });

        console.log(addresses);
        const result = this.addressService.saveAddresses(addresses);
        return res.send(result);
    }
}
