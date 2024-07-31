import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Not, Repository } from 'typeorm';

import UsersService from '../users/users.service';

import GameServer from './game-servers.model';
import { generateServerUrl, Inputs } from './utils';

@Injectable()
class GameServersService {
    constructor(
        @InjectRepository(GameServer) private gameServersRepo: Repository<GameServer>,
        private readonly userService: UsersService
    ) {}

    async createServer(data: Inputs.CreateServer, req: Request) {
        const user = await this.userService.getViewer(req, ['gameServers']);

        if (user.gameServers.find((i) => i.name === data.name)) {
            throw Error('Not unique');
        }

        const hashPass = data.password ? await bcrypt.hash(data.password, 5) : '';
        const newServer = await this.gameServersRepo.create({ ...data, password: hashPass, private: !!data.password });
        user.gameServers.push(newServer);
        await this.userService.save(user);

        return { ...newServer, url: generateServerUrl(user.nickname, newServer.name) };
    }

    async getViewerServers(req) {
        const user = await this.userService.getViewer(req, ['gameServers']);

        return user.gameServers;
    }

    async getAllServers(req) {
        const viewerId = await this.userService.getId(req);

        return await this.gameServersRepo.find({
            where: [{ user: Not(viewerId) }],
        });
    }

    async getServer(id: number) {
        const server = await this.gameServersRepo.findOne({ where: { id }, relations: ['user'] });

        return { ...server, url: generateServerUrl(server.user.nickname, server.name) };
    }
}

export default GameServersService;
