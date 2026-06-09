import { IsString, IsNotEmpty, MaxLength, IsArray, ArrayMinSize, IsOptional } from 'class-validator';

export class CreateManuscriptDto {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(255, { message: '标题最多255个字符' })
  title: string;

  @IsString({ message: '摘要必须是字符串' })
  @IsNotEmpty({ message: '摘要不能为空' })
  @MaxLength(500, { message: '摘要最多500个字符' })
  summary: string;

  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @IsOptional()
  @IsArray({ message: '标签必须是数组' })
  @ArrayMinSize(0, { message: '标签数组不能为空' })
  tags?: string[];
}
