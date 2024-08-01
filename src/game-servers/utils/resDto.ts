import { OmitType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

import User from '../../users/users.model';
import GameServer from '../game-servers.model';

import generateServerUrl from './generateServerUrl';

class BaseGameServer extends OmitType(GameServer, ['owner'] as const) {
    owner: Partial<User>;

    constructor(server: GameServer, user: User) {
        super(null, null);
        Object.entries(server).forEach(([key, val]) => {
            if (key === 'url') {
                return (this[key] = generateServerUrl(user.nickname, server.name));
            }

            this[key] = val;
        });

        this.owner = {
            id: user.id,
            nickname: user.nickname,
        };
    }
}

export class GameServerDTO extends BaseGameServer {
    @Exclude()
    password: string;

    constructor(server: GameServer, user: User) {
        super(server, user);
        delete this.password;
    }
}
