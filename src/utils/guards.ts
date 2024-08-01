import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Exceptions } from 'utils';

@Injectable()
export class AuthLocal extends AuthGuard('local') {
    constructor() {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        req.body.username = req.body.variables.nickname;
        req.body.password = req.body.variables.password;

        try {
            return (await super.canActivate(context)) as boolean;
        } catch (e) {
            Exceptions.unauthorized();
        }
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);

        return ctx.getContext().req;
    }
}

@Injectable()
export class AuthJwt extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req, res } = ctx.getContext();
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (accessToken) {
            req.headers.authorization = `Bearer ${accessToken}`;
        }

        try {
            return (await super.canActivate(context)) as boolean;
        } catch (e) {
            if (!refreshToken) {
                res.clearCookie('accessToken', req.cookies['accessToken']);
            }

            Exceptions.unauthorized();
        }
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);

        return ctx.getContext().req;
    }
}

@Injectable()
export class RefreshJwt extends AuthGuard('jwt-refresh') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req, res } = ctx.getContext();
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            req.body.refresh = refreshToken;
        }

        try {
            return (await super.canActivate(context)) as boolean;
        } catch (e) {
            res.clearCookie('accessToken', req.cookies['accessToken']);
            res.clearCookie('refreshToken', req.cookies['refreshToken']);
            Exceptions.unauthorized();
        }
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);

        return ctx.getContext().req;
    }
}
