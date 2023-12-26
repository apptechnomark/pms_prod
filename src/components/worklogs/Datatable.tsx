import React, { useEffect, useState } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { toast } from "react-toastify";
// icons imports
import PlayButton from "@/assets/icons/worklogs/PlayButton";
import PlayPause from "@/assets/icons/worklogs/PlayPause";
import PauseButton from "@/assets/icons/worklogs/PauseButton";
import StopButton from "@/assets/icons/worklogs/StopButton";
import RestartButton from "@/assets/icons/worklogs/RestartButton";
import RecurringIcon from "@/assets/icons/worklogs/RecurringIcon";
// Internal Component imports
import { toHoursAndMinutes, toSeconds } from "@/utils/timerFunctions";
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generatePriorityWithColor,
  generateStatusWithColor,
  handlePageChangeWithFilter,
  handleChangeRowsPerPageWithFilter,
  generateCustomeTaskIdwithErrorLogs,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { worklogs_Options } from "@/utils/datatable/TableOptions";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import WorklogsActionBar from "./actionBar/WorklogsActionBar";
import { generateCustomColumn } from "@/utils/datatable/columns/ColsGenerateFunctions";
import ReportLoader from "../common/ReportLoader";

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  PageNo: pageNo,
  PageSize: pageSize,
  SortColumn: "",
  IsDesc: true,
  GlobalSearch: "",
  ClientId: null,
  TypeOfWork: null,
  ProjectId: null,
  StatusId: null,
  AssignedTo: null,
  AssignedBy: null,
  DueDate: null,
  StartDate: null,
  EndDate: null,
  ReviewStatus: null,
};

const Datatable = ({
  isOnBreak,
  onGetBreakData,
  onSetBreak,
  onEdit,
  onRecurring,
  onDrawerOpen,
  onDrawerClose,
  onDataFetch,
  onCurrentFilterId,
  currentFilterData,
  onHandleExport,
  onComment,
  searchValue,
  isUnassigneeClicked,
}: any) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [workItemData, setWorkItemData] = useState<any | any[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<any | number[]>([]);
  const [selectedRowStatusName, setSelectedRowStatusName] = useState<
    any | string[]
  >([]);
  const [selectedRowStatusId, setSelectedRowStatusId] = useState<
    any | number[]
  >([]);
  const [selectedRowClientId, setSelectedRowClientId] = useState<
    any | number[]
  >([]);
  const [selectedRowWorkTypeId, setSelectedRowWorkTypeId] = useState<
    any | number[]
  >([]);
  const [selectedRowsdata, setSelectedRowsData] = useState<any | number[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<any | number>(null);
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);

  // States for Time
  const [isRunning, setRunning] = useState<number>(-1);
  const [workitemTimeId, setWorkitemTimeId] = useState<number>(-1);
  const [stopTimerDialog, setStopTimerDialog] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [commentErrText, setCommentErrText] = useState<string>("");
  const [isTimeExceed, setIsTimeExceed] = useState<boolean>(false);

  const handleRowSelect = (
    currentRowsSelected: any,
    allRowsSelected: any,
    rowsSelected: any
  ) => {
    const selectedData = allRowsSelected.map(
      (row: any) => workItemData[row.dataIndex]
    );
    setSelectedRowsCount(rowsSelected?.length);
    setSelectedRows(rowsSelected);
    setSelectedRowsData(selectedData);

    // adding all selected Ids in an array
    const selectedWorkItemIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow?.WorkitemId)
        : [];

    setSelectedRowIds(selectedWorkItemIds);

    // adding only one or last selected id
    const lastSelectedWorkItemId =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1]?.WorkitemId
        : null;
    setSelectedRowId(lastSelectedWorkItemId);

    // adding all selected row's status name in an array
    const selectedWorkItemStatus =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow?.StatusName)
        : [];

    setSelectedRowStatusName(selectedWorkItemStatus);

    // adding all selected row's status Ids in an array
    const selectedWorkItemStatusIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow?.StatusId)
        : [];

    setSelectedRowStatusId(selectedWorkItemStatusIds);

    // adding all selected row's Client Ids in an array
    const selectedWorkItemClientIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow?.ClientId)
        : [];

    setSelectedRowClientId(selectedWorkItemClientIds);

    // adding all selected row's WorkType Ids in an array
    const selectedWorkItemWorkTypeIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow?.WorkTypeId)
        : [];

    setSelectedRowWorkTypeId(selectedWorkItemWorkTypeIds);

    setIsPopupOpen(allRowsSelected);
  };

  const handleClearSelection = () => {
    setSelectedRowsCount(0);
    setSelectedRows([]);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.href.includes("id=");
      if (pathname) {
        const idMatch = window.location.href.match(/id=([^?&]+)/);
        const id = idMatch ? idMatch[1] : null;
        onEdit(id);
        onDrawerOpen();
      }
    }
  }, []);

  useEffect(() => {
    handleClearSelection();
    setRowsPerPage(10);
    setPage(0);
  }, [onDrawerClose]);

  useEffect(() => {
    setRunning(
      workItemData.filter((data: any) => data.TimelogId > 0).length > 0
        ? workItemData.filter((data: any) => data.TimelogId > 0)[0].WorkitemId
        : -1
    );
    setWorkitemTimeId(
      workItemData.filter((data: any) => data.TimelogId > 0).length > 0
        ? workItemData.filter((data: any) => data.TimelogId > 0)[0].TimelogId
        : -1
      // workItemData.filter(
      //   (data: any) => data.TimelogId !== 0 || data.TimelogId !== null
      // ).length > 0
      //   ? workItemData.filter(
      //       (data: any) => data.TimelogId !== 0 || data.TimelogId !== null
      //     )[0].TimelogId
      //   : -1
    );
  }, [workItemData]);

  // Timer API
  const handleTimer = async (
    state: number,
    selectedRowId: number,
    workitemTimeId?: number
  ) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    if (state === 1 && isOnBreak !== 0) {
      onGetBreakData();
      onSetBreak();
    }

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/saveworkitemtimestamp`,
        {
          workitemTimeId:
            workitemTimeId && workitemTimeId > 0 ? workitemTimeId : 0,
          workitemId: selectedRowId,
          state: state,
          comment: comment.trim().length <= 0 ? null : comment.trim(),
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
          setComment("");
          setWorkitemTimeId((prev) =>
            response.data.ResponseData !== prev
              ? response.data.ResponseData
              : -1
          );
          setRunning((prev) => (selectedRowId !== prev ? selectedRowId : -1));
          getWorkItemList();
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

  const handleSync = async (selectedRowId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/getworkitemsync`,
        {
          workitemId: selectedRowId,
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
          if (response.data.ResponseData !== null) {
            setWorkItemData((prev: any) =>
              prev.map((data: any) => {
                if (data.WorkitemId === selectedRowId) {
                  return new Object({
                    ...data,
                    Timer: response.data.ResponseData?.SyncTime,
                  });
                } else {
                  return data;
                }
              })
            );
          } else {
            getWorkItemList();
          }
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

  useEffect(() => {
    setFilteredOject({
      ...filteredObject,
      ...currentFilterData,
      GlobalSearch: searchValue,
    });
    getWorkItemList();
  }, [currentFilterData, searchValue]);

  // API for filter list
  const getFilterList = async (filterId: number) => {
    if (filterId === 0) {
      setFilteredOject(initialFilter);
    } else {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/filter/getfilterlist`,
          {
            type: 1,
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
            const responseData = response.data.ResponseData;

            // Filter the data based on the given filterId
            const filteredData = responseData.filter(
              (filter: any) => filter.FilterId === filterId
            );

            if (filteredData.length > 0) {
              const appliedFilterData = filteredData[0].AppliedFilter;
              setFilteredOject({
                ...filteredObject,
                ClientId:
                  appliedFilterData.ClientId === 0 ||
                  appliedFilterData.ClientId === null
                    ? null
                    : appliedFilterData.ClientId,
                TypeOfWork:
                  appliedFilterData.TypeOfWork === 0 ||
                  appliedFilterData.TypeOfWork === null
                    ? null
                    : appliedFilterData.TypeOfWork,
                ProjectId:
                  appliedFilterData.ProjectId === 0 ||
                  appliedFilterData.ProjectId === null
                    ? null
                    : appliedFilterData.ProjectId,
                StatusId:
                  appliedFilterData.Status === 0 ||
                  appliedFilterData.Status === null
                    ? null
                    : appliedFilterData.Status,
                AssignedTo:
                  appliedFilterData.AssignedTo === 0 ||
                  appliedFilterData.AssignedTo === null
                    ? null
                    : appliedFilterData.AssignedTo,
                AssignedBy:
                  appliedFilterData.AssignedBy === 0 ||
                  appliedFilterData.AssignedBy === null
                    ? null
                    : appliedFilterData.AssignedBy,
                DueDate:
                  appliedFilterData.DueDate === 0 ||
                  appliedFilterData.DueDate === null
                    ? null
                    : appliedFilterData.DueDate,
                StartDate:
                  appliedFilterData.StartDate === 0 ||
                  appliedFilterData.StartDate === null
                    ? null
                    : appliedFilterData.StartDate,
                EndDate:
                  appliedFilterData.EndDate === 0 ||
                  appliedFilterData.EndDate === null
                    ? null
                    : appliedFilterData.EndDate,
                ReviewStatus:
                  appliedFilterData.ReviewStatus === 0 ||
                  appliedFilterData.ReviewStatus === null
                    ? null
                    : appliedFilterData.ReviewStatus,
              });
            }
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
    }
  };

  // WorkItemList API
  const getWorkItemList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/getworkitemlist`,
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
          onHandleExport(
            response.data.ResponseData.List.length > 0 ? true : false
          );
          setLoaded(true);
          setWorkItemData(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
        } else {
          setLoaded(true);
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        setLoaded(true);
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      setLoaded(true);
      console.error(error);
    }
  };

  useEffect(() => {
    // refreshing data from Drawer side
    const fetchData = async () => {
      await getWorkItemList();
      onDataFetch(() => fetchData());
    };
    fetchData();
    getWorkItemList();
  }, []);

  useEffect(() => {
    getFilterList(onCurrentFilterId);
  }, [onCurrentFilterId]);

  useEffect(() => {
    getWorkItemList();
  }, [onCurrentFilterId, filteredObject]);

  useEffect(() => {
    getWorkItemList();
  }, [isOnBreak]);

  useEffect(() => {
    onHandleExport(workItemData.length > 0 ? true : false);
  }, [workItemData]);

  const handleComment = (e: any) => {
    setComment(e.target.value);
    if (e.target.value.trim().length === 0) {
      setCommentErrText("This is required field!");
    } else if (e.target.value.trim().length < 5) {
      setCommentErrText("Minimum 5 characters are required!");
    } else if (e.target.value.trim().length > 250) {
      setCommentErrText("Maximum limit is 250 characters!");
    } else {
      setCommentErrText("");
    }
  };

  const generateCustomTaskNameBody = (bodyValue: any, TableMeta: any) => {
    const IsRecurring = TableMeta.rowData[19];
    return (
      <div className="flex items-center gap-2">
        {bodyValue === null || bodyValue === "" ? (
          "-"
        ) : (
          <>
            {IsRecurring && (
              <span className="text-secondary font-semibold">
                <RecurringIcon />
              </span>
            )}
            {bodyValue}
          </>
        )}
      </div>
    );
  };

  const generateShortProcessNameBody = (bodyValue: any) => {
    const shortProcessName = bodyValue && bodyValue.split(" ");
    return (
      <div className="font-semibold">
        {bodyValue === null || bodyValue === "" ? (
          "-"
        ) : (
          <ColorToolTip title={bodyValue} placement="top">
            {shortProcessName[0]}
          </ColorToolTip>
        )}
      </div>
    );
  };

  const columnConfig = [
    {
      name: "WorkitemId",
      label: "Task ID",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "ClientName",
      label: "Client",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "ProjectName",
      label: "Project",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "TaskName",
      label: "Task",
      bodyRenderer: generateCustomTaskNameBody,
    },
    {
      name: "ProcessName",
      label: "Process",
      bodyRenderer: generateShortProcessNameBody,
    },
    {
      name: "SubProcessName",
      label: "Sub-Process",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "IsManual",
      options: {
        display: false,
        viewColumns: false,
        filter: false,
      },
    },
    {
      name: "Timer",
      label: "Timer",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "AssignedToName",
      label: "Assigned To",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "PriorityName",
      label: "Priority",
      bodyRenderer: generatePriorityWithColor,
    },
    {
      name: "StatusColorCode",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "StatusName",
      label: "Status",
      bodyRenderer: (value: any, tableMeta: any) =>
        generateStatusWithColor(value, tableMeta.rowData[9]),
    },
    {
      name: "EstimateTime",
      label: "Est. Time",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "Quantity",
      label: "Qty.",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "STDTime",
      label: "Total Time",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "StartDate",
      label: "Start Date",
      bodyRenderer: generateCustomFormatDate,
    },
    {
      name: "EndDate",
      label: "End Date",
      bodyRenderer: generateCustomFormatDate,
    },
    {
      name: "AssignedByName",
      label: "Assigned By",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "IsHasErrorlog",
      options: {
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "IsRecurring",
      options: {
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "AssignedToId",
      options: {
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "StatusId",
      options: {
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "State",
      options: {
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "WorkitemId",
      options: {
        display: false,
        viewColumns: false,
      },
    },
  ];

  const generateConditionalColumn = (
    column: {
      name: string;
      label: string;
      bodyRenderer: (arg0: any) => any;
    },
    rowDataIndex: number
  ) => {
    if (column.name === "Timer") {
      return {
        name: "Timer",
        options: {
          filter: true,
          sort: true,
          viewColumns: false,
          customHeadLabelRender: () => generateCustomHeaderName("Timer"),
          customBodyRender: (value: any, tableMeta: any) => {
            const estimatedTime = tableMeta.rowData[14].includes(":")
              ? tableMeta.rowData[14].split(":")
              : "00:00:00".split(":");
            const estimatedTimeInSeconds =
              parseInt(estimatedTime[0]) * 60 * 60 +
              parseInt(estimatedTime[1]) * 60 +
              parseInt(estimatedTime[2]);

            const timerValue =
              value === 0 ? "00:00:00" : toHoursAndMinutes(value);

            return (
              <div className="w-40 h-7 flex items-center">
                <ColorToolTip
                  title={`Estimated Time: ${estimatedTime[0]}:${estimatedTime[1]}:${estimatedTime[2]}`}
                  placement="top"
                  arrow
                >
                  <span
                    className={`w-16 text-center text-ellipsis overflow-hidden ${
                      tableMeta.rowData[tableMeta.rowData.length - 2] === 3
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    {timerValue}
                  </span>
                </ColorToolTip>
                {tableMeta.rowData[tableMeta.rowData.length - 4].toString() ===
                  localStorage.getItem("UserId") &&
                  tableMeta.rowData[tableMeta.rowData.length - 2] !== 3 &&
                  (workItemData[tableMeta.rowIndex].IsManual === false ||
                    !workItemData[tableMeta.rowIndex].IsManual ||
                    workItemData[tableMeta.rowIndex].IsManual === null) &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 7 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 9 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 6 &&
                  // tableMeta.rowData[tableMeta.rowData.length - 3] !== 10 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 8 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 4 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 11 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 13 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 53 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 54 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 55 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 57 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 58 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 59 &&
                  tableMeta.rowData[tableMeta.rowData.length - 3] !== 60 &&
                  tableMeta.rowData[tableMeta.rowData.length - 1] !==
                    isRunning &&
                  (tableMeta.rowData[tableMeta.rowData.length - 2] === 0 ? (
                    <ColorToolTip title="Start" placement="top" arrow>
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          handleTimer(
                            1,
                            tableMeta.rowData[tableMeta.rowData.length - 1],
                            0
                          );
                          handleClearSelection();
                        }}
                      >
                        <PlayButton />
                      </span>
                    </ColorToolTip>
                  ) : (
                    (workItemData[tableMeta.rowIndex].IsManual === false ||
                      !workItemData[tableMeta.rowIndex].IsManual) &&
                    tableMeta.rowData[tableMeta.rowData.length - 2] === 2 && (
                      <ColorToolTip title="Resume" placement="top" arrow>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            handleTimer(
                              1,
                              tableMeta.rowData[tableMeta.rowData.length - 1],
                              0
                            );
                            handleClearSelection();
                          }}
                        >
                          <PlayPause />
                        </span>
                      </ColorToolTip>
                    )
                  ))}
                {(tableMeta.rowData[tableMeta.rowData.length - 2] === 1 ||
                  tableMeta.rowData[tableMeta.rowData.length - 1] ===
                    isRunning) && (
                  <div className="flex">
                    <ColorToolTip title="Pause" placement="top" arrow>
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          setRunning(
                            tableMeta.rowData[tableMeta.rowData.length - 1]
                          );
                          handleTimer(
                            2,
                            tableMeta.rowData[tableMeta.rowData.length - 1],
                            workitemTimeId
                          );
                          handleClearSelection();
                        }}
                      >
                        <PauseButton />
                      </span>
                    </ColorToolTip>
                    <ColorToolTip title="Stop" placement="top" arrow>
                      <span
                        className="cursor-pointer mt-[2px]"
                        onClick={() => {
                          handleSync(
                            tableMeta.rowData[tableMeta.rowData.length - 1]
                          );
                          setRunning(
                            tableMeta.rowData[tableMeta.rowData.length - 1]
                          );
                          // setRowId(tableMeta.rowIndex);
                          setStopTimerDialog(true);
                          value > estimatedTimeInSeconds
                            ? setIsTimeExceed(true)
                            : setIsTimeExceed(false);

                          handleClearSelection();
                        }}
                      >
                        <StopButton />
                      </span>
                    </ColorToolTip>
                    <ColorToolTip title="Sync" placement="top" arrow>
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          handleSync(
                            tableMeta.rowData[tableMeta.rowData.length - 1]
                          );
                          handleClearSelection();
                        }}
                      >
                        <RestartButton />
                      </span>
                    </ColorToolTip>
                  </div>
                )}
              </div>
            );
          },
        },
      };
    } else if (column.label === "Task ID") {
      return {
        name: "WorkitemId",
        options: {
          filter: true,
          viewColumns: false,
          sort: true,
          customHeadLabelRender: () => generateCustomHeaderName("Task ID"),
          customBodyRender: (value: any, tableMeta: any) => {
            return generateCustomeTaskIdwithErrorLogs(value, tableMeta, 18);
          },
        },
      };
    } else if (column.name === "IsManual") {
      return {
        name: "IsManual",
        options: {
          display: false,
          viewColumns: false,
          filter: false,
        },
      };
    } else if (column.name === "StatusColorCode") {
      return {
        name: "StatusColorCode",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
      };
    } else if (column.name === "StatusName") {
      return {
        name: "StatusName",
        options: {
          filter: true,
          sort: true,
          viewColumns: false,
          customHeadLabelRender: () => generateCustomHeaderName("Status"),
          customBodyRender: (value: any, tableMeta: any) =>
            generateStatusWithColor(value, tableMeta.rowData[rowDataIndex]),
        },
      };
    } else if (column.name === "TaskName") {
      return {
        name: "TaskName",
        options: {
          filter: true,
          sort: true,
          customHeadLabelRender: () => generateCustomHeaderName("Task"),
          customBodyRender: (value: any, tableMeta: any) => {
            return generateCustomTaskNameBody(value, tableMeta);
          },
        },
      };
    } else if (column.name === "IsHasErrorlog") {
      return {
        name: "IsHasErrorlog",
        options: {
          display: false,
          viewColumns: false,
        },
      };
    } else if (column.name === "IsRecurring") {
      return {
        name: "IsRecurring",
        options: {
          display: false,
          viewColumns: false,
        },
      };
    } else if (column.name === "AssignedToId") {
      return {
        name: "AssignedToId",
        options: {
          display: false,
          viewColumns: false,
        },
      };
    } else if (column.name === "StatusId") {
      return {
        name: "StatusId",
        options: {
          display: false,
          viewColumns: false,
        },
      };
    } else if (column.name === "State") {
      return {
        name: "State",
        options: {
          display: false,
          viewColumns: false,
        },
      };
    } else if (column.name === "WorkitemId") {
      return {
        name: "WorkitemId",
        options: {
          display: false,
          viewColumns: false,
        },
      };
    } else {
      return generateCustomColumn(
        column.name,
        column.label,
        column.bodyRenderer
      );
    }
  };

  const workLogsColumns: any = columnConfig.map((col: any) => {
    return generateConditionalColumn(col, 10);
  });

  const runningTimerData: any = workItemData.filter(
    (data: any) => data.WorkitemId === isRunning
  );

  // props for actionbar
  const propsForActionBar = {
    selectedRowsCount,
    selectedRows,
    selectedRowStatusId,
    selectedRowId,
    selectedRowsdata,
    selectedRowClientId,
    selectedRowWorkTypeId,
    selectedRowStatusName,
    selectedRowIds,
    onEdit,
    handleClearSelection,
    onRecurring,
    onComment,
    workItemData,
    getWorkItemList,
    isUnassigneeClicked,
  };

  return (
    <div>
      {loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={workItemData}
            columns={workLogsColumns}
            title={undefined}
            options={{
              ...worklogs_Options,
              tableBodyHeight: "65vh",
              viewColumns: true,
              selectAllRows: isPopupOpen && selectedRowsCount === 0,
              rowsSelected: selectedRows,
              textLabels: {
                body: {
                  noMatch: (
                    <div className="flex items-start">
                      <span>
                        Currently there is no record, you may{" "}
                        <a
                          className="text-secondary underline cursor-pointer"
                          onClick={onDrawerOpen}
                        >
                          create task
                        </a>{" "}
                        to continue.
                      </span>
                    </div>
                  ),
                  toolTip: "",
                },
              },
              onRowSelectionChange: (
                currentRowsSelected: any,
                allRowsSelected: any,
                rowsSelected: any
              ) =>
                handleRowSelect(
                  currentRowsSelected,
                  allRowsSelected,
                  rowsSelected
                ),
            }}
            data-tableid="Datatable"
          />
          <TablePagination
            component="div"
            count={tableDataCount}
            page={page}
            onPageChange={(
              event: React.MouseEvent<HTMLButtonElement> | null,
              newPage: number
            ) => {
              handlePageChangeWithFilter(newPage, setPage, setFilteredOject);
            }}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleChangeRowsPerPageWithFilter(
                event,
                setRowsPerPage,
                setPage,
                setFilteredOject
              );
            }}
          />
        </ThemeProvider>
      ) : (
        <ReportLoader />
      )}

      {/* Timer Stop Dialog */}
      <Dialog open={stopTimerDialog}>
        <DialogTitle sx={{ fontSize: 18, paddingRight: 16, paddingBottom: 3 }}>
          {isTimeExceed
            ? "You have taken more time than estimated time"
            : "You have completed this task"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="w-full flex items-center justify-between border-b border-gray-500 pb-2">
              <span>Total Estimated Time</span>
              <span>
                {runningTimerData.length > 0
                  ? toHoursAndMinutes(
                      (toSeconds(runningTimerData[0].EstimateTime) ?? 0) *
                        runningTimerData[0]?.Quantity
                    )
                  : "00:00:00"}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b border-gray-500 py-2 my-3">
              <span>Yout total time spent</span>
              <span>
                {toHoursAndMinutes(
                  runningTimerData.length > 0
                    ? runningTimerData[0].Timer
                    : "00:00:00"
                )}
              </span>
            </div>
          </DialogContentText>
          {isTimeExceed && (
            <>
              <TextField
                multiline
                rows={2}
                value={comment}
                error={commentErrText.trim().length > 0 ? true : false}
                helperText={commentErrText}
                autoFocus
                margin="dense"
                id="comment"
                label={
                  <>
                    <span>Reason for extra needed time</span>
                    <span className="text-defaultRed">&nbsp;*</span>
                  </>
                }
                type="text"
                fullWidth
                variant="standard"
                onChange={handleComment}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              setStopTimerDialog(false);
              setComment("");

              setCommentErrText("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="!bg-secondary"
            autoFocus
            onClick={() => {
              if (isTimeExceed) {
                if (comment.trim().length > 0 && commentErrText === "") {
                  setCommentErrText("");
                  setStopTimerDialog(false);
                  handleTimer(3, isRunning, workitemTimeId);
                } else {
                  setCommentErrText("This is required field!");
                }
              } else {
                setStopTimerDialog(false);
                handleTimer(3, isRunning, workitemTimeId);
              }
            }}
          >
            Yes, Stop
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Bar */}
      <WorklogsActionBar {...propsForActionBar} />
    </div>
  );
};

export default Datatable;
