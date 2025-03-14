import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import * as cheerio from "cheerio";
import Image from "next/image";

import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
} from "../../utils/constant";

import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";

const Align: React.FC = observer(() => {
  const { resume, navbar } = useStore();
  const [alignAnchorEl, setAlignAnchorEl] = useState<null | HTMLElement>(null);
  const alignOpen = Boolean(alignAnchorEl);
  const theme = useTheme();

  /**
   * Update alignment style
   */
  const updateStyle =
    (flag: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      const id = resume.choosenKey;
      const { isMarkdownMode } = navbar;

      if (isMarkdownMode) {
        updateMarkdown(id, flag);
      } else {
        updateNormal(id, flag);
      }

      // Close the alignment menu
      setAlignAnchorEl(null);
    };

  const updateMarkdown = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_MARKDOWN) || "";

    if (flag === "hStart") {
      content = content + "[-S]";
    } else if (flag === "hCenter") {
      content = content + "[-C]";
    } else if (flag === "hEnd") {
      content = content + "[-E]";
    } else if (flag === "vStart") {
      content = content + "[+S]";
    } else if (flag === "vCenter") {
      content = content + "[+C]";
    } else if (flag === "vEnd") {
      content = content + "[+E]";
    }

    if (element.childNodes[0]) {
      (element.childNodes[0] as HTMLElement).innerText = content;
    }
    element.setAttribute(DATA_MARKDOWN, content);
  };

  const updateNormal = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_ORIGIN) || "";

    const $ = cheerio.load(content, {
      xmlMode: true,
    });

    const sectionInner = $("section").html() || "";
    content = `<section class="${flag}">${sectionInner}</section>`;

    if (element.childNodes[0]) {
      (element.childNodes[0] as HTMLElement).innerHTML = content;
    }
    element.setAttribute(DATA_ORIGIN, content);
  };

  const openAlignMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAlignAnchorEl(event.currentTarget);
  };

  const closeAlignMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAlignAnchorEl(null);
  };

  // Define styles as objects
  const styles = {
    menuItem: {
      fontSize: "0.95em",
    },
    menu: {
      top: "40px !important",
    },
    btn: {
      padding: "6px 10px",
      borderRadius: "0",
      borderBottom: "1px solid #cccccc",
      borderTop: "1px solid #cccccc",
      borderRight: "1px solid #cccccc",
      height: "100%",
    },
    minWidth: {
      minWidth: "auto",
    },
    opacity: {
      opacity: 0.3,
    },
    corner: {
      position: "absolute" as const,
      bottom: 2,
      right: 2,
    },
  };

  return (
    <div>
      <Menu
        id="align-menu"
        anchorEl={alignAnchorEl}
        open={alignOpen}
        onClose={closeAlignMenu}
        sx={styles.menu}
      >
        <MenuItem sx={styles.menuItem} style={{ display: "none" }} />
        <MenuItem sx={styles.menuItem} onClick={updateStyle("hStart")}>
          左对齐
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={updateStyle("hCenter")}>
          水平居中
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={updateStyle("hEnd")}>
          右对齐
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={updateStyle("vStart")}>
          上对齐
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={updateStyle("vCenter")}>
          垂直居中
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={updateStyle("vEnd")}>
          下对齐
        </MenuItem>
      </Menu>
      <Tooltip
        title="对齐"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
        disableFocusListener
      >
        <span>
          <Button
            disabled={navbar.isDisabled}
            onClick={openAlignMenu}
            sx={{
              ...styles.btn,
              ...(navbar.isDisabled ? styles.opacity : {}),
              ...styles.minWidth,
            }}
          >
            <Image
              src="/icons/align.svg"
              alt="align icon"
              width={24}
              height={24}
            />
            <Image
              src="/icons/corner.svg"
              alt="corner icon"
              width={12}
              height={12}
              style={styles.corner}
            />
          </Button>
        </span>
      </Tooltip>
    </div>
  );
});

export default Align;
