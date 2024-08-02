import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieParser, Exceptions } from 'utils';

import UsersService from '../users/users.service';

@Injectable()
class PubSubService {
    constructor(private readonly userService: UsersService) {}

    private async getUser(ctx) {
        const cookie = ctx.extra.request.headers.cookie;

        if (cookie) {
            const jwt = new JwtService();
            const accessToken = CookieParser.get(ctx.extra.request.headers.cookie, 'accessToken');
            const refreshToken = CookieParser.get(ctx.extra.request.headers.cookie, 'refreshToken');

            if (!accessToken) {
                Exceptions.unauthorized();
            }

            const userData = jwt.decode(accessToken);

            return { ...userData, accessToken, refreshToken };
        }
    }

    async onConnect(ctx: any) {
        const user = await this.getUser(ctx);
        ctx.extra.user = user;
        await this.userService.onConnect(user);
    }

    async onDisconnect(ctx: any) {
        const user = await this.getUser(ctx);
        ctx.extra.user = null;
        await this.userService.onDisconnect(user);
    }
}

export default PubSubService;
