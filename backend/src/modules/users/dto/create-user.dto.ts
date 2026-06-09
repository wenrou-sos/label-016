import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名最少3个字符' })
  @MaxLength(50, { message: '用户名最多50个字符' })
  username: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码最少6个字符' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: '角色类型不正确' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: '简介必须是字符串' })
  bio?: string;
}
