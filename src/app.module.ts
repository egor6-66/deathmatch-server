import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule } from '@nestjs/sequelize';
import process from 'process';

import { AuthModule } from './auth';
import { UsersModel, UsersModule } from './users';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: './schema.gql',
            playground: {
                settings: {
                    'request.credentials': 'include',
                },
            },
            cors: {
                origin: true,
                credentials: true,
            },
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASS,
            database: process.env.POSTGRES_DB,
            models: [UsersModel],
            autoLoadModels: true,
        }),
        UsersModule,
        AuthModule,
    ],
})
class AppModule {}

export default AppModule;
