# 简历生成器

这是一个基于 Next.js 的简历生成器应用，支持静态部署。

## 功能特点

- 支持 Markdown 和普通模式编辑简历
- 支持自定义主题颜色
- 支持导出为 PDF
- 完全客户端渲染，无需服务器
- 可静态部署到任何静态网站托管服务

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 构建静态网站

```bash
# 构建静态网站
npm run export
```

构建完成后，静态文件将生成在 `out` 目录中。

## 部署

### 部署到 Vercel

直接将代码推送到 GitHub 仓库，然后在 Vercel 中导入该仓库即可。Vercel 会自动识别 Next.js 项目并正确构建。

### 部署到 Netlify

1. 在 Netlify 中导入 GitHub 仓库
2. 构建命令设置为 `npm run export`
3. 发布目录设置为 `out`

### 部署到 GitHub Pages

1. 构建静态网站：`npm run export`
2. 将 `out` 目录中的文件推送到 GitHub Pages 分支

### 部署到其他静态网站托管服务

只需将 `out` 目录中的文件上传到任何静态网站托管服务即可。

## 注意事项

- 此应用完全在客户端运行，所有数据存储在浏览器的 localStorage 中
- 请记得定期导出您的简历数据，以防数据丢失
- 静态部署版本不支持服务器端渲染功能
