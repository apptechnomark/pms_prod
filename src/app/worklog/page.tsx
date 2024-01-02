/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import DrawerOverlay from "@/components/settings/drawer/DrawerOverlay";
import Drawer from "@/components/worklog/Drawer";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import Datatable_Worklog from "@/components/worklog/Datatable_Worklog";
import Datatable_CompletedTask from "@/components/worklog/Datatable_CompletedTask";
import AddPlusIcon from "@/assets/icons/AddPlusIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import FilterDialog from "@/components/worklog/filterDialog";
import SearchIcon from "@/assets/icons/SearchIcon";
import ImportIcon from "@/assets/icons/ImportIcon";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { useRouter } from "next/navigation";
import ImportDialog from "@/components/worklog/worklog_Import/ImportDialog";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import { callAPI } from "@/utils/API/callAPI";

const Worklog = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [hasEdit, setHasEdit] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [dataFunction, setDataFunction] = useState<(() => void) | null>(null);
  const [isWorklogClicked, setIsWorklogClicked] = useState(true);
  const [isCompletedTaskClicked, setIsCompletedTaskClicked] = useState(false);
  const [hasComment, setHasComment] = useState(false);
  const [hasErrorLog, setHasErrorLog] = useState(false);
  const [currentFilterData, setCurrentFilterData] = useState([]);
  const [errorLog, setErrorLog] = useState(false);
  const [isWorklogSearch, setIsWorklogSearch] = useState("");
  const [workTypeData, setWorkTypeData] = useState([]);
  const [isWorklogCompleteSearch, setIsWorklogCompleteSearch] = useState("");
  const [workTypeCompleteData, setWorkTypeCompleteData] = useState([]);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isClient") === "true") {
      if (
        (hasPermissionWorklog("", "View", "Worklogs") &&
          (hasPermissionWorklog("Task/SubTask", "View", "Worklogs") ||
            hasPermissionWorklog("Rating", "View", "Worklogs"))) === false
      ) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleIsWorklogSearch = async (searchValue: any) => {
    const params = {
      PageNo: 1,
      PageSize: 50000,
      SortColumn: "",
      IsDesc: true,
      GlobalSearch: searchValue,
      ProjectIds: null,
      OverdueBy: null,
      PriorityId: null,
      StatusId: null,
      WorkTypeId: null,
      AssignedTo: null,
      StartDate: null,
      EndDate: null,
      DueDate: null,
      IsCreatedByClient: null,
      IsCompletedTaskPage: false,
      IsSignedOff: false,
      ...currentFilterData,
    };
    const url = `${process.env.worklog_api_url}/ClientWorkitem/getworkitemlist`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setWorkTypeData(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  useEffect(() => {
    const fetchOrgToken = async () => {
      const orgToken = await localStorage.getItem("Org_Token");
      if (orgToken && isWorklogClicked) {
        if (isWorklogSearch.length >= 3) {
          handleIsWorklogSearch(isWorklogSearch);
        } else {
          handleIsWorklogSearch("");
        }
      }
    };

    fetchOrgToken();
  }, [isWorklogSearch, isWorklogClicked]);

  const handleIsWorklogCompleteSearch = async (searchValue: any) => {
    const params = {
      PageNo: 1,
      PageSize: 50000,
      SortColumn: "",
      IsDesc: true,
      GlobalSearch: searchValue,
      ProjectIds: null,
      OverdueBy: null,
      PriorityId: null,
      StatusId: null,
      WorkTypeId: null,
      AssignedTo: null,
      StartDate: null,
      EndDate: null,
      DueDate: null,
      IsCreatedByClient: null,
      IsCompletedTaskPage: true,
      IsSignedOff: false,
      ...currentFilterData,
    };
    const url = `${process.env.worklog_api_url}/ClientWorkitem/getworkitemlist`;
    const successCallback = (
      ResponseData: any,
      error: any,
      ResponseStatus: any
    ) => {
      if (ResponseStatus === "Success" && error === false) {
        setWorkTypeCompleteData(ResponseData.List);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  useEffect(() => {
    const fetchOrgToken = async () => {
      const orgToken = await localStorage.getItem("Org_Token");
      if (orgToken && isCompletedTaskClicked) {
        if (isWorklogCompleteSearch.length >= 3) {
          handleIsWorklogCompleteSearch(isWorklogCompleteSearch);
        } else {
          handleIsWorklogCompleteSearch("");
        }
      }
    };

    fetchOrgToken();
  }, [isWorklogCompleteSearch, isCompletedTaskClicked]);

  const closeFilterModal = () => {
    setIsFilterOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setIsWorklogSearch("");
    setIsWorklogCompleteSearch("");
    setOpenDrawer(false);
    setHasEdit(0);
    setHasComment(false);
    setHasErrorLog(false);
  };

  const handleDataFetch = (getData: () => void) => {
    setDataFunction(() => getData);
  };

  const handleEdit = (rowData: any) => {
    setHasEdit(rowData);
    setOpenDrawer(true);
  };

  const handleSetComments = (rowData: any, selectedId: number) => {
    setHasComment(true);
    setOpenDrawer(rowData);
    setHasEdit(selectedId);
  };

  const handleSetErrorLog = (rowData: any, selectedId: number) => {
    setHasErrorLog(true);
    setOpenDrawer(rowData);
    setHasEdit(selectedId);
  };

  const getIdFromFilterDialog = (data: any) => {
    setCurrentFilterData(data);
  };

  return (
    <Wrapper>
      <Navbar />
      <div className="bg-white flex justify-between items-center px-[20px]">
        <div className="flex gap-[16px] items-center py-[6.5px]">
          {hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && (
            <label
              onClick={() => {
                setIsWorklogClicked(true);
                setIsCompletedTaskClicked(false);
                setErrorLog(false);
              }}
              className={`py-[10px] text-[16px] cursor-pointer select-none ${
                isWorklogClicked
                  ? "text-secondary font-semibold"
                  : "text-slatyGrey"
              }`}
            >
              Work Logs
            </label>
          )}
          {hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") &&
            hasPermissionWorklog("Rating", "View", "WorkLogs") && (
              <span className="text-lightSilver">|</span>
            )}
          {hasPermissionWorklog("Rating", "View", "WorkLogs") && (
            <label
              onClick={() => {
                setIsCompletedTaskClicked(true);
                setIsWorklogClicked(false);
                setErrorLog(true);
              }}
              className={`py-[10px] text-[16px] cursor-pointer select-none ${
                isCompletedTaskClicked
                  ? "text-secondary font-semibold"
                  : "text-slatyGrey"
              }`}
            >
              Completed Task
            </label>
          )}
        </div>

        <div className="flex gap-[20px] items-center justify-center">
          {isWorklogClicked &&
            hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && (
              <div className="flex items-center h-full relative">
                <TextField
                  className="m-0"
                  placeholder="Search"
                  fullWidth
                  value={
                    isWorklogSearch?.trim().length <= 0 ? "" : isWorklogSearch
                  }
                  onChange={(e) => setIsWorklogSearch(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 300 }}
                />
                <span className="absolute right-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}
          {isCompletedTaskClicked &&
            hasPermissionWorklog("Rating", "View", "WorkLogs") && (
              <div className="flex items-center h-full relative">
                <TextField
                  className="m-0"
                  placeholder="Search"
                  fullWidth
                  value={
                    isWorklogCompleteSearch?.trim().length <= 0
                      ? ""
                      : isWorklogCompleteSearch
                  }
                  onChange={(e) => setIsWorklogCompleteSearch(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 300 }}
                />
                <span className="absolute right-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}
          <ColorToolTip title="Filter" placement="top" arrow>
            <span
              className="cursor-pointer"
              onClick={() => setIsFilterOpen(true)}
            >
              <FilterIcon />
            </span>
          </ColorToolTip>

          <ColorToolTip title="Import" placement="top" arrow>
            <span
              className="cursor-pointer"
              onClick={() => {
                setIsImportOpen(true);
              }}
            >
              <ImportIcon />
            </span>
          </ColorToolTip>

          <Button
            type="submit"
            variant="contained"
            className="rounded-[4px] !h-[36px] !bg-secondary"
            onClick={
              hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")
                ? handleDrawerOpen
                : () => toast.error("User not have permission to Create Task")
            }
          >
            <span className="flex items-center justify-center gap-[10px] px-[5px]">
              <span>
                <AddPlusIcon />
              </span>
              <span>Create Task</span>
            </span>
          </Button>
        </div>
      </div>

      {isWorklogClicked && (
        <Datatable_Worklog
          onDataFetch={handleDataFetch}
          onEdit={handleEdit}
          onDrawerOpen={handleDrawerOpen}
          onComment={handleSetComments}
          currentFilterData={currentFilterData}
          onSearchWorkTypeData={workTypeData}
          onCloseDrawer={openDrawer}
        />
      )}

      {isCompletedTaskClicked && (
        <Datatable_CompletedTask
          onDataFetch={handleDataFetch}
          onDrawerOpen={handleDrawerOpen}
          onComment={handleSetComments}
          onErrorLog={handleSetErrorLog}
          currentFilterData={currentFilterData}
          onSearchWorkTypeData={workTypeCompleteData}
          onCloseDrawer={openDrawer}
        />
      )}

      <Drawer
        onDataFetch={dataFunction}
        onOpen={openDrawer}
        onClose={handleDrawerClose}
        onEdit={hasEdit}
        onComment={hasComment}
        onErrorLog={hasErrorLog}
        errorLog={errorLog}
        isCompletedTaskClicked={isCompletedTaskClicked}
      />

      <DrawerOverlay isOpen={openDrawer} onClose={handleDrawerClose} />

      {/* Filter Dialog Box */}
      <FilterDialog
        onOpen={isFilterOpen}
        onClose={closeFilterModal}
        currentFilterData={getIdFromFilterDialog}
        isCompletedTaskClicked={isCompletedTaskClicked}
      />

      <ImportDialog
        onOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onDataFetch={dataFunction}
      />
    </Wrapper>
  );
};

export default Worklog;
