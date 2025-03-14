"use client";

import React from "react";
import { Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import Image from "next/image";
// import axios from "axios";
import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
  SM_MS_PROXY,
} from "../../utils/constant";
import { useStore } from "../../stores";

// Define styled components using Material UI's styled API
const PictureButton = styled(Button)(({ theme }) => ({
  padding: "0px",
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

const InputLabel = styled("label")({
  display: "flex",
  height: "100%",
  padding: "6px 10px",
});

const HiddenInput = styled("input")({
  display: "none",
  width: "100%",
});

const Picture = () => {
  const { navbar, resume, hint } = useStore();

  /**
   * Upload an image
   */
  const uploadPicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = document.getElementById("uploadImage") as HTMLInputElement;
    if (!file || !file.files || file.files.length === 0) return;

    const formData = new FormData();
    const fileToUpload = file.files[0];
    if (!fileToUpload) return;

    formData.append("smfile", fileToUpload);

    try {
      // Using fetch instead of axios to avoid dependency issues
      const response = await fetch(SM_MS_PROXY, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.message === "Image upload repeated limit.") {
        hint.setError({
          isOpen: true,
          message: "同一张图片无法上传多次",
        });
      } else {
        const id = resume.choosenKey;
        const element = document.getElementById(id);
        if (!element) return;

        const { isMarkdownMode } = navbar;
        let content;

        if (isMarkdownMode) {
          content = `![avatar](${result.data.url})`;
          if (element.childNodes[0]) {
            element.childNodes[0].textContent = content;
          }
          element.setAttribute(DATA_MARKDOWN, content);
        } else {
          content = `<section><p><img src="${result.data.url}" alt="avatar"></p>\n</section>`;
          // Check if childNode is an Element before setting innerHTML
          const childNode = element.childNodes[0];
          if (childNode && childNode.nodeType === Node.ELEMENT_NODE) {
            (childNode as Element).innerHTML = content;
          } else if (childNode) {
            // If not an element, replace with a new element
            const newElement = document.createElement("span");
            newElement.innerHTML = content;
            element.replaceChild(newElement, childNode);
          }
          element.setAttribute(DATA_ORIGIN, content);
        }
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      hint.setError({
        isOpen: true,
        message: "图片上传失败，请重试",
      });
    }
  };

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Tooltip
      title="图片"
      placement="bottom"
      enterDelay={ENTER_DELAY}
      leaveDelay={LEAVE_DELAY}
      disableFocusListener
    >
      <span>
        {" "}
        {/* Wrapper to handle disabled button tooltip */}
        <PictureButton disabled={navbar.isDisabled} onClick={stopPropagation}>
          <HiddenInput
            accept="image/*"
            id="uploadImage"
            onChange={uploadPicture}
            type="file"
          />
          <InputLabel htmlFor="uploadImage">
            <Image
              src="/icons/picture.svg"
              alt="图片"
              width={24}
              height={24}
              priority
            />
          </InputLabel>
        </PictureButton>
      </span>
    </Tooltip>
  );
};

export default observer(Picture);
