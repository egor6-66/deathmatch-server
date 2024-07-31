import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import process from 'process';

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
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: './schema.gql',
            subscriptions: { 'graphql-ws': true },
            playground: process.env.NODE_ENV === 'dev' ? { settings: { 'request.credentials': 'include' } } : false,
            cors: { origin: true, credentials: true },
            context: ({ req, res }) => ({ req, res }),
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [User, ClientApp, GameServer],
            synchronize: process.env.NODE_ENV === 'dev',
        }),
        UsersModule,
        AuthModule,
        ClientAppModule,
        GameServersModule,
        PubSubModule,
    ],
})
class AppModule {}

export default AppModule;
