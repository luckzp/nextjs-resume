"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import MainNavbar from "@/components/MainNavbar";
import { getThemeInfo } from "@/utils/themeLoader";
import TemplateLink from "@/components/TemplateLink";

export default function TemplatesPage() {
  // Get templates from the theme loader utility
  const templates = getThemeInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Navigation */}
      <MainNavbar activeLink="templates" />

      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          选择您喜欢的简历模板
        </h1>
        <p className="mx-auto mb-12 max-w-3xl text-center text-xl text-white/80">
          浏览我们的专业设计模板，找到最适合您职业发展的简历样式。所有模板都支持使用
          Markdown 语法编辑。
        </p>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm transition-transform hover:scale-105"
            >
              <div className="relative h-64 w-full bg-gray-200">
                {/* Placeholder for template thumbnails */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                  {template.name} 预览图
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">
                  {template.name}
                </h3>
                <p className="mb-4 text-white/80">{template.description}</p>
                <TemplateLink
                  templateId={template.id}
                  className="inline-block rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-blue-800 transition-colors hover:bg-yellow-400"
                >
                  使用此模板
                </TemplateLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
