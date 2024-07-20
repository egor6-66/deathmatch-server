import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import UsersModel from './users.model';

@Injectable()
class UsersService {
    constructor(@InjectModel(UsersModel) private userRepo: typeof UsersModel) {}

    async createUser(user: { nickname: string; password: string }) {
        return await this.userRepo.create(user);
    }

    async getUserByNickname(data: { nickname?: string; id?: number }) {
        return await this.userRepo.findOne({ where: data });
    }
}

export default UsersService;
