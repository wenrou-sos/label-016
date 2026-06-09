import { IsEnum, IsString, MaxLength, IsOptional } from 'class-validator';
import { DecisionType } from '../../../common/enums/decision-type.enum';

export class DecisionManuscriptDto {
  @IsEnum(DecisionType, { message: '决策类型不正确' })
  decision: DecisionType;

  @IsOptional()
  @IsString({ message: '评语必须是字符串' })
  @MaxLength(2000, { message: '评语最多2000个字符' })
  comment?: string;
}
