import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Guards } from '@utils';

import AuthService from './auth.service';
import { Inputs } from './utils';

@Controller('auth')
class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(Guards.AuthLocal)
    @Post('login')
    login(@Req() req, @Res({ passthrough: true }) response) {
        return this.authService.login(req.user, response);
    }

    @Post('registration')
    async registration(@Body() body: Inputs.Auth, @Res({ passthrough: true }) response) {
        return await this.authService.registration(body, response);
    }

    @UseGuards(Guards.RefreshJwt)
    @Post('refresh')
    async refreshToken(@Body() req, @Res({ passthrough: true }) response) {
        return this.authService.refreshToken(req, response);
    }
}

export default AuthController;
