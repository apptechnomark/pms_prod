/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";

import Datatable from "@/components/approvals/Datatable";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
// Icons
import ExportIcon from "@/assets/icons/ExportIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
// Material Import
import {
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
  InputBase,
} from "@mui/material";
import Drawer from "@/components/approvals/Drawer";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import FilterDialog_Approval from "@/components/approvals/FilterDialog_Approval";
import IdleTimer from "@/components/common/IdleTimer";
import Loading from "@/assets/icons/reports/Loading";
import axios from "axios";
import SearchIcon from "@/assets/icons/SearchIcon";

const exportBody = {
  pageNo: 1,
  pageSize: 50000,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  userId: null,
  clientId: null,
  projectId: null,
  startDate: null,
  endDate: null,
  StatusId: 6,
  ProcessId: null,
};

const Page = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [hasEditId, setHasEditId] = useState(0);
  const [iconIndex, setIconIndex] = useState<number>(0);
  const [hasId, setHasId] = useState("");
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [isFilterOpen, setisFilterOpen] = useState<boolean>(false);
  const [dataFunction, setDataFunction] = useState<(() => void) | null>(null);
  const [currentFilterData, setCurrentFilterData] = useState([]);
  const [hasComment, setHasComment] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [canExport, setCanExport] = useState<boolean>(false);

  const handleCloseFilter = () => {
    setisFilterOpen(false);
  };

  const getIdFromFilterDialog = (data: any) => {
    setCurrentFilterData(data);
  };

  useEffect(() => {
    if (localStorage.getItem("isClient") === "false") {
      if (!hasPermissionWorklog("", "View", "Approvals")) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const ColorToolTip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#0281B9",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#0281B9",
    },
  }));

  // To Toggle Drawer
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setHasEditId(0);
    setHasComment(false);
    setHasError(false);
    setHasId("");
    setGlobalSearchValue("");
  };

  // To Toggle Drawer for Edit
  const handleEdit = (rowId: any, Id: any, iconIndex?: number) => {
    setIconIndex(iconIndex !== undefined ? iconIndex : 0);
    setHasEditId(rowId);
    setOpenDrawer(true);
    setHasId(Id);
  };

  // For refreshing data in Datatable from drawer
  const handleDataFetch = (getData: () => void) => {
    setDataFunction(() => getData);
  };

  // To Toggle Drawer for Comments
  const handleSetComments = (rowData: any, selectedId: number) => {
    setHasComment(true);
    setOpenDrawer(rowData);
    setHasEditId(selectedId);
  };

  // To Toggle Drawer for Error
  const handleSetError = (rowData: any, selectedId: number) => {
    setHasError(true);
    setOpenDrawer(rowData);
    setHasEditId(selectedId);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const token = localStorage.getItem("token");
    const Org_Token = localStorage.getItem("Org_Token");

    const response = await axios.post(
      `${process.env.worklog_api_url}/workitem/approval/GetReviewExportExcelList`,
      {
        ...exportBody,
        ...currentFilterData,
        isDownload: true,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
          org_token: Org_Token,
        },
        responseType: "arraybuffer",
      }
    );
    if (response.status === 200) {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "approval_report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsExporting(false);
    } else {
      toast.error("Failed to download, please try again later.");
    }
  };

  const handleCanExport = (arg1: boolean) => {
    setCanExport(arg1);
  };

  console.log(currentFilterData);
  

  return (
    <Wrapper>
      <IdleTimer onIdle={() => window.location.reload()} />
      <div>
        <Navbar />
        <div className="bg-white flex justify-between items-center px-[20px]">
          <div className="flex gap-[10px] items-center py-[6.5px]">
            <label className="py-[10px] cursor-pointer select-none text-[16px] text-slatyGrey">
              Review
            </label>
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="relative">
              <InputBase
                className="pl-1 pr-7 border-b border-b-slatyGrey w-52"
                placeholder="Search"
                value={globalSearchValue}
                onChange={(e: any) => setGlobalSearchValue(e.target.value)}
              />
              <span className="absolute top-2 right-2 text-slatyGrey">
                <SearchIcon />
              </span>
            </div>
            <ColorToolTip title="Filter" placement="top" arrow>
              <span
                className="cursor-pointer"
                onClick={() => setisFilterOpen(true)}
              >
                <FilterIcon />
              </span>
            </ColorToolTip>
            <ColorToolTip title="Export" placement="top" arrow>
              <span
                className={
                  canExport
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-50"
                }
                onClick={canExport ? handleExport : undefined}
              >
                {isExporting ? <Loading /> : <ExportIcon />}
              </span>
            </ColorToolTip>
          </div>
        </div>
        <Datatable
          searchValue={globalSearchValue}
          onDataFetch={handleDataFetch}
          onEdit={handleEdit}
          onDrawerOpen={handleDrawerOpen}
          currentFilterData={currentFilterData}
          onFilterOpen={isFilterOpen}
          onCloseDrawer={openDrawer}
          onComment={handleSetComments}
          onErrorLog={handleSetError}
          onHandleExport={handleCanExport}
        />

        <Drawer
          onDataFetch={dataFunction}
          onOpen={openDrawer}
          onClose={handleDrawerClose}
          onEdit={hasEditId}
          hasIconIndex={iconIndex > 0 ? iconIndex : 0}
          onHasId={hasId}
          onComment={hasComment}
          onErrorLog={hasError}
        />

        <FilterDialog_Approval
          onOpen={isFilterOpen}
          onClose={handleCloseFilter}
          onDataFetch={() => {}}
          currentFilterData={getIdFromFilterDialog}
        />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Wrapper>
  );
};

export default Page;
