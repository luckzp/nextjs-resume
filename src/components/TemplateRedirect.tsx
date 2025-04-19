"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Resume from "@/components/Resume";
import NormalResume from "@/components/NormalResume";
import HintDialog from "@/components/Hint";
import useNavbarStore from "@/stores/NavbarStore";
import useResumeStore from "@/stores/ResumeStore";
import Dialog from "@/components/Dialog";
import { STORAGE_LAYOUT, TEMPLATE_NUM } from "@/utils/constant";

interface TemplateRedirectProps {
  templateId: string;
}

export default function TemplateRedirect({
  templateId,
}: TemplateRedirectProps) {
  // 使用各个store的hooks获取状态和方法
  const isExported = useNavbarStore((state) => state.isExported);
  const isMarkdownMode = useNavbarStore((state) => state.isMarkdownMode);
  const setExported = useNavbarStore((state) => state.setExported);
  const initialize = useNavbarStore((state) => state.initialize);
  const setBtnDisable = useNavbarStore((state) => state.setBtnDisable);

  const updateResume = useResumeStore((state) => state.updateResume);
  const updateNormalResume = useResumeStore(
    (state) => state.updateNormalResume,
  );
  const setChoosen = useResumeStore((state) => state.setChoosen);
  const initializeResume = useResumeStore((state) => state.initialize);

  // 在组件挂载时初始化所有必要的 store
  useEffect(() => {
    // 先清除之前保存的布局数据，确保加载新的模板
    window.localStorage.removeItem(STORAGE_LAYOUT);

    // 提取数字部分并保存为templateNumIndex
    const numPart = templateId.replace("theme", "");
    const templateNum = parseInt(numPart);
    if (!isNaN(templateNum)) {
      window.localStorage.setItem("templateNumIndex", templateNum.toString());
    }

    // 保存模板ID
    window.localStorage.setItem(TEMPLATE_NUM, templateId);

    // 初始化 store
    initialize();
    // 初始化简历布局，传入模板ID
    initializeResume(templateId);
  }, [initialize, initializeResume, templateId]);

  const handleWindowClick = () => {
    console.log("window click");
    if (isMarkdownMode) {
      updateResume();
    } else {
      updateNormalResume();
    }
    setBtnDisable(true);
  };

  useEffect(() => {
    // 设置事件监听器
    const afterPrint = () => setExported(false);

    const preventDrag = (e: DragEvent) => e.preventDefault();

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message = "数据目前存储在浏览器中，记得保存到本地备份！";
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // 添加事件监听器
    window.onafterprint = afterPrint;
    window.ondragstart = preventDrag;
    window.onbeforeunload = handleBeforeUnload;
  }, [isMarkdownMode, setExported]);

  // 使用普通 useEffect 监听导出状态变化并触发打印
  useEffect(() => {
    if (isExported) {
      console.log("Attempting to print...");
      setChoosen();
      window.print();
    }
  }, [isExported, setChoosen]);

  return (
    <main className="flex w-full justify-center">
      {/* Navbar section */}
      <div
        className="fixed z-[999] w-full"
        style={{ display: isExported ? "none" : "block" }}
      >
        <Navbar />
      </div>

      {/* Resume section */}
      <div
        className="box-content flex h-[264mm] w-[188mm] overflow-auto break-all bg-white shadow-md"
        style={{
          border: isExported ? "none" : "1px solid black",
          boxShadow: isExported ? "none" : "0px 0px 4px",
          margin: isExported ? "0px auto" : "80px auto",
          padding: isExported ? "16mm 11mm" : "16mm 11mm",
        }}
        onClick={handleWindowClick}
      >
        {isMarkdownMode ? <Resume /> : <NormalResume />}
      </div>

      <HintDialog />
      <Dialog />
    </main>
  );
}
