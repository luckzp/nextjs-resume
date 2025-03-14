"use client";

import React from "react";
import { Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import * as cheerio from "cheerio";
import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
} from "../../utils/constant";
import { useStore } from "../../stores";

// Define styled components using Material UI's styled API
const BlockquoteButton = styled(Button)(({ theme }) => ({
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

const Blockquote = () => {
  const { navbar, resume } = useStore();

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
    content = "> " + content;

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

    // Use Cheerio to parse and manipulate HTML content
    const $ = cheerio.load(content, {
      xmlMode: true,
    });

    const section = $.html();
    const sectionInner = $("section").html() || "";

    let newContent: string;

    if ($("section blockquote").html()) {
      // If already has a blockquote, use its content
      const sectionTitle = $("section blockquote").html() || "";
      newContent = section.replace(sectionInner, `${sectionTitle}`);
    } else {
      // Create a new blockquote with the current content
      const sectionTitle = $("section").html() || "";
      newContent = section.replace(
        sectionInner,
        `<blockquote>${sectionTitle}</blockquote>`,
      );
    }

    // Update HTML content
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
  };

  return (
    <Tooltip
      title="引用"
      placement="bottom"
      enterDelay={ENTER_DELAY}
      leaveDelay={LEAVE_DELAY}
      disableFocusListener
    >
      <span>
        {" "}
        {/* Wrapper to handle disabled button tooltip */}
        <BlockquoteButton disabled={navbar.isDisabled} onClick={updateStyle}>
          <Image
            src="/icons/underline.svg"
            alt="引用"
            width={24}
            height={24}
            priority
          />
        </BlockquoteButton>
      </span>
    </Tooltip>
  );
};

export default observer(Blockquote);
