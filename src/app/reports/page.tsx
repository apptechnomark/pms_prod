/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import {
  Button,
  InputBase,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import React, { Fragment, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import LineIcon from "@/assets/icons/reports/LineIcon";
import MoreIcon from "@/assets/icons/reports/MoreIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import ExportIcon from "@/assets/icons/ExportIcon";
import Loading from "@/assets/icons/reports/Loading";
import SearchIcon from "@/assets/icons/SearchIcon";
import Client from "@/components/reports/tables/Client";
import Project from "@/components/reports/tables/Project";
import User from "@/components/reports/tables/User";
import TimeSheet from "@/components/reports/tables/TimeSheet";
import Workload from "@/components/reports/tables/Workload";
import UserLogs from "@/components/reports/tables/UserLogs";
import Audit from "@/components/reports/tables/Audit";
import BillingReport from "@/components/reports/tables/BillingReport";
import CustomReport from "@/components/reports/tables/CustomReport";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { haveSameData } from "@/utils/reports/commonFunctions";
import {
  customreport_InitialFilter,
  getCurrentTabDetails,
} from "@/utils/reports/getFilters";
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
import styled from "@emotion/styled";

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

const Page = () => {
  const router = useRouter();
  const moreTabsRef = useRef<HTMLDivElement>(null);
  const [activeTabs, setActiveTabs] = useState<any[]>(primaryTabs);
  const [moreTabs, setMoreTabs] = useState<any[]>(secondaryTabs);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [showMoreTabs, setShowMoreTabs] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [hasBTC, setHasBTC] = useState<boolean>(false);
  const [hasRaisedInvoiceData, setHasRaisedInvoiceData] =
    useState<boolean>(false);
  const [saveBTCData, setSaveBTCData] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  //handling outside click for moreTabs
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      const isOutsideMoreTabs =
        moreTabsRef.current && !moreTabsRef.current.contains(event.target);

      if (isOutsideMoreTabs) {
        setShowMoreTabs(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

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

  //check if has permissions
  const hasTabsPermission = () => {
    return (
      !hasPermissionWorklog("", "View", "Report") &&
      (!hasPermissionWorklog("project", "View", "Report") ||
        !hasPermissionWorklog("user", "View", "Report") ||
        !hasPermissionWorklog("timesheet", "View", "Report") ||
        !hasPermissionWorklog("workload", "View", "Report") ||
        !hasPermissionWorklog("user log", "View", "Report") ||
        !hasPermissionWorklog("audit", "View", "Report") ||
        !hasPermissionWorklog("billing report", "View", "Report") ||
        !hasPermissionWorklog("custom report", "View", "Report"))
    );
  };

  //redirect or set required states
  const actionAfterPermissionCheck = () => {
    if (hasTabsPermission()) {
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
  };

  //handle routing & permission
  useEffect(() => {
    const isClient = localStorage.getItem("isClient") === "false";

    if (isClient) {
      actionAfterPermissionCheck();
    } else {
      router.push("/");
    }
  }, [router]);

  //tab change handling
  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    setFilteredData(null);
    setSearchValue("");
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
        //swap the last tab of activeTabs with clicked tab of moreTabs
        index === activeTabs.length - 1 ? moreTabs[clickedIndex] : tab
      )
    );

    //updating the moreTabs state with the last tab present in activeTabs
    setMoreTabs((prevTabs) =>
      prevTabs.map((tab: any, index: number) =>
        //swap the last tab of activeTabs with clicked tab of moreTabs
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
        globalSearch: searchValue.trim().length > 0 ? searchValue : "",
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
      a.download = `${
        getCurrentTabDetails(activeTab).charAt(0).toUpperCase() +
        getCurrentTabDetails(activeTab).slice(1)
      }_report.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsExporting(false);
    } else {
      toast.error("Failed to download, please try again later.");
    }
  };

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
              key={tab.value}
              className={`py-2 w-full hover:bg-[#0000000e] ${
                index === 0 ? "rounded-t" : ""
              } ${index === moreTabs.length - 1 ? "rounded-b" : ""}`}
              onClick={() => handleMoreTabsClick(tab, index)}
            >
              <label
                className={`mx-4 my-1 flex capitalize cursor-pointer text-base`}
              >
                {tab.label}
              </label>
            </div>
          ))}
      </div>
    );
  };

  return (
    <Wrapper>
      <div>
        <Navbar />
        <div className="w-full pr-5 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              {activeTabs
                .filter((tab: any) => tab !== false)
                .map((tab: any, index: number) => (
                  <Fragment key={tab.value}>
                    <label
                      className={`mx-4 capitalize cursor-pointer text-base ${
                        activeTab === tab.value
                          ? "text-secondary font-semibold"
                          : "text-slatyGrey"
                      }`}
                      onClick={() => handleTabChange(tab.value)}
                    >
                      {tab.label}
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
            <div className="relative">
              <InputBase
                className="pl-1 pr-7 border-b border-b-slatyGrey w-52"
                placeholder="Search"
                value={searchValue}
                onChange={(e: any) => setSearchValue(e.target.value)}
              />
              <span className="absolute top-2 right-2 text-slatyGrey">
                <SearchIcon />
              </span>
            </div>

            <ColorToolTip title="Filter" placement="top" arrow>
              <span
                className="cursor-pointer relative"
                onClick={() => {
                  setIsFiltering(true);
                }}
              >
                <FilterIcon />
              </span>
            </ColorToolTip>
            <ColorToolTip title="Export" placement="top" arrow>
              <span
                className={`${
                  isExporting ? "cursor-default" : "cursor-pointer"
                } ${
                  getCurrentTabDetails(activeTab).toLowerCase() === "custom" &&
                  (filteredData === null ||
                    haveSameData(customreport_InitialFilter, filteredData))
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={
                  getCurrentTabDetails(activeTab).toLowerCase() === "custom" &&
                  (filteredData === null ||
                    haveSameData(customreport_InitialFilter, filteredData))
                    ? undefined
                    : handleExport
                }
              >
                {isExporting ? <Loading /> : <ExportIcon />}
              </span>
            </ColorToolTip>

            {activeTab === 7 && (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  color="info"
                  disabled={!hasRaisedInvoiceData}
                  className={`whitespace-nowrap ${
                    hasRaisedInvoiceData ? "!bg-secondary" : ""
                  }`}
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
            searchValue={searchValue}
            filteredData={filteredData}
            // onProjectSearchData={projectSearchData}
          />
        )}
        {activeTab === 2 && (
          <User
            searchValue={searchValue}
            filteredData={filteredData}
            // onUserSearchData={userSearchData}
          />
        )}
        {activeTab === 3 && (
          <TimeSheet
            searchValue={searchValue}
            filteredData={filteredData}
            // onTimesheetSearchData={timesheetSearchData}
          />
        )}
        {activeTab === 4 && (
          <Workload
            searchValue={searchValue}
            filteredData={filteredData}
            // onWorkloadSearchData={workloadSearchData}
          />
        )}
        {activeTab === 5 && (
          <UserLogs
            searchValue={searchValue}
            filteredData={filteredData}
            // onUserLogSearchData={userLogSearchData}
          />
        )}
        {activeTab === 6 && (
          <Audit
            searchValue={searchValue}
            filteredData={filteredData}
            // onAuditSearchData={auditSeachData}
          />
        )}
        {activeTab === 7 && (
          <BillingReport
            searchValue={searchValue}
            filteredData={filteredData}
            hasBTCData={(arg1: any) => setHasBTC(arg1)}
            hasRaisedInvoiceData={(arg1: any) => setHasRaisedInvoiceData(arg1)}
            isSavingBTCData={saveBTCData}
            onSaveBTCDataComplete={() => setSaveBTCData(false)}
            // onBillingReportSearchData={billingReportSearchData}
          />
        )}
        {activeTab === 8 && (
          <CustomReport
            searchValue={searchValue}
            filteredData={filteredData}
            // onCustomReportSearchData={customReportSearchData}
          />
        )}
        {activeTab === 9 && (
          <RatingReport
            searchValue={searchValue}
            filteredData={filteredData}
            // onRatingSearchData={ratingSearchData}
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

export default Page;
