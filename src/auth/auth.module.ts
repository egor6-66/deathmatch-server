import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import process from 'process';

import { UsersModel, UsersService } from '../users';

import Controller from './auth.controller';
import AuthService from './auth.service';
import { AuthStrategy } from './utils';

@Module({
    providers: [AuthService, UsersService, AuthStrategy.Local, AuthStrategy.Jwt, AuthStrategy.RefreshJwt],
    controllers: [Controller],
    imports: [
        SequelizeModule.forFeature([UsersModel]),
        JwtModule.register({
            secret: `${process.env.GWT_SECRET}`,
        }),
    ],
})
class AuthModule {}

export default AuthModule;
