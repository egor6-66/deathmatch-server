import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import process from 'process';

import UsersModule from '../users/users.module';

import AuthResolver from './auth.resolver';
import AuthService from './auth.service';
import { AuthStrategy } from './utils';

@Module({
    providers: [AuthResolver, AuthService, AuthStrategy.Local, AuthStrategy.Jwt, AuthStrategy.RefreshJwt],

    imports: [
        TypeOrmModule.forFeature([]),
        JwtModule.register({
            secret: `${process.env.GWT_SECRET}`,
        }),
        UsersModule,
    ],
})
class AuthModule {}

export default AuthModule;
