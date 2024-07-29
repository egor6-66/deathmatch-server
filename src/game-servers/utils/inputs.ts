import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateServer {
    @Field()
    @IsString()
    readonly name: string;

    @Field()
    @IsString()
    @IsOptional()
    readonly password?: string;
}
