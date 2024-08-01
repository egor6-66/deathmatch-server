import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Guards } from '@utils';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { PUB_SUB } from '../pubSub/pubSub.module';

import GameServer from './game-servers.model';
import GameServersService from './game-servers.service';
import { Enums, Inputs } from './utils';

@UseGuards(Guards.AuthJwt)
@Resolver()
class GameServersResolver {
    constructor(
        private gameServersService: GameServersService,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub
    ) {}

    @Mutation(() => GameServer, { nullable: true, name: Enums.EVENTS.newServer })
    async createServer(@Args('data') data: Inputs.CreateServer, @Context() context: any) {
        const newServer = await this.gameServersService.createServer(data, context.req);
        await this.pubSub.publish(Enums.EVENTS.newServer, { newServer });

        return newServer;
    }

    @Subscription(() => GameServer, {
        filter: (payload, variables, context) => {
            return context?.req.extra?.user.id !== payload.newServer.owner.id;
        },
    })
    newServer() {
        return this.pubSub.asyncIterator(Enums.EVENTS.newServer);
    }

    @Query(() => [GameServer], { nullable: true, name: 'viewerServers' })
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
