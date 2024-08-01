import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { enums } from 'utils';

import PubSubService from './pubSub.service';

const PUB_SUB = 'PUB_SUB';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: PUB_SUB,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                new RedisPubSub({
                    connection: {
                        host: configService.get(enums.Env.REDIS_HOST),
                        port: configService.get(enums.Env.REDIS_PORT),
                    },
                }),
        },
        PubSubService,
    ],
    exports: [PUB_SUB, PubSubService],
})
class PubSubModule {}

export { PUB_SUB };
export default PubSubModule;
