import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Not, Repository } from 'typeorm';
import { Exceptions } from 'utils';
import { v4 as uuidv4 } from 'uuid';

import { PUB_SUB } from '../pubSub/pubSub.module';
import UsersService from '../users/users.service';

import GameServer from './game-servers.model';
import { Inputs } from './utils';

@Injectable()
class GameServersService {
    constructor(
        @InjectRepository(GameServer) private gameServersRepo: Repository<GameServer>,
        @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
        private readonly userService: UsersService
    ) {}

    async createServer(data: Inputs.CreateServer, req: Request) {
        const user = await this.userService.getUser(req, { relations: { ownedServers: true } });

        if (user.ownedServers.length > 30) {
            Exceptions.maxCount();
        }

        if (user.ownedServers.find((i) => i.name === data.name)) {
            Exceptions.notUnique();
        }

        const hashPass = data.password ? await bcrypt.hash(data.password, 5) : '';
        const newServer = await this.gameServersRepo.create({ ...data, password: hashPass, private: !!data.password, url: uuidv4() });
        user.ownedServers.push(newServer);
        await this.userService.save(user);

        return { ...newServer, owner: user };
    }

    async getViewerServers(req) {
        const id = await this.userService.getId(req);

        return await this.gameServersRepo
            .createQueryBuilder()
            .loadRelationCountAndMap('GameServer.usersCount', 'GameServer.users')
            .where({ owner: { id } })
            .getMany();
    }

    async getAllServers(req) {
        const user = await this.userService.getUser(req);

        return await this.gameServersRepo
            .createQueryBuilder()
            .loadRelationCountAndMap('GameServer.usersCount', 'GameServer.users')
            .leftJoinAndSelect('GameServer.owner', 'User')
            .where({ owner: Not(user.id) })
            .getMany();
    }

    async getServer(id: number) {
        return await this.gameServersRepo.findOne({ where: { id }, relations: ['owner', 'users'] });
    }

    async joinServer(id: number, req: Request) {
        const user = await this.userService.getUser(req);

        try {
            await this.gameServersRepo.createQueryBuilder().relation(GameServer, 'users').of(id).add(user);

            return true;
        } catch (e) {
            Exceptions.serverError();
        }
    }
}

export default GameServersService;
