import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as configs from 'configs';

import AuthModule from './auth/auth.module';
import ClientApp from './client-app/client-app.model';
import ClientAppModule from './client-app/client-app.module';
import GameServer from './game-servers/game-servers.model';
import GameServersModule from './game-servers/game-servers.module';
import PubSubModule from './pubSub/pubSub.module';
import User from './users/users.model';
import UsersModule from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot(configs.base()),
        GraphQLModule.forRootAsync(configs.graphQl()),
        TypeOrmModule.forRootAsync(configs.typeorm([User, ClientApp, GameServer])),
        UsersModule,
        AuthModule,
        ClientAppModule,
        GameServersModule,
        PubSubModule,
    ],
})
class AppModule {}

export default AppModule;
