"use client";

import React from "react";
import { Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
} from "../../utils/constant";
import { useStore } from "../../stores";

// Define styled components using Material UI's styled API
const BucketButton = styled(Button)(({ theme }) => ({
  padding: "6px 10px",
  borderRadius: "0",
  borderBottom: "1px solid #cccccc",
  borderTop: "1px solid #cccccc",
  borderRight: "1px solid #cccccc",
  height: "100%",
  minWidth: "auto",
  "&.Mui-disabled": {
    opacity: 0.3,
  },
}));

const Bucket = () => {
  const { navbar, resume, hint } = useStore();

  /**
   * Updates the style based on the current mode (markdown or normal)
   */
  const updateStyle = (event: React.MouseEvent) => {
    event.stopPropagation();
    const id = resume.choosenKey;
    const { isMarkdownMode } = navbar;

    if (isMarkdownMode) {
      updateMarkdown(id);
    } else {
      updateNormal(id);
    }
  };

  /**
   * Updates the content in markdown mode
   */
  const updateMarkdown = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_MARKDOWN) || "";
    const selectValue = window.getSelection()?.toString() || "";

    if (selectValue) {
      const index = content.indexOf(selectValue);
      if (index !== -1) {
        content =
          content.slice(0, index) +
          "`" +
          selectValue +
          "`" +
          content.slice(index + selectValue.length);
      }
    } else {
      content = `${content}\`\``;
    }

    // Update markdown content
    if (element.childNodes[0]) {
      element.childNodes[0].textContent = content;
    }
    element.setAttribute(DATA_MARKDOWN, content);
  };

  /**
   * Updates the content in normal mode
   */
  const updateNormal = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_ORIGIN) || "";
    const selectValue = window.getSelection()?.toString() || "";

    if (selectValue) {
      const index = content.indexOf(selectValue);
      if (index === -1) {
        hint.setError({
          isOpen: true,
          message: "主题色位置请不要与其他加粗、主题色和链接位置重合",
        });
        return;
      }

      content =
        content.slice(0, index) +
        "<code>" +
        selectValue +
        "</code>" +
        content.slice(index + selectValue.length);

      const childNode = element.childNodes[0];
      if (childNode && childNode.nodeType === Node.ELEMENT_NODE) {
        (childNode as Element).innerHTML = content;
      }

      element.setAttribute(DATA_ORIGIN, content);
    } else {
      hint.setError({
        isOpen: true,
        message: "请选择文本",
      });
    }
  };

  return (
    <Tooltip
      title="油漆桶"
      placement="bottom"
      enterDelay={ENTER_DELAY}
      leaveDelay={LEAVE_DELAY}
      disableFocusListener
    >
      <span>
        {" "}
        {/* Wrapper to handle disabled button tooltip */}
        <BucketButton disabled={navbar.isDisabled} onClick={updateStyle}>
          <Image
            src="/icons/bucket.svg"
            alt="油漆桶"
            width={24}
            height={24}
            priority
          />
        </BucketButton>
      </span>
    </Tooltip>
  );
};

export default observer(Bucket);
