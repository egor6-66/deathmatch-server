import { UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { Guards } from '@utils';

import UsersModel from './users.model';
import UsersService from './users.service';

@Resolver()
class UsersResolver {
    constructor(private userService: UsersService) {}

    // @UseGuards(Guards.AuthJwt)
    @Query(() => UsersModel, { nullable: true, name: 'viewer' })
    async getViewer(@Context() context: any) {
        return await this.userService.getViewer(context.req, ['clientApp']);
    }

    @Query(() => Boolean, { nullable: true, name: 'uniqueNickname' })
    async checkUniqueNickname(@Args('nickname') nickname: string) {
        return !(await this.userService.checkUniqueNickname(nickname));
    }
}

export default UsersResolver;
