"use client";

import React from "react";

import useResumeStore from "../../stores/ResumeStore";
import useNavbarStore from "../../stores/NavbarStore";

import Export from "../Button/Export";
import { ENTER_DELAY, LEAVE_DELAY } from "../../utils/constant";

/**
 * ListStorage component - Contains export functionality and GitHub link
 */
const ListStorage: React.FC = () => {
  // 使用zustand hooks
  const resume = useResumeStore();
  const navbar = useNavbarStore();

  const handleSave = () => {
    // This function is kept for future implementation
    // Currently it just redirects to GitHub
  };

  return (
    <div className="mr-[15px] flex">
      <Export />
    </div>
  );
};

export default ListStorage;
