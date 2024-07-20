import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as PassportJwt from 'passport-jwt';
import * as PassportLocal from 'passport-local';
import process from 'process';

import AuthService from '../auth.service';

@Injectable()
export class Local extends PassportStrategy(PassportLocal.Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'nickname',
        });
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validateUser({ password: password, nickname: username });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}

export class Jwt extends PassportStrategy(PassportJwt.Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: `${process.env.jwt_secret}`,
        });
    }

    async validate(payload) {
        return { user: payload.sub, username: payload.username };
    }
}

export class RefreshJwt extends PassportStrategy(PassportJwt.Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: PassportJwt.ExtractJwt.fromBodyField('refresh'),
            ignoreExpiration: false,
            secretOrKey: `${process.env.jwt_secret}`,
        });
    }

    async validate(payload: any) {
        return { user: payload.sub, username: payload.username };
    }
}
