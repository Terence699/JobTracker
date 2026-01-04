# JobTracker

这是一个功能完整的全栈求职申请追踪系统，帮助求职者高效管理申请进度、面试记录和数据分析。

## ✨ 核心功能

- 📋 **看板视图** - 使用拖拽方式管理申请状态（已投递、面试中、Offer、被拒）
- 📝 **职位管理** - 记录公司信息、职位描述、薪资、地点等详细信息
- 📅 **面试记录** - 追踪面试时间、类型、笔记和反馈
- 📊 **数据分析** - 可视化投递回复率、面试转化率、投递趋势等关键指标
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

## ⚠️ 踩坑指南与解决方案 (Troubleshooting)

在项目从开发环境推向生产环境（Vercel + Cloud Run）的过程中，我们遇到并解决了一系列经典问题。以下是经验总结，供后续维护参考。

### 1. Clerk 身份验证在生产环境失效 (登录页空白/400 Host Invalid)
*   **现象**: 本地开发一切正常，部署到 Vercel 后点击登录按钮无反应，Network 请求 `/__clerk/v1/environment` 报 400 Invalid Host。
*   **原因**: Clerk 在 Production 模式下需要严格的域名配置或 Proxy。我们最初尝试在 Vercel 配置 Rewrites 代理 `/__clerk` 到 Clerk Frontend API，但因为 Cloudflare DNS 限制 (`CNAME Cross-User Banned`) 和 Vercel Serverless Function 环境变量配置不当，导致代理失败。
*   **解决方案 (最终采用)**:
    *   **回退到 Clerk Development Mode (推荐)**: 对于个人项目，直接在生产环境使用 Clerk 的 Dev Mode Keys (`pk_test_...`)。这会使用 Clerk 托管的 `accounts.dev` 域名，彻底绕过 DNS 和 Proxy 配置问题，开箱即用。
    *   **清理 Proxy 配置**: 删除了 `frontend/vercel.json` 中的 rewrites 和 `frontend/src/App.tsx` 中的 `proxyUrl` 配置，让前端直接连接 Clerk 官方 API。

### 2. GCP Cloud Run 部署失败 (Container failed to start)
*   **现象**: Cloud Run 部署后无法启动，报错 `The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable`。
*   **原因 1 (端口不匹配)**: `Dockerfile` 中写死 `EXPOSE 5000`，但 Cloud Run 默认期望监听 `8080`。
    *   *修复*: 修改 `Dockerfile` 为 `EXPOSE 8080`，并确保 `index.ts` 中使用 `process.env.PORT`。
*   **原因 2 (数据库连接失败导致进程退出)**: MongoDB Atlas 默认只允许白名单 IP 访问。Cloud Run 的 IP 是动态的，连接超时导致 Node 进程直接 `process.exit(1)`，Cloud Run 以为服务挂了。
    *   *修复*: 在 MongoDB Atlas -> Network Access 中添加 `0.0.0.0/0` (Allow from Anywhere)。

### 3. DNS 解析与 CNAME 冲突
*   **现象**: 访问 `jobtracker.top` 跳转到 Namesilo 停靠页，无法打开 Vercel 应用；配置 `clerk.jobtracker.top` CNAME 时报错 `Cross-User Banned`。
*   **原因**:
    *   **Root Domain**: 忘记在域名商处配置 `@` (Root) 的 A 记录指向 Vercel IP (`76.76.21.21`)。
    *   **Clerk CNAME**: 域名托管在 Cloudflare 时，Clerk 的默认 CNAME 目标 `frontend-api.clerk.services` 会触发 Cloudflare 的跨账号安全限制。
*   **解决方案**:
    *   在域名商处删除旧的 Parking A 记录，添加指向 Vercel 的 A 记录。
    *   Clerk 认证最终改用 Dev Mode 托管域名，避开了 CNAME 配置。

### 4. Vercel 环境变量配置错误
*   **现象**: 部署后功能异常，或者后端无法连接。
*   **教训**:
    *   **不要**在 Vercel 环境变量中给 `CLERK_SECRET_KEY` 加 `VITE_` 前缀，这会导致后端/Serverless Function 读不到 key，且可能泄露给前端。
    *   前端用的变量必须带 `VITE_`，后端用的（如 Secret Key）绝对不能带。
    *   修改环境变量后，必须 **Redeploy** 才会生效。

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

## 👤 作者

Yifu Yuan

---

**注意**: 这是一个个人项目，用于学习和实践全栈开发。在生产环境使用前，请确保：

- 配置好所有环境变量
- 设置好数据库备份策略
- 配置好错误监控和日志系统
- 进行充分的安全测试
