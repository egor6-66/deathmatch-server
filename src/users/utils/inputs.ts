import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class GetUser {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    readonly nickname?: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    readonly id?: number;
}
