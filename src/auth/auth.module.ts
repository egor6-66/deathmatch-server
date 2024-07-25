import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import process from 'process';

import { User, UsersService } from '../users';

import Controller from './auth.controller';
import AuthService from './auth.service';
import { AuthStrategy } from './utils';

@Module({
    providers: [AuthService, UsersService, AuthStrategy.Local, AuthStrategy.Jwt, AuthStrategy.RefreshJwt],
    controllers: [Controller],
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: `${process.env.GWT_SECRET}`,
        }),
    ],
})
class AuthModule {}

export default AuthModule;
