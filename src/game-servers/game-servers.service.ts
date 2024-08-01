import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Not, Repository } from 'typeorm';

import { PUB_SUB } from '../pubSub/pubSub.module';
import UsersService from '../users/users.service';

import GameServer from './game-servers.model';
import { generateServerUrl, reqDto, resDto } from './utils';

@Injectable()
class GameServersService {
    constructor(
        @InjectRepository(GameServer) private gameServersRepo: Repository<GameServer>,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
        private readonly userService: UsersService
    ) {}

    async createServer(data: reqDto.CreateServer, req: Request) {
        const user = await this.userService.getUser(req, ['ownedServers']);

        if (user.ownedServers.find((i) => i.name === data.name)) {
            throw Error('Not unique');
        }

        const hashPass = data.password ? await bcrypt.hash(data.password, 5) : '';
        const newServer = await this.gameServersRepo.create({ ...data, password: hashPass, private: !!data.password });
        user.ownedServers.push(newServer);
        await this.userService.save(user);

        return new resDto.GameServerDTO(newServer, user);
    }

    async getViewerServers(req) {
        const user = await this.userService.getUser(req, ['ownedServers']);
        console.log(user);

        return user.ownedServers;
    }

    async getAllServers(req) {
        // const viewerId = await this.userService.getId(req);
        // console.log(viewerId);

        //
        // console.log(a);
        //
        const a = await this.gameServersRepo.find({ relations: ['users'] });
        a.forEach((i) => {
            // console.log(i.name, i.users);
        });

        return a;
    }

    async getServer(id: number) {
        const server = await this.gameServersRepo.findOne({ where: { id }, relations: ['owner'] });
        // console.log(server);

        return { ...server, url: generateServerUrl(server.owner.nickname, server.name) };
    }

    async joinServer(id: number, req: Request) {
        const user = await this.userService.getUser(req, ['ownedServers']);

        // if(user.gameServers.find(i => i.id === id)){
        //
        // }

        const server = await this.gameServersRepo.findOne({ where: { id }, relations: ['users'] });
        server.users.push(user);
        // console.log(server);
        await this.gameServersRepo.save(server);

        return true;
    }
}

export default GameServersService;
