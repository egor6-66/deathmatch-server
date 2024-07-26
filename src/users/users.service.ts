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
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService
    ) {}

    async checkUniqueNickname(nickname: string) {
        return await this.userRepo.findOneBy({ nickname });
    }

    async createUser(user: { nickname: string; password: string }) {
        const newUser = await this.userRepo.create({ ...user, clientApp: new ClientApp() });
        await this.userRepo.save(newUser);

        return newUser;
    }

    async getUserBy(data: Inputs.GetUser) {
        return await this.userRepo.findOneBy(data);
    }

    async getViewer(req) {
        const data = await this.jwtService.decode(req.cookies['accessToken']);

        return await this.userRepo.findOne({ where: { id: data.id }, relations: ['clientApp'] });
    }
}

export default UsersService;
