import { IsInt, IsString, Min, Max, MaxLength, IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsInt({ message: '评分必须是整数' })
  @Min(1, { message: '评分最小为1' })
  @Max(5, { message: '评分最大为5' })
  score?: number;

  @IsOptional()
  @IsString({ message: '评审意见必须是字符串' })
  @MaxLength(2000, { message: '评审意见最多2000个字符' })
  comment?: string;
}
