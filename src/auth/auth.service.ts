import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import UsersService from '../users/users.service';

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
        this.saveTokens(newUser, response);

        return newUser;
    }

    async login(user: Inputs.Auth, response?: Response) {
        const foundUser = await this.userService.getUserBy({ nickname: user.nickname });

        if (foundUser && (await bcrypt.compare(user.password, foundUser.password))) {
            response && this.saveTokens(foundUser, response);

            return foundUser;
        }

        return null;
    }

    async logout(response, request) {
        response.clearCookie('accessToken', request.cookies['accessToken']);
        response.clearCookie('refreshToken', request.cookies['refreshToken']);

        return 200;
    }

    async refreshToken(refreshToken: string, response) {
        const data = this.jwtService.decode(refreshToken);

        this.saveTokens({ id: data.id, nickname: data.username }, response);

        return 200;
    }

    saveTokens(data: { id: number; nickname: string }, response) {
        const payload = {
            username: data.nickname,
            sub: { name: data.nickname, id: data.id },
        };

        const tokens = {
            // accessToken: this.jwtService.sign(payload, { expiresIn: '3600s' }),
            accessToken: this.jwtService.sign(payload, { expiresIn: '6000s' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '604800s' }),
        };

        response.cookie('accessToken', tokens.accessToken, { httpOnly: true, path: true });
        response.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, path: true });

        return tokens;
    }
}

export default AuthService;
