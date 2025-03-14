import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import { observer } from "mobx-react-lite";
import Change from "../Button/Change";
import Mode from "../Button/Mode";

const StyledList = styled(List)(({ theme }) => ({
  display: "flex",
  marginLeft: "5px",
}));

const ListSwitch = () => {
  return (
    <StyledList>
      <Change />
      <Mode />
    </StyledList>
  );
};

export default ListSwitch;
