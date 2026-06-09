import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ManuscriptStatus } from '../../../common/enums/manuscript-status.enum';

export class SearchManuscriptDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: '关键词必须是字符串' })
  keyword?: string;

  @IsOptional()
  @IsArray({ message: '标签必须是数组' })
  tags?: string[];

  @IsOptional()
  @IsEnum(ManuscriptStatus, { message: '状态类型不正确' })
  status?: ManuscriptStatus;
}
