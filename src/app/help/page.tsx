"use client";

import React from "react";
import Link from "next/link";
import MainNavbar from "@/components/MainNavbar";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Navigation */}
      <MainNavbar activeLink="help" />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-xl bg-white/10 p-8 backdrop-blur-sm">
          <h1 className="mb-8 text-4xl font-bold text-white">使用指南</h1>

          <div className="space-y-8 text-white">
            <section>
              <h2 className="mb-4 text-2xl font-bold">如何开始使用</h2>
              <ol className="ml-4 list-inside list-decimal space-y-2">
                <li>从首页或模板库中选择一个适合您的简历模板</li>
                <li>使用 Markdown 语法编辑您的简历内容</li>
                <li>实时预览效果，直到您对结果满意</li>
                <li>导出为 PDF 或其他格式</li>
              </ol>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">Markdown 语法指南</h2>
              <div className="rounded-lg bg-white/5 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold">基本语法</h3>
                    <ul className="space-y-3">
                      <li>
                        <code className="rounded bg-white/20 px-2 py-1">
                          ## 标题二
                        </code>
                        <p className="mt-1">
                          用于创建不同级别的标题（# 到 ######）
                        </p>
                      </li>
                      <li>
                        <code className="rounded bg-white/20 px-2 py-1">
                          **粗体文本**
                        </code>
                        <p className="mt-1">使文字变为粗体</p>
                      </li>
                      <li>
                        <code className="rounded bg-white/20 px-2 py-1">
                          *斜体文本*
                        </code>
                        <p className="mt-1">使文字变为斜体</p>
                      </li>
                      <li>
                        <code className="rounded bg-white/20 px-2 py-1">
                          [链接文本](URL)
                        </code>
                        <p className="mt-1">创建超链接</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xl font-semibold">列表与格式</h3>
                    <ul className="space-y-3">
                      <li>
                        <code className="rounded bg-white/20 px-2 py-1">
                          - 无序列表项
                        </code>
                        <p className="mt-1">创建无序列表</p>
                      </li>
                      <li>
                        <code className="rounded bg-white/20 px-2 py-1">
                          1. 有序列表项
                        </code>
                        <p className="mt-1">创建有序列表</p>
                      </li>
                      <li>
                        <code className="rounded bg-white/20 px-2 py-1">
                          | 表头1 | 表头2 |<br />
                          | ----- | ----- |<br />| 内容1 | 内容2 |
                        </code>
                        <p className="mt-1">创建表格</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">简历结构建议</h2>
              <div className="rounded-lg bg-white/5 p-6">
                <p className="mb-4">一个完整的简历通常包含以下几个部分：</p>
                <ul className="ml-4 list-inside list-disc space-y-2">
                  <li>个人信息和联系方式</li>
                  <li>教育背景</li>
                  <li>工作经验</li>
                  <li>技能清单</li>
                  <li>项目经历</li>
                  <li>证书和获奖情况</li>
                </ul>
                <div className="mt-6">
                  <h3 className="mb-3 text-xl font-semibold">示例结构</h3>
                  <pre className="overflow-auto rounded bg-white/20 p-4 text-sm">
                    {`# 张三

## 联系方式
- 电话：123-4567-8901
- 邮箱：zhangsan@example.com
- 网站：https://zhangsan.example.com

## 教育背景
**XX大学** | 计算机科学与技术 | 2018-2022
- GPA: 3.8/4.0

## 工作经验
**XX科技有限公司** | 前端开发工程师 | 2022-至今
- 负责公司主要产品的前端开发和维护
- 实现了新功能X，提高了Y性能
`}
                  </pre>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">常见问题</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">如何保存我的简历？</h3>
                  <p>
                    您可以导出为PDF保存，也可以保存Markdown源文件以便将来编辑。
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">支持哪些导出格式？</h3>
                  <p>目前支持PDF、HTML和Markdown格式导出。</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    我可以自定义模板吗？
                  </h3>
                  <p>我们提供了多种预设模板，未来会增加更多自定义选项。</p>
                </div>
              </div>
            </section>

            <div className="pt-6 text-center">
              <Link
                href="/templates"
                className="inline-block rounded-lg bg-yellow-300 px-8 py-3 font-semibold text-blue-800 transition-colors hover:bg-yellow-400"
              >
                浏览模板库
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
