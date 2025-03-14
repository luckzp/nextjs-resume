"use client";

import React, { useState } from "react";
import { Button, Tooltip, Menu, MenuItem } from "@mui/material";
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
const WordButton = styled(Button)(({ theme }) => ({
  padding: "6px 10px",
  border: "1px solid #cccccc",
  borderRadius: "0",
  borderTopLeftRadius: "3px",
  borderBottomLeftRadius: "3px",
  height: "100%",
  minWidth: "auto",
  "&.Mui-disabled": {
    opacity: 0.3,
  },
}));

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    top: "40px !important",
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: "0.95em",
});

const WordCorner = styled("img")({
  position: "absolute",
  bottom: 2,
  right: 2,
});

const Word = () => {
  const { navbar, resume, hint } = useStore();
  const [sizeAnchorEl, setSizeAnchorEl] = useState<null | HTMLElement>(null);
  const sizeOpen = Boolean(sizeAnchorEl);

  /**
   * Update text style
   */
  const updateStyle = (flag: string) => (event: React.MouseEvent) => {
    event.stopPropagation();
    const id = resume.choosenKey;
    const { isMarkdownMode } = navbar;

    if (isMarkdownMode) {
      updateMarkdown(id, flag);
    } else {
      updateNormal(id, flag);
    }

    // Hide font size menu
    setSizeAnchorEl(null);
  };

  const updateMarkdown = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_MARKDOWN) || "";

    if (flag === "h1") {
      content = "# " + content;
    } else if (flag === "h2") {
      content = "## " + content;
    }

    if (element.childNodes[0]) {
      element.childNodes[0].textContent = content;
    }
    element.setAttribute(DATA_MARKDOWN, content);
  };

  const updateNormal = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_ORIGIN) || "";

    // Process content with cheerio to handle HTML
    const $ = cheerio.load(content, {
      xmlMode: true,
    });

    const section = $.html();
    const sectionInner = $("section").html() || "";

    let sectionTitle;
    if ($("section h1").html()) {
      sectionTitle = $("section h1").html();
    } else if ($("section h2").html()) {
      sectionTitle = $("section h2").html();
    } else {
      sectionTitle = $("section").html();
    }

    if (flag === "h1") {
      content = section.replace(sectionInner, `<h1>${sectionTitle}</h1>`);
    } else if (flag === "h2") {
      content = section.replace(sectionInner, `<h2>${sectionTitle}</h2>`);
    } else if (flag === "p") {
      content = section.replace(sectionInner, `${sectionTitle}`);
    }

    // Update content
    const childNode = element.childNodes[0];
    if (childNode && childNode.nodeType === Node.ELEMENT_NODE) {
      (childNode as Element).innerHTML = content;
    }
    element.setAttribute(DATA_ORIGIN, content);
  };

  const openFontSizeMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setSizeAnchorEl(event.currentTarget);
  };

  const closeFontSizeMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSizeAnchorEl(null);
  };

  return (
    <div>
      <StyledMenu
        id="size-menu"
        anchorEl={sizeAnchorEl}
        open={sizeOpen}
        onClose={closeFontSizeMenu}
      >
        <StyledMenuItem style={{ display: "none" }} />
        <StyledMenuItem
          onClick={updateStyle("p")}
          style={{ display: navbar.isMarkdownMode ? "none" : "block" }}
        >
          普通字号
        </StyledMenuItem>
        <StyledMenuItem onClick={updateStyle("h1")}>一级标题</StyledMenuItem>
        <StyledMenuItem onClick={updateStyle("h2")}>二级标题</StyledMenuItem>
      </StyledMenu>

      <Tooltip
        title="字号切换"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
        disableFocusListener
      >
        <span>
          {" "}
          {/* Wrapper to handle disabled button tooltip */}
          <WordButton disabled={navbar.isDisabled} onClick={openFontSizeMenu}>
            <Image
              src="/icons/word.svg"
              alt="字号切换"
              width={24}
              height={24}
              priority
            />
            <WordCorner src="/icons/corner.svg" alt="corner" />
          </WordButton>
        </span>
      </Tooltip>
    </div>
  );
};

export default observer(Word);
