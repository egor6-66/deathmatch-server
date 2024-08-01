import { ApolloDriver } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GqlModuleAsyncOptions, GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { enums } from '@utils';

import PubSubModule from '../pubSub/pubSub.module';
import pubSubService from '../pubSub/pubSub.service';
import PubSubService from '../pubSub/pubSub.service';

const graphQl = (): GqlModuleAsyncOptions<GqlModuleOptions, GqlOptionsFactory<GqlModuleOptions>> => ({
    imports: [PubSubModule, ConfigModule],
    driver: ApolloDriver,
    inject: [pubSubService, ConfigService],
    useFactory: async (pubSubService: PubSubService, configService: ConfigService) => {
        return {
            autoSchemaFile: './schema.gql',
            subscriptions: {
                'graphql-ws': {
                    onConnect: pubSubService.onConnect,
                    onDisconnect: pubSubService.onDisconnect,
                },
            },
            playground: configService.get(enums.Env.NODE_ENV) === 'dev' ? { settings: { 'request.credentials': 'include' } } : false,
            cors: { origin: true, credentials: true },
            context: ({ req, res }) => ({ req, res }),
        } as GqlModuleOptions;
    },
});

export default graphQl;
