import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import User from '../users/users.model';

@Entity({ name: 'game-server' })
@ObjectType()
class GameServer {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    url: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    private: boolean;

    @ManyToOne(() => User, (user) => user.gameServers)
    @Field(() => User)
    user: User;
}

export default GameServer;
