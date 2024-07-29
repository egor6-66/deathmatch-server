import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import UsersService from '../users/users.service';

import GameServer from './game-servers.model';
import { Inputs } from './utils';

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

        return newServer;
    }

    async getViewerServers(req) {
        const user = await this.userService.getViewer(req, ['gameServers']);

        return user.gameServers;
    }

    async getAllServers() {
        return await this.gameServersRepo.find();
    }
}

export default GameServersService;
