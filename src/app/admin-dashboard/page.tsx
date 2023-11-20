/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// MUI Imports
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import {
  Autocomplete,
  Card,
  Grid,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
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
import MUIDataTable from "mui-datatables";
import TablePagination from "@mui/material/TablePagination";
import { getClientDropdownData } from "@/utils/commonDropdownApiCall";

const getMuiTheme = () =>
  createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: "#F6F6F6",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          },
        },
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          root: {
            overflowX: "auto",
            whiteSpace: "nowrap",
          },
        },
      },
    },
  });

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  PageSize: pageSize,
  PageNo: pageNo,
  SortColumn: "",
  IsDesc: true,
  Clients: null,
};

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
  const [isDashboardClicked, setIsDashboardClicked] = useState(true);
  const [isReportClicked, setIsReportClicked] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);
  const [clientName, setClientName] = useState(0);
  const [clientDropdownData, setClientDropdownData] = useState<any>([]);

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

    const getReportData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      // const ClientId = await localStorage.getItem("clientId");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/dashboard/dashboardclientsummary`,
          filteredObject,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setReportData(response.data.ResponseData.ClientSummary);
            setTableDataCount(response.data.ResponseData.TotalCount);
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

    const getData = async () => {
      setClientDropdownData(await getClientDropdownData());
    };

    isDashboardClicked && getWorkTypes();
    isReportClicked && getReportData();
    isReportClicked && getData();
  }, [isDashboardClicked, isReportClicked, filteredObject]);

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

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    setFilteredOject({ ...filteredObject, PageNo: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setFilteredOject({
      ...filteredObject,
      PageNo: 1,
      PageSize: event.target.value,
    });
  };

  // Report Table Columns
  const columns = [
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Client Name</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Accept",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Accept</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "AcceptWithNotes",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Accept With Notes</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Errorlogs",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Errorlogs</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "InProgress",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">In Progress</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "InReview",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">In Review</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "NotStarted",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Not Started</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "OnHoldFromClient",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">On Hold From Client</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "PartialSubmitted",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Partial Submitted</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Rework",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Rework</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "SignedOff",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Signed Off</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Stop",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Stop</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "WithDraw",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">WithDraw</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Total",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Total</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
  ];

  const options: any = {
    responsive: "standard",
    tableBodyHeight: "73vh",
    viewColumns: false,
    filter: false,
    print: false,
    download: false,
    search: false,
    pagination: false,
    selectToolbarPlacement: "none",
    draggableColumns: {
      enabled: true,
      transitionTime: 300,
    },
    elevation: 0,
    selectableRows: "none",
  };

  return (
    <Wrapper className="min-h-screen overflow-y-auto">
      <div>
        <Navbar onUserDetailsFetch={handleUserDetailsFetch} />

        <div className="flex items-center justify-between w-full px-6">
          <div className="flex gap-[16px] items-center py-[6.5px]">
            <label
              onClick={() => {
                setIsDashboardClicked(true);
                setIsReportClicked(false);
                setClientName(0);
              }}
              className={`py-[10px] text-[16px] cursor-pointer select-none ${
                isDashboardClicked
                  ? "text-secondary font-semibold"
                  : "text-slatyGrey"
              }`}
            >
              Dashboard
            </label>
            <span className="text-lightSilver">|</span>
            <label
              onClick={() => {
                setIsReportClicked(true);
                setIsDashboardClicked(false);
                setClientName(0);
                setFilteredOject({ ...filteredObject, Clients: null });
              }}
              className={`py-[10px] text-[16px] cursor-pointer select-none ${
                isReportClicked
                  ? "text-secondary font-semibold"
                  : "text-slatyGrey"
              }`}
            >
              Report
            </label>
          </div>

          {isReportClicked && (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={clientDropdownData}
              value={
                clientDropdownData.find((i: any) => i.value === clientName) ||
                null
              }
              onChange={(e: any, value: any) => {
                setFilteredOject({ ...filteredObject, Clients: [value.value] });
                setClientName(value.value);
              }}
              sx={{ mx: 0.75, width: 210 }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" label="Client Name" />
              )}
            />
          )}
        </div>

        {isDashboardClicked && (
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
            <Grid
              container
              className="flex items-center px-[20px] py-[10px]"
              gap={1}
            >
              {dashboardSummary &&
                dashboardSummary.slice(0, 4).map((item: any) => (
                  <Grid xs={2.9} item key={item.Key}>
                    <Card
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
                  </Grid>
                ))}
            </Grid>

            <Grid
              container
              className="flex items-center px-[20px] py-[10px]"
              gap={1}
            >
              {dashboardSummary &&
                dashboardSummary.slice(4, 8).map((item: any) => (
                  <Grid xs={2.9} item key={item.Key}>
                    <Card
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
                  </Grid>
                ))}
            </Grid>

            <Grid
              container
              className="flex items-center px-[20px] py-[10px]"
              gap={1}
            >
              {dashboardSummary &&
                dashboardSummary.slice(8, 12).map((item: any) => (
                  <Grid xs={2.9} item key={item.Key}>
                    <Card
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
                  </Grid>
                ))}
            </Grid>

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
        )}

        {/* Dashboard Summary Dialog & Datatable */}
        {isDashboardClicked && (
          <Dialog_DashboardSummaryList
            onOpen={isSummaryDialogOpen}
            onClose={() => setIsSummaryDialogOpen(false)}
            onSelectedWorkType={workType}
            onClickedSummaryTitle={clickedCardName}
          />
        )}

        {/* Task Status Dialog & Datatable */}
        {isDashboardClicked && (
          <Dialog_TaskStatus
            onOpen={isTaskStatusDialogOpen}
            onClose={() => setIsTaskStatusDialogOpen(false)}
            onSelectedWorkType={workType}
            onSelectedStatusName={clickedStatusName}
          />
        )}

        {/* Billing Type Dialog & Datatable */}
        {isDashboardClicked && (
          <Dialog_BillingType
            onOpen={isBillingTypeDialogOpen}
            onClose={() => setIsBillingTypeDialogOpen(false)}
            onSelectedWorkType={workType}
            onSelectedStatusName={clickedBillingTypeName}
          />
        )}

        {/* Project Status Dialog & Datatable */}
        {isDashboardClicked && (
          <Dialog_ProjectStatus
            onOpen={isProjectStatusDialogOpen}
            onClose={() => setIsProjectStatusDialogOpen(false)}
            onSelectedWorkType={workType}
            onSelectedProjectStatus={clickedProjectStatusName}
            onSelectedProjectIds={[]}
          />
        )}

        {isReportClicked && (
          <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={reportData}
              columns={columns}
              title={undefined}
              options={options}
              data-tableid="Datatable"
            />
            <TablePagination
              component="div"
              count={tableDataCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ThemeProvider>
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
      </div>
    </Wrapper>
  );
};

export default page;
