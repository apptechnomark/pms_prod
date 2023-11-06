/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// MUI Imports
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import { Card } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Internal components
import { hasPermissionWorklog } from "@/utils/commonFunction";
import Chart_BillingType from "@/components/admin-dashboard/charts/Chart_BillingType";
import Chart_TaskStatus from "@/components/admin-dashboard/charts/Chart_TaskStatus";
import Chart_ProjectStatus from "@/components/admin-dashboard/charts/Chart_ProjectStatus";

// SVG Icons
import InReview from "@/assets/icons/dashboard_Admin/InReview";
import Withdraw_Outlined from "@/assets/icons/dashboard_Admin/Withdraw_Outlined";
import InPreparation from "@/assets/icons/dashboard_Admin/InPreparation";

// Material Icons
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RestorePageOutlinedIcon from "@mui/icons-material/RestorePageOutlined";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import RunningWithErrorsOutlinedIcon from "@mui/icons-material/RunningWithErrorsOutlined";
import Dialog_TaskStatus from "@/components/admin-dashboard/dialog/Dialog_TaskStatus";
import Dialog_BillingType from "@/components/admin-dashboard/dialog/Dialog_BillingType";
import Dialog_ProjectStatus from "@/components/admin-dashboard/dialog/Dialog_ProjectStatus";
import Dialog_DashboardSummaryList from "@/components/admin-dashboard/dialog/Dialog_DashboardSummaryList";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DrawerOverlay from "@/components/settings/drawer/DrawerOverlay";

const page = () => {
  const router = useRouter();
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const [isBillingTypeDialogOpen, setIsBillingTypeDialogOpen] =
    useState<boolean>(false);
  const [isTaskStatusDialogOpen, setIsTaskStatusDialogOpen] =
    useState<boolean>(false);
  const [isProjectStatusDialogOpen, setIsProjectStatusDialogOpen] =
    useState<boolean>(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] =
    useState<boolean>(false);
  const [clickedProjectStatusName, setClickedProjectStatusName] =
    useState<string>("");
  const [clickedStatusName, setClickedStatusName] = useState<string>("");
  const [clickedBillingTypeName, setClickedBillingTypeName] =
    useState<string>("");
  const [workType, setWorkType] = useState<any | null>(0);
  const [workTypeData, setWorkTypeData] = useState<any[] | any>([]);
  const [dashboardSummary, setDashboardSummary] = useState<any | any[]>([]);
  const [clickedCardName, setClickedCardName] = useState<string>("");

  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
  };

  useEffect(() => {
    if (localStorage.getItem("isClient") === "false") {
      if (!hasPermissionWorklog("", "View", "Dashboard")) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  // getting value from Total hours chart
  const handleValueFromBillingType = (
    isDialogOpen: boolean,
    selectedPointData: string
  ) => {
    setIsBillingTypeDialogOpen(isDialogOpen);
    setClickedBillingTypeName(selectedPointData);
  };

  // getting value from Task Status chart
  const handleValueFromTaskStatus = (
    isDialogOpen: boolean,
    selectedPointData: string
  ) => {
    setIsTaskStatusDialogOpen(isDialogOpen);
    setClickedStatusName(selectedPointData);
  };

  // getting value from Priority chart
  const handleValueFromProjectStatus = (
    isDialogOpen: boolean,
    selectedPointData: string
  ) => {
    setIsProjectStatusDialogOpen(isDialogOpen);
    setClickedProjectStatusName(selectedPointData);
  };

    useEffect(() => {
    if (
      !hasPermissionWorklog("", "View", "Dashboard") &&
      localStorage.getItem("isClient")
    ) {
      router.push("/");
    }
  }, [router]);

  // API for Worktype data
  useEffect(() => {
    const getWorkTypes = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      // const ClientId = await localStorage.getItem("clientId");
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/WorkType/GetDropdown`,
          {
            clientId: 0,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setWorkTypeData(response.data.ResponseData);
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
      } catch (error) {
        console.error(error);
      }
    };

    getWorkTypes();
  }, []);

  // API for Dashboard Summary
  useEffect(() => {
    const getProjectSummary = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/dashboard/summary`,
          {
            WorkTypeId: workType === 0 ? null : workType,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setDashboardSummary(response.data.ResponseData);
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
      } catch (error) {
        console.error(error);
      }
    };

    getProjectSummary();
  }, [workType]);

  const statusIconMapping: any = {
    Accepted: <CheckCircleOutlineOutlinedIcon />,
    "In Preparation": <InPreparation />,
    "In Review": <InReview />,
    "Error Logs": <ErrorOutlineIcon />,
    "Not Started": <PendingActionsOutlinedIcon />,
    "Overdue Task": <RunningWithErrorsOutlinedIcon />,
    Rejected: <CancelOutlinedIcon />,
    "On Hold From Client": <PauseCircleOutlineOutlinedIcon />,
    Withdraw: <Withdraw_Outlined />,
    Rework: <RestorePageOutlinedIcon />,
    "Total Received": <PlaylistAddCheckOutlinedIcon />,
    "Review Complated": <TaskOutlinedIcon />,
  };

  return (
    <Wrapper className="min-h-screen overflow-y-auto">
      <div>
        <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
        <div className="py-[10px]">
          {/* <section className="flex py-[10px] px-[20px] justify-end items-center">
            <FormControl sx={{ mx: 0.75, minWidth: 150, marginTop: 1 }}>
              <Select
                labelId="workType"
                id="workType"
                value={workType === 0 ? 0 : workType}
                onChange={(e) => setWorkType(e.target.value)}
                sx={{ height: 50 }}
              >
                <MenuItem value={0}>All</MenuItem>
                {workTypeData.map((i: any, index: number) => (
                  <MenuItem value={i.value} key={index}>
                    {i.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </section> */}

          <section className="flex gap-[25px] items-center px-[20px] py-[10px]">
            {dashboardSummary &&
              dashboardSummary.slice(0, 4).map((item: any) => (
                <Card
                  key={item.Key}
                  className={`w-full border shadow-md hover:shadow-xl cursor-pointer`}
                  style={{ borderColor: item.ColorCode }}
                >
                  <div
                    className="flex p-[20px] items-center"
                    onClick={() => {
                      setClickedCardName(item.Key),
                        setIsSummaryDialogOpen(true);
                    }}
                  >
                    <span
                      style={{ color: item.ColorCode }}
                      className={`border-r border-lightSilver pr-[20px]`}
                    >
                      {statusIconMapping[item.Key]}
                    </span>
                    <div className="inline-flex flex-col items-start pl-[20px]">
                      <span className="text-[14px] font-normal text-darkCharcoal">
                        {item.Key}
                      </span>
                      <span className="text-[20px] text-slatyGrey font-semibold">
                        {item.Value}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
          </section>

          <section className="flex gap-[25px] items-center px-[20px] py-[10px]">
            {dashboardSummary &&
              dashboardSummary.slice(4, 8).map((item: any) => (
                <Card
                  key={item.Key}
                  className={`w-full border shadow-md hover:shadow-xl cursor-pointer`}
                  style={{ borderColor: item.ColorCode }}
                >
                  <div
                    className="flex p-[20px] items-center"
                    onClick={() => {
                      setClickedCardName(item.Key),
                        setIsSummaryDialogOpen(true);
                    }}
                  >
                    <span
                      style={{ color: item.ColorCode }}
                      className={`border-r border-lightSilver pr-[20px]`}
                    >
                      {statusIconMapping[item.Key]}
                    </span>
                    <div className="inline-flex flex-col items-start pl-[20px]">
                      <span className="text-[14px] font-normal text-darkCharcoal">
                        {item.Key}
                      </span>
                      <span className="text-[20px] text-slatyGrey font-semibold">
                        {item.Value}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
          </section>

          <section className="flex gap-[25px] items-center px-[20px] py-[10px]">
            {dashboardSummary &&
              dashboardSummary.slice(8, 12).map((item: any) => (
                <Card
                  key={item.Key}
                  className={`w-full border shadow-md hover:shadow-xl cursor-pointer`}
                  style={{ borderColor: item.ColorCode }}
                >
                  <div
                    className="flex p-[20px] items-center"
                    onClick={() => {
                      setClickedCardName(item.Key),
                        setIsSummaryDialogOpen(true);
                    }}
                  >
                    <span
                      style={{ color: item.ColorCode }}
                      className={`border-r border-lightSilver pr-[20px]`}
                    >
                      {statusIconMapping[item.Key]}
                    </span>
                    <div className="inline-flex flex-col items-start pl-[20px]">
                      <span className="text-[14px] font-normal text-darkCharcoal">
                        {item.Key}
                      </span>
                      <span className="text-[20px] text-slatyGrey font-semibold">
                        {item.Value}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
          </section>

          {/* Task Status Chart */}
          <section className="flex gap-[20px] items-center px-[20px] py-[10px]">
            <Card className="w-full border border-lightSilver rounded-lg">
              <Chart_TaskStatus
                sendData={handleValueFromTaskStatus}
                onSelectedProjectIds={[]}
                onSelectedWorkType={0}
              />
            </Card>
          </section>

          {/* Project Status and Billing Type Charts */}
          <section className="flex gap-[20px] items-center px-[20px] py-[10px]">
            <Card className="w-full h-[344px] border border-lightSilver rounded-lg px-[10px]">
              <Chart_ProjectStatus
                sendData={handleValueFromProjectStatus}
                onSelectedProjectIds={[]}
                onSelectedWorkType={0}
              />
            </Card>

            <Card className="w-full h-[344px] border border-lightSilver rounded-lg px-[10px]">
              <Chart_BillingType
                sendData={handleValueFromBillingType}
                onSelectedProjectIds={[]}
                onSelectedWorkType={0}
              />
            </Card>
          </section>
        </div>

        {/* Dashboard Summary Dialog & Datatable */}
        <Dialog_DashboardSummaryList
          onOpen={isSummaryDialogOpen}
          onClose={() => setIsSummaryDialogOpen(false)}
          onSelectedWorkType={workType}
          onClickedSummaryTitle={clickedCardName}
        />

        {/* Task Status Dialog & Datatable */}
        <Dialog_TaskStatus
          onOpen={isTaskStatusDialogOpen}
          onClose={() => setIsTaskStatusDialogOpen(false)}
          onSelectedWorkType={workType}
          onSelectedStatusName={clickedStatusName}
        />

        {/* Billing Type Dialog & Datatable */}
        <Dialog_BillingType
          onOpen={isBillingTypeDialogOpen}
          onClose={() => setIsBillingTypeDialogOpen(false)}
          onSelectedWorkType={workType}
          onSelectedStatusName={clickedBillingTypeName}
        />

        {/* Project Status Dialog & Datatable */}
        <Dialog_ProjectStatus
          onOpen={isProjectStatusDialogOpen}
          onClose={() => setIsProjectStatusDialogOpen(false)}
          onSelectedWorkType={workType}
          onSelectedProjectStatus={clickedProjectStatusName}
          onSelectedProjectIds={[]}
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
