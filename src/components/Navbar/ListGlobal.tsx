"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import { observer } from "mobx-react-lite";

import Frame from "../Button/Frame";
import Color from "../Button/Color";
import Screen from "../Button/Screen";
import AddGrip from "../Button/AddGrid";
import Help from "../Button/Help";

// Styled List component using MUI v6 styling approach
const StyledList = styled(List)(({ theme }) => ({
  display: "flex",
  marginLeft: "5px",
}));

/**
 * ListGlobal component - Contains global controls for the resume editor
 */
const ListGlobal = () => {
  return (
    <StyledList>
      <Frame />
      <Color />
      <Screen />
      <AddGrip />
      <Help />
    </StyledList>
  );
};

export default observer(ListGlobal);
