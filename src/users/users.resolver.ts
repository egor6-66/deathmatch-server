import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Guards } from '@utils';

import User from './users.model';
import UsersService from './users.service';

@UseGuards(Guards.AuthJwt)
@Resolver(() => User)
class UsersResolver {
    constructor(private userService: UsersService) {}

    @Query(() => User, { nullable: true })
    getUserById(@Args('id', { type: () => Int }) id: number) {
        return {
            id: 1,
            name: 'wd',
        };
    }

    @Query(() => [User])
    getUsers() {
        return [];
    }
}

export default UsersResolver;
