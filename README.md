# Markdown 简历生成器

一个使用 Next.js 和 Tailwind CSS 构建的现代化简历生成器应用，支持使用 Markdown 语法创建专业简历。

## 特点

- 使用 Markdown 语法轻松编辑简历内容
- 多种专业设计的简历模板
- 实时预览
- 导出为 PDF、HTML 或 Markdown 格式
- 响应式设计，支持桌面和移动设备
- 中文界面

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [React](https://reactjs.org/) - 前端库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 样式
- [Marked](https://marked.js.org/) - Markdown 解析
- [Zustand](https://github.com/pmndrs/zustand) - 状态管理

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用.

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 项目结构

```
├── public/                # 静态资源
│   └── templates/         # 模板预览图片
├── src/                   # 源代码
│   ├── app/               # Next.js App Router 路由
│   │   ├── editor/        # 编辑器页面
│   │   ├── help/          # 帮助页面
│   │   ├── templates/     # 模板选择页面
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 首页
│   ├── components/        # 组件
│   │   ├── MainNavbar.tsx # 主导航组件
│   │   └── ...            # 其他组件
│   ├── stores/            # 状态管理
│   ├── styles/            # 样式
│   ├── types/             # 类型定义
│   └── utils/             # 工具函数
└── ...                    # 配置文件等
```

## 模板

应用提供多种专业设计的简历模板:

- 现代简约
- 专业商务
- 创意设计
- 学术研究
- 极简风格
- 技术专业

## 使用指南

1. 从首页或模板库中选择一个适合的简历模板
2. 使用 Markdown 语法编辑您的简历内容
3. 实时预览效果，直到满意
4. 导出为 PDF 或其他格式

## 许可证

MIT
