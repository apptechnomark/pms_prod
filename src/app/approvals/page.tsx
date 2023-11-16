/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";

import Datatable from "@/components/approvals/Datatable";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
// Icons
import ExportIcon from "@/assets/icons/ExportIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import ImportIcon from "@/assets/icons/ImportIcon";
// Material Import
import { Tooltip, TooltipProps, tooltipClasses, styled } from "@mui/material";
import Drawer from "@/components/approvals/Drawer";
import { ToastContainer } from "react-toastify";
// import SearchIcon from "@/assets/icons/SearchIcon";
import { useRouter } from "next/navigation";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import FilterDialog_Approval from "@/components/approvals/FilterDialog_Approval";

const page = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [hasEditId, setHasEditId] = useState(0);
  const [iconIndex, setIconIndex] = useState<number>(0);
  const [hasId, setHasId] = useState("");
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const [isFilterOpen, setisFilterOpen] = useState<boolean>(false);
  const [dataFunction, setDataFunction] = useState<(() => void) | null>(null);
  const [currentFilterData, setCurrentFilterData] = useState([]);
  const [hasComment, setHasComment] = useState(false);

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

  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
  };

  // To Toggle Drawer
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setHasEditId(0);
    setHasComment(false);
    setHasId("");
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

  return (
    <Wrapper>
      <div>
        <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
        <div className="bg-white flex justify-between items-center px-[20px]">
          <div className="flex gap-[10px] items-center py-[6.5px]">
            <label className="py-[10px] cursor-pointer select-none text-[16px] text-slatyGrey">
              Review
            </label>
          </div>
          <div className="flex gap-[20px] items-center">
            <ColorToolTip title="Filter" placement="top" arrow>
              <span
                className="cursor-pointer"
                onClick={() => setisFilterOpen(true)}
              >
                <FilterIcon />
              </span>
            </ColorToolTip>
            <ColorToolTip title="Import" placement="top" arrow>
              <span className="cursor-pointer">
                <ImportIcon />
              </span>
            </ColorToolTip>
            <ColorToolTip title="Export" placement="top" arrow>
              <span className="cursor-pointer">
                <ExportIcon />
              </span>
            </ColorToolTip>
          </div>
        </div>
        <Datatable
          onDataFetch={handleDataFetch}
          onEdit={handleEdit}
          onDrawerOpen={handleDrawerOpen}
          currentFilterData={currentFilterData}
          onFilterOpen={isFilterOpen}
          onCloseDrawer={openDrawer}
          onComment={handleSetComments}
        />

        <Drawer
          onDataFetch={dataFunction}
          onOpen={openDrawer}
          onClose={handleDrawerClose}
          onEdit={hasEditId}
          hasIconIndex={iconIndex > 0 ? iconIndex : 0}
          onHasId={hasId}
          onComment={hasComment}
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

export default page;
