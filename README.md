# JobTracker

这是一个功能完整的全栈求职申请追踪系统，帮助求职者高效管理申请进度、面试记录和数据分析。

## ✨ 核心功能

- 📋 **看板视图** - 使用拖拽方式管理申请状态（已投递、面试中、Offer、被拒）
- 📝 **职位管理** - 记录公司信息、职位描述、薪资、地点等详细信息
- 📅 **面试记录** - 追踪面试时间、类型、笔记和反馈
- 📊 **数据分析** - 可视化投递回复率、面试转化率、投递趋势等关键指标
- 🔔 **双重提醒** - 邮件提醒 + 应用内通知，不错过重要事项
- 🌐 **双语支持** - 完整的中英文界面切换
- 🎨 **主题切换** - 支持深色/浅色主题

## 🛠️ 技术栈

### 前端

- **React 19.2.3** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Tailwind CSS** + **shadcn/ui** - 美观的 UI 组件库
- **dnd-kit** - 拖拽交互库
- **React Router v7** - 路由管理
- **TanStack Query** - 数据获取和缓存
- **Zustand** - 轻量级状态管理
- **react-i18next** - 国际化支持
- **Clerk** - 用户认证
- **Recharts** - 数据可视化

### 后端

- **Node.js** + **Express** + **TypeScript** - RESTful API 服务
- **MongoDB** + **Mongoose** - 数据库和 ODM
- **Clerk SDK** - 后端认证验证
- **Resend** - 邮件发送服务
- **node-cron** - 定时任务（提醒系统）
- **Zod** - 数据验证

### 部署

- **前端**: Vercel
- **后端**: Google Cloud Platform (Cloud Run)
- **数据库**: MongoDB Atlas

## 📁 项目结构

```
job-app-tracker/
├── frontend/                 # React 前端应用
│   ├── src/
│   │   ├── components/      # React 组件
│   │   │   ├── ui/          # shadcn/ui 基础组件
│   │   │   ├── kanban/      # 看板相关组件
│   │   │   ├── jobs/        # 职位管理组件
│   │   │   ├── layout/      # 布局组件
│   │   │   └── auth/        # 认证相关组件
│   │   ├── pages/           # 页面组件
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── services/        # API 服务
│   │   ├── lib/             # 工具函数和配置
│   │   └── locales/         # 国际化翻译文件
│   │       ├── en/
│   │       └── zh/
│   └── package.json
│
├── backend/                 # Express 后端服务
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # Mongoose 数据模型
│   │   ├── routes/          # API 路由
│   │   ├── middleware/      # 中间件（认证等）
│   │   └── lib/             # 工具函数和数据库连接
│   ├── Dockerfile           # Docker 配置
│   └── package.json
│
└── README.md
```

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn
- MongoDB Atlas 账户（或本地 MongoDB）
- Clerk 账户（用于认证）
- Resend 账户（用于邮件服务，可选）

### 安装步骤

1. **克隆仓库**

```bash
git clone <repository-url>
cd job-app-tracker
```

2. **安装依赖**

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. **配置环境变量**

**后端** (`backend/.env`):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key  # 可选，用于邮件提醒
```

**前端** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. **启动开发服务器**

```bash
# 启动后端（在 backend 目录）
npm run dev

# 启动前端（在 frontend 目录，新终端）
npm run dev
```

前端将在 `http://localhost:5173` 运行，后端在 `http://localhost:5000` 运行。

## 📚 API 文档

### 职位管理 (`/api/jobs`)

- `GET /api/jobs` - 获取用户所有职位
- `POST /api/jobs` - 创建新职位
- `PUT /api/jobs/:id` - 更新职位信息
- `PATCH /api/jobs/:id/status` - 更新职位状态（拖拽时使用）
- `POST /api/jobs/:id/interview` - 添加面试记录
- `DELETE /api/jobs/:id` - 删除职位

### 数据分析 (`/api/analytics`)

- `GET /api/analytics/stats` - 获取统计数据（回复率、转化率等）

所有 API 端点都需要通过 Clerk 认证。

## 🗄️ 数据模型

### Job Schema

```typescript
{
  userId: string;              // Clerk 用户 ID
  companyName: string;         // 公司名称
  position: string;            // 职位名称
  jobUrl?: string;             // 职位链接
  jobDescription?: string;     // 职位描述
  status: "applied" | "interviewing" | "offer" | "rejected";
  appliedDate: Date;           // 投递日期
  salary?: string;             // 薪资
  location?: string;           // 地点
  contactInfo?: {              // HR 联系方式
    hrName?: string;
    hrEmail?: string;
    hrPhone?: string;
  };
  interviews?: [{              // 面试记录
    date: Date;
    type: string;
    notes?: string;
    feedback?: string;
  }];
  notes?: string;              // 备注
  tags?: string[];            // 标签
  createdAt: Date;
  updatedAt: Date;
}
```

## 🌍 国际化

项目支持中英文双语切换。翻译文件位于：

- `frontend/src/locales/en/translation.json` - 英文
- `frontend/src/locales/zh/translation.json` - 中文

用户的语言偏好会保存在 localStorage 中。

## 🐳 Docker 部署

### 构建后端镜像

```bash
cd backend
docker build -t job-tracker-backend .
docker run -p 5000:5000 --env-file .env job-tracker-backend
```

## 📦 构建生产版本

### 前端

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist` 目录，可直接部署到 Vercel。

### 后端

```bash
cd backend
npm run build
```

编译后的 JavaScript 文件在 `backend/dist` 目录。

## 🔒 环境变量说明

### 后端必需变量

- `MONGODB_URI` - MongoDB 连接字符串
- `CLERK_SECRET_KEY` - Clerk 后端密钥
- `FRONTEND_URL` - 前端 URL（用于 CORS）

### 后端可选变量

- `RESEND_API_KEY` - Resend API 密钥（用于邮件提醒功能）
- `PORT` - 服务器端口（默认 5000）

### 前端必需变量

- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk 前端公钥
- `VITE_API_URL` - 后端 API URL

## 👤 作者

Yifu Yuan

---

**注意**: 这是一个个人项目，用于学习和实践全栈开发。在生产环境使用前，请确保：

- 配置好所有环境变量
- 设置好数据库备份策略
- 配置好错误监控和日志系统
- 进行充分的安全测试
