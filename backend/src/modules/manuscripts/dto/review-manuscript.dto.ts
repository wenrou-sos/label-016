import { IsInt, IsString, IsNotEmpty, Min, Max, MaxLength } from 'class-validator';

export class ReviewManuscriptDto {
  @IsInt({ message: '评分必须是整数' })
  @Min(1, { message: '评分最小为1' })
  @Max(5, { message: '评分最大为5' })
  score: number;

  @IsString({ message: '评审意见必须是字符串' })
  @IsNotEmpty({ message: '评审意见不能为空' })
  @MaxLength(2000, { message: '评审意见最多2000个字符' })
  comment: string;
}
