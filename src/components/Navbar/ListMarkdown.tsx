"use client";

import React from "react";

import Word from "../Button/Word";
import Strong from "../Button/Strong";
import Li from "../Button/Li";
import Blockquote from "../Button/Blockquote";
import Align from "../Button/Align";
import Line from "../Button/Line";
import RemoveGrid from "../Button/RemoveGrid";

/**
 * ListMarkdown component - Contains markdown formatting controls for the resume editor
 */
const ListMarkdown: React.FC = () => {
  return (
    <div className="flex items-center">
      <Word />
      <Strong />
      <Li />
      <Blockquote />
      <Align />
      <Line />
      <RemoveGrid />
    </div>
  );
};

export default ListMarkdown;
