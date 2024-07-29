import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ClientApp } from '../client-app';

@Entity({ name: 'game-server' })
@ObjectType()
class GameServer {
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
}

export default GameServer;
