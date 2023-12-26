"use client"

import { Toast } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import React from "react";

const MainWrapper = ({ children }: any) => {
  return (
    <>
      <Toast position="top_center" />
      {children}
    </>
  );
};

export default MainWrapper;
