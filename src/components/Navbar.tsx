"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { Button, FormControlLabel, Switch } from "@mui/material";
import navbarStore from "../stores/NavbarStore";
import ListSwitch from "./Navbar/ListSwitch";
import ListGlobal from "./Navbar/ListGlobal";
import ListMarkdown from "./Navbar/ListMarkdown";
import ListStorage from "../components/Navbar/ListStorage";
// import ListGlobal from "../components/Navbar/ListGlobal";
// import ListSwitch from "../components/Navbar/ListSwitch";
// import ListMarkdown from "../components/Navbar/ListMarkdown";
// import ListNormal from '../components/Navbar/ListNormal';

const Navbar = () => {
  useEffect(() => {
    navbarStore.initialize();
  }, []);

  return (
    <div className="fixed z-[999] flex w-full items-center justify-center overflow-auto bg-white shadow-md">
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
