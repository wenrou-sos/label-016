import { IsInt, IsString, IsNotEmpty, IsEnum, MaxLength, IsOptional } from 'class-validator';
import { DecisionType } from '../../../common/enums/decision-type.enum';

export class CreateDecisionDto {
  @IsInt({ message: '稿件ID必须是整数' })
  @IsNotEmpty({ message: '稿件ID不能为空' })
  manuscript_id: number;

  @IsEnum(DecisionType, { message: '决策类型不正确' })
  decision: DecisionType;

  @IsOptional()
  @IsString({ message: '评语必须是字符串' })
  @MaxLength(2000, { message: '评语最多2000个字符' })
  comment?: string;
}
