import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as xss from 'xss';

export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const sanitizedData = this.sanitizeData(data);
        return {
          code: 200,
          message: '操作成功',
          data: sanitizedData,
        };
      }),
    );
  }

  private sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return xss.filterXSS(data);
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    if (typeof data === 'object') {
      const result: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (key === 'password') {
            continue;
          }
          result[key] = this.sanitizeData(data[key]);
        }
      }
      return result;
    }

    return data;
  }
}
