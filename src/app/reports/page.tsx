/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import axios from "axios";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import React, { Fragment, useEffect, useRef, useState } from "react";

//toast
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

//icons
import LineIcon from "@/assets/icons/reports/LineIcon";
import MoreIcon from "@/assets/icons/reports/MoreIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import ExportIcon from "@/assets/icons/ExportIcon";
import Loading from "@/assets/icons/reports/Loading";
import SearchIcon from "@/assets/icons/SearchIcon";

// Tabs components
import Client from "@/components/reports/tables/Client";
import Project from "@/components/reports/tables/Project";
import User from "@/components/reports/tables/User";
import TimeSheet from "@/components/reports/tables/TimeSheet";
import Workload from "@/components/reports/tables/Workload";
import UserLogs from "@/components/reports/tables/UserLogs";
import Audit from "@/components/reports/tables/Audit";
import BillingReport from "@/components/reports/tables/BillingReport";
import CustomReport from "@/components/reports/tables/CustomReport";

// common functions
import { getCurrentTabDetails } from "@/utils/reports/getFilters";
import { hasPermissionWorklog } from "@/utils/commonFunction";

// filter body for reports
import { client_project_InitialFilter } from "@/utils/reports/getFilters";
import { user_InitialFilter } from "@/utils/reports/getFilters";
import { timeSheet_InitialFilter } from "@/utils/reports/getFilters";
import { workLoad_InitialFilter } from "@/utils/reports/getFilters";
import { userLogs_InitialFilter } from "@/utils/reports/getFilters";
import { audit_InitialFilter } from "@/utils/reports/getFilters";
import { billingreport_InitialFilter } from "@/utils/reports/getFilters";
import { customreport_InitialFilter } from "@/utils/reports/getFilters";
import { rating_InitialFilter } from "@/utils/reports/getFilters";

//filter components
import ClientFilter from "@/components/reports/Filter/ClientFilter";
import ProjectFilter from "@/components/reports/Filter/ProjectFilter";
import UserFilter from "@/components/reports/Filter/UserFilter";
import WorkLoadFilter from "@/components/reports/Filter/WorkLoadFilter";
import UserLogsFilter from "@/components/reports/Filter/UserLogsFilter";
import TimesheetFilter from "@/components/reports/Filter/TimesheetFilter";
import BillingReportFilter from "@/components/reports/Filter/BillingReportFilter";
import CustomReportFilter from "@/components/reports/Filter/CustomReportFilter";
import RatingReport from "@/components/reports/tables/RatingReport";
import RatingReportFilter from "@/components/reports/Filter/RatingReportFilter";
import AuditFilter from "@/components/reports/Filter/AuditFilter";

const primaryTabs = [
  { label: "project", value: 1 },
  { label: "user", value: 2 },
  { label: "timesheet", value: 3 },
  { label: "workload", value: 4 },
  { label: "billing", value: 7 },
  { label: "custom", value: 8 },
];

const secondaryTabs = [
  { label: "user log", value: 5 },
  { label: "audit", value: 6 },
  { label: "rating", value: 9 },
];

const page = () => {
  const router = useRouter();
  const moreTabsRef = useRef<HTMLDivElement>(null);
  const [activeTabs, setActiveTabs] = useState<any[]>(primaryTabs);
  const [moreTabs, setMoreTabs] = useState<any[]>(secondaryTabs);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [lastTab, setLastTab] = useState<string>("billing report");
  const [showMoreTabs, setShowMoreTabs] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [hasBTC, setHasBTC] = useState<boolean>(false);
  const [hasRaisedInvoiceData, setHasRaisedInvoiceData] =
    useState<boolean>(false);
  const [saveBTCData, setSaveBTCData] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
  };

  const [projectSearchValue, setProjectSearchValue] = useState("");
  const [projectSearchData, setProjectSearchData] = useState([]);
  const [userSeachValue, setUserSearchValue] = useState("");
  const [userSearchData, setUserSearchData] = useState([]);
  const [timesheetSearchValue, setTimesheetSeachValue] = useState("");
  const [timesheetSearchData, setTimesheetSeachData] = useState([]);
  const [workloadSearchValue, setWorkloadSearchValue] = useState("");
  const [workloadSearchData, setWorkloadSearchData] = useState([]);
  const [userLogSearchValue, setUserLogSearchValue] = useState("");
  const [userLogSearchData, setUserLogSearchData] = useState([]);
  const [auditSearchValue, setAuditSearchValue] = useState("");
  const [auditSeachData, setAuditSearchData] = useState([]);
  const [billingReportSearchValue, setBillingReportSearchValue] = useState("");
  const [billingReportSearchData, setBillingReportSearchData] = useState([]);
  const [customReportSearchValue, setCustomReportSearchValue] = useState("");
  const [customReportSearchData, setCustomReportSearchData] = useState([]);
  const [ratingSearchValue, setRatingSearchValue] = useState("");
  const [ratingSearchData, setRatingSearchData] = useState([]);

  //handling outside click for moreTabs
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (moreTabsRef.current && !moreTabsRef.current.contains(event.target)) {
        setShowMoreTabs(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  //handle routing & permission
  useEffect(() => {
    if (localStorage.getItem("isClient") === "false") {
      if (
        !hasPermissionWorklog("", "View", "Report") &&
        (!hasPermissionWorklog("project", "View", "Report") ||
          !hasPermissionWorklog("user", "View", "Report") ||
          !hasPermissionWorklog("timesheet", "View", "Report") ||
          !hasPermissionWorklog("workload", "View", "Report") ||
          !hasPermissionWorklog("user log", "View", "Report") ||
          !hasPermissionWorklog("audit", "View", "Report") ||
          !hasPermissionWorklog("billing report", "View", "Report") ||
          !hasPermissionWorklog("custom report", "View", "Report"))
      ) {
        router.push("/");
      } else {
        setActiveTabs(
          primaryTabs.map((tab: any) =>
            hasPermissionWorklog(tab.label, "view", "report") ? tab : false
          )
        );

        setMoreTabs(
          secondaryTabs.map((tab: any) =>
            hasPermissionWorklog(tab.label, "view", "report") ? tab : false
          )
        );

        setActiveTab(
          primaryTabs
            .map((tab: any) =>
              hasPermissionWorklog(tab.label, "view", "report") ? tab : false
            )
            .filter((tab: any) => tab !== false)[0].value
        );
      }
    } else {
      router.push("/");
    }
  }, [router]);

  //tab change handling
  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    setFilteredData(null);
  };

  //handling more tabs
  const handleMoreTabsClick = (tab: any, index: number) => {
    //index of clicked tab in moreTab section
    const clickedIndex = index;

    //object of last present in activeTabs
    const lastVisibleTab = activeTabs[activeTabs.length - 1];

    //closing the more tabs section
    setShowMoreTabs(false);

    //handling tab change
    handleTabChange(tab.value);

    //updating the activeTabs state with the newly clicked tab
    setActiveTabs((prevTabs) =>
      prevTabs.map((tab: any, index: number) =>
        index === activeTabs.length - 1 ? moreTabs[clickedIndex] : tab
      )
    );

    //updating the moreTabs state with the last tab present in activeTabs
    setMoreTabs((prevTabs) =>
      prevTabs.map((tab: any, index: number) =>
        index === clickedIndex ? lastVisibleTab : tab
      )
    );
  };

  const handleFilterData = (arg1: any) => {
    setFilteredData(arg1);
  };

  const handleFilter = (arg1: boolean) => {
    setIsFiltering(arg1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const token = localStorage.getItem("token");
    const Org_Token = localStorage.getItem("Org_Token");

    const filtered =
      filteredData === null
        ? getCurrentTabDetails(activeTab, true)
        : filteredData;

    const response = await axios.post(
      `${process.env.report_api_url}/report/${getCurrentTabDetails(
        activeTab
      )}/export`,
      {
        ...filtered,
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
      a.download = `${getCurrentTabDetails(activeTab)}_report.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsExporting(false);
    } else {
      toast.error("Failed to download, please try again later.");
    }
  };

  // getting project data by search
  const getProjectSearchData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/project`,
        { ...client_project_InitialFilter, globalSearch: seachValue },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setProjectSearchData(response.data.ResponseData.List);
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
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // getting User data by search
  const getUserSearchData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/user`,
        { ...user_InitialFilter, globalSearch: seachValue },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setUserSearchData(response.data.ResponseData.List);
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
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // getting timesheet data by search
  const getTimesheetSearchData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/timesheet`,
        { ...timeSheet_InitialFilter, globalSearch: seachValue },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_Token: Org_Token,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setTimesheetSeachData(response.data.ResponseData.List);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else toast.error(data);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else toast.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // getting Workload data by search
  const getWorkloadSearchData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/workLoad`,
        { ...workLoad_InitialFilter, globalSearch: seachValue },
        { headers: { Authorization: `bearer ${token}`, org_token: Org_Token } }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setWorkloadSearchData(response.data.ResponseData.List);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later");
          } else toast.error(data);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later");
        } else toast.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // getting User Log data by search
  const getUserLogSearchData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/userLog`,
        { ...userLogs_InitialFilter, globalSearch: seachValue },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: Org_Token,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setUserLogSearchData(response.data.ResponseData.List);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later");
          } else toast.error(data);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later");
        } else toast.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // getting Audit Data by search
  const getAuditReportData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/audit`,
        { ...audit_InitialFilter, globalSearch: seachValue },
        { headers: { Authorization: `bearer ${token}`, org_token: Org_Token } }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setAuditSearchData(response.data.ResponseData.List);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else toast.error(data);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else toast.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // getting Billing Report Data by search
  const getBillingReportData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/billing`,
        { ...billingreport_InitialFilter, globalSearch: seachValue },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setBillingReportSearchData(response.data.ResponseData.List);
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
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // getting Custom Rport Data by search
  const getCustomReportData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/custom`,
        { ...customreport_InitialFilter, globalSearch: seachValue },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setCustomReportSearchData(response.data.ResponseData.List);
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
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // getting Rating Data by search
  const getRatingSearchData = async (seachValue: string) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/admin/rating`,
        { ...rating_InitialFilter, GlobalSearch: seachValue },
        { headers: { Authorization: `bearer ${token}`, org_token: Org_Token } }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setRatingSearchData(response.data.ResponseData.List);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else toast.error(data);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else toast.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Search function for all tabs
  useEffect(() => {
    const handleSearch = (
      value: string,
      searchFunction: {
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (seachValue: string): Promise<void>;
        (arg0: string): void;
      }
    ) => {
      if (value.length >= 3) {
        searchFunction(value);
      } else {
        searchFunction("");
      }
    };

    switch (activeTab) {
      case 1:
        handleSearch(projectSearchValue, getProjectSearchData);
        break;
      case 2:
        handleSearch(userSeachValue, getUserSearchData);
        break;
      case 3:
        handleSearch(timesheetSearchValue, getTimesheetSearchData);
        break;
      case 4:
        handleSearch(workloadSearchValue, getWorkloadSearchData);
        break;
      case 5:
        handleSearch(userLogSearchValue, getUserLogSearchData);
        break;
      case 6:
        handleSearch(auditSearchValue, getAuditReportData);
        break;
      case 7:
        handleSearch(billingReportSearchValue, getBillingReportData);
        break;
      case 8:
        handleSearch(customReportSearchValue, getCustomReportData);
        break;
      case 9:
        handleSearch(ratingSearchValue, getRatingSearchData);
        break;
      default:
        break;
    }
  }, [
    activeTab,
    projectSearchValue,
    timesheetSearchValue,
    userSeachValue,
    workloadSearchValue,
    userLogSearchValue,
    auditSearchValue,
    billingReportSearchValue,
    customReportSearchValue,
    ratingSearchValue,
  ]);

  const MoreTabs = () => {
    return (
      <div
        style={{
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        }}
        className="absolute w-36 z-50 bg-slate-50 rounded flex flex-col whitespace-nowrap"
      >
        {moreTabs
          .filter((tab: any) => tab !== false)
          .map((tab: any, index: number) => (
            <div
              className={`py-2 w-full hover:bg-[#0000000e] ${
                index === 0 ? "rounded-t" : ""
              } ${index === moreTabs.length - 1 ? "rounded-b" : ""}`}
              onClick={() => handleMoreTabsClick(tab, index)}
            >
              <label
                className={`mx-4 my-1 flex capitalize cursor-pointer text-base`}
              >
                {tab.label}
                {tab.label.toLowerCase() === "billing" ||
                tab.label.toLowerCase() === "custom" ||
                tab.label.toLowerCase() === "rating"
                  ? " report"
                  : ""}
              </label>
            </div>
          ))}
      </div>
    );
  };

  return (
    <Wrapper>
      <div>
        <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
        <div className="w-full pr-5 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              {activeTabs
                .filter((tab: any) => tab !== false)
                .map((tab: any, index: number) => (
                  <Fragment key={index}>
                    <label
                      className={`mx-4 capitalize cursor-pointer text-base ${
                        activeTab === tab.value
                          ? "text-secondary font-semibold"
                          : "text-slatyGrey"
                      }`}
                      onClick={() => handleTabChange(tab.value)}
                    >
                      {tab.label}
                      {tab.label.toLowerCase() === "billing" ||
                      tab.label.toLowerCase() === "custom" ||
                      tab.label.toLowerCase() === "rating"
                        ? " report"
                        : ""}
                    </label>
                    <LineIcon />
                  </Fragment>
                ))}
            </div>
            <div className="cursor-pointer relative">
              <div
                ref={moreTabsRef}
                onClick={() => setShowMoreTabs(!showMoreTabs)}
              >
                <MoreIcon />
              </div>
              {showMoreTabs && <MoreTabs />}
            </div>
          </div>

          <div className="h-full flex items-center gap-5">
            {activeTab === 1 && (
              <div className="flex items-center relative">
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={projectSearchValue}
                  onChange={(e) => setProjectSearchValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            {activeTab === 2 && (
              <div className="flex items-center relative">
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={userSeachValue}
                  onChange={(e) => setUserSearchValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            {activeTab === 3 && (
              <div className="flex items-center relative">
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={timesheetSearchValue}
                  onChange={(e) => setTimesheetSeachValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            {activeTab === 4 && (
              <div className="flex items-center relative">
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={workloadSearchValue}
                  onChange={(e) => setWorkloadSearchValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            {activeTab === 5 && (
              <div className="flex items-center relative">
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={userLogSearchValue}
                  onChange={(e) => setUserLogSearchValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            {activeTab === 6 && (
              <div className="flex items-center relative">
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={auditSearchValue}
                  onChange={(e) => setAuditSearchValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            {activeTab === 7 && (
              <div className="flex items-center relative">
                <TextField
                  className="w-[130px]"
                  placeholder="Search"
                  variant="standard"
                  value={billingReportSearchValue}
                  onChange={(e) => setBillingReportSearchValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            {activeTab === 8 && (
              <div className="flex items-center relative">
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={customReportSearchValue}
                  onChange={(e) => setCustomReportSearchValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            {activeTab === 9 && (
              <div className="flex items-center relative">
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={ratingSearchValue}
                  onChange={(e) => setRatingSearchValue(e.target.value)}
                />
                <span className="absolute right-1 py-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            )}

            <span
              className="cursor-pointer relative"
              onClick={() => {
                setIsFiltering(true);
              }}
            >
              <FilterIcon />
            </span>
            <span
              className={`${
                isExporting ? "cursor-default" : "cursor-pointer"
              } ${
                getCurrentTabDetails(activeTab).toLowerCase() === "custom" &&
                filteredData === null
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              onClick={
                getCurrentTabDetails(activeTab).toLowerCase() === "custom" &&
                filteredData === null
                  ? undefined
                  : handleExport
              }
            >
              {isExporting ? <Loading /> : <ExportIcon />}
            </span>

            {activeTab === 7 && (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  color="info"
                  disabled={!hasRaisedInvoiceData}
                  className={`${hasRaisedInvoiceData ? "!bg-secondary" : ""}`}
                  onClick={() => setSaveBTCData(true)}
                >
                  Raise Invoice
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="info"
                  disabled={!hasBTC}
                  className={`${hasBTC ? "!bg-secondary" : ""}`}
                  onClick={() => setSaveBTCData(true)}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {/* tabs */}
        {activeTab === 0 && <Client filteredData={filteredData} />}
        {activeTab === 1 && (
          <Project
            filteredData={filteredData}
            onProjectSearchData={projectSearchData}
          />
        )}
        {activeTab === 2 && (
          <User filteredData={filteredData} onUserSearchData={userSearchData} />
        )}
        {activeTab === 3 && (
          <TimeSheet
            filteredData={filteredData}
            onTimesheetSearchData={timesheetSearchData}
          />
        )}
        {activeTab === 4 && (
          <Workload
            filteredData={filteredData}
            onWorkloadSearchData={workloadSearchData}
          />
        )}
        {activeTab === 5 && (
          <UserLogs
            filteredData={filteredData}
            onUserLogSearchData={userLogSearchData}
          />
        )}
        {activeTab === 6 && (
          <Audit
            filteredData={filteredData}
            onAuditSearchData={auditSeachData}
          />
        )}
        {activeTab === 7 && (
          <BillingReport
            filteredData={filteredData}
            hasBTCData={(arg1: any) => setHasBTC(arg1)}
            hasRaisedInvoiceData={(arg1: any) => setHasRaisedInvoiceData(arg1)}
            isSavingBTCData={saveBTCData}
            onSaveBTCDataComplete={() => setSaveBTCData(false)}
            onBillingReportSearchData={billingReportSearchData}
          />
        )}
        {activeTab === 8 && (
          <CustomReport
            filteredData={filteredData}
            onCustomReportSearchData={customReportSearchData}
          />
        )}
        {activeTab === 9 && (
          <RatingReport
            filteredData={filteredData}
            onRatingSearchData={ratingSearchData}
          />
        )}
      </div>

      {/* tabs filter */}
      {activeTab === 0 && (
        <ClientFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}

      {activeTab === 1 && (
        <ProjectFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}

      {activeTab === 2 && (
        <UserFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}

      {activeTab === 3 && (
        <TimesheetFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}

      {activeTab === 4 && (
        <WorkLoadFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}

      {activeTab === 5 && (
        <UserLogsFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}

      {activeTab === 6 && (
        <AuditFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}

      {activeTab === 7 && (
        <BillingReportFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}
      {activeTab === 8 && (
        <CustomReportFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
        />
      )}
      {activeTab === 9 && (
        <RatingReportFilter
          isFiltering={isFiltering}
          sendFilterToPage={handleFilterData}
          onDialogClose={handleFilter}
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

export default page;
