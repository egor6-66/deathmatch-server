import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Not, Repository } from 'typeorm';
import { Exceptions } from 'utils';
import { v4 as uuidv4 } from 'uuid';

import { PUB_SUB } from '../pubSub/pubSub.module';
import User from '../users/users.model';
import UsersService from '../users/users.service';

import GameServer from './game-servers.model';
import { Inputs, QueryBuilders } from './utils';

@Injectable()
class GameServersService {
    constructor(
        @InjectRepository(GameServer) private gameServersRepo: Repository<GameServer>,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
        private readonly userService: UsersService
    ) {}

    async createServer(data: Inputs.CreateServer, req: Request) {
        const user = await this.userService.getUser(req, { relations: { ownedServers: true } });

        if (user.ownedServers.find((i) => i.name === data.name)) {
            Exceptions.notUnique();
        }

        const hashPass = data.password ? await bcrypt.hash(data.password, 5) : '';
        const url = uuidv4();
        const newServer = await this.gameServersRepo.create({ ...data, password: hashPass, private: !!data.password, url });
        user.ownedServers.push(newServer);
        await this.userService.save(user);

        return { ...newServer, owner: user };
    }

    async getViewerServers(req) {
        const user = await this.userService.getUser(req, { relations: { ownedServers: { users: true } } } as any);

        return user.ownedServers;
    }

    async getAllServers(req) {
        const user = await this.userService.getUser(req);

        return await QueryBuilders.getAllServers(this.gameServersRepo, user);
    }

    async getServer(id: number) {
        return await this.gameServersRepo.findOne({ where: { id }, relations: ['owner'] });
    }

    async joinServer(id: number, req: Request) {
        const user = await this.userService.getUser(req);

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
