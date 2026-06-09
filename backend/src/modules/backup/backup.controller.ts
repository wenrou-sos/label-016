import { Controller, Post, Get, Delete, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  @Roles(UserRole.CHIEF_EDITOR)
  createBackup() {
    return this.backupService.createBackup();
  }

  @Post('restore')
  @Roles(UserRole.CHIEF_EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  restoreBackup(@UploadedFile() file?: Express.Multer.File) {
    return this.backupService.restoreBackup(file);
  }

  @Get('list')
  @Roles(UserRole.CHIEF_EDITOR)
  listBackups() {
    return this.backupService.listBackups();
  }

  @Delete(':filename')
  @Roles(UserRole.CHIEF_EDITOR)
  deleteBackup(@Param('filename') filename: string) {
    return this.backupService.deleteBackup(filename);
  }
}
