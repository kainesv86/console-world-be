import { Controller, Req, Res, UseGuards, Body, Post, Get, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { AddAddressDTO, vAddAddressDTO } from './dto/addAddressDTO';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { JoiValidatorPipe } from 'src/core/pipe/validator.pipe';

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
        const result = await this.addressService.createOne(body.location, body.phone, req.user);
        return res.send(result);
    }
}
