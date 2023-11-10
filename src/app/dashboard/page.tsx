/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// MUI Imports
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import {
  Avatar,
  Card,
  FormControl,
  IconButton,
  InputBase,
  List,
  MenuItem,
  Popover,
  Select,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons
import TotalTaskCreated from "@/assets/icons/dashboard_Client/TotalTaskCreated";
import InProgressWork from "@/assets/icons/dashboard_Client/InProgressWork";
import PendingTask from "@/assets/icons/dashboard_Client/PendingTask";
import CompletedTask from "@/assets/icons/dashboard_Client/CompletedTask";
import Chart_Priority from "@/components/dashboard/charts/Chart_Priority";
import Chart_ReturnType from "@/components/dashboard/charts/Chart_ReturnType";
import ArrowDown from "@/assets/icons/dashboard_Client/ArrowDown";
import ArrowUp from "@/assets/icons/dashboard_Client/ArrowUp";
import SearchIcon from "@/assets/icons/SearchIcon";
import Btn_FullScreen from "@/assets/icons/dashboard_Client/Btn_FullScreen";

// Internal components
import Dialog_TaskList from "@/components/dashboard/dialog/Dialog_TaskList";
import Datatable_Overdue from "@/components/dashboard/datatable/Datatable_Overdue";
import Datatable_OnHold from "@/components/dashboard/datatable/Datatable_OnHold";
import Chart_OverallProjectCompletion from "@/components/dashboard/charts/Chart_OverallProjectCompletion";
import Chart_TotalHours from "@/components/dashboard/charts/Chart_TotalHours";
import Chart_TaskStatus from "@/components/dashboard/charts/Chart_TaskStatus";
import Dialog_TotalHoursInfo from "@/components/dashboard/dialog/Dialog_TotalHoursInfo";
import Dialog_TaskStatusInfo from "@/components/dashboard/dialog/Dialog_TaskStatusInfo";
import Dialog_PriorityInfo from "@/components/dashboard/dialog/Dialog_PriorityInfo";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { useRouter } from "next/navigation";
import Dialog_OverallProjectSummary from "@/components/dashboard/dialog/Dialog_OverallProjectSummary";
import Dialog_SummaryList from "@/components/dashboard/dialog/Dialog_SummaryList";
import Dialog_ReturnTypeData from "@/components/dashboard/dialog/Dialog_ReturnTypeData";

const page = () => {
  const router = useRouter();
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const [isTotalHrsDialogOpen, setIsTotalHrsDialogOpen] =
    useState<boolean>(false);
  const [isTaskStatusDialogOpen, setIsTaskStatusDialogOpen] =
    useState<boolean>(false);
  const [isPriorityInfoDialogOpen, setIsPriorityInfoDialogOpen] =
    useState<boolean>(false);
  const [isProjectStatusDialogOpen, setIsProjectStatusDialogOpen] =
    useState<boolean>(false);
  const [clickedPriorityName, setClickedPriorityName] = useState<string>("");
  const [clickedStatusName, setClickedStatusName] = useState<string>("");
  const [clickedWorkTypeName, setClickedWorkTypeName] = useState<string>("");
  const [clickedProjectStatusName, setClickedProjectStatusName] =
    useState<string>("");
  const [isDatatableDialog, setIsDatatableDialog] = useState<boolean>(false);
  const [isOverdueClicked, setIsOverdueClicked] = useState<boolean>(true);
  const [isOnHoldClicked, setIsOnHoldClicked] = useState<boolean>(false);
  const [workType, setWorkType] = useState<any | null>(0);
  const [workTypeData, setWorkTypeData] = useState<any[] | any>([]);
  const [projects, setProjects] = useState<any | any[]>([]);
  const [isAllProject, setIsAllProject] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState<number[]>([]);
  const [currentProjectName, setCurrentProjectName] = useState<any>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectSummary, setProjectSummary] = useState<any>([]);
  const [anchorElProjects, setAnchorElProjects] = React.useState<
    HTMLButtonElement | null | any
  >(null);
  const [summaryLabel, setSummaryLabel] = useState<string>("");
  const [isSummaryListDialogOpen, setIsSummaryListDialogOpen] =
    useState<boolean>(false);
  const [isReturnTypeDialogOpen, setIsReturnTypeDialogOpen] =
    useState<boolean>(false);
  const [clickedReturnTypeValue, setClickedReturnTypeValue] = useState<any>("");

  const handleClickProjects = (event: any) => {
    setAnchorElProjects(event.currentTarget);
  };

  const handleCloseProjects = () => {
    setAnchorElProjects(null);
  };

  const openProjects = Boolean(anchorElProjects);
  const idProjects = openProjects ? "simple-popover" : undefined;

  // handling project ids and name
  const handleOptionProjects = (id: any, name: any) => {
    setCurrentProjectId([id]);
    setCurrentProjectName(name);
    setIsAllProject(false);
    handleCloseProjects();
  };

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const filteredProjects = searchQuery
    ? projects.filter((project: any) =>
        project.ProjectName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
  };

  // handling "All projects"
  const handleSelectAllProject = () => {
    setCurrentProjectId([]);
    setCurrentProjectName("All Projects");
    setIsAllProject(true);
    handleCloseProjects();
  };

  // getting value from Overall Project Completion chart
  const handleValueFromOverallProject = (
    isDialogOpen: boolean,
    selectedPointData: string
  ) => {
    setIsProjectStatusDialogOpen(isDialogOpen);
    setClickedProjectStatusName(selectedPointData);
  };

  // getting value from Return Type chart
  const handleValueFromReturnType = (
    isDialogOpen: boolean,
    selectedPointData: number
  ) => {
    setIsReturnTypeDialogOpen(isDialogOpen);
    setClickedReturnTypeValue(selectedPointData);
  };

  // getting value from Total hours chart
  const handleValueFromTotalHours = (
    isDialogOpen: boolean,
    selectedPointData: string
  ) => {
    setIsTotalHrsDialogOpen(isDialogOpen);
    setClickedWorkTypeName(selectedPointData);
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
  const handleValueFromPriority = (
    isDialogOpen: boolean,
    selectedPointData: string
  ) => {
    setIsPriorityInfoDialogOpen(isDialogOpen);
    setClickedPriorityName(selectedPointData);
  };

  useEffect(() => {
    if (localStorage.getItem("isClient") === "true") {
      if (hasPermissionWorklog("", "View", "Dashboard") === false) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const getProjects = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      const ClientId = await localStorage.getItem("clientId");
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/project/getdropdown`,
          {
            clientId: ClientId,
            isAll: true,
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
            setProjects(response.data.ResponseData.List);
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

    // calling function
    getProjects();
  }, []);

  useEffect(() => {
    const getWorkTypes = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      const ClientId = await localStorage.getItem("clientId");
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/WorkType/GetDropdown`,
          {
            clientId: ClientId,
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

  useEffect(() => {
    // if (currentProjectId.length > 0) {
    const getProjectSummary = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/clientdashboard/summarybyproject`,
          {
            projectIds: currentProjectId,
            typeOfWork: workType === 0 ? null : workType,
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
            setProjectSummary(response.data.ResponseData);
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
    // }
  }, [currentProjectId, workType]);

  // Change workType when select individual project
  useEffect(() => {
    if (!isAllProject) {
      setWorkType(0);
    }
  }, [isAllProject]);

  // Summary Status Icons mapping
  const statusIconMapping: any = {
    "Total Task Created": <TotalTaskCreated />,
    "Pending Task": <PendingTask />,
    "In Progress Task": <InProgressWork />,
    "Completed Task": <CompletedTask />,
  };

  return (
    <Wrapper className="min-h-screen overflow-y-auto">
      <div>
        <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
        <div>
          <section className="flex py-[10px] px-[20px] justify-between items-center">
            <div
              className={`flex items-center gap-[50px] px-5 cursor-pointer h-[65px] min-w-[225px] ${
                anchorElProjects === null
                  ? "bg-whiteSmoke rounded"
                  : "bg-[#EEF4F8] delay-75 rounded"
              }`}
              aria-describedby={idProjects}
              onClick={handleClickProjects}
            >
              <div className="flex items-center gap-[15px]">
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: 14,
                    color: "#02B89D",
                    backgroundColor: "#C9DDEB",
                  }}
                >
                  {currentProjectName
                    ? currentProjectName
                        .split(" ")
                        .map((word: any) => word.charAt(0).toUpperCase())
                        .join("")
                    : "All Projects"
                        .split(" ")
                        .map((word: any) => word.charAt(0).toUpperCase())
                        .join("")}
                </Avatar>
                <span
                  className={`${
                    anchorElProjects === null
                      ? ""
                      : "font-semibold text-primary"
                  }`}
                >
                  {currentProjectName ? currentProjectName : "All Projects"}
                </span>
              </div>
              <span>
                {anchorElProjects === null ? <ArrowDown /> : <ArrowUp />}
              </span>
            </div>

            <Popover
              id={idProjects}
              open={openProjects}
              anchorEl={anchorElProjects}
              onClose={handleCloseProjects}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              sx={{ marginTop: 0.2 }}
            >
              <nav className="!w-[225px] !max-h-[550px]">
                <div className="px-4 mt-4">
                  <div className="flex items-center h-10 rounded-md pl-2 flex-row border border-lightSilver">
                    <span className="mr-2">
                      <SearchIcon />
                    </span>
                    <span>
                      <InputBase
                        placeholder="Search"
                        inputProps={{ "aria-label": "search" }}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ fontSize: "13px" }}
                      />
                    </span>
                  </div>
                </div>
                <List>
                  {(searchQuery === "" ||
                    searchQuery.toLowerCase().includes("all projects") ||
                    searchQuery.toLowerCase().startsWith("a") ||
                    searchQuery.toLowerCase().startsWith("l")) && (
                    <span className="flex flex-col py-1 px-4 hover-bg-whiteSmoke text-sm">
                      <span className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2">
                        <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
                          {"All Projects"
                            .split(" ")
                            .map((word: any) => word.charAt(0).toUpperCase())
                            .join("")}
                        </Avatar>

                        <span
                          onClick={() => {
                            handleSelectAllProject();
                          }}
                          className="pt-[0.8px]"
                        >
                          All Projects
                        </span>
                      </span>
                    </span>
                  )}

                  {filteredProjects.length === 0 &&
                    !searchQuery.toLowerCase().includes("all projects") &&
                    !searchQuery.toLowerCase().startsWith("a") &&
                    !searchQuery.toLowerCase().startsWith("l") && (
                      <span className="flex flex-col py-1 px-4 hover-bg-whiteSmoke text-sm">
                        <span className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2">
                          No Result found
                        </span>
                      </span>
                    )}

                  {filteredProjects.map((project: any, index: any) => {
                    return (
                      <span
                        key={index}
                        className="flex flex-col py-1 px-4 hover-bg-whiteSmoke text-sm"
                      >
                        <span
                          className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                          onClick={() =>
                            handleOptionProjects(
                              project.ProjectId,
                              project.ProjectName
                            )
                          }
                        >
                          <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
                            {project.ProjectName.split(" ")
                              .map((word: any) => word.charAt(0).toUpperCase())
                              .join("")}
                          </Avatar>

                          <span className="pt-[0.8px]">
                            {project.ProjectName}
                          </span>
                        </span>
                      </span>
                    );
                  })}
                </List>
              </nav>
            </Popover>

            <FormControl sx={{ mx: 0.75, minWidth: 150, marginTop: 1 }}>
              <Select
                labelId="workType"
                id="workType"
                value={workType === 0 || !isAllProject ? 0 : workType}
                onChange={(e) => setWorkType(e.target.value)}
                disabled={!isAllProject}
              >
                <MenuItem value={0}>All</MenuItem>
                {workTypeData.map((i: any, index: number) => (
                  <MenuItem value={i.value} key={index}>
                    {i.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </section>

          <section className="flex gap-[25px] items-center px-[20px] py-[10px]">
            {projectSummary &&
              projectSummary.map((item: any) => (
                <Card
                  key={item.Key}
                  className={`w-full border shadow-md hover:shadow-xl cursor-pointer`}
                  style={{ borderColor: item.ColorCode }}
                >
                  <div
                    className="flex p-[20px] items-center"
                    onClick={() => {
                      setSummaryLabel(item.Key),
                        setIsSummaryListDialogOpen(true);
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

          <section className="flex gap-[20px] items-center px-[20px] py-[10px]">
            <Card className="w-full h-[344px] border border-lightSilver rounded-lg">
              <Chart_OverallProjectCompletion
                sendData={handleValueFromOverallProject}
                onSelectedProjectIds={currentProjectId}
                onSelectedWorkType={workType}
              />
            </Card>

            <Card className="w-full h-[344px] border border-lightSilver rounded-lg">
              <Chart_TotalHours
                sendData={handleValueFromTotalHours}
                onSelectedProjectIds={currentProjectId}
                onSelectedWorkType={workType}
              />
            </Card>
          </section>

          <section className="px-[20px] py-[10px]">
            <Card className="w-full h-[460px] border border-lightSilver rounded-lg">
              <Chart_TaskStatus
                sendData={handleValueFromTaskStatus}
                onSelectedProjectIds={currentProjectId}
                onSelectedWorkType={workType}
              />
            </Card>
          </section>

          <section className="flex gap-[20px] px-[20px] py-[10px]">
            <div className="flex flex-col w-[345px]">
              <Card className="w-full h-[344px] mb-[40px] border border-lightSilver rounded-lg">
                <Chart_Priority
                  onSelectedProjectIds={currentProjectId}
                  onSelectedWorkType={workType}
                  sendData={handleValueFromPriority}
                />
              </Card>

              {workType !== 1 && (
                <Card className="w-full h-[344px] border border-lightSilver rounded-lg justify-center flex">
                  <Chart_ReturnType
                    onSelectedProjectIds={currentProjectId}
                    onSelectedWorkType={workType}
                    sendData={handleValueFromReturnType}
                  />
                </Card>
              )}
            </div>

            <Card className="w-full h-full">
              <div>
                <div className="bg-whiteSmoke flex justify-between items-center px-[10px]">
                  <div className="flex gap-[20px] items-center py-[6.5px] px-[10px]">
                    <label
                      onClick={() => {
                        setIsOverdueClicked(true);
                        setIsOnHoldClicked(false);
                      }}
                      className={`py-[10px] cursor-pointer select-none ${
                        isOverdueClicked
                          ? "text-secondary text-[16px] font-semibold"
                          : "text-slatyGrey text-[14px]"
                      }`}
                    >
                      Overdue
                    </label>
                    <span className="text-lightSilver">|</span>
                    <label
                      onClick={() => {
                        setIsOnHoldClicked(true);
                        setIsOverdueClicked(false);
                      }}
                      className={`py-[10px] cursor-pointer select-none ${
                        isOnHoldClicked
                          ? "text-secondary text-[16px] font-semibold"
                          : "text-slatyGrey text-[14px]"
                      }`}
                    >
                      On Hold
                    </label>
                    <span className="text-lightSilver">|</span>
                  </div>

                  <IconButton onClick={() => setIsDatatableDialog(true)}>
                    <Btn_FullScreen />
                  </IconButton>
                </div>

                {isOverdueClicked && (
                  <Datatable_Overdue
                    onSelectedProjectIds={currentProjectId}
                    onSelectedWorkType={workType}
                  />
                )}

                {isOnHoldClicked && (
                  <Datatable_OnHold
                    onSelectedProjectIds={currentProjectId}
                    onSelectedWorkType={workType}
                  />
                )}
              </div>
            </Card>
          </section>
        </div>

        <Dialog_TaskList
          onOpen={isDatatableDialog}
          onClose={() => setIsDatatableDialog(false)}
          onSelectedWorkType={workType}
          onSelectedProjectIds={currentProjectId}
        />

        <Dialog_TotalHoursInfo
          onOpen={isTotalHrsDialogOpen}
          onClose={() => setIsTotalHrsDialogOpen(false)}
          onWorkTypeData={workTypeData}
          onSelectedProjectIds={currentProjectId}
          onSelectedWorkTypeName={clickedWorkTypeName}
        />

        <Dialog_TaskStatusInfo
          onOpen={isTaskStatusDialogOpen}
          onClose={() => setIsTaskStatusDialogOpen(false)}
          onWorkTypeData={workTypeData}
          onSelectedProjectIds={currentProjectId}
          onSelectedWorkType={workType}
          onSelectedStatusName={clickedStatusName}
        />

        <Dialog_PriorityInfo
          onOpen={isPriorityInfoDialogOpen}
          onClose={() => setIsPriorityInfoDialogOpen(false)}
          onSelectedProjectIds={currentProjectId}
          onSelectedPriorityName={clickedPriorityName}
        />

        <Dialog_OverallProjectSummary
          onOpen={isProjectStatusDialogOpen}
          onClose={() => setIsProjectStatusDialogOpen(false)}
          onSelectedProjectIds={currentProjectId}
          onSelectedWorkType={workType}
          onSelectedTaskStatus={clickedProjectStatusName}
        />

        <Dialog_SummaryList
          onOpen={isSummaryListDialogOpen}
          onClose={() => setIsSummaryListDialogOpen(false)}
          onSelectedProjectIds={currentProjectId}
          onSelectedWorkType={workType}
          onSelectedSummaryStatus={summaryLabel}
          onCurrProjectSummary={projectSummary}
        />

        <Dialog_ReturnTypeData
          onOpen={isReturnTypeDialogOpen}
          onClose={() => setIsReturnTypeDialogOpen(false)}
          onSelectedProjectIds={currentProjectId}
          onSelectedReturnTypeValue={
            clickedReturnTypeValue === "Individual Return" ? 1 : 2
          }
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
