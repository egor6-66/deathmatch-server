import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Guards } from '@utils';

import GameServer from './game-servers.model';
import GameServersService from './game-servers.service';
import { Inputs } from './utils';

@UseGuards(Guards.AuthJwt)
@Resolver()
class GameServersResolver {
    constructor(private gameServersService: GameServersService) {}

    @Mutation(() => GameServer, { nullable: true })
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
    async getAllServers() {
        return await this.gameServersService.getAllServers();
    }
}

export default GameServersResolver;
