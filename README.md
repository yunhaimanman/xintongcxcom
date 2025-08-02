# 小桐导航 - 项目部署指南

## 项目介绍
小桐导航是一个工具导航网站，提供各类在线工具的分类和快速访问功能，同时包含文章管理系统。

## 部署步骤

### 1. 环境准备

#### 必要条件
- Node.js (v14.0.0 或更高版本)
- pnpm 包管理器
- Git
- 一个Netlify账号 (https://www.netlify.com)

#### 检查环境
```bash
# 检查Node.js版本
node -v

# 检查pnpm版本
pnpm -v

# 如果没有安装pnpm，请先安装
npm install -g pnpm
```

### 2. 项目构建

#### 克隆项目 (如未克隆)
```bash
git clone <your-repository-url>
cd your-project-directory
```

#### 安装依赖
```bash
pnpm install
```

#### 本地测试
```bash
pnpm dev
```
打开浏览器访问 http://localhost:3000，确认项目能正常运行

#### 构建生产版本
```bash
pnpm build
```
构建完成后，项目根目录会生成一个 `dist` 文件夹，包含所有生产环境所需文件

### 3. Netlify部署

#### 方法一：通过Netlify网站部署

1. **登录Netlify账号**
   - 访问 https://app.netlify.com 并登录

2. **创建新项目**
   - 点击 "Add new site" -> "Import an existing project"

3. **连接到Git仓库**
   - 选择 "GitHub" (或您使用的其他Git托管平台)
   - 授权Netlify访问您的仓库
   - 选择您的项目仓库

4. **配置构建设置**
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
   - 点击 "Show advanced" -> "New variable" 添加环境变量(如有需要)
     - 不需要额外环境变量可跳过此步

5. **部署网站**
   - 点击 "Deploy site"
   - Netlify将自动开始构建和部署过程
   - 等待部署完成 (通常需要1-3分钟)

6. **访问您的网站**
   - 部署完成后，Netlify会分配一个随机域名 (如 `xxxxxx.netlify.app`)
   - 您可以点击该域名访问已部署的网站
   - 如需自定义域名，可在Netlify项目设置中进行配置

#### 方法二：使用Netlify CLI部署

1. **安装Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **登录Netlify**
```bash
netlify login
```
这将打开浏览器窗口，让您授权Netlify CLI访问您的账号

3. **初始化Netlify项目**
```bash
# 在项目根目录执行
netlify init
```
- 选择 "Create & configure a new site"
- 选择您的团队 (或创建新团队)
- 为您的网站命名 (或使用默认名称)
- 确认构建命令: `pnpm build`
- 确认发布目录: `dist`

4. **部署网站**
```bash
# 执行构建并部署
netlify deploy --prod
```
- 这将运行构建命令并部署结果
- 部署完成后，CLI将显示您的网站URL

### 4. 部署后设置

#### 配置自定义域名 (可选)
1. 在Netlify项目仪表板中，点击 "Domain settings"
2. 点击 "Add custom domain"
3. 输入您的域名 (如 `example.com`)
4. 按照Netlify提供的说明，在您的域名提供商处更新DNS设置

#### 启用HTTPS
- Netlify会自动为您的网站配置HTTPS，无需额外操作
- 首次配置自定义域名后，HTTPS证书可能需要几分钟到几小时才能生效

#### 持续部署设置
- Netlify默认启用持续部署，当您推送到连接的Git仓库时，会自动触发新的构建和部署
- 如需修改此行为，可在Netlify项目设置的 "Build & deploy" 部分进行调整

### 5. 常见问题解决

#### 构建失败
- **依赖问题**: 尝试删除 `node_modules` 和 `pnpm-lock.yaml`，然后重新安装依赖
  ```bash
  rm -rf node_modules pnpm-lock.yaml
  pnpm install
  ```
- **Node.js版本问题**: 确保使用与项目兼容的Node.js版本 (建议v16或更高)

#### 部署后网站空白或资源加载失败
- 检查浏览器控制台是否有404错误
- 确认Netlify的"Publish directory"设置为 `dist`
- 检查您的路由配置，确保使用了正确的路由模式

#### 本地构建正常但Netlify构建失败
- 检查Netlify构建日志，查看具体错误信息
- 确保所有依赖都在 `dependencies` 中 (而不是 `devDependencies`)
- 添加必要的构建环境变量

### 6. 其他部署选项

#### Vercel部署
1. 创建Vercel账号: https://vercel.com/signup
2. 安装Vercel CLI: `npm install -g vercel`
3. 在项目根目录运行: `vercel`
4. 按照提示完成部署配置

#### GitHub Pages部署
1. 安装部署工具: `pnpm add -D gh-pages`
2. 在package.json中添加脚本:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist -b gh-pages"
   }
   ```
3. 构建并部署: `pnpm build && pnpm deploy`
4. 在GitHub仓库设置中启用GitHub Pages，选择gh-pages分支
