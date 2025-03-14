"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";

import Export from "../Button/Export";
import { ENTER_DELAY, LEAVE_DELAY } from "../../utils/constant";

// Styled components using MUI v6 styling approach
const StyledList = styled(List)(({ theme }) => ({
  display: "flex",
  marginLeft: "5px",
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: "4px 6px",
  cursor: "pointer",
}));

const StyledLink = styled("a")({
  borderBottom: "none",
});

/**
 * ListStorage component - Contains export functionality and GitHub link
 */
const ListStorage: React.FC = () => {
  const { resume, navbar } = useStore();

  const handleSave = () => {
    // This function is kept for future implementation
    // Currently it just redirects to GitHub
  };

  return (
    <StyledList>
      <Export />

      <Tooltip
        title="源码"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
      >
        <StyledListItem onClick={handleSave}>
          <StyledLink
            href="https://github.com/guanpengchn/markdown-resume"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/github.svg"
              alt="GitHub"
              width={24}
              height={24}
            />
          </StyledLink>
        </StyledListItem>
      </Tooltip>
    </StyledList>
  );
};

export default observer(ListStorage);
