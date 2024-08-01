import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import ClientApp from '../client-app/client-app.model';
import GameServer from '../game-servers/game-servers.model';

@Entity({ name: 'user' })
@ObjectType()
class User {
    @PrimaryGeneratedColumn()
    @Field(() => Int, { nullable: true })
    id: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    last_name: string;

    @Column({ unique: true })
    @Field({ nullable: true })
    nickname: string;

    @Column()
    @Field({ nullable: true })
    @Exclude()
    password: string;

    @Column({ default: false })
    @Field({ nullable: true })
    isOnline: boolean;

    @OneToOne(() => ClientApp, (ClientApp) => ClientApp, { cascade: true })
    @JoinColumn()
    @Field({ nullable: true })
    clientApp: ClientApp;

    @OneToMany(() => GameServer, (gameServer) => gameServer.owner, { cascade: true })
    @Field(() => GameServer)
    ownedServers: GameServer[];

    @ManyToOne(() => GameServer, (gameServer) => gameServer.users)
    @Field(() => GameServer)
    activeServer: GameServer;
}

export default User;
