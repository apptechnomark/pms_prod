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
        <div className="px-5 flex justify-between items-center w-full h-10">
          <span>kfojsdf</span>
          <Button variant="contained" className="!bg-secondary">
            Download
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
