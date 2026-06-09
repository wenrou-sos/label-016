import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ManuscriptStatus } from '../../../common/enums/manuscript-status.enum';

export class UpdateStatusDto {
  @IsEnum(ManuscriptStatus, { message: '状态类型不正确' })
  status: ManuscriptStatus;

  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @MaxLength(500, { message: '备注最多500个字符' })
  remark?: string;
}
