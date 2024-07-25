import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UsersModel from './users.model';
import UsersResolver from './users.resolver';
import UsersService from './users.service';

@Module({
    providers: [UsersResolver, UsersService],
    imports: [TypeOrmModule.forFeature([UsersModel])],
})
class UsersModule {}

export default UsersModule;
