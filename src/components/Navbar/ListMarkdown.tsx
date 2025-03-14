"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import { observer } from "mobx-react-lite";

import Word from "../Button/Word";
import Strong from "../Button/Strong";
import Li from "../Button/Li";
import Bucket from "../Button/Bucket";
import Blockquote from "../Button/Blockquote";
import Link from "../Button/Link";
import Align from "../Button/Align";
import Line from "../Button/Line";
import Picture from "../Button/Picture";
import RemoveGrid from "../Button/RemoveGrid";

// Styled List component using MUI v6 styling approach
const StyledList = styled(List)(({ theme }) => ({
  display: "flex",
  marginLeft: "5px",
}));

/**
 * ListMarkdown component - Contains markdown formatting controls for the resume editor
 */
const ListMarkdown: React.FC = () => {
  return (
    <StyledList>
      <Word />
      <Strong />
      <Li />
      <Blockquote />
      <Bucket />
      <Link />
      <Align />
      <Line />
      <Picture />
      <RemoveGrid />
    </StyledList>
  );
};

export default observer(ListMarkdown);
