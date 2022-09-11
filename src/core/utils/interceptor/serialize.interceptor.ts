import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { plainToInstance, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { apiResponse } from 'src/core/common/response/apiResponse';
import { User } from 'src/core/models';

interface ClassConstructor {
    new (...args: any[]): object;
}

export function serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                console.log(data);
                const result = plainToClass(this.dto, data, { excludeExtraneousValues: false });
                return apiResponse.send(result, null);
            }),
        );
    }
}
