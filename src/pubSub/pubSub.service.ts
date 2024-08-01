import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CookieParser, Exceptions } from 'utils';

import User from '../users/users.model';

@Injectable()
class PubSubService {
    constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

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

            const user = await this.usersRepo.findOneBy({ id: userData.id });

            return { ...user, accessToken, refreshToken };
        }
    }

    async onConnect(ctx: any) {
        const user = await this.getUser(ctx);
        user.isOnline = true;
        await this.usersRepo.save(user);
        ctx.extra.user = user;
    }

    async onDisconnect(ctx: any) {
        const user = await this.getUser(ctx);
        user.isOnline = false;
        await this.usersRepo.save(user);
        ctx.extra.user = null;
    }
}

export default PubSubService;
