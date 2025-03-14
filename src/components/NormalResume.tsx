"use client";

import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import MarkdownIt from "markdown-it";
// @ts-ignore
import MarkdownItIns from "markdown-it-ins";
// @ts-ignore
import MarkdownItMark from "markdown-it-mark";
import { makeStyles } from "@mui/styles";
import { DATA_ORIGIN } from "../utils/constant";
import { useStore } from "../stores";

// Define the CSS styles for the component using MUI's makeStyles
const useStyles = makeStyles(() => ({
  hStart: {
    justifyContent: "flex-start",
  },
  hCenter: {
    justifyContent: "center",
  },
  hEnd: {
    justifyContent: "flex-end",
  },
  vStart: {
    alignItems: "flex-start",
  },
  vCenter: {
    alignItems: "center",
  },
  vEnd: {
    alignItems: "flex-end",
  },
  layout: {
    width: "188mm",
    // height: "200vh",
    // margin: "16mm 11mm",
    "& div": {
      display: "flex",
      flexDirection: "column-reverse",
      "& mark": {
        color: "rgb(70,140,212)",
        backgroundColor: "rgba(0,0,0,0)",
        "& hr": {
          height: "100%",
          border: "0",
          color: "black",
          margin: 0,
        },
      },
      "& ins": {
        textDecoration: "none",
        width: "100%",
        "& hr": {
          width: "100%",
          border: "0",
          color: "black",
          margin: 0,
        },
      },
      "& section": {
        height: "100%",
        display: "flex",
        fontSize: "3.8mm",
        lineHeight: "24px",
        overflow: "hidden",
        width: "100%",
      },
      "& h1": {
        margin: "0",
        fontSize: "7mm",
        "& p": {
          fontSize: "7mm",
        },
      },
      "& h2": {
        margin: "0",
        fontSize: "4mm",
        fontWeight: "bold",
        "& p": {
          fontSize: "4mm",
        },
      },
      "& p": {
        fontSize: "3.8mm",
        margin: "0",
        lineHeight: "24px",
      },
      "& a": {
        fontSize: "3.8mm",
        textDecoration: "none",
        fontWeight: "bold",
      },
      "& strong": {
        width: "100%",
      },
      "& blockquote": {
        margin: "0",
        "&:before": {
          content: "''",
          position: "absolute",
          bottom: "-1px",
          background: "#494949",
          width: "100%",
          height: "1px",
        },
      },
      "& ul": {
        fontSize: "3.8mm",
        margin: "0",
        paddingInlineStart: "20px",
        lineHeight: "24px",
        width: "100%",
      },
      "& code": {
        width: "100%",
      },
      "& img": {
        width: "100%",
      },
    },
  },
}));

// Define the NormalResume component
const NormalResume: React.FC = observer(() => {
  const classes = useStyles();
  const { resume, navbar } = useStore();
  const mdRef = useRef<MarkdownIt | null>(null);

  // Initialize Markdown parser
  useEffect(() => {
    if (!mdRef.current) {
      const md = new MarkdownIt();
      md.use(MarkdownItIns);
      md.use(MarkdownItMark);
      mdRef.current = md;
    }
  }, []);

  // Handle clicking on a grid item
  const handleClick = (event: React.MouseEvent) => {
    console.log("normal resume handleClick");
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const id = target.id ? target.id : (target.offsetParent as HTMLElement).id;
    const { choosenKey } = resume;
    const { isResizable } = resume.status;

    // Don't process the click event if in content edit state or grid state
    if (id === choosenKey || isResizable) {
      return;
    }

    // Different item clicked
    if (choosenKey) {
      resume.updateNormalResume();
    }

    resume.setChoosen(id);
    navbar.setBtnDisable(false);

    const currentElement = document.getElementById(id);
    currentElement?.focus();
  };

  // Prevent line breaks and handle key presses
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const id = resume.choosenKey;
    const currentElement = document.getElementById(id);

    if (!currentElement) return;

    const section = currentElement.childNodes[0] as HTMLElement;
    const value = section.innerText.replace(/[\r\n]/g, "");

    // Backspace - prevent deleting the HTML structure
    if (event.key === "Backspace" && value === "") {
      event.preventDefault();
    }

    // Enter - save changes and disable editing
    if (event.key === "Enter") {
      resume.updateNormalResume();
      navbar.setBtnDisable(true);
    }
  };

  // Update the original content when input changes
  const handleInput = () => {
    const id = resume.choosenKey;
    if (!id) return;

    const currentElement = document.getElementById(id);
    if (!currentElement) return;

    const section = currentElement.childNodes[0] as HTMLElement;
    currentElement.setAttribute(DATA_ORIGIN, section.innerHTML);
  };

  // Only paste plain text
  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };

  // Save layout changes
  const handleLayoutChange = (layout: any[]) => {
    resume.updateLayout(layout);
  };

  // Apply theme color to elements via CSS
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Helper function to safely apply styles
    const applyStyle = (index: number, property: string, value: string) => {
      try {
        if (
          document.styleSheets[0] &&
          document.styleSheets[0].cssRules &&
          document.styleSheets[0].cssRules[index] &&
          (document.styleSheets[0].cssRules[index] as CSSStyleRule).style
        ) {
          (
            document.styleSheets[0].cssRules[index] as CSSStyleRule
          ).style.setProperty(property, value);
        }
      } catch (error) {
        console.error(
          `Failed to set style property ${property} at index ${index}:`,
          error,
        );
      }
    };

    // Set theme color
    applyStyle(0, "color", navbar.themeColor);

    // Horizontal lines
    applyStyle(1, "background-color", navbar.themeColor);
    applyStyle(1, "height", "3px");

    applyStyle(2, "background-color", "black");
    applyStyle(2, "height", "3px");

    applyStyle(3, "background-color", navbar.themeColor);
    applyStyle(3, "height", "1px");

    applyStyle(4, "background-color", "black");
    applyStyle(4, "height", "1px");

    // Vertical lines
    applyStyle(5, "background-color", navbar.themeColor);
    applyStyle(5, "width", "3px");

    applyStyle(6, "background-color", "black");
    applyStyle(6, "width", "3px");

    applyStyle(7, "background-color", navbar.themeColor);
    applyStyle(7, "width", "1px");

    applyStyle(8, "background-color", "black");
    applyStyle(8, "width", "1px");

    // Link underline
    applyStyle(9, "border-bottom", `1px solid ${navbar.themeColor}`);
    applyStyle(9, "color", navbar.themeColor);
  }, [navbar.themeColor]);

  // Handle newly added grid item styling
  useEffect(() => {
    if (resume.isAdded) {
      const id = resume.choosenKey;
      const element = document.getElementById(id);
      if (!element) return;

      // The space in the middle is important - for replacement and to avoid self-closing tags
      const content = "<section> </section>";

      if (element.childNodes[0]) {
        (element.childNodes[0] as HTMLElement).innerHTML = content;
      }

      element.setAttribute(DATA_ORIGIN, content);
      resume.switchStyle(id, true);
      resume.setAdded(false);
    }
  }, [resume.isAdded, resume.choosenKey]);

  return (
    <GridLayout
      className={classes.layout}
      layout={resume.layout}
      cols={24}
      rowHeight={22}
      width={710}
      margin={[10, 2]}
      isResizable={resume.status.isResizable}
      isDraggable={resume.status.isDraggable}
      onLayoutChange={handleLayoutChange}
    >
      {resume.layout.map((item) => (
        <div
          id={item.i}
          key={item.i}
          data-origin={item.origin}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onInput={handleInput}
          style={resume.status.gridStyle}
          suppressContentEditableWarning={true}
        >
          <section dangerouslySetInnerHTML={{ __html: item.origin || "" }} />
        </div>
      ))}
    </GridLayout>
  );
});

export default NormalResume;
