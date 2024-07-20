import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
    data: T;
}

@Injectable()
export class TransformResponse<T> implements NestInterceptor<T, IResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                delete data.password;

                return data;
            })
        );
    }
}
