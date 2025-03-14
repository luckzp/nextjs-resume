"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Resume from "@/components/Resume";
import NormalResume from "@/components/NormalResume";
import HintDialog from "@/components/Hint";
import { observer } from "mobx-react-lite";

// Wrap the component with observer
const HomePage = observer(() => {
  // Handle print related effects on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Handle after print
      const afterPrint = () => {
        const { useStore } = require("@/stores");
        const { navbar } = useStore();
        navbar.setExported(false);
      };

      // Prevent default drag
      const preventDrag = (e: DragEvent) => {
        e.preventDefault();
      };

      // Handle window click
      const handleWindowClick = () => {
        console.log("window click");
        const { useStore } = require("@/stores");
        const { navbar, resume } = useStore();

        if (navbar.isMarkdownMode) {
          resume.updateResume();
          navbar.setBtnDisable(true);
        } else {
          resume.updateNormalResume();
          navbar.setBtnDisable(true);
        }
      };

      // Handle beforeunload
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        const message = "数据目前存储在浏览器中，记得保存到本地备份！";
        e.preventDefault();
        e.returnValue = message;
        return message;
      };

      // Add event listeners
      window.onafterprint = afterPrint;
      window.ondragstart = preventDrag;
      window.onclick = handleWindowClick;
      window.onbeforeunload = handleBeforeUnload;

      // Clean up function
      return () => {
        window.onafterprint = null;
        window.ondragstart = null;
        window.onclick = null;
        window.onbeforeunload = null;
      };
    }
  }, []);

  // Initialize NavbarStore to ensure markdownMode is set from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { useStore } = require("@/stores");
      const { navbar } = useStore();
      // Ensure NavbarStore is initialized before rendering
      navbar.initialize();
      console.log(
        "NavbarStore initialized, markdownMode:",
        navbar.isMarkdownMode,
      );
    }
  }, []);

  // 监听导出状态变化并触发打印
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize store references
      const { useStore } = require("@/stores");
      const store = useStore();

      // Create a MobX reaction to watch for changes to isExported
      const disposer = require("mobx").reaction(
        () => store.navbar.isExported,
        (isExported: boolean) => {
          console.log("Export state changed to:", isExported);
          if (isExported) {
            console.log("Attempting to print...");
            store.resume.setChoosen();
            window.print();
          }
        },
      );

      // Clean up the reaction when component unmounts
      return () => {
        disposer();
      };
    }
  }, []); // Empty dependency array to run only on mount

  // Get store for rendering - moved inside the component
  const { useStore } = require("@/stores");
  const { navbar, resume } = useStore();

  return (
    <main className="flex w-full justify-center">
      {/* Navbar section */}
      <div
        className="fixed z-[999] w-full"
        style={{ display: navbar.isExported ? "none" : "block" }}
      >
        <Navbar />
      </div>

      {/* Resume section */}
      <div
        className="my-[80px] box-content flex h-[264mm] w-[188mm] overflow-auto break-all bg-white p-[16mm_11mm] shadow-md print:my-0 print:h-auto print:w-full print:overflow-visible print:border-none print:shadow-none"
        style={{
          border: navbar.isExported ? "none" : "1px solid black",
          boxShadow: navbar.isExported ? "none" : "0px 0px 4px",
          margin: navbar.isExported ? "0px auto" : "80px auto",
          padding: navbar.isExported ? "0mm" : "16mm 11mm",
        }}
      >
        {navbar.isMarkdownMode ? <Resume /> : <NormalResume />}
      </div>

      {/* Dialogs */}
      <HintDialog />
    </main>
  );
});

export default HomePage;
