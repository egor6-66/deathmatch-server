import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { ClientApp } from '../client-app';

import User from './users.model';
import { UserDto } from './utils';

@Injectable()
class UsersService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        private jwtService: JwtService
    ) {}

    async createUser(user: { nickname: string; password: string }) {
        const newUser = await this.usersRepo.create({ ...user, clientApp: new ClientApp() });
        await this.usersRepo.save(newUser);

        return newUser;
    }

    async getUserBy(data: UserDto.GetUser) {
        return await this.usersRepo.findOneBy(data);
    }

    async getUser(req: Request, relations?: ['clientApp' | 'ownedServers']) {
        const data = await this.jwtService.decode(req.cookies['accessToken']);

        return await this.usersRepo.findOne({ where: { id: data.id }, relations: relations });
    }

    async save(user: User) {
        await this.usersRepo.save(user);
    }
}

export default UsersService;
