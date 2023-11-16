/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import axios from "axios";
import { Box, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import React, { Fragment, useEffect, useRef, useState } from "react";

//toast
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

//icons
import LineIcon from "@/assets/icons/reports/LineIcon";
// import MoreIcon from "@/assets/icons/reports/MoreIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import ExportIcon from "@/assets/icons/ExportIcon";
import Loading from "@/assets/icons/reports/Loading";

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

const visibleTabs = [
  { label: "project", value: 1 },
  { label: "user", value: 2 },
  { label: "timesheet", value: 3 },
  { label: "workload", value: 4 },
  { label: "user log", value: 5 },
  { label: "audit", value: 6 },
  { label: "billing", value: 7 },
  { label: "custom", value: 8 },
  // { label: "rating", value: 9 },
];

const page = () => {
  const router = useRouter();
  const moreTabsRef = useRef<HTMLDivElement>(null);
  const [activeTabs, setActiveTabs] = useState<any[]>(visibleTabs);
  const [activeTab, setActiveTab] = useState<number>(1);
  // const [lastTab, setLastTab] = useState<string>("billing report");
  // const [showMoreTabs, setShowMoreTabs] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [hasBTC, setHasBTC] = useState<boolean>(false);
  const [saveBTCData, setSaveBTCData] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
  };

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
          visibleTabs.map((tab: any) =>
            hasPermissionWorklog(tab.label, "view", "report") ? tab : false
          )
        );

        setActiveTab(
          visibleTabs
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

  return (
    <Wrapper>
      <div>
        <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
        <div className="w-full pr-5 flex items-center justify-between">
          <div className="my-[15px] flex justify-between items-center">
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
                      {tab.label} {index === 6 || index === 7 ? "report" : ""}
                    </label>
                    {!(
                      index ===
                      activeTabs.filter((tab: any) => tab !== false).length - 1
                    ) && <LineIcon />}
                  </Fragment>
                ))}
            </div>
            {/* <div className="cursor-pointer relative">
              <div
                ref={moreTabsRef}
                onClick={() => setShowMoreTabs(!showMoreTabs)}
              >
                <MoreIcon />
              </div>
              {showMoreTabs && <MoreTabs />}
            </div> */}
          </div>
          <div className="h-full flex items-center gap-5">
            {!(
              activeTab ===
              visibleTabs.filter(
                (tab: any) => tab.label.toLowerCase() === "audit"
              )[0].value
            ) && (
              <span
                className="cursor-pointer relative"
                onClick={() => {
                  setIsFiltering(true);
                }}
              >
                <FilterIcon />
              </span>
            )}
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
                  disabled={!hasBTC}
                  className={`${hasBTC ? "!bg-secondary" : ""}`}
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
        {activeTab === 1 && <Project filteredData={filteredData} />}
        {activeTab === 2 && <User filteredData={filteredData} />}
        {activeTab === 3 && <TimeSheet filteredData={filteredData} />}
        {activeTab === 4 && <Workload filteredData={filteredData} />}
        {activeTab === 5 && <UserLogs filteredData={filteredData} />}
        {activeTab === 6 && <Audit />}
        {activeTab === 7 && (
          <BillingReport
            filteredData={filteredData}
            hasBTCData={(arg1: any) => setHasBTC(arg1)}
            isSavingBTCData={saveBTCData}
            onSaveBTCDataComplete={() => setSaveBTCData(false)}
          />
        )}
        {activeTab === 8 && <CustomReport filteredData={filteredData} />}
        {activeTab === 9 && <RatingReport filteredData={filteredData} />}
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
