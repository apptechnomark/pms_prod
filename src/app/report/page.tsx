/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import "next-ts-lib/dist/index.css";
import Wrapper from "@/components/common/Wrapper";
import Navbar from "@/components/common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import {
  TextField,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import FilterIcon from "@/assets/icons/FilterIcon";
import Datatable_Rating from "@/components/report/Datatable_Rating";
import Datatable_Task from "@/components/report/Datatable_Task";
import styled from "@emotion/styled";
import FilterDialog_Task from "../../components/report/filterDialog_Task";
import FilterDialog_Rating from "../../components/report/filterDialog_Rating";
import axios from "axios";
import SearchIcon from "@/assets/icons/SearchIcon";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { useRouter } from "next/navigation";
import ExportIcon from "@/assets/icons/ExportIcon";
import Loading from "@/assets/icons/reports/Loading";

const task_InitialFilter = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  priority: null,
  statusFilter: null,
  workType: null,
  assignedIdsForFilter: [],
  projectIdsForFilter: [],
  overDueBy: 1,
  startDate: null,
  endDate: null,
  isDownload: true,
};

const rating_InitialFilter = {
  pageNo: 1,
  pageSize: 10,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  projects: [],
  returnTypeId: null,
  typeofReturnId: null,
  ratings: null,
  dateSubmitted: null,
  users: [],
  isDownload: true,
};

const Report = () => {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isTaskClicked, setIsTaskClicked] = useState(true);
  const [isRatingClicked, setIsRatingClicked] = useState(false);
  const [currentFilterData, setCurrentFilterData] = useState<any>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Search
  const [isTaskSearch, setIsTaskSearch] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [isRatingSearch, setIsRatingSearch] = useState("");
  const [ratingData, setRatingData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("isClient") === "true") {
      if (
        (hasPermissionWorklog("", "View", "Report") &&
          (hasPermissionWorklog("Task", "View", "Report") ||
            hasPermissionWorklog("Rating", "View", "Report"))) === false
      ) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  // fetching workog data according to search values
  const handleIsTaskSearch = async (searchValue: any, orgToken: any) => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/client/task`,
        {
          PageNo: 1,
          PageSize: 50000,
          SortColumn: null,
          IsDesc: true,
          GlobalSearch: searchValue,
          Priority: null,
          StatusFilter: null,
          OverDueBy: 1,
          WorkType: null,
          AssignedIdsForFilter: [],
          ProjectIdsForFilter: [],
          StartDate: null,
          EndDate: null,
          IsDownload: false,
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
          setTaskData(response.data.ResponseData.List);
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
      if (orgToken && isTaskClicked) {
        if (isTaskSearch.length >= 3) {
          handleIsTaskSearch(isTaskSearch, orgToken);
        } else {
          handleIsTaskSearch("", orgToken);
        }
      }
    };

    fetchOrgToken();
  }, [isTaskSearch, isTaskClicked]);

  // fetching workog data according to search values
  const handleIsRatingSearch = async (searchValue: any, orgToken: any) => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/client/rating`,
        {
          PageNo: 1,
          PageSize: 50000,
          SortColumn: null,
          IsDesc: true,
          GlobalSearch: searchValue,
          Projects: [],
          ReturnTypeId: null,
          TypeofReturnId: null,
          Ratings: null,
          Users: [],
          DepartmentId: null,
          DateSubmitted: null,
          StartDate: null,
          EndDate: null,
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
          setRatingData(response.data.ResponseData.List);
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
      if (orgToken && isRatingClicked) {
        if (isRatingSearch.length >= 3) {
          handleIsRatingSearch(isRatingSearch, orgToken);
        } else {
          handleIsRatingSearch("", orgToken);
        }
      }
    };

    fetchOrgToken();
  }, [isRatingSearch, isRatingClicked]);

  // For Closing Filter Modal
  const closeFilterModal = () => {
    setIsFilterOpen(false);
  };

  const handleUserDetailsFetch = () => {};

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

  const exportClientReport = async () => {
    setIsExporting(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    const filteredData =
      typeof currentFilterData === "object" &&
      currentFilterData !== null &&
      !Array.isArray(currentFilterData)
        ? isTaskClicked
          ? {
              ...task_InitialFilter,
              projectIdsForFilter: currentFilterData.ProjectIdsForFilter,
              workType: currentFilterData.WorkType,
              priority: currentFilterData.Priority,
              startDate: currentFilterData.StartDate,
              endDate: currentFilterData.EndDate,
            }
          : isRatingClicked && {
              ...rating_InitialFilter,
              projects: currentFilterData.Projects,
              returnTypeId: currentFilterData.ReturnTypeId,
              typeofReturnId: currentFilterData.TypeofReturnId,
              ratings: currentFilterData.Ratings,
              dateSubmitted: currentFilterData.DateSubmitted,
            }
        : isTaskClicked
        ? { ...task_InitialFilter }
        : isRatingClicked && { ...rating_InitialFilter };

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/client/${
          isTaskClicked ? "task" : isRatingClicked && "rating"
        }/export`,
        { ...filteredData },
        {
          headers: { Authorization: `bearer ${token}`, org_token: Org_Token },
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
        a.download = `${
          isTaskClicked ? "task" : isRatingClicked && "rating"
        }_report.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setIsExporting(false);
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

  return (
    <Wrapper>
      <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
      <div className="bg-white flex justify-between items-center px-[20px]">
        <div className="flex gap-[20px] items-center py-[6.5px]">
          {hasPermissionWorklog("Task", "View", "Report") && (
            <label
              onClick={() => {
                setIsTaskClicked(true);
                setIsRatingClicked(false);
                setCurrentFilterData([]);
              }}
              className={`py-[10px] cursor-pointer select-none ${
                isTaskClicked
                  ? "text-secondary text-[16px] font-semibold"
                  : "text-slatyGrey text-[14px]"
              }`}
            >
              Task Report
            </label>
          )}
          {hasPermissionWorklog("Task", "View", "Report") &&
            hasPermissionWorklog("Rating", "View", "Report") && (
              <span className="text-lightSilver">|</span>
            )}
          {hasPermissionWorklog("Rating", "View", "Report") && (
            <label
              onClick={() => {
                setIsRatingClicked(true);
                setIsTaskClicked(false);
                setCurrentFilterData([]);
              }}
              className={`py-[10px] cursor-pointer select-none ${
                isRatingClicked
                  ? "text-secondary text-[16px] font-semibold"
                  : "text-slatyGrey text-[14px]"
              }`}
            >
              Rating Report
            </label>
          )}
        </div>

        <div className="flex gap-[20px] items-center">
          {isTaskClicked && hasPermissionWorklog("Task", "View", "Report") && (
            <div className="flex items-center h-full relative">
              <TextField
                className="m-0"
                placeholder="Search"
                fullWidth
                value={isTaskSearch?.trim().length <= 0 ? "" : isTaskSearch}
                onChange={(e) => setIsTaskSearch(e.target.value)}
                margin="normal"
                variant="standard"
                sx={{ mx: 0.75, maxWidth: 300 }}
              />
              <span className="absolute right-1 pl-1">
                <SearchIcon />
              </span>
            </div>
          )}
          {isRatingClicked &&
            hasPermissionWorklog("Rating", "View", "Report") && (
              <div className="flex items-center h-full relative">
                <TextField
                  className="m-0"
                  placeholder="Search"
                  fullWidth
                  value={
                    isRatingSearch?.trim().length <= 0 ? "" : isRatingSearch
                  }
                  onChange={(e) => setIsRatingSearch(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 300 }}
                />
                <span className="absolute right-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}
          <ColorToolTip title="filter" placement="top" arrow>
            <span
              className="cursor-pointer"
              onClick={() => setIsFilterOpen(true)}
            >
              <FilterIcon />
            </span>
          </ColorToolTip>
          <ColorToolTip title="export" placement="top" arrow>
            <span
              className={`${isExporting ? "cursor-default" : "cursor-pointer"}`}
              onClick={exportClientReport}
            >
              {isExporting ? <Loading /> : <ExportIcon />}
            </span>
          </ColorToolTip>
        </div>
      </div>

      {isTaskClicked && (
        <Datatable_Task
          currentFilterData={currentFilterData}
          onSearchData={taskData}
        />
      )}

      {isTaskClicked && (
        <FilterDialog_Task
          onOpen={isFilterOpen}
          onClose={closeFilterModal}
          currentFilterData={getIdFromFilterDialog}
        />
      )}

      {isRatingClicked && (
        <Datatable_Rating
          currentFilterData={currentFilterData}
          onSearchData={ratingData}
        />
      )}

      {isRatingClicked && (
        <FilterDialog_Rating
          onOpen={isFilterOpen}
          onClose={closeFilterModal}
          currentFilterData={getIdFromFilterDialog}
        />
      )}

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
export default Report;
