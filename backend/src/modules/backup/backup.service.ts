import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { exec } from 'child_process';
import { User } from '../../entities/user.entity';
import { Manuscript } from '../../entities/manuscript.entity';
import { Review } from '../../entities/review.entity';
import { Decision } from '../../entities/decision.entity';
import { ManuscriptHistory } from '../../entities/manuscript-history.entity';
import { Tag } from '../../entities/tag.entity';

const execAsync = util.promisify(exec);

@Injectable()
export class BackupService {
  private backupDir = path.join(process.cwd(), 'backups');

  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Manuscript)
    private manuscriptRepository: Repository<Manuscript>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Decision)
    private decisionRepository: Repository<Decision>,
    @InjectRepository(ManuscriptHistory)
    private historyRepository: Repository<ManuscriptHistory>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.json`;
    const backupFilePath = path.join(this.backupDir, backupFileName);

    try {
      const [users, manuscripts, reviews, decisions, histories, tags] = await Promise.all([
        this.userRepository.find(),
        this.manuscriptRepository.find(),
        this.reviewRepository.find(),
        this.decisionRepository.find(),
        this.historyRepository.find(),
        this.tagRepository.find(),
      ]);

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          users,
          manuscripts,
          reviews,
          decisions,
          manuscript_histories: histories,
          tags,
        },
      };

      fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');

      return {
        message: '备份创建成功',
        filename: backupFileName,
        filepath: backupFilePath,
        size: fs.statSync(backupFilePath).size,
        timestamp: backupData.timestamp,
      };
    } catch (error) {
      if (fs.existsSync(backupFilePath)) {
        fs.unlinkSync(backupFilePath);
      }
      throw new InternalServerErrorException('备份创建失败: ' + error.message);
    }
  }

  async restoreBackup(file?: Express.Multer.File) {
    let backupData: any;

    try {
      if (file) {
        backupData = JSON.parse(file.buffer.toString('utf8'));
      } else {
        const files = fs.readdirSync(this.backupDir)
          .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
          .sort()
          .reverse();

        if (files.length === 0) {
          throw new BadRequestException('没有找到备份文件');
        }

        const latestBackup = files[0];
        const backupFilePath = path.join(this.backupDir, latestBackup);
        backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
      }

      if (!backupData.data) {
        throw new BadRequestException('备份文件格式不正确');
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');

        await queryRunner.query('TRUNCATE TABLE manuscript_histories');
        await queryRunner.query('TRUNCATE TABLE reviews');
        await queryRunner.query('TRUNCATE TABLE decisions');
        await queryRunner.query('TRUNCATE TABLE manuscripts');
        await queryRunner.query('TRUNCATE TABLE users');
        await queryRunner.query('TRUNCATE TABLE tags');

        if (backupData.data.tags && backupData.data.tags.length > 0) {
          await queryRunner.manager.save(Tag, backupData.data.tags);
        }

        if (backupData.data.users && backupData.data.users.length > 0) {
          await queryRunner.manager.save(User, backupData.data.users);
        }

        if (backupData.data.manuscripts && backupData.data.manuscripts.length > 0) {
          await queryRunner.manager.save(Manuscript, backupData.data.manuscripts);
        }

        if (backupData.data.reviews && backupData.data.reviews.length > 0) {
          await queryRunner.manager.save(Review, backupData.data.reviews);
        }

        if (backupData.data.decisions && backupData.data.decisions.length > 0) {
          await queryRunner.manager.save(Decision, backupData.data.decisions);
        }

        if (backupData.data.manuscript_histories && backupData.data.manuscript_histories.length > 0) {
          await queryRunner.manager.save(ManuscriptHistory, backupData.data.manuscript_histories);
        }

        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
        await queryRunner.commitTransaction();

        return {
          message: '数据恢复成功',
          timestamp: backupData.timestamp,
          restored: {
            users: backupData.data.users?.length || 0,
            manuscripts: backupData.data.manuscripts?.length || 0,
            reviews: backupData.data.reviews?.length || 0,
            decisions: backupData.data.decisions?.length || 0,
            manuscript_histories: backupData.data.manuscript_histories?.length || 0,
            tags: backupData.data.tags?.length || 0,
          },
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('数据恢复失败: ' + error.message);
    }
  }

  async listBackups() {
    if (!fs.existsSync(this.backupDir)) {
      return [];
    }

    const files = fs.readdirSync(this.backupDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .sort()
      .reverse();

    const result = files.map(file => {
      const filePath = path.join(this.backupDir, file);
      const stat = fs.statSync(filePath);
      return {
        filename: file,
        size: stat.size,
        created_at: stat.birthtime,
        modified_at: stat.mtime,
      };
    });

    return result;
  }

  async deleteBackup(filename: string) {
    const filePath = path.join(this.backupDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('备份文件不存在');
    }

    if (!filename.startsWith('backup-') || !filename.endsWith('.json')) {
      throw new BadRequestException('无效的备份文件名');
    }

    fs.unlinkSync(filePath);

    return { message: '备份文件删除成功' };
  }
}
