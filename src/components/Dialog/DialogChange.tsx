"use client";

import React from "react";
import useDialogStore from "@/stores/DialogStore";
import useNavbarStore from "@/stores/NavbarStore";
import useResumeStore from "@/stores/ResumeStore";
import useHintStore from "@/stores/HintStore";
import { THEMES, TEMPLATE_NUM } from "@/utils/constant";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DialogChange = () => {
  const { isChangeOpened, setChangeOpened } = useDialogStore();
  const { templateNum } = useNavbarStore();
  const { switchLayout } = useResumeStore();
  const { setSuccess } = useHintStore();

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setChangeOpened(false);
  };

  const handleChangeTheme = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("templateNum", templateNum);
    const theme = THEMES[templateNum];
    console.log("theme", theme);
    if (theme) {
      switchLayout(theme);

      // 保存数字索引形式，用于NavbarStore
      window.localStorage.setItem("templateNumIndex", templateNum.toString());

      // 保存字符串ID形式，用于ResumeStore (theme0 是自定义，theme1-4 是预设模板)
      const templateId = templateNum === 0 ? "theme0" : `theme${templateNum}`;
      window.localStorage.setItem(TEMPLATE_NUM, templateId);

      setSuccess({ isOpen: true, message: "切换模板成功" });
      setChangeOpened(false);
    }
  };

  return (
    <Dialog open={isChangeOpened} onOpenChange={setChangeOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>提醒</DialogTitle>
          <DialogDescription>
            切换主题后将丢失当前编辑内容，是否确定切换主题？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleChangeTheme}>确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogChange;
