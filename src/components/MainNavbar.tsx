import React from "react";
import Link from "next/link";

interface MainNavbarProps {
  activeLink: "home" | "templates" | "help" | "editor" | "none";
}

export default function MainNavbar({ activeLink }: MainNavbarProps) {
  return (
    <nav className="bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="text-yellow-300">简历</span>生成器
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/help"
              className={`${
                activeLink === "help"
                  ? "font-medium text-yellow-300"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              使用指南
            </Link>
            <Link
              href="/templates"
              className={`${
                activeLink === "templates"
                  ? "font-medium text-yellow-300"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              模板库
            </Link>
            <Link
              href="/editor"
              className={`${
                activeLink === "editor"
                  ? "font-medium text-yellow-300"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              编辑简历
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
