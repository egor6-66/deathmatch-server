import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientApp } from '../client-app';

import User from './users.model';
import { Inputs } from './utils';

@Injectable()
class UsersService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        private jwtService: JwtService
    ) {}

    async checkUniqueNickname(nickname: string) {
        return await this.usersRepo.findOneBy({ nickname });
    }

    async createUser(user: { nickname: string; password: string }) {
        const newUser = await this.usersRepo.create({ ...user, clientApp: new ClientApp() });
        await this.usersRepo.save(newUser);

        return newUser;
    }

    async getUserBy(data: Inputs.GetUser) {
        return await this.usersRepo.findOneBy(data);
    }

    async getViewer(req, relations: ['clientApp' | 'gameServers']) {
        const data = await this.jwtService.decode(req.cookies['accessToken']);

        return await this.usersRepo.findOne({ where: { id: data.id }, relations: relations });
    }

    async getId(req) {
        const data = await this.jwtService.decode(req.cookies['accessToken']);

        return data.id;
    }

    async save(user: User) {
        await this.usersRepo.save(user);
    }
}

export default UsersService;
