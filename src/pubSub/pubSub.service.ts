import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CookieParser, Exceptions } from 'utils';

import User from '../users/users.model';

@Injectable()
class PubSubService {
    onConnect(ctx: any) {
        const cookie = ctx.extra.request.headers.cookie;
        console.log('connect');

        if (cookie) {
            const jwt = new JwtService();
            const accessToken = CookieParser.get(ctx.extra.request.headers.cookie, 'accessToken');

            if (!accessToken) {
                Exceptions.unauthorized();
            }

            // await this.usersRepo.save({ isOnline: true });
            ctx.extra.user = jwt.decode(accessToken);
        }

        return null;
    }

    onDisconnect(ctx: any) {
        console.log('disconnect');
    }
}

export default PubSubService;
