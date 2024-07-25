import { Args, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';

import UsersModel from './users.model';
import UsersService from './users.service';
import { Inputs } from './utils';

// @UseGuards(Guards.AuthJwt)

@Resolver()
class UsersResolver {
    constructor(private userService: UsersService) {}

    @Query(() => UsersModel, { nullable: true, name: 'user' })
    async getUser(@Args('data') data: Inputs.GetUser) {
        return await this.userService.getUser(data);
    }

    // @Mutation(() => UsersModel, { nullable: true })
    // async updSettings(@Args('data') theme: string) {
    //     return await this.userService.setTheme(theme);
    // }
}

export default UsersResolver;
