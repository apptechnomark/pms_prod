"use client";
import React from "react";
import Wrapper from "@/components/common/Wrapper";
import Navbar from "@/components/common/Navbar";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const downloadExe = async () => {
    try {
      const response = await axios.get(
        "https://pmsaea8.blob.core.windows.net/prod-help-video-setup/PGCTimeTracker.msi"
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          toast.success("File downloaded successfully.");
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

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
          <span>PMS EXE</span>
          <Button variant="contained" className="!bg-secondary">
            <a href="https://pmsaea8.blob.core.windows.net/prod-help-video-setup/PGCTimeTracker.msi">
              Download
            </a>
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
