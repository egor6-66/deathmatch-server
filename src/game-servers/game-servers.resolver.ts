import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Guards } from '@utils';

import GameServer from './game-servers.model';
import GameServersService from './game-servers.service';
import { Inputs } from './utils';

@UseGuards(Guards.AuthJwt)
@Resolver()
class GameServersResolver {
    constructor(private gameServersService: GameServersService) {}

    @Mutation(() => GameServer, { nullable: true, name: 'newServer' })
    createServer(@Args('data') data: Inputs.CreateServer, @Context() context: any) {
        return this.gameServersService.createServer(data, context.req);
    }

    @UseGuards(Guards.AuthJwt)
    @Query(() => [GameServer], { nullable: true, name: 'servers' })
    async getViewerServers(@Context() context: any) {
        return await this.gameServersService.getViewerServers(context.req);
    }

    @UseGuards(Guards.AuthJwt)
    @Query(() => [GameServer], { nullable: true, name: 'allServers' })
    async getAllServers(@Context() context: any) {
        return await this.gameServersService.getAllServers(context.req);
    }

    @UseGuards(Guards.AuthJwt)
    @Query(() => GameServer, { nullable: true, name: 'server' })
    async getServer(@Args('id', { type: () => Int }) id: number) {
        return await this.gameServersService.getServer(id);
    }
}

export default GameServersResolver;
