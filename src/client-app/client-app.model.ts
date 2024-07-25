import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clientApp' })
@ObjectType()
class ClientApp {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ default: 'eng' })
    @Field({ nullable: true, defaultValue: 'eng' })
    lang: string;

    @Column({ default: 'blood' })
    @Field({ nullable: true, defaultValue: 'blood' })
    theme: string;
}

export default ClientApp;
