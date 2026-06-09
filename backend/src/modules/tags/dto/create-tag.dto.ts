import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: '标签名必须是字符串' })
  @IsNotEmpty({ message: '标签名不能为空' })
  @MaxLength(50, { message: '标签名最多50个字符' })
  name: string;

  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @MaxLength(255, { message: '描述最多255个字符' })
  description?: string;
}
