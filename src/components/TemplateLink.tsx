"use client";

import { useRouter } from "next/navigation";
import { STORAGE_LAYOUT, TEMPLATE_NUM } from "@/utils/constant";

interface TemplateLinkProps {
  templateId: string;
  className: string;
  children: React.ReactNode;
}

export default function TemplateLink({
  templateId,
  className,
  children,
}: TemplateLinkProps) {
  const router = useRouter();

  const handleSelectTemplate = () => {
    // 选择新模板时，清除之前的布局数据
    window.localStorage.removeItem(STORAGE_LAYOUT);

    // 从字符串 'themeX' 中提取数字部分，兼容两种方式
    const numPart = templateId.replace("theme", "");
    const templateNum = parseInt(numPart);

    // 存储新的模板ID（同时存储数字索引和字符串ID）
    if (!isNaN(templateNum)) {
      // 对于NavbarStore兼容，同时存储数字形式
      window.localStorage.setItem("templateNumIndex", templateNum.toString());
    }

    // 为ResumeStore存储字符串形式的模板ID
    window.localStorage.setItem(TEMPLATE_NUM, templateId);

    // 跳转到带模板ID的编辑器页面
    router.push(`/editor/${templateId}`);
  };

  return (
    <button onClick={handleSelectTemplate} className={className}>
      {children}
    </button>
  );
}
