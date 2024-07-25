import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientApp } from '../client-app';

import User from './users.model';
import { Inputs } from './utils';

@Injectable()
class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    async createUser(user: { nickname: string; password: string }) {
        const newUser = await this.userRepo.create({ ...user, clientApp: new ClientApp() });
        await this.userRepo.save(newUser);

        return newUser;
    }

    async getUser(data: Inputs.GetUser) {
        return await this.userRepo.findOneBy(data);
    }
}

export default UsersService;
