import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users';

import { Inputs } from './utils';

@Injectable()
class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ) {}

    async registration(user: Inputs.Auth, response) {
        const hashPass = await bcrypt.hash(user.password, 5);
        const newUser = await this.userService.createUser({ ...user, password: hashPass });
        this.saveTokens(response, user);

        return newUser;
    }

    async validateUser(data: Inputs.Auth) {
        const user = await this.userService.getUser({ nickname: data.nickname });

        if (user && (await bcrypt.compare(data.password, user.password))) {
            return user;
        }

        return null;
    }

    async login(user: Inputs.Auth, response) {
        this.saveTokens(response, user);

        return user;
    }

    async refreshToken(user: Inputs.Auth, response) {
        this.saveTokens(response, user);

        return 200;
    }

    saveTokens(response, user: Inputs.Auth) {
        const payload = {
            username: user.nickname,
            sub: { name: user.nickname },
        };

        const tokens = {
            accessToken: this.jwtService.sign(payload, { expiresIn: '3600s' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '604800s' }),
        };

        response.cookie('accessToken', tokens.accessToken);
        response.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, path: true });

        return tokens;
    }
}

export default AuthService;
