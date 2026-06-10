import { IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class MarkReadDto {
  @IsOptional()
  @IsArray({ message: 'ID列表必须是数组' })
  @ArrayNotEmpty({ message: 'ID列表不能为空' })
  ids?: number[];

  @IsOptional()
  all?: boolean;
}
