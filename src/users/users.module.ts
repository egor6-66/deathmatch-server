import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import process from 'process';

import User from './users.model';
import UsersResolver from './users.resolver';
import UsersService from './users.service';

@Module({
    providers: [UsersResolver, UsersService],
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: `${process.env.GWT_SECRET}`,
        }),
    ],
    exports: [UsersService],
})
class UsersModule {}

export default UsersModule;
