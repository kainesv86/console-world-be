import { Body, Controller, Get, HttpException, Param, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from '../core';
import { constant } from '../core/constant';
import { JwtToken } from '../core/interface';
import { User } from '../core/models';
import { JoiValidatorPipe } from '../core/pipe/validator.pipe';
import { EmailService } from '../core/providers';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, RequestVerifyEmailDTO, vLoginDTO, vRegisterDTO, vRequestVerifyEmailDTO } from './dto';

@ApiTags('Authentication')
@Controller(AuthController.endPoint)
export class AuthController {
    static endPoint = '/api/auth';

    constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly emailService: EmailService) {}

    @Post('/verify-email')
    @UsePipes(new JoiValidatorPipe(vRequestVerifyEmailDTO))
    async cSendVerifyEmail(@Body() body: RequestVerifyEmailDTO, @Res() res: Response) {
        const user = await this.userService.findOne('email', body.email);

        if (!user) {
            throw new HttpException({ errorMessage: 'error.not_found' }, StatusCodes.BAD_REQUEST);
        }

        const otp = await this.authService.createAccessToken(user, 5);

        const isSend = await this.emailService.sendEmailForVerify(user.email, otp);

        if (!isSend) {
            throw new HttpException({ errorMessage: 'error.something_wrong' }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return res.send();
    }

    @Get('/verify-email/:otp')
    async cVerifyEmail(@Param('otp') otp: string, @Res() res: Response) {
        const { data, error } = await this.authService.verifyToken<JwtToken>(otp);
        if (error) {
            throw new HttpException({ errorMessage: '' }, StatusCodes.UNAUTHORIZED);
        }

        const user = await this.userService.findOne('id', data.id);
        if (!user) {
            throw new HttpException({ errorMessage: '' }, StatusCodes.UNAUTHORIZED);
        }

        user.isVerified = true;
        await this.userService.updateOne(user);

        return res.send();
    }

    @Post('/register')
    @ApiOperation({ summary: 'Create new user' })
    @ApiCreatedResponse({ type: String, description: 'access token' })
    @UsePipes(new JoiValidatorPipe(vRegisterDTO))
    async cRegister(@Body() body: RegisterDTO, @Res() res: Response) {
        const existedUser = await this.userService.findOne('email', body.email);
        if (existedUser) throw new HttpException({ email: 'field.field-taken' }, StatusCodes.BAD_REQUEST);
        const newUser = await this.authService.createOne(body.name, body.email, body.password);

        const accessToken = await this.authService.createAccessToken(newUser);
        return res.cookie(constant.authController.tokenName, accessToken, { maxAge: constant.authController.registerCookieTime }).send({ token: accessToken });
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login' })
    @ApiCreatedResponse({ type: String, description: 'access token' })
    @UsePipes(new JoiValidatorPipe(vLoginDTO))
    async cLogin(@Body() body: LoginDTO, @Res() res: Response) {
        const user = await this.userService.findOne('email', body.email);
        if (!user) throw new HttpException({ errorMessage: 'error.invalid-password-username' }, StatusCodes.BAD_REQUEST);

        const isCorrectPassword = await this.authService.decryptPassword(body.password, user.password);
        if (!isCorrectPassword) throw new HttpException({ errorMessage: 'error.invalid-password-username' }, StatusCodes.BAD_REQUEST);

        const accessToken = await this.authService.createAccessToken(user);
        return res.cookie(constant.authController.tokenName, accessToken, { maxAge: constant.authController.loginCookieTime }).send({ token: accessToken });
    }

    @Post('/logout')
    @ApiOperation({ summary: 'Logout user account' })
    async cLogout(@Req() req: Request, @Res() res: Response) {
        return res.cookie(constant.authController.tokenName, '', { maxAge: -999 }).send();
    }

    // ---------------------------3rd authentication---------------------------
    @Get('/google')
    @UseGuards(AuthGuard('google'))
    cGoogleAuth() {
        //
    }

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async cGoogleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const accessToken = await this.authService.createAccessToken(req.user as User);
        return res.cookie(constant.authController.tokenName, accessToken, { maxAge: constant.authController.googleUserCookieTime }).redirect(config.GOOGLE_CLIENT_REDIRECT_URL);
    }
}
