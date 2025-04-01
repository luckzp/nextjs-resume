"use client";

import React from "react";

import Frame from "../Button/Frame";
import Screen from "../Button/Screen";
import AddGrip from "../Button/AddGrid";

/**
 * ListGlobal component - Contains global controls for the resume editor
 */
const ListGlobal = () => {
  return (
    <div className="flex items-center">
      <Frame />
      <Screen />
      <AddGrip />
    </div>
  );
};

export default ListGlobal;
