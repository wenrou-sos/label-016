# 杂志社投稿与编辑审稿平台

一个功能完整的期刊稿件管理系统，实现作者、编辑和主编三个角色的协同工作流程。

## ✨ 功能特性

### 🎯 核心功能

| 角色 | 功能模块 | 主要功能 |
|------|----------|----------|
| **作者** | 账号管理 | 注册、登录、个人信息 |
| | 稿件管理 | 提交稿件（Markdown编辑器）、查看我的稿件、状态追踪 |
| | 历史记录 | 查看审核历史、各阶段意见 |
| **编辑** | 审稿工作台 | 待审稿件列表、按标签筛选 |
| | 审稿操作 | 查看稿件详情、1-5分评分、富文本审稿意见 |
| **主编** | 终审工作台 | 待终审稿件列表、查看编辑评分和意见 |
| | 最终决策 | 录用/退稿决策、富文本评语 |
| **公开** | 稿件展示 | 已发布稿件列表、搜索、标签筛选 |
| | 详情阅读 | Markdown正文渲染、作者信息、浏览量统计 |

### 🛡️ 安全特性

- ✅ **JWT认证**：无状态身份验证，Token有效期24小时
- ✅ **角色权限控制**：细粒度的角色守卫，确保数据隔离
- ✅ **密码加密**：bcrypt加密存储，saltRounds=10
- ✅ **防SQL注入**：TypeORM参数化查询 + class-validator参数验证
- ✅ **XSS防护**：输出内容自动转义
- ✅ **Helmet安全头**：14项安全响应头
- ✅ **接口限流**：登录1分钟5次，其他接口1分钟100次
- ✅ **CORS配置**：跨域安全控制
- ✅ **操作二次确认**：重要操作弹窗确认

### ⚡ 性能优化

- ✅ **数据库索引优化**：常用查询字段建立索引，全文搜索支持
- ✅ **Gzip压缩**：Nginx启用静态资源压缩
- ✅ **缓存策略**：静态资源长期缓存（1年）
- ✅ **分页查询**：列表接口统一分页，避免大数据量返回
- ✅ **懒加载**：路由级代码分割
- ✅ **首屏优化**：目标加载时间 < 2秒
- ✅ **10万级数据支持**：优化查询，确保大数据量下响应流畅

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.x | 前端框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Naive UI | 2.x | UI组件库 |
| Vue Router | 4.x | 路由管理 |
| Pinia | 2.x | 状态管理 |
| Axios | 1.x | HTTP请求 |
| @kangc/v-md-editor | 2.x | Markdown编辑器 |
| marked | 12.x | Markdown渲染 |
| highlight.js | 11.x | 代码高亮 |
| nprogress | 0.2.x | 页面加载进度 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| NestJS | 10.x | 后端框架 |
| TypeScript | 5.x | 类型安全 |
| TypeORM | 0.3.x | ORM框架 |
| MySQL | 8.0 | 数据库 |
| JWT | 9.x | 身份认证 |
| Passport | 0.7.x | 认证中间件 |
| bcrypt | 5.x | 密码加密 |
| class-validator | 0.14.x | 参数验证 |
| Helmet | 7.x | 安全头 |
| express-rate-limit | 7.x | 接口限流 |

## 📁 项目结构

```
journal-platform/
├── backend/                    # 后端NestJS项目
│   ├── src/
│   │   ├── common/            # 公共模块
│   │   │   ├── decorators/    # 装饰器（Roles, CurrentUser）
│   │   │   ├── enums/         # 枚举定义
│   │   │   ├── guards/        # 守卫（JWT, Roles）
│   │   │   ├── interceptors/  # 拦截器（响应转换）
│   │   │   ├── filters/       # 过滤器（异常处理）
│   │   │   ├── strategies/    # 认证策略
│   │   │   └── dto/           # 公共DTO
│   │   ├── config/            # 配置文件
│   │   ├── entities/          # 数据库实体
│   │   └── modules/           # 业务模块
│   │       ├── auth/          # 认证模块
│   │       ├── users/         # 用户模块
│   │       ├── manuscripts/   # 稿件模块
│   │       ├── reviews/       # 审稿模块
│   │       ├── decisions/     # 决策模块
│   │       ├── tags/          # 标签模块
│   │       └── backup/        # 备份模块
│   ├── .env                   # 环境配置
│   ├── Dockerfile             # Docker配置
│   └── package.json
├── frontend/                   # 前端Vue3项目
│   ├── src/
│   │   ├── api/               # API接口封装
│   │   ├── stores/            # Pinia状态管理
│   │   ├── router/            # 路由配置
│   │   ├── views/             # 页面组件
│   │   │   ├── author/        # 作者模块
│   │   │   ├── editor/        # 编辑模块
│   │   │   └── chief/         # 主编模块
│   │   ├── components/        # 公共组件
│   │   ├── types/             # TypeScript类型
│   │   ├── utils/             # 工具函数
│   │   └── styles/            # 全局样式
│   ├── nginx.conf             # Nginx配置
│   ├── Dockerfile             # Docker配置
│   └── package.json
├── database/                   # 数据库脚本
│   └── schema.sql             # 表结构初始化脚本
├── docker-compose.yml         # Docker Compose配置
├── package.json               # 根项目脚本
└── README.md                  # 项目文档
```

## 🗄️ 数据库设计

### 核心数据表

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| **users** | 用户表 | id, username, email, password, role(author/editor/chief_editor) |
| **manuscripts** | 稿件表 | id, title, summary(500字), content, author_id, status, tags(JSON), view_count |
| **reviews** | 审稿记录表 | id, manuscript_id, editor_id, score(1-5), comment |
| **decisions** | 主编决策表 | id, manuscript_id, chief_editor_id, decision(accepted/rejected), comment |
| **manuscript_history** | 历史记录表 | id, manuscript_id, old_status, new_status, operator_id, remark |
| **tags** | 标签表 | id, name, description |

### 状态流转

```
待审(pending) → 审核中(reviewing) → 已录用(accepted) / 已退稿(rejected)
     ↑                ↑                    ↑
  作者提交         编辑开始审稿          主编终审决策
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0
- Docker（可选，推荐）

### 方式一：Docker一键部署（推荐）

```bash
# 1. 克隆项目
git clone <repository-url>
cd label-016

# 2. 一键启动所有服务
npm run docker:build
npm run docker:up

# 3. 访问应用
# 前端: http://localhost
# 后端API: http://localhost:3000
# 数据库: localhost:3306 (root/password)
```

### 方式二：本地开发部署

#### 1. 数据库初始化

```bash
# 确保MySQL已启动，密码为password
mysql -u root -ppassword < database/schema.sql
```

#### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前后端依赖
npm run install:all
```

#### 3. 启动开发服务

```bash
# 方式1：同时启动前后端
npm run dev

# 方式2：分别启动
# 后端（端口3000）
npm run dev:backend

# 前端（端口5173）
npm run dev:frontend
```

#### 4. 访问应用

- 前端: http://localhost:5173
- 后端API: http://localhost:3000/api
- API文档: http://localhost:3000/api

### 生产构建

```bash
# 构建前后端
npm run build

# 启动生产服务
npm run start
```

## 🔌 API 接口文档

### 认证接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/auth/register` | 公开 | 用户注册 |
| POST | `/api/auth/login` | 公开 | 用户登录 |
| GET | `/api/auth/me` | 已登录 | 获取当前用户信息 |

### 稿件接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/manuscripts` | 已登录 | 稿件列表（按角色过滤） |
| POST | `/api/manuscripts` | 作者 | 提交稿件 |
| GET | `/api/manuscripts/published` | 公开 | 已发布稿件列表（支持搜索/筛选） |
| GET | `/api/manuscripts/published/:id` | 公开 | 公开稿件详情（浏览量+1） |
| GET | `/api/manuscripts/:id` | 已登录 | 稿件详情 |
| POST | `/api/manuscripts/:id/review` | 编辑 | 编辑审稿（评分+意见） |
| POST | `/api/manuscripts/:id/decision` | 主编 | 主编终审决策 |
| GET | `/api/manuscripts/:id/history` | 已登录 | 稿件历史记录 |

### 其他接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/tags` | 公开 | 获取所有标签 |
| POST | `/api/backup/create` | 主编 | 创建数据备份 |
| POST | `/api/backup/restore` | 主编 | 恢复数据备份 |

### 请求示例

**注册**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "author1",
    "email": "author1@example.com",
    "password": "123456",
    "role": "author"
  }'
```

**登录**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author1@example.com",
    "password": "123456"
  }'

# 返回: { "code": 200, "message": "success", "data": { "token": "eyJhbG..." } }
```

**提交稿件（需要Author角色）**
```bash
curl -X POST http://localhost:3000/api/manuscripts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "人工智能在医疗领域的应用研究",
    "summary": "本文探讨了人工智能技术在医疗影像诊断、药物研发、健康管理等领域的最新应用进展...",
    "content": "# 引言\n\n人工智能(AI)正在深刻改变医疗行业...",
    "tags": ["科技", "医学"]
  }'
```

## 🎨 界面预览

### 角色工作台

| 角色 | 工作台入口 | 主要功能 |
|------|------------|----------|
| 作者 | `/author` | 提交稿件、查看我的稿件、审核追踪 |
| 编辑 | `/editor` | 待审稿件列表、审稿评分、提交意见 |
| 主编 | `/chief` | 终审列表、查看编辑意见、最终决策 |

### 标签列表

系统预设12个标签：
`科技`、`文化`、`经济`、`教育`、`医学`、`艺术`、`历史`、`社会`、`环境`、`政治`、`体育`、`文学`

## 🔧 常用命令

### 项目管理

```bash
# 安装所有依赖
npm run install:all

# 开发模式（同时启动前后端）
npm run dev

# 生产构建
npm run build

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 测试
npm run test
```

### Docker管理

```bash
# 构建镜像
npm run docker:build

# 启动容器
npm run docker:up

# 停止容器
npm run docker:down

# 查看日志
docker-compose logs -f
```

### 数据库管理

```bash
# 初始化数据库
npm run db:init

# 备份数据库（后端服务内执行）
# 调用 /api/backup/create 接口

# 恢复数据库
# 调用 /api/backup/restore 接口
```

## 🔐 安全建议

1. **修改默认密码**：生产环境务必修改MySQL root密码和JWT密钥
2. **HTTPS配置**：生产环境启用HTTPS，配置SSL证书
3. **定期备份**：配置自动备份策略，定期备份数据库
4. **日志审计**：开启操作日志，记录敏感操作
5. **网络隔离**：数据库不对外暴露端口，使用内网访问
6. **依赖更新**：定期更新依赖包，修复安全漏洞

## 📈 扩展规划

- [ ] 在线实时通知系统（WebSocket）
- [ ] 稿件版本管理与对比
- [ ] 多轮审稿机制
- [ ] 专家推荐系统
- [ ] 数据统计与可视化报表
- [ ] 移动端适配与小程序
- [ ] 多语言国际化
- [ ] 论文格式自动检测
- [ ] 参考文献管理
- [ ] 一键导出PDF/Word

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 技术支持

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件: support@journal-platform.com

---

**🎉 感谢使用本系统！如果对您有帮助，请给个 Star 支持一下。**
