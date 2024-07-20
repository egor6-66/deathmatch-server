import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class Auth {
    @Field()
    @IsString()
    readonly nickname: string;

    @Field()
    @IsString()
    @Length(5, 100000)
    @IsNotEmpty()
    readonly password: string;
}
