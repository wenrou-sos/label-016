import { IsString, MaxLength, IsArray, ArrayMinSize, IsOptional } from 'class-validator';

export class UpdateManuscriptDto {
  @IsOptional()
  @IsString({ message: '标题必须是字符串' })
  @MaxLength(255, { message: '标题最多255个字符' })
  title?: string;

  @IsOptional()
  @IsString({ message: '摘要必须是字符串' })
  @MaxLength(500, { message: '摘要最多500个字符' })
  summary?: string;

  @IsOptional()
  @IsString({ message: '内容必须是字符串' })
  content?: string;

  @IsOptional()
  @IsArray({ message: '标签必须是数组' })
  @ArrayMinSize(0, { message: '标签数组不能为空' })
  tags?: string[];
}
