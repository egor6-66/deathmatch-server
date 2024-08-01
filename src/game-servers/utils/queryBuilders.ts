import { Not, Repository } from 'typeorm';

import User from '../../users/users.model';
import GameServer from '../game-servers.model';

class QueryBuilders {
    private readonly serverFields = ['id', 'name', 'private', 'url'];

    private readonly userFields = ['id', 'nickname'];

    async getAllServers(gameServersRepo: Repository<GameServer>, user: User) {
        const mapper = (arr: string[], entity: string) => arr.map((i) => `${entity}.${i}`);

        return gameServersRepo
            .createQueryBuilder()
            .loadRelationCountAndMap('GameServer.usersCount', 'GameServer.users', 'user', (qb) => qb.where('user IS NULL'))
            .leftJoinAndSelect('GameServer.owner', 'User')
            .select([...mapper(this.serverFields, 'GameServer'), ...mapper(this.userFields, 'User')])
            .where({ owner: Not(user.id) })
            .getMany();
    }
}

export default new QueryBuilders();
