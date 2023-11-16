import React, { useEffect, useState } from "react";

import MUIDataTable from "mui-datatables";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  InputBase,
  Avatar,
} from "@mui/material";
import Popover from "@mui/material/Popover";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";
// icons imports
import PlayButton from "@/assets/icons/worklogs/PlayButton";
import Minus from "@/assets/icons/worklogs/Minus";
import EditIcon from "@/assets/icons/worklogs/EditIcon";
import AcceptIcon from "@/assets/icons/worklogs/AcceptIcon";
import AcceptNote from "@/assets/icons/worklogs/AcceptNote";
import ErrorLogs from "@/assets/icons/worklogs/ErrorLogs";
import RejectIcon from "@/assets/icons/worklogs/RejectIcon";
import Priority from "@/assets/icons/worklogs/Priority";
import SearchIcon from "@/assets/icons/SearchIcon";

// Internal component Imports
import EditDialog from "./EditDialog";
import AcceptDiloag from "./AcceptDiloag";
import RejectDialog from "./RejectDialog";
import { toHoursAndMinutes } from "@/utils/timerFunctions";
import PlayPause from "@/assets/icons/worklogs/PlayPause";
import PauseButton from "@/assets/icons/worklogs/PauseButton";
import StopButton from "@/assets/icons/worklogs/StopButton";
import RestartButton from "@/assets/icons/worklogs/RestartButton";
import ClockIcon from "@/assets/icons/ClockIcon";
import Recurring from "@/assets/icons/worklogs/Recurring";
import Comments from "@/assets/icons/worklogs/Comments";
import Assignee from "@/assets/icons/worklogs/Assignee";

const ColorToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#0281B9",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#0281B9",
  },
}));

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

const priorityOptions = [
  { id: 3, text: "Low" },
  { id: 2, text: "Medium" },
  { id: 1, text: "High" },
];

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  pageNo: pageNo,
  pageSize: pageSize,
  sortColumn: "",
  isDesc: true,
  globalSearch: "",
  userId: null,
  clientId: null,
  projectId: null,
  startDate: null,
  endDate: null,
  StatusId: 6,
  ProcessId: null,
};

const Datatable = ({
  onEdit,
  onDataFetch,
  currentFilterData,
  onFilterOpen,
  onCloseDrawer,
  onComment,
}: any) => {
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditOpen, setisEditOpen] = useState<boolean>(false);
  const [isAcceptOpen, setisAcceptOpen] = useState<boolean>(false);
  const [isRejectOpen, setisRejectOpen] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<any | number>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [workitemId, setWorkitemId] = useState(0);
  const [id, setId] = useState(0);
  const [note, setNote] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);
  const [isRunning, setRunning] = useState<number>(-1);
  const [workitemTimeId, setWorkitemTimeId] = useState<number>(-1);
  const [submissionId, setSubmissionId] = useState<number>(-1);
  const [stopReviewTimer, setStopReviewTimer] = useState<boolean>(false);
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);
  const [reviewList, setReviewList] = useState<any>([]);
  const [selectedRowStatusId, setSelectedRowStatusId] = useState<
    any | number[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignee, setAssignee] = useState<any | any[]>([]);
  const [selectedRowClientId, setSelectedRowClientId] = useState<
    any | number[]
  >([]);
  const [selectedRowWorkTypeId, setSelectedRowWorkTypeId] = useState<
    any | number[]
  >([]);

  // States for popup/shortcut filter management using table
  const [anchorElPriority, setAnchorElPriority] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElAssignee, setAnchorElAssignee] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElStatus, setAnchorElStatus] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickPriority = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPriority(event.currentTarget);
  };

  const handleClosePriority = () => {
    setAnchorElPriority(null);
  };

  const handleClickAssignee = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAssignee(event.currentTarget);
  };

  const handleCloseAssignee = () => {
    setAnchorElAssignee(null);
  };

  const handleClickStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

  const openPriority = Boolean(anchorElPriority);
  const idPriority = openPriority ? "simple-popover" : undefined;

  const openAssignee = Boolean(anchorElAssignee);
  const idAssignee = openAssignee ? "simple-popover" : undefined;

  const openStatus = Boolean(anchorElStatus);
  const idStatus = openStatus ? "simple-popover" : undefined;

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  // Function for checking that All vlaues in the arrar are same or not
  function areAllValuesSame(arr: any[]) {
    return arr.every((value, index, array) => value === array[0]);
  }

  const filteredAssignees = assignee.filter((assignee: any) =>
    assignee.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update Priority API
  const updatePriority = async (id: number[], priorityId: number) => {
    if (
      selectedRowsCount === 1 &&
      (selectedRowStatusId.includes(7) ||
        selectedRowStatusId.includes(8) ||
        selectedRowStatusId.includes(9))
    ) {
      toast.warning(
        "Cannot change priority for 'Accept,' 'Reject,' or 'Accept with Notes' tasks."
      );
    } else {
      if (
        selectedRowsCount > 1 &&
        (selectedRowStatusId.includes(7) ||
          selectedRowStatusId.includes(8) ||
          selectedRowStatusId.includes(9))
      ) {
        toast.warning(
          "Cannot change priority for 'Accept,' 'Reject,' or 'Accept with Notes' tasks."
        );
      }
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdatePriority`,
          {
            workitemIds: id,
            priority: priorityId,
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
            toast.success("Priority has been updated successfully.");
            handleClearSelection();
            getReviewList();
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

  // API for get Assignee with all conditions
  useEffect(() => {
    if (
      selectedRowClientId.length > 0 &&
      selectedRowWorkTypeId.length > 0 &&
      areAllValuesSame(selectedRowClientId) &&
      areAllValuesSame(selectedRowWorkTypeId)
    ) {
      const getAssignee = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.api_url}/user/GetAssigneeUserDropdown`,
            {
              ClientIds: selectedRowClientId,
              WorktypeId: selectedRowWorkTypeId[0],
              IsAll: selectedRowClientId.length > 0 ? true : false,
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
              setAssignee(response.data.ResponseData);
            } else {
              const data = response.data.Message;
              if (data === null) {
                toast.error("Error duplicating task.");
              } else {
                toast.error(data);
              }
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Error duplicating task.");
            } else {
              toast.error(data);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };

      // calling function
      getAssignee();
    }
  }, [selectedRowClientId, selectedRowWorkTypeId]);

  // API for update Assignee
  const updateAssignee = async (id: number[], assigneeId: number) => {
    if (
      selectedRowsCount === 1 &&
      (selectedRowStatusId.includes(7) ||
        selectedRowStatusId.includes(8) ||
        selectedRowStatusId.includes(9))
    ) {
      toast.warning(
        "Cannot change assignee for 'Accept,' 'Reject,' or 'Accept with Notes' tasks."
      );
    } else {
      if (
        selectedRowsCount > 1 &&
        (selectedRowStatusId.includes(7) ||
          selectedRowStatusId.includes(8) ||
          selectedRowStatusId.includes(9))
      ) {
        toast.warning(
          "Cannot change assignee for 'Accept,' 'Reject,' or 'Accept with Notes' tasks."
        );
      }
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdateAssignee`,
          {
            workitemIds: id,
            assigneeId: assigneeId,
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
            toast.success("Assignee has been updated successfully.");
            handleClearSelection();
            getReviewList();
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Error duplicating task.");
            } else {
              toast.error(data);
            }
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Error duplicating task.");
          } else {
            toast.error(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // actions for priority popup
  const handleOptionPriority = (id: any) => {
    updatePriority(selectedRowIds, id);
    handleClosePriority();
  };

  const handleOptionAssignee = (id: any) => {
    updateAssignee(selectedRowIds, id);
    handleCloseAssignee();
  };

  useEffect(() => {
    if (
      onCloseDrawer === false ||
      !onCloseDrawer ||
      isEditOpen === false ||
      !isEditOpen
    ) {
      setRowsPerPage(10);
    }
  }, [onCloseDrawer, isEditOpen]);

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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setFilteredOject({
      ...filteredObject,
      PageNo: 1,
      PageSize: event.target.value,
    });
  };

  const handleRowSelect = (
    currentRowsSelected: any,
    allRowsSelected: any,
    rowsSelected: any
  ) => {
    const selectedData = allRowsSelected.map(
      (row: any) => reviewList[row.dataIndex]
    );

    setSelectedRowsCount(rowsSelected.length);
    setSelectedRows(rowsSelected);

    // adding selected Id
    const lastSelectedWorkItemId =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].WorkitemId
        : null;
    setSelectedRowId(lastSelectedWorkItemId);

    // adding selected workItem Id
    const workitem =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].WorkitemId
        : null;
    setWorkitemId(workitem);

    // adding selected workItem Id
    const Id =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].SubmissionId
        : null;
    setId(Id);

    // adding all selected Ids in an array
    const selectedWorkItemIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow.SubmissionId)
        : [];

    setSelectedRowIds(selectedWorkItemIds);

    // adding all selected row's Client Ids in an array
    const selectedWorkItemClientIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow.ClientId)
        : [];

    setSelectedRowClientId(selectedWorkItemClientIds);

    // adding all selected row's WorkType Ids in an array
    const selectedWorkItemWorkTypeIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow.WorkTypeId)
        : [];

    setSelectedRowWorkTypeId(selectedWorkItemWorkTypeIds);

    if (allRowsSelected) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedRowsCount(0);
    setSelectedRows([]);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (onFilterOpen || onFilterOpen === true) {
      handleClearSelection();
    }
  }, [onFilterOpen]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        handleClearSelection();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const settingSelectedId = () => {
    onEdit(workitemId, id);
    handleClearSelection();
  };

  const handleReviewerManualTime = () => {
    onEdit(workitemId, id, 2);
    handleClearSelection();
  };

  // converting seconds into HH:MM:SS
  function formatTime(seconds: any) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  const handleReviewTimer = async (
    state: number,
    workitemId: number,
    submissionId: number,
    workitemTimeId?: number
  ) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    // if (state === 1 && isOnBreak !== 0) {
    //   onGetBreakData();
    //   onSetBreak();
    // }

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/saveworkitemreviewertimestamp`,
        {
          state: state,
          workitemId: workitemId,
          submissionId: submissionId,
          timeId: workitemTimeId && workitemTimeId > 0 ? workitemTimeId : 0,
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
          setWorkitemTimeId((prev) =>
            response.data.ResponseData !== prev
              ? response.data.ResponseData
              : -1
          );
          setRunning((prev) => (selectedRowId !== prev ? selectedRowId : -1));
          getReviewList();
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

  const handleReviewSync = async (submissionId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/getreviewerworkitemsync`,
        {
          submissionId: submissionId,
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
          setReviewList((prev: any) =>
            prev.map((data: any, index: number) => {
              if (data.SubmissionId === submissionId) {
                return new Object({
                  ...data,
                  Timer: response.data.ResponseData.SyncTime,
                });
              } else {
                return data;
              }
            })
          );
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
    setRunning(
      reviewList.filter(
        (data: any) => data.TimelogId > 0 || data.TimelogId !== null
      ).length > 0
        ? reviewList.filter(
            (data: any) => data.TimelogId > 0 || data.TimelogId !== null
          )[0].WorkitemId
        : -1
    );
    setWorkitemTimeId(
      reviewList.filter(
        (data: any) => data.TimelogId > 0 || data.TimelogId !== null
      ).length > 0
        ? reviewList.filter(
            (data: any) => data.TimelogId > 0 || data.TimelogId !== null
          )[0].TimelogId
        : -1
    );
    setSubmissionId(
      reviewList.filter(
        (data: any) => data.TimelogId > 0 || data.TimelogId !== null
      ).length > 0
        ? reviewList.filter(
            (data: any) => data.TimelogId > 0 || data.TimelogId !== null
          )[0].SubmissionId
        : -1
    );
  }, [reviewList]);

  // Review List API
  const getReviewList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/GetReviewList`,
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
          setReviewList(response.data.ResponseData.List);
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
        // setLoader(false);
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

  // Applying filter data
  useEffect(() => {
    setFilteredOject({ ...filteredObject, ...currentFilterData });
    getReviewList();
  }, [currentFilterData]);

  // calling reviewList on first time
  useEffect(() => {
    getReviewList();
  }, [filteredObject]);

  // Accept WorkItem or Accept with Note API
  const acceptWorkitem = async (note: string, id: number[]) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/acceptworkitem`,
        {
          workitemSubmissionIds: id,
          comment: note ? note : null,
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
          toast.success("Selected tasks have been successfully approved.");
          handleClearSelection();
          getReviewList();
          setRowsPerPage(10);
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

  // Accept WorkItem or Accept with Note API
  const rejectWorkitem = async (note: string, id: number[]) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/rejectworkitem`,
        {
          workitemSubmissionIds: id,
          comment: note ? note : "",
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
          toast.success("Selected tasks have been successfully rejected.");
          handleClearSelection();
          getReviewList();
          setRowsPerPage(10);
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
    // refreshing data from Drawer side
    const fetchData = async () => {
      const fetchedData = await getReviewList();
      onDataFetch(() => fetchData());
    };
    fetchData();
    getReviewList();
  }, []);

  // Table columns
  const columns = [
    {
      name: "WorkitemId",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Task ID</span>
        ),
      },
    },
    {
      name: "EmpolyeeName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Employees</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Role",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Designation</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "EstimateTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Est. Hours</span>
        ),
        // converting time (Seconnds) into HH:MM:SS
        customBodyRender: (value: any) => {
          return <div>{value ? formatTime(value) : "00:00:00"}</div>;
        },
      },
    },
    {
      name: "TotalTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Total Hrs</span>
        ),
        // converting time (Seconnds) into HH:MM:SS
        customBodyRender: (value: any) => {
          return <div>{value ? formatTime(value) : "00:00:00"}</div>;
        },
      },
    },

    {
      name: "Timer",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Review Timer</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          const timerValue =
            value === 0 ? "00:00:00" : toHoursAndMinutes(value);

          return (
            <div className="w-40 h-7 flex items-center">
              <ColorToolTip
                title={`Estimated Time: ${toHoursAndMinutes(
                  tableMeta.rowData[4]
                )}`}
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
              {reviewList.length > 0 &&
                (reviewList[tableMeta.rowIndex].ReviewerIsManual === null ||
                  reviewList[tableMeta.rowIndex].ReviewerIsManual === false) &&
                reviewList[tableMeta.rowIndex].IsFinalSubmited &&
                tableMeta.rowData[tableMeta.rowData.length - 2] !== 3 &&
                tableMeta.rowData[tableMeta.rowData.length - 1] !== isRunning &&
                (tableMeta.rowData[tableMeta.rowData.length - 2] === 0 ? (
                  <ColorToolTip title="Start" placement="top" arrow>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        handleReviewTimer(
                          1,
                          tableMeta.rowData[tableMeta.rowData.length - 1],
                          tableMeta.rowData[tableMeta.rowData.length - 3],
                          0
                        )
                      }
                    >
                      <PlayButton />
                    </span>
                  </ColorToolTip>
                ) : (
                  tableMeta.rowData[tableMeta.rowData.length - 2] === 2 && (
                    <ColorToolTip title="Resume" placement="top" arrow>
                      <span
                        className="cursor-pointer"
                        onClick={() =>
                          handleReviewTimer(
                            1,
                            tableMeta.rowData[tableMeta.rowData.length - 1],
                            tableMeta.rowData[tableMeta.rowData.length - 3],
                            0
                          )
                        }
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
                        handleReviewTimer(
                          2,
                          tableMeta.rowData[tableMeta.rowData.length - 1],
                          tableMeta.rowData[tableMeta.rowData.length - 3],
                          workitemTimeId
                        );
                      }}
                    >
                      <PauseButton />
                    </span>
                  </ColorToolTip>
                  <ColorToolTip title="Stop" placement="top" arrow>
                    <span
                      className="cursor-pointer mt-[2px]"
                      onClick={() => setStopReviewTimer(true)}
                    >
                      <StopButton />
                    </span>
                  </ColorToolTip>
                  <ColorToolTip title="Sync" placement="top" arrow>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        handleReviewSync(
                          tableMeta.rowData[tableMeta.rowData.length - 3]
                        )
                      }
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
    },
    {
      name: "AssignedName",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Assigned To</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "PriorityName",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Priority</span>
        ),
        customBodyRender: (value: any) => {
          let isHighPriority;
          let isMediumPriority;
          let isLowPriority;

          if (value) {
            isHighPriority = value.toLowerCase() === "high";
            isMediumPriority = value.toLowerCase() === "medium";
            isLowPriority = value.toLowerCase() === "low";
          }

          return (
            <div>
              <div className="inline-block mr-1">
                <div
                  className={`w-[10px] h-[10px] rounded-full inline-block mr-2 ${
                    isHighPriority
                      ? "bg-defaultRed"
                      : isMediumPriority
                      ? "bg-yellowColor"
                      : isLowPriority
                      ? "bg-primary"
                      : "bg-lightSilver"
                  }`}
                ></div>
              </div>
              {value === null || "" ? "-" : value}
            </div>
          );
        },
      },
    },
    {
      name: "ColorCode",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "StatusName",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Status</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          const statusColorCode = tableMeta.rowData[8];
          return (
            <div>
              <div className="inline-block mr-1">
                <div
                  className="w-[10px] h-[10px] rounded-full inline-block mr-2"
                  style={{ backgroundColor: statusColorCode }}
                ></div>
              </div>
              {value === null || "" ? "-" : value}
            </div>
          );
        },
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Client</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Project</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ParentProcess",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Process</span>
        ),
        customBodyRender: (value: any) => {
          const shortProcessName = value && value.split(" ");
          return (
            <div className="font-semibold">
              {value === null || "" ? (
                "-"
              ) : (
                <ColorToolTip title={value} placement="top">
                  {shortProcessName[0]}
                </ColorToolTip>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "SubProcess",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Sub Process</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Start Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || "") {
            return "-";
          }

          const startDate = new Date(value);
          const month = startDate.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const day = startDate.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedYear = startDate.getFullYear();
          const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

          return <div>{formattedDate}</div>;
        },
      },
    },
    {
      name: "EndDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">End Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || "") {
            return "-";
          }

          const startDate = new Date(value);
          const month = startDate.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const day = startDate.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedYear = startDate.getFullYear();
          const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

          return <div>{formattedDate}</div>;
        },
      },
    },
    {
      name: "Quantity",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Qty.</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "EmployeeManualTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Edited Time</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div>{value ? formatTime(value) : "00:00:00"}</div>;
        },
      },
    },
    {
      name: "EmployeeIsManual",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Is Manual</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div>{value === true ? "Yes" : "No"}</div>;
        },
      },
    },

    {
      name: "ManagerName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Manager</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || "" || undefined ? "-" : value}</div>;
        },
      },
    },
    {
      name: "SubmissionId",
      options: {
        display: false,
      },
    },
    {
      name: "State",
      options: {
        display: false,
      },
    },
    {
      name: "WorkitemId",
      options: {
        display: false,
      },
    },
  ];

  const options: any = {
    filterType: "checkbox",
    responsive: "standard",
    tableBodyHeight: "73vh",
    elevation: 0,
    viewColumns: false,
    filter: false,
    print: false,
    download: false,
    search: false,
    selectToolbarPlacement: "none",
    pagination: false,
    draggableColumns: {
      enabled: true,
      transitionTime: 300,
    },
    textLabels: {
      body: {
        noMatch: (
          <div className="flex items-start">
            <span>Currently there is no records available.</span>
          </div>
        ),
        toolTip: "",
      },
    },
  };

  const closeModal = () => {
    setisEditOpen(false);
    setisAcceptOpen(false);
    setisRejectOpen(false);
  };

  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={reviewList}
          columns={columns}
          title={undefined}
          data-tableid="approval_Datatable"
          options={{
            ...options,
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
            selectAllRows: isPopupOpen && selectedRowsCount === 0,
            rowsSelected: selectedRows,
          }}
        />
        <TablePagination
          className="mt-[10px]"
          component="div"
          count={tableDataCount}
          page={page}
          // rowsPerPageOptions={[5, 10, 15]}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>

      {/* filter popup box*/}
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-start ml-12">
          <Card className="rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg w-[65%] h-[8%] bottom-12 -translate-y-1/2">
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[30%]">
                <span className="cursor-pointer" onClick={handleClearSelection}>
                  <Minus />
                </span>
                <span className="pl-2 pt-[1px] pr-6 text-[14px]">
                  {selectedRowsCount || selectedRows} task selected
                </span>
              </div>

              <div
                className={`flex flex-row z-10 h-8 justify-center ${
                  selectedRowsCount === 1 ? "w-[80%]" : "w-[50%]"
                }`}
              >
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  selectedRowsCount === 1 &&
                  !selectedRowStatusId.some((statusId: number) =>
                    [4, 7, 8, 9, 13].includes(statusId)
                  ) && (
                    <ColorToolTip title="Edit" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 text-slatyGrey cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        onClick={() => {
                          onEdit(selectedRowId);
                        }}
                      >
                        <EditIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {hasPermissionWorklog("", "Approve", "Approvals") && (
                  <ColorToolTip title="Accept" arrow>
                    <span
                      className={`pl-2 pr-2 pt-1 cursor-pointer border-l-[1.5px] border-gray-300 ${
                        selectedRowsCount > 1 ? "border-r-[1.5px]" : ""
                      }`}
                      onClick={() => acceptWorkitem(note, selectedRowIds)}
                    >
                      <AcceptIcon />
                    </span>
                  </ColorToolTip>
                )}

                {/* {hasPermissionWorklog("", "Reject", "Approvals") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Reject" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-l-[1.5px] border-gray-300"
                        onClick={() => setisRejectOpen(true)}
                      >
                        <RejectIcon />
                      </span>
                    </ColorToolTip>
                  )} */}

                {hasPermissionWorklog("", "Approve", "Approvals") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Accept with Note" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-l-[1.5px] border-gray-300"
                        onClick={() => setisAcceptOpen(true)}
                      >
                        <AcceptNote />
                      </span>
                    </ColorToolTip>
                  )}

                <ColorToolTip title="Priority" arrow>
                  <span
                    aria-describedby={idPriority}
                    onClick={handleClickPriority}
                    className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                  >
                    <Priority />
                  </span>
                </ColorToolTip>

                {/* Priority Popover */}
                <Popover
                  id={idPriority}
                  open={openPriority}
                  anchorEl={anchorElPriority}
                  onClose={handleClosePriority}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <List>
                      {priorityOptions.map((option, index) => (
                        <span
                          key={index}
                          className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                        >
                          <span
                            className="p-1 cursor-pointer"
                            onClick={() => handleOptionPriority(option.id)}
                          >
                            {option.text}
                          </span>
                        </span>
                      ))}
                    </List>
                  </nav>
                </Popover>

                {/* if the selected client Ids and worktype ids are same then only the Assignee icon will show */}
                {areAllValuesSame(selectedRowClientId) &&
                  areAllValuesSame(selectedRowWorkTypeId) && (
                    <ColorToolTip title="Assignee" arrow>
                      <span
                        aria-describedby={idAssignee}
                        onClick={handleClickAssignee}
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                      >
                        <Assignee />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Assignee Popover */}
                <Popover
                  id={idAssignee}
                  open={openAssignee}
                  anchorEl={anchorElAssignee}
                  onClose={handleCloseAssignee}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <nav className="!w-52">
                    <List>
                      {filteredAssignees.map((assignee: any, index: any) => {
                        return (
                          <span
                            key={index}
                            className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                          >
                            <span
                              className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                              onClick={() =>
                                handleOptionAssignee(assignee.value)
                              }
                            >
                              <Avatar
                                sx={{ width: 32, height: 32, fontSize: 14 }}
                              >
                                {assignee.label
                                  .split(" ")
                                  .map((word: any) =>
                                    word.charAt(0).toUpperCase()
                                  )
                                  .join("")}
                              </Avatar>

                              <span className="pt-[0.8px]">
                                {assignee.label}
                              </span>
                            </span>
                          </span>
                        );
                      })}
                    </List>
                    <div className="mr-4 ml-4 mb-4">
                      <div
                        className="flex items-center h-10 rounded-md pl-2 flex-row"
                        style={{
                          border: "1px solid lightgray",
                        }}
                      >
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
                  </nav>
                </Popover>

                {hasPermissionWorklog("Comment", "View", "WorkLogs") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Comments" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        onClick={() => onComment(true, selectedRowId)}
                      >
                        <Comments />
                      </span>
                    </ColorToolTip>
                  )}

                {hasPermissionWorklog("", "ErrorLog", "Approvals") &&
                  // hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Error logs" arrow>
                      <span
                        onClick={settingSelectedId}
                        className="pl-2 pr-2 pt-1 cursor-pointer border-l-[1.5px] border-gray-300"
                      >
                        <ErrorLogs />
                      </span>
                    </ColorToolTip>
                  )}

                {
                  // hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&

                  reviewList.filter(
                    (list: any) => list.WorkitemId === workitemId
                  )[0].ReviewerIsManual !== false &&
                    selectedRowsCount === 1 && (
                      <ColorToolTip title="Reviewer Manual Time" arrow>
                        <span
                          onClick={handleReviewerManualTime}
                          className="pl-2 pr-2 pt-[6px] cursor-pointer border-l-[1.5px] border-gray-300"
                        >
                          <ClockIcon />
                        </span>
                      </ColorToolTip>
                    )
                }

                {selectedRowsCount === 1 && (
                  <ColorToolTip title="Edit Time" arrow>
                    <span
                      className="pl-2 pr-2 pt-1 text-slatyGrey cursor-pointer border-l-[1.5px] border-gray-300"
                      onClick={() => setisEditOpen(true)}
                    >
                      <EditIcon />
                    </span>
                  </ColorToolTip>
                )}
              </div>

              <div className="flex right-0 justify-end pr-3 pt-1 w-[60%]">
                <span className="text-gray-400 italic text-[14px] pl-2">
                  shift+click to select, esc to deselect all
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Dialog open={stopReviewTimer}>
        <div className="p-2">
          <DialogTitle
            sx={{ fontSize: 18, paddingRight: 16, paddingBottom: 1 }}
          >
            Stop Task
          </DialogTitle>
          <hr className="mx-5" />
          <DialogContent>
            <DialogContentText>
              <div className="mr-20 mb-8">Are you sure you want to stop?</div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                setStopReviewTimer(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="!bg-secondary"
              autoFocus
              onClick={() => {
                handleReviewTimer(3, isRunning, submissionId, workitemTimeId);
                setStopReviewTimer(false);
              }}
            >
              Yes, Stop
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {/* Filter Dialog Box */}
      <EditDialog
        onOpen={isEditOpen}
        onClose={closeModal}
        onSelectWorkItemId={selectedRowId}
        onSelectedSubmissionId={id}
        onReviewerDataFetch={getReviewList}
        onClearSelection={handleClearSelection}
      />

      <AcceptDiloag
        onOpen={isAcceptOpen}
        onClose={closeModal}
        acceptWorkitem={acceptWorkitem}
        selectedWorkItemIds={selectedRowIds}
      />

      <RejectDialog
        onOpen={isRejectOpen}
        onClose={closeModal}
        rejectWorkItem={rejectWorkitem}
        selectedWorkItemIds={selectedRowIds}
      />
    </div>
  );
};

export default Datatable;
