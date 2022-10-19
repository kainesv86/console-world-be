import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { apiResponse } from '../common/response/apiResponse';

interface ClassConstructor {
    new (...args: any[]): object;
}

export function serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializationInterceptor(dto));
}

export class SerializationInterceptor implements NestInterceptor {
    constructor(private dto: any) {}
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((response: any) => {
                const result = plainToInstance(this.dto, response, { excludeExtraneousValues: false });
                return apiResponse.send(result, null);
            }),
        );
    }
}
