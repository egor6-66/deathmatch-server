import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Guards } from '@utils';

import AuthService from './auth.service';
import { Inputs } from './utils';

@Resolver()
class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => Boolean)
    async registration(@Args('data') data: Inputs.Auth, @Context() context: any) {
        return !!(await this.authService.registration(data, context.res));
    }

    @UseGuards(Guards.AuthLocal)
    @Mutation(() => Boolean)
    async login(@Args('data') data: Inputs.Auth, @Context() context: any) {
        return !!(await this.authService.login(data, context.res));
    }

    @Query(() => Boolean)
    async logout(@Context() context: any) {
        return !!(await this.authService.logout(context.res, context.req));
    }

    @UseGuards(Guards.RefreshJwt)
    @Query(() => Boolean)
    async refreshToken(@Context() context: any) {
        return !!(await this.authService.refreshToken(context.req.cookies.refreshToken, context.res));
    }
}

export default AuthResolver;
