-- 杂志社投稿与审稿平台数据库设计
-- 数据库: journal_platform
-- 字符集: utf8mb4

CREATE DATABASE IF NOT EXISTS journal_platform 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE journal_platform;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('author', 'editor', 'chief_editor') NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 稿件表
CREATE TABLE IF NOT EXISTS manuscripts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    content LONGTEXT NOT NULL,
    author_id INT NOT NULL,
    status ENUM('pending', 'reviewing', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    tags JSON DEFAULT NULL,
    view_count INT DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_author_id (author_id),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_published_at (published_at),
    FULLTEXT INDEX ft_title_summary (title, summary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 审稿记录表
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manuscript_id INT NOT NULL,
    editor_id INT NOT NULL,
    score TINYINT NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manuscript_id) REFERENCES manuscripts(id) ON DELETE CASCADE,
    FOREIGN KEY (editor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_manuscript_id (manuscript_id),
    INDEX idx_editor_id (editor_id),
    INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 主编决策表
CREATE TABLE IF NOT EXISTS decisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manuscript_id INT NOT NULL UNIQUE,
    chief_editor_id INT NOT NULL,
    decision ENUM('accepted', 'rejected') NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manuscript_id) REFERENCES manuscripts(id) ON DELETE CASCADE,
    FOREIGN KEY (chief_editor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_manuscript_id (manuscript_id),
    INDEX idx_decision (decision)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 稿件历史记录表
CREATE TABLE IF NOT EXISTS manuscript_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manuscript_id INT NOT NULL,
    old_status ENUM('pending', 'reviewing', 'accepted', 'rejected') NOT NULL,
    new_status ENUM('pending', 'reviewing', 'accepted', 'rejected') NOT NULL,
    operator_id INT NOT NULL,
    remark VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manuscript_id) REFERENCES manuscripts(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_manuscript_id (manuscript_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 标签表（用于管理标签）
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入默认标签
INSERT INTO tags (name, description) VALUES 
('科技', '科技类文章'),
('文化', '文化类文章'),
('经济', '经济类文章'),
('教育', '教育类文章'),
('医学', '医学类文章'),
('艺术', '艺术类文章'),
('历史', '历史类文章'),
('社会', '社会类文章'),
('环境', '环境类文章'),
('政治', '政治类文章'),
('体育', '体育类文章'),
('文学', '文学类文章')
ON DUPLICATE KEY UPDATE name=name;

-- 备份表结构（用于数据恢复）
CREATE TABLE IF NOT EXISTS backup_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    backup_name VARCHAR(255) NOT NULL,
    backup_path VARCHAR(500) NOT NULL,
    backup_size BIGINT DEFAULT 0,
    backup_type ENUM('full', 'incremental') DEFAULT 'full',
    status ENUM('success', 'failed', 'processing') DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
