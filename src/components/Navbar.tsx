"use client";

import React from "react";
import Image from "next/image";
import ListSwitch from "./Navbar/ListSwitch";
import ListGlobal from "./Navbar/ListGlobal";
import ListMarkdown from "./Navbar/ListMarkdown";
import ListStorage from "../components/Navbar/ListStorage";

const Navbar = () => {
  return (
    <div className="fixed z-[999] flex w-full items-center justify-center overflow-auto bg-white py-1.5 shadow-md">
      <div className="ml-5 flex grow basis-[200px] justify-start">
        <Image
          src="/icons/resume.svg"
          alt="logo"
          width={24}
          height={24}
          style={{ width: "auto", height: "auto" }}
        />
        <span>Markdown简历</span>
      </div>
      <div className="flex w-[210mm] shrink-0 justify-between">
        <ListSwitch />
        <ListGlobal />
        <ListMarkdown />
      </div>
      <div className="mr-5 flex grow basis-[200px] justify-end">
        <ListStorage />
      </div>
    </div>
  );
};

export default Navbar;
