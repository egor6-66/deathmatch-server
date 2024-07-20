import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Exceptions } from '@utils';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class Validation implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);

        if (errors.length) {
            const updErrors = errors.map((err) => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
            });

            throw new Exceptions.Validation(updErrors);
        }

        return value;
    }
}
