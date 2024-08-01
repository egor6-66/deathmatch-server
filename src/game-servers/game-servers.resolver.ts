import { ClassSerializerInterceptor, Inject, UseInterceptors } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { PUB_SUB } from '../pubSub/pubSub.module';

import GameServer from './game-servers.model';
import GameServersService from './game-servers.service';
import { enums, reqDto } from './utils';

@Resolver()
class GameServersResolver {
    constructor(
        private gameServersService: GameServersService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub
    ) {}

    @Mutation(() => GameServer, { nullable: true, name: 'newServer' })
    async createServer(@Args('data') data: reqDto.CreateServer, @Context() context: any) {
        const newServer = await this.gameServersService.createServer(data, context.req);
        await this.pubSub.publish(enums.SUB_EVENTS.newServer, { newServer });

        return newServer;
    }

    // @UseInterceptors(ClassSerializerInterceptor)
    @Subscription(() => GameServer, {
        filter: (payload, variables, context) => {
            // console.log('payload', payload);
            // console.log('variables', variables);
            console.log(context.req.extra);

            return true;
        },
    })
    newServer() {
        return this.pubSub.asyncIterator(enums.SUB_EVENTS.newServer, { da: 'dw' });
    }

    @Query(() => [GameServer], { nullable: true, name: 'servers' })
    async getViewerServers(@Context() context: any) {
        return await this.gameServersService.getViewerServers(context.req);
    }

    @Query(() => [GameServer], { nullable: true, name: 'allServers' })
    async getAllServers(@Context() context: any) {
        return await this.gameServersService.getAllServers(context.req);
    }

    @Query(() => GameServer, { nullable: true, name: 'server' })
    async getServer(@Args('id', { type: () => Int }) id: number) {
        return await this.gameServersService.getServer(id);
    }

    @Mutation(() => Boolean)
    async joinServer(@Args('id', { type: () => Int }) id: number, @Context() context: any) {
        return await this.gameServersService.joinServer(id, context.req);
    }
}

export default GameServersResolver;
