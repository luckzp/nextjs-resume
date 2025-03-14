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

const Line: React.FC = observer(() => {
  const { resume, navbar } = useStore();
  const [lineAnchorEl, setLineAnchorEl] = useState<null | HTMLElement>(null);
  const lineOpen = Boolean(lineAnchorEl);
  const theme = useTheme();

  /**
   * Update line style
   */
  const addLine = (flag: string) => (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const id = resume.choosenKey;
    const { isMarkdownMode } = navbar;

    if (isMarkdownMode) {
      updateMarkdown(id, flag);
    } else {
      updateNormal(id, flag);
    }

    // Close the line menu
    setLineAnchorEl(null);
  };

  const updateMarkdown = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_MARKDOWN) || "";

    if (flag === "h") {
      content = "---";
    } else if (flag === "v") {
      content = "+++";
    }
    if (flag === "H") {
      content = "---";
    } else if (flag === "strongH") {
      content = "**---**";
    } else if (flag === "colorH") {
      content = "`---`";
    } else if (flag === "strongColorH") {
      content = "**`---`**";
    } else if (flag === "V") {
      content = "+++";
    } else if (flag === "strongV") {
      content = "**+++**";
    } else if (flag === "colorV") {
      content = "`+++`";
    } else if (flag === "strongColorV") {
      content = "**`+++`**";
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

    const section = $.html();
    const sectionInner = $("section").html() || "";
    let html;

    if (flag === "H") {
      html = "<ins><hr></ins>";
    } else if (flag === "strongH") {
      html = "<strong><ins><hr></ins></strong>";
    } else if (flag === "colorH") {
      html = "<code><ins><hr></ins></code>";
    } else if (flag === "strongColorH") {
      html = "<strong><code><ins><hr></ins></code></strong>";
    } else if (flag === "V") {
      html = "<mark><hr></mark>";
    } else if (flag === "strongV") {
      html = "<strong><mark><hr></mark></strong>";
    } else if (flag === "colorV") {
      html = "<code><mark><hr></mark></code>";
    } else if (flag === "strongColorV") {
      html = "<strong><code><mark><hr></mark></code></strong>";
    }

    content = section.replace(sectionInner || "", html || "");

    if (element.childNodes[0]) {
      (element.childNodes[0] as HTMLElement).innerHTML = content;
    }
    element.setAttribute(DATA_ORIGIN, content);
  };

  const openLineMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setLineAnchorEl(event.currentTarget);
  };

  const closeLineMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setLineAnchorEl(null);
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
        id="line-menu"
        anchorEl={lineAnchorEl}
        open={lineOpen}
        onClose={closeLineMenu}
        sx={styles.menu}
      >
        <MenuItem sx={styles.menuItem} style={{ display: "none" }} />
        <MenuItem sx={styles.menuItem} onClick={addLine("H")}>
          横线
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={addLine("strongH")}>
          加粗横线
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={addLine("colorH")}>
          主题色横线
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={addLine("strongColorH")}>
          加粗主题色横线
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={addLine("V")}>
          竖线
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={addLine("strongV")}>
          加粗竖线
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={addLine("colorV")}>
          主题色竖线
        </MenuItem>
        <MenuItem sx={styles.menuItem} onClick={addLine("strongColorV")}>
          加粗主题色竖线
        </MenuItem>
      </Menu>
      <Tooltip
        title="分割线"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
        disableFocusListener
      >
        <span>
          <Button
            disabled={navbar.isDisabled}
            onClick={openLineMenu}
            sx={{
              ...styles.btn,
              ...(navbar.isDisabled ? styles.opacity : {}),
              ...styles.minWidth,
            }}
          >
            <Image
              src="/icons/line.svg"
              alt="line icon"
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

export default Line;
