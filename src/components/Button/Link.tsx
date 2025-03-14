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
const LinkButton = styled(Button)(({ theme }) => ({
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

const Link = () => {
  const { navbar, resume, hint } = useStore();

  /**
   * Updates markdown style with a link
   */
  const updateStyle = (event: React.MouseEvent) => {
    event.stopPropagation();

    const id = resume.choosenKey;
    const element = document.getElementById(id);
    if (!element) return;

    const selectValue = window.getSelection()?.toString() || "";
    const { isMarkdownMode } = navbar;

    if (selectValue) {
      let content;

      if (isMarkdownMode) {
        content = element.getAttribute(DATA_MARKDOWN) || "";
      } else {
        content = element.getAttribute(DATA_ORIGIN) || "";
      }

      const index = content.indexOf(selectValue);

      if (index === -1) {
        hint.setError({
          isOpen: true,
          message: "链接位置请不要与其他加粗、主题色和链接位置重合",
        });
        return;
      } else {
        // Successfully selected text - in the original, this would open a dialog
        // Since we don't have a DialogStore, we'll add a simple prompt
        const url = prompt("请输入链接地址:", "https://");

        if (url) {
          if (isMarkdownMode) {
            // Update Markdown format
            const newContent =
              content.slice(0, index) +
              `[${selectValue}](${url})` +
              content.slice(index + selectValue.length);

            if (element.childNodes[0]) {
              element.childNodes[0].textContent = newContent;
            }
            element.setAttribute(DATA_MARKDOWN, newContent);
          } else {
            // Update HTML format
            const newContent =
              content.slice(0, index) +
              `<a href="${url}" target="_blank">${selectValue}</a>` +
              content.slice(index + selectValue.length);

            // Check if childNode is an Element before setting innerHTML
            const childNode = element.childNodes[0];
            if (childNode && childNode.nodeType === Node.ELEMENT_NODE) {
              (childNode as Element).innerHTML = newContent;
            } else if (childNode) {
              // If not an element, replace with a new element
              const newElement = document.createElement("span");
              newElement.innerHTML = newContent;
              element.replaceChild(newElement, childNode);
            }

            element.setAttribute(DATA_ORIGIN, newContent);
          }
        }
      }
    } else {
      hint.setError({
        isOpen: true,
        message: "请选择文本",
      });
    }
  };

  return (
    <Tooltip
      title="链接"
      placement="bottom"
      enterDelay={ENTER_DELAY}
      leaveDelay={LEAVE_DELAY}
      disableFocusListener
    >
      <span>
        {" "}
        {/* Wrapper to handle disabled button tooltip */}
        <LinkButton disabled={navbar.isDisabled} onClick={updateStyle}>
          <Image
            src="/icons/link.svg"
            alt="链接"
            width={24}
            height={24}
            priority
          />
        </LinkButton>
      </span>
    </Tooltip>
  );
};

export default observer(Link);
