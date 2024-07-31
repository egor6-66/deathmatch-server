import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Guards } from '@utils';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { PUB_SUB } from '../pubSub/pubSub.module';

import GameServer from './game-servers.model';
import GameServersService from './game-servers.service';
import { enums, Inputs } from './utils';

// @UseGuards(Guards.AuthJwt)
@Resolver()
class GameServersResolver {
    constructor(
        private gameServersService: GameServersService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub
    ) {}

    @Mutation(() => GameServer, { nullable: true, name: 'newServer' })
    async createServer(@Args('data') data: Inputs.CreateServer, @Context() context: any) {
        // await this.pubSub.publish(enums.SUB_EVENTS.newServer, { newServer });

        return this.gameServersService.createServer(data, context.req);
    }

    // @Subscription(() => GameServer)
    // newServer() {
    //     return this.pubSub.asyncIterator(enums.SUB_EVENTS.newServer);
    // }

    // @UseGuards(Guards.AuthJwt)
    @Query(() => [GameServer], { nullable: true, name: 'servers' })
    async getViewerServers(@Context() context: any) {
        return await this.gameServersService.getViewerServers(context.req);
    }

    // @UseGuards(Guards.AuthJwt)
    @Query(() => [GameServer], { nullable: true, name: 'allServers' })
    async getAllServers(@Context() context: any) {
        return await this.gameServersService.getAllServers(context.req);
    }

    // @UseGuards(Guards.AuthJwt)
    @Query(() => GameServer, { nullable: true, name: 'server' })
    async getServer(@Args('id', { type: () => Int }) id: number) {
        return await this.gameServersService.getServer(id);
    }
}

export default GameServersResolver;
