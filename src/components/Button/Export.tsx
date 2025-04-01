"use client";
import React from "react";
import Image from "next/image";
import { useNavbarStore, useHintStore } from "../../stores";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { STORAGE_LAYOUT } from "../../utils/constant";
import { downloadFile } from "../../utils/helper";

const Export: React.FC = () => {
  const { setExported, isExported } = useNavbarStore();
  const { setSuccess } = useHintStore();

  const handleExport = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log("Export button clicked, setting isExported to true");
    setExported(true);
    console.log("isExported set to:", isExported);

    setSuccess({
      isOpen: true,
      message: "正在导出为PDF...",
    });
  };

  const saveToLocal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const layout = window.localStorage.getItem(STORAGE_LAYOUT);
    if (layout) {
      const filename = `markdown-resume-${new Date().getTime()}.json`;
      downloadFile(filename, layout);

      setSuccess({
        isOpen: true,
        message: "已保存到本地",
      });
    }
  };

  const importFromLocal = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const content = fileReader.result as string;
        window.localStorage.setItem(STORAGE_LAYOUT, content);
        window.location.href = "/";
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-full w-[100px] px-2.5">
          导入导出
          <div className="absolute bottom-0.5 right-0.5">
            <Image src="/icons/corner.svg" alt="logo" width={10} height={10} />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent align="start" className="mt-1 text-[0.95em]">
          <DropdownMenuItem onClick={handleExport}>导出PDF</DropdownMenuItem>
          <DropdownMenuItem onClick={saveToLocal}>保存到本地</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <label className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none">
              从本地导入
              <input
                className="hidden"
                accept="application/json"
                id="import-file-input"
                type="file"
                onChange={importFromLocal}
              />
            </label>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default Export;
