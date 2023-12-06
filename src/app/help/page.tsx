"use client";
import React from "react";
import Wrapper from "@/components/common/Wrapper";
import Navbar from "@/components/common/Navbar";
import { Button } from "@mui/material";

const Page = () => {
  return (
    <Wrapper>
      <div>
        <Navbar />
        <div className="bg-white flex justify-between items-center px-[20px]">
          <div className="flex gap-[10px] items-center py-[6.5px]">
            <label className="py-[10px] cursor-pointer select-none text-[16px] text-slatyGrey">
              Latest EXE
            </label>
          </div>
        </div>
        <div className="mx-4 px-5 flex justify-between items-center w-[97%] h-28 bg-whiteSmoke rounded-lg shadow-xl">
          <span>PMS EXE (Version 1.0) 12-05-2023</span>
          {/* <Button variant="contained" className="!bg-secondary">
            <a href="https://pmsaea8.blob.core.windows.net/prod-help-video-setup/PGCTimeTracker.msi">
              Download
            </a>
          </Button> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
