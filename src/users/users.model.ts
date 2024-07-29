import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import ClientApp from '../client-app/client-app.model';
import GameServer from '../game-servers/game-servers.model';

@Entity({ name: 'user' })
@ObjectType()
class User {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    last_name: string;

    @Column({ unique: true })
    @Field()
    nickname: string;

    @Column()
    password: string;

    @OneToOne(() => ClientApp, (ClientApp) => ClientApp, { cascade: true })
    @JoinColumn()
    @Field({ nullable: true })
    clientApp: ClientApp;

    @OneToMany(() => GameServer, (gameServer) => gameServer.user, { cascade: true })
    @Field(() => GameServer)
    gameServers: GameServer[];
}

export default User;
