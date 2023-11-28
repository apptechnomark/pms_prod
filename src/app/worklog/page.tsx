/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";

import DrawerOverlay from "@/components/settings/drawer/DrawerOverlay";
import Drawer from "@/components/worklog/Drawer";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";

import Datatable_Worklog from "@/components/worklog/Datatable_Worklog";
import Datatable_CompletedTask from "@/components/worklog/Datatable_CompletedTask";
// Icons
import AddPlusIcon from "@/assets/icons/AddPlusIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
// Material Import
import {
  Button,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import styled from "@emotion/styled";
import FilterDialog from "@/components/worklog/filterDialog";
import SearchIcon from "@/assets/icons/SearchIcon";
import ImportIcon from "@/assets/icons/ImportIcon";
import axios from "axios";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { useRouter } from "next/navigation";
import ImportDialog from "@/components/worklog/worklog_Import/ImportDialog";

const Worklog = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [hasEdit, setHasEdit] = useState(0);
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [dataFunction, setDataFunction] = useState<(() => void) | null>(null);
  const [isWorklogClicked, setIsWorklogClicked] = useState(true);
  const [isCompletedTaskClicked, setIsCompletedTaskClicked] = useState(false);
  const [hasComment, setHasComment] = useState(false);
  const [hasErrorLog, setHasErrorLog] = useState(false);
  const [currentFilterData, setCurrentFilterData] = useState([]);
  const [errorLog, setErrorLog] = useState(false);

  // Search
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

  // fetching workog data according to search values
  const handleIsWorklogSearch = async (searchValue: any, orgToken: any) => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/ClientWorkitem/getworkitemlist`,
        {
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
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: orgToken,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setWorkTypeData(response.data.ResponseData.List);
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
          toast.error("Login failed. Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchOrgToken = async () => {
      const orgToken = await localStorage.getItem("Org_Token");
      if (orgToken && isWorklogClicked) {
        if (isWorklogSearch.length >= 3) {
          handleIsWorklogSearch(isWorklogSearch, orgToken);
        } else {
          handleIsWorklogSearch("", orgToken);
        }
      }
    };

    fetchOrgToken();
  }, [isWorklogSearch, isWorklogClicked]);

  // fetching workog data according to search values
  const handleIsWorklogCompleteSearch = async (
    searchValue: any,
    orgToken: any
  ) => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/ClientWorkitem/getworkitemlist`,
        {
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
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: orgToken,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setWorkTypeCompleteData(response.data.ResponseData.List);
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
          toast.error("Login failed. Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchOrgToken = async () => {
      const orgToken = await localStorage.getItem("Org_Token");
      if (orgToken && isCompletedTaskClicked) {
        if (isWorklogCompleteSearch.length >= 3) {
          handleIsWorklogCompleteSearch(isWorklogCompleteSearch, orgToken);
        } else {
          handleIsWorklogCompleteSearch("", orgToken);
        }
      }
    };

    fetchOrgToken();
  }, [isWorklogCompleteSearch, isCompletedTaskClicked]);

  // For Closing Filter Modal
  const closeFilterModal = () => {
    setIsFilterOpen(false);
  };

  // To Toggle Drawer
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

  // For refreshing data in Datatable from drawer
  const handleDataFetch = (getData: () => void) => {
    setDataFunction(() => getData);
  };

  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
  };

  // To Toggle Drawer for Edit
  const handleEdit = (rowData: any) => {
    setHasEdit(rowData);
    setOpenDrawer(true);
  };

  // To Toggle Drawer for Comments
  const handleSetComments = (rowData: any, selectedId: number) => {
    setHasComment(true);
    setOpenDrawer(rowData);
    setHasEdit(selectedId);
  };

  // To Toggle Drawer for ErrorLog
  const handleSetErrorLog = (rowData: any, selectedId: number) => {
    setHasErrorLog(true);
    setOpenDrawer(rowData);
    setHasEdit(selectedId);
  };

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

  const getIdFromFilterDialog = (data: any) => {
    setCurrentFilterData(data);
  };

  return (
    <Wrapper>
      <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
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
    </Wrapper>
  );
};

export default Worklog;
