import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IUserCreation {
    nickname: string;
    password: string;
}

@Table({ tableName: 'user' })
@ObjectType()
class UsersModel extends Model<UsersModel, IUserCreation> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    @Field(() => Int)
    id: number;

    @Column({ type: DataType.STRING })
    @Field({ nullable: true })
    first_name: string;

    @Column({ type: DataType.STRING })
    @Field({ nullable: true })
    last_name: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    @Field()
    nickname: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    // @Field({ nullable: true })
    // settings?: Settings;
}

export default UsersModel;
