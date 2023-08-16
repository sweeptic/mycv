import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";

interface ClassConstructor {
    new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) { }

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
        // console.log('Im running before the handler', context);

        return handler.handle().pipe(
            map((data: any) => {
                // run something before the response is sent out
                // console.log('Im running before response is sent out', data);
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )

    }
}