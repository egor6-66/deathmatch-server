import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import UsersModel from './users.model';
import UsersResolver from './users.resolver';
import UsersService from './users.service';

@Module({
    providers: [UsersResolver, UsersService],
    imports: [SequelizeModule.forFeature([UsersModel])],
})
class UsersModule {}

export default UsersModule;
