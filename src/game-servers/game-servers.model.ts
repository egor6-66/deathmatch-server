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

    @Column({ select: false })
    @Field({ nullable: true })
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    url: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    private: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    usersCount: number;

    @ManyToOne(() => User, (user) => user.ownedServers)
    @JoinColumn({ name: 'owner' })
    @Field(() => User)
    owner: User;

    @OneToMany(() => User, (user) => user.activeServer, { cascade: true, nullable: true })
    @Field(() => User)
    users: User[];
}

export default GameServer;
