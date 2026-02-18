import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { successHandler } from '../../utils/successHandler';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpCtx = context.switchToHttp();
        const request = httpCtx.getRequest();
        const response = httpCtx.getResponse();

        return next.handle().pipe(
            map((data) => {
                // Skip transformation for root route
                if (request.url === '/') {
                    return data;
                }

                return successHandler({
                    res: response,
                    data: data || null,
                    statusCode: response.statusCode,
                    message: 'Operation successful',
                });
            }),
        );
    }
}
