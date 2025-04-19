"use client";

import Link from "next/link";
import MainNavbar from "@/components/MainNavbar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      <MainNavbar activeLink="home" />

      <div className="flex flex-grow flex-col items-center justify-center px-4 py-16">
        <div className="container flex flex-col items-center justify-center gap-8">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Markdown <span className="text-yellow-300">简历</span> 生成器
          </h1>

          <p className="max-w-2xl text-center text-xl">
            使用 Markdown 轻松创建专业简历，支持多种模板和导出格式
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/templates"
              className="rounded-lg bg-white px-6 py-3 text-lg font-semibold text-blue-700 shadow-lg transition-all hover:bg-yellow-300 hover:text-blue-800"
            >
              选择模板
            </Link>

            <Link
              href="/editor"
              className="rounded-lg bg-yellow-300 px-6 py-3 text-lg font-semibold text-blue-800 shadow-lg transition-all hover:bg-white hover:text-blue-700"
            >
              直接编辑
            </Link>

            <Link
              href="/help"
              className="rounded-lg border-2 border-white bg-transparent px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-white hover:text-blue-700"
            >
              使用指南
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-blue-500 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Markdown 编辑</h3>
              <p className="mt-2 text-center">
                使用简单的 Markdown 语法编写您的简历内容
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-blue-500 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">多种模板</h3>
              <p className="mt-2 text-center">选择多种专业设计的简历模板</p>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-blue-500 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">一键导出</h3>
              <p className="mt-2 text-center">导出为 PDF、HTML 或其他格式</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg">立即开始创建您的专业简历</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/templates"
                className="inline-block rounded-lg bg-yellow-300 px-8 py-4 text-xl font-bold text-blue-800 shadow-lg transition-all hover:bg-yellow-400"
              >
                选择模板
              </Link>
              <Link
                href="/editor"
                className="inline-block rounded-lg bg-white px-8 py-4 text-xl font-bold text-blue-700 shadow-lg transition-all hover:bg-yellow-300 hover:text-blue-800"
              >
                直接编辑
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-blue-900/30 py-6 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-white/80">
          <p>Markdown 简历生成器 - 轻松创建专业简历</p>
        </div>
      </footer>
    </div>
  );
}
