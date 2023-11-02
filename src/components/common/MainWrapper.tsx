"use client"

import { Toast } from "next-ts-lib";
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
