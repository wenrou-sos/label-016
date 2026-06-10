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
        const transformedData = this.transformData(data);
        return {
          code: 200,
          message: '操作成功',
          data: transformedData,
        };
      }),
    );
  }

  private transformData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return xss.filterXSS(data);
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    if (typeof data === 'object') {
      const result: any = {};
      
      if (data.list !== undefined && data.total !== undefined) {
        result.items = this.transformData(data.list);
        result.total = data.total;
        result.page = data.page || 1;
        result.pageSize = data.pageSize || 10;
        result.totalPages = Math.ceil(data.total / (data.pageSize || 10));
        return result;
      }

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (key === 'password') {
            continue;
          }

          const camelKey = this.snakeToCamel(key);
          const mappedKey = this.mapFieldName(camelKey);
          result[mappedKey] = this.transformData(data[key]);
        }
      }
      return result;
    }

    return data;
  }

  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }

  private mapFieldName(key: string): string {
    const fieldMap: Record<string, string> = {
      'summary': 'abstract',
      'score': 'rating',
      'authorId': 'authorId',
      'editorId': 'editorId',
      'chiefEditorId': 'chiefId',
      'submittedAt': 'submittedAt',
      'reviewedAt': 'reviewedAt',
      'decidedAt': 'decidedAt',
      'publishedAt': 'publishedAt',
      'createdAt': 'createdAt',
      'updatedAt': 'updatedAt',
      'viewCount': 'views',
      'editorRating': 'editorRating',
      'editorComment': 'editorComment',
      'chiefDecision': 'chiefDecision',
      'chiefComment': 'chiefComment',
    };
    return fieldMap[key] || key;
  }
}
