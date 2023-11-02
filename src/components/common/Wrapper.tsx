"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DrawerOverlay from "../settings/drawer/DrawerOverlay";
import { Toast } from "next-ts-lib";

interface WrapperProps {
  children: ReactNode;
  className?: any;
}

const Wrapper = ({ children, className = "" }: WrapperProps): JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [Collapsed, setCollapsed] = useState<boolean>(false);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState(0);

  const isOpen = (arg: any) => {
    setMobileOpen(arg);
    setDrawer(arg);
  };
  const isCollapsed = (arg: any) => {
    setCollapsed(arg);
  };

  const handleResize = () => {
    setWindowSize(window.innerWidth);
  };

  useEffect(() => {
    setWindowSize(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div className="lg:flex !h-[200px]">
      <Toast position="top_center" />
      <Sidebar
        setOpen={isOpen}
        setSetting={isCollapsed}
        toggleDrawer={drawer}
      />
      <main
        className={`${
          windowSize <= 1023
            ? "w-[100vw]"
            : Collapsed
            ? "w-[94vw]"
            : `w-[85vw] ${className}`
        }`}
      >
        <DrawerOverlay
          className="!top-[70px]"
          isOpen={drawer}
          onClose={() => {
            setDrawer(!drawer);
          }}
        />
        {children}
      </main>
    </div>
  );
};

export default Wrapper;
