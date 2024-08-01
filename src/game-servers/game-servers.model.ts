import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
    @Field({ nullable: true })
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    url: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    private: boolean;

    @ManyToOne(() => User, (user) => user.ownedServers)
    @JoinColumn({ name: 'ownerId' })
    @Field(() => User)
    owner: User;

    @OneToMany(() => User, (user) => user.activeServer, { cascade: true })
    @Field(() => User)
    users: User[];
}

export default GameServer;
