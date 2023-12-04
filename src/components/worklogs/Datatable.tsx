import React, { useEffect, useState } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Popover from "@mui/material/Popover";
import {
  Avatar,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputBase,
  List,
  TextField,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// icons imports
import PlayButton from "@/assets/icons/worklogs/PlayButton";
import PlayPause from "@/assets/icons/worklogs/PlayPause";
import PauseButton from "@/assets/icons/worklogs/PauseButton";
import StopButton from "@/assets/icons/worklogs/StopButton";
import RestartButton from "@/assets/icons/worklogs/RestartButton";
import Assignee from "@/assets/icons/worklogs/Assignee";
import Minus from "@/assets/icons/worklogs/Minus";
import Priority from "@/assets/icons/worklogs/Priority";
import DetectorStatus from "@/assets/icons/worklogs/DetectorStatus";
import Delete from "@/assets/icons/worklogs/Delete";
import ContentCopy from "@/assets/icons/worklogs/ContentCopy";
import Recurring from "@/assets/icons/worklogs/Recurring";
import Comments from "@/assets/icons/worklogs/Comments";
import SearchIcon from "@/assets/icons/SearchIcon";
import EditIcon from "@/assets/icons/worklogs/EditIcon";
import RecurringIcon from "@/assets/icons/worklogs/RecurringIcon";
import ClientIcon from "@/assets/icons/worklogs/ClientIcon";
import ProjectIcon from "@/assets/icons/worklogs/ProjectIcon";
import ProcessIcon from "@/assets/icons/worklogs/ProcessIcon";
import ReturnYearIcon from "@/assets/icons/worklogs/ReturnYearIcon";
import ManagerIcon from "@/assets/icons/worklogs/ManagerIcon";
import DateIcon from "@/assets/icons/worklogs/DateIcon";
// Internal Component imports
import DeleteDialog from "@/components/common/workloags/DeleteDialog";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { toHoursAndMinutes, toSeconds } from "@/utils/timerFunctions";
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generatePriorityWithColor,
  generateStatusWithColor,
} from "@/utils/datatable/CommonFunction";
import {
  getClientDropdownData,
  getManagerDropdownData,
  getProjectDropdownData,
} from "@/utils/commonDropdownApiCall";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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
  currentFilterData,onHandleExport,
  onComment,
}: any) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [allStatus, setAllStatus] = useState<any | any[]>([]);
  const [assignee, setAssignee] = useState<any | any[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  const [projectSearchQuery, setprojectSearchQuery] = useState("");
  const [processSearchQuery, setprocessSearchQuery] = useState("");
  const [workItemData, setWorkItemData] = useState<any | any[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<any | number[]>([]);
  const [clientDropdownData, setClientDropdownData] = useState([]);
  const [managerDropdownData, setManagerDropdownData] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [processDropdownData, setProcessDropdownData] = useState([]);
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

  // States for Time
  const [isRunning, setRunning] = useState<number>(-1);
  const [workitemTimeId, setWorkitemTimeId] = useState<number>(-1);
  const [stopTimerDialog, setStopTimerDialog] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [commentErrText, setCommentErrText] = useState<string>("");
  const [isTimeExceed, setIsTimeExceed] = useState<boolean>(false);

  // States for popup/shortcut filter management using table
  const [anchorElPriority, setAnchorElPriority] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElAssignee, setAnchorElAssignee] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElStatus, setAnchorElStatus] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElClient, setAnchorElClient] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElProject, setAnchorElProject] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElProcess, setAnchorElProcess] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElReturnYear, setAnchorElReturnYear] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElManager, setAnchorElManager] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElDateReceived, setAnchorElDateReceived] =
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

  const handleClickClient = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElClient(event.currentTarget);
    getClientData();
  };

  const handleCloseClient = () => {
    setAnchorElClient(null);
  };

  const handleClickProject = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProject(event.currentTarget);
  };

  const handleCloseProject = () => {
    setAnchorElProject(null);
  };

  const handleClickProcess = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProcess(event.currentTarget);
  };

  const handleCloseProcess = () => {
    setAnchorElProcess(null);
  };

  const handleClickReturnYear = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElReturnYear(event.currentTarget);
  };

  const handleCloseReturnYear = () => {
    setAnchorElReturnYear(null);
  };

  const handleClickManager = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElManager(event.currentTarget);
    getManagerData();
  };

  const handleCloseManager = () => {
    setAnchorElManager(null);
  };

  const handleClickDateReceived = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElDateReceived(event.currentTarget);
  };

  const handleCloseDateReceived = () => {
    setAnchorElDateReceived(null);
  };

  const openPriority = Boolean(anchorElPriority);
  const idPriority = openPriority ? "simple-popover" : undefined;

  const openAssignee = Boolean(anchorElAssignee);
  const idAssignee = openAssignee ? "simple-popover" : undefined;

  const openStatus = Boolean(anchorElStatus);
  const idStatus = openStatus ? "simple-popover" : undefined;

  const openClient = Boolean(anchorElClient);
  const idClient = openClient ? "simple-popover" : undefined;

  const openProject = Boolean(anchorElProject);
  const idProject = openProject ? "simple-popover" : undefined;

  const openProcess = Boolean(anchorElProcess);
  const idProcess = openProcess ? "simple-popover" : undefined;

  const openReturnYear = Boolean(anchorElReturnYear);
  const idReturnYear = openReturnYear ? "simple-popover" : undefined;

  const openManager = Boolean(anchorElManager);
  const idManager = openManager ? "simple-popover" : undefined;

  const openDateReceived = Boolean(anchorElDateReceived);
  const idDateReceived = openDateReceived ? "simple-popover" : undefined;

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const filteredAssignees = assignee?.filter((assignee: any) =>
    assignee.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientSearchChange = (event: any) => {
    setClientSearchQuery(event.target.value);
  };

  const handleManagerSearchChange = (event: any) => {
    setManagerSearchQuery(event.target.value);
  };

  const handleProjectSearchChange = (event: any) => {
    setprojectSearchQuery(event.target.value);
  };

  const handleProcessSearchChange = (event: any) => {
    setprocessSearchQuery(event.target.value);
  };

  const filteredClient = clientDropdownData?.filter((client: any) =>
    client.label.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const filteredManager = managerDropdownData?.filter((manager: any) =>
    manager.label.toLowerCase().includes(managerSearchQuery.toLowerCase())
  );

  const filteredProject = projectDropdownData?.filter((project: any) =>
    project.label.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  const filteredProcess = processDropdownData?.filter((process: any) =>
    process.label.toLowerCase().includes(processSearchQuery.toLowerCase())
  );

  // actions for priority popup
  const handleOptionPriority = (id: any) => {
    updatePriority(selectedRowIds, id);
    handleClosePriority();
  };

  const handleOptionAssignee = (id: any) => {
    updateAssignee(selectedRowIds, id);
    handleCloseAssignee();
  };

  const handleOptionStatus = (id: any) => {
    updateStatus(selectedRowIds, id);
    handleCloseStatus();
  };

  const handleOptionreturnYear = (id: any) => {
    updateReturnYear(selectedRowIds, id);
    handleCloseReturnYear();
  };

  const handleOptionManager = (id: any) => {
    updateManager(selectedRowIds, id);
    handleCloseManager();
  };

  const handleOptionClient = (id: any) => {
    updateClient(selectedRowIds, id);
    handleCloseClient();
  };

  const handleOptionProject = (id: any) => {
    updateProject(selectedRowIds, id);
    handleCloseProject();
  };

  const handleOptionProcess = (id: any) => {
    updateProcess(selectedRowIds, id);
    handleCloseProcess();
  };

  // Function for checking that All vlaues in the arrar are same or not
  function areAllValuesSame(arr: any[]) {
    return arr.every((value, index, array) => value === array[0]);
  }

  // getting years
  const currentYear = new Date().getFullYear();
  const Years = [];

  for (let year = 2010; year <= currentYear + 1; year++) {
    Years.push({ label: String(year), value: year });
  }

  // For Closing Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  const handleRowSelect = (
    currentRowsSelected: any,
    allRowsSelected: any,
    rowsSelected: any
  ) => {
    const selectedData = allRowsSelected.map(
      (row: any) => workItemData[row.dataIndex]
    );
    setSelectedRowsCount(rowsSelected.length);
    setSelectedRows(rowsSelected);
    setSelectedRowsData(selectedData);

    // adding all selected Ids in an array
    const selectedWorkItemIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow.WorkitemId)
        : [];

    setSelectedRowIds(selectedWorkItemIds);

    // adding only one or last selected id
    const lastSelectedWorkItemId =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].WorkitemId
        : null;
    setSelectedRowId(lastSelectedWorkItemId);

    // adding all selected row's status name in an array
    const selectedWorkItemStatus =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow.StatusName)
        : [];

    setSelectedRowStatusName(selectedWorkItemStatus);

    // adding all selected row's status Ids in an array
    const selectedWorkItemStatusIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow.StatusId)
        : [];

    setSelectedRowStatusId(selectedWorkItemStatusIds);

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

    setIsPopupOpen(allRowsSelected);
  };

  const handleClearSelection = () => {
    setSelectedRowsCount(0);
    setSelectedRows([]);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.href.includes("=");
      if (pathname) {
        const id = window.location.href.split("=")[1];
        onEdit(id);
        onDrawerOpen();
      }
    }
  }, []);

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

  useEffect(() => {
    handleClearSelection();
    setRowsPerPage(10);
    setPage(0);
  }, [onDrawerClose]);

  // Function for handling conditionally delete task
  const handleDeleteClick = (selectedRowStatusId: any) => {
    const isInProgressOrNotStarted =
      selectedRowStatusId.includes(1) || selectedRowStatusId.includes(2);

    if (selectedRowStatusId.length === 1) {
      if (
        workItemData
          .map((i: any) => i.WorkitemId === selectedRowId && i.IsHasErrorlog)
          .filter((i: any) => i === true)
          .includes(true)
      ) {
        toast.warning("After resolving the error log, users can delete it.");
      } else if (isInProgressOrNotStarted) {
        setIsDeleteOpen(true);
      } else {
        toast.warning(
          "Only tasks in 'In Progress' or 'Not Started' status will be deleted."
        );
      }
    } else {
      setIsDeleteOpen(true);
    }
  };

  // function to fetch the only assignee which has logged in from the all data
  const handleAssigneeForSubmission = (arr: any[], userId: string | null) => {
    const workItemIds: number[] = [];
    const selctedWorkItemStatusIds: number[] = [];

    for (const item of arr) {
      if (item.AssignedToId === parseInt(userId || "", 10)) {
        workItemIds.push(item.WorkitemId);
        selctedWorkItemStatusIds.push(item.StatusId);
      }
    }
    return { workItemIds, selctedWorkItemStatusIds };
  };

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
              prev.map((data: any, index: number) => {
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
    setFilteredOject({ ...filteredObject, ...currentFilterData });
    getWorkItemList();
  }, [currentFilterData]);

  // client Dropdown API
  const getClientData = async () => {
    setClientDropdownData(await getClientDropdownData());
  };

  const getManagerData = async () => {
    setManagerDropdownData(await getManagerDropdownData());
  };

  // API for filte list
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

  // Delete WorkItem API
  const deleteWorkItem = async () => {
    const warningStatusIds = [3, 4, 5, 6, 7, 8, 9, 10, 11];
    let shouldWarn;

    const deletedId = workItemData
      .map((item: any) =>
        selectedRowIds.includes(item.WorkitemId) && !item.IsCreatedByClient
          ? item.WorkitemId
          : undefined
      )
      .filter((i: any) => i !== undefined);

    shouldWarn = workItemData
      .map((item: any) =>
        selectedRowIds.includes(item.WorkitemId) && !item.IsCreatedByClient
          ? item.StatusId
          : undefined
      )
      .filter((item: any) => item !== undefined)
      .map((id: number) => {
        if (!warningStatusIds.includes(id)) {
          return id;
        }
        return undefined;
      })
      .filter((id: number) => id !== undefined);

    if (selectedRowIds.length > 0) {
      if (
        workItemData.some(
          (item: any) =>
            selectedRowIds.includes(item.WorkitemId) && item.IsHasErrorlog
        )
      ) {
        toast.warning("After resolving the error log, users can delete it.");
      }
      if (
        (selectedRowStatusId.includes(3) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(4) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(5) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(6) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(7) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(8) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(9) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(10) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(11) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(12) && selectedRowIds.length > 1) ||
        (selectedRowStatusId.includes(13) && selectedRowIds.length > 1)
      ) {
        toast.warning(
          "Only tasks in 'In Progress' or 'Not Started' status will be deleted."
        );
      }
      if (
        workItemData.some(
          (item: any) =>
            selectedRowIds.includes(item.WorkitemId) && item.IsCreatedByClient
        )
      ) {
        toast.warning("You can not delete task which is created by Client.");
      }
      if (shouldWarn.length > 0 && deletedId.length > 0) {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");

        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/deleteworkitem`,
            {
              workitemIds: deletedId,
            },
            {
              headers: {
                Authorization: `bearer ${token}`,
                org_token: `${Org_Token}`,
              },
            }
          );

          if (
            response.status === 200 &&
            response.data.ResponseStatus === "Success"
          ) {
            toast.success("Task has been deleted successfully.");
            handleClearSelection();
            getWorkItemList();
            shouldWarn = [];
          } else {
            const data = response.data.Message || "An error occurred.";
            toast.error(data);
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred while deleting the task.");
        }
      }
    } else if (shouldWarn.includes[1] || shouldWarn.includes[2]) {
      toast.warning(
        "Only tasks in 'In Progress' or 'Not Started' status will be deleted."
      );
    }
  };

  // Submit WorkItem API
  const submitWorkItem = async () => {
    const userId = localStorage.getItem("UserId");
    const { workItemIds, selctedWorkItemStatusIds } =
      handleAssigneeForSubmission(selectedRowsdata, userId);

    if (workItemIds.length === 0) {
      toast.warning("Only Assignee can submit the task.");
      return;
    }

    const hasInProgressOrStopStatus =
      selctedWorkItemStatusIds.includes(2) ||
      selctedWorkItemStatusIds.includes(4);

    if (!hasInProgressOrStopStatus) {
      toast.warning(
        "Tasks can only be submitted if they are currently in the 'In Progress' or 'Stop' status."
      );
      return;
    }

    if (workItemIds.length < selectedRowsCount) {
      toast.warning("Only Assignee can submit the task.");
    }

    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/saveworkitemsubmission`,
        {
          workitemIds: workItemIds,
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
          if (
            (selectedRowStatusName.length > 0 &&
              selectedRowStatusName.includes("In Progress")) ||
            selectedRowStatusId.includes(2)
          ) {
            toast.success("Task has been Partially Submitted.");
          } else {
            toast.success("The task has been successfully submitted.");
          }

          handleClearSelection();
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

  // Update Priority API
  const updatePriority = async (id: number[], priorityId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const isInvalidStatus = selectedRowStatusId.some((statusId: any) =>
        [7, 8, 9, 13].includes(statusId)
      );

      if (selectedRowsCount >= 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change Priority for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else {
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
          const data = response.data.Message;
          if (response.data.ResponseStatus === "Success") {
            toast.success("Priority has been updated successfully.");
            handleClearSelection();
            getWorkItemList();
          } else {
            toast.error(data || "Please try again later.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Please try again later.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Duplicate Task API
  const duplicateWorkItem = async () => {
    const dontDuplicateId = workItemData
      .map((item: any) =>
        selectedRowIds.includes(item.WorkitemId) && item.IsCreatedByClient
          ? item.WorkitemId
          : undefined
      )
      .filter((i: any) => i !== undefined);

    const duplicateId = workItemData
      .map((item: any) =>
        selectedRowIds.includes(item.WorkitemId) && !item.IsCreatedByClient
          ? item.WorkitemId
          : undefined
      )
      .filter((i: any) => i !== undefined);

    if (dontDuplicateId.length > 0) {
      toast.warning("You can not duplicate task which is created by PABS.");
    }
    if (duplicateId.length > 0) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/copyworkitem`,
          {
            workitemIds: duplicateId,
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
            toast.success("Task has been duplicated successfully");
            handleClearSelection();
            getWorkItemList();
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

  // API for status dropdown in Filter Popup
  const getAllStatus = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/status/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setAllStatus(
            response.data.ResponseData.map((i: any) =>
              i.Type === "OnHoldFromClient" || i.Type === "WithDraw" ? i : ""
            ).filter((i: any) => i !== "")
          );
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for process Data
  const getProcessData = async (ids: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/getclientcommonprocess`,
        { ClientIds: ids },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setProcessDropdownData(response.data.ResponseData);
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
    const getData = async (clientName: any) => {
      clientName > 0 &&
        setProjectDropdownData(await getProjectDropdownData(clientName));
    };
    if (
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProjectId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length > 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) && i.ClientId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProjectId !== 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0 &&
      Array.from(new Set(selectedRowClientId)).length === 1
    ) {
      getData(Array.from(new Set(selectedRowClientId))[0]);
    }

    if (
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProcessId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length > 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) && i.ClientId === 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0 &&
      workItemData
        .map((i: any) =>
          selectedRowIds.includes(i.WorkitemId) &&
          i.ClientId > 0 &&
          i.ProcessId !== 0
            ? i.WorkitemId
            : undefined
        )
        .filter((j: any) => j !== undefined).length <= 0
    ) {
      getProcessData(selectedRowClientId);
    }
  }, [selectedRowClientId]);

  // API for update status
  const updateStatus = async (id: number[], statusId: number) => {
    try {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      const isInvalidStatus = selectedRowStatusId.some((status: number) =>
        [7, 8, 9, 13].includes(status)
      );

      const hasRunningTasks = workItemData.some((item: any) =>
        id.includes(item.WorkitemId)
          ? item.TimelogId !== null
            ? true
            : false
          : false
      );

      if (selectedRowsCount === 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change status for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else if (selectedRowsCount > 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change status for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else if (hasRunningTasks) {
        toast.warning("Cannot change status for running task.");
      } else {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdateStatus`,
          {
            workitemIds: workItemData
              .map((item: any) =>
                id.includes(item.WorkitemId)
                  ? item.TimelogId === null &&
                    ![7, 8, 9, 13].includes(item.StatusId)
                    ? item.WorkitemId
                    : false
                  : undefined
              )
              .filter((i: any) => i !== undefined)
              .filter((i: any) => i !== false),
            statusId: statusId,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.Message;
          if (response.data.ResponseStatus === "Success") {
            toast.success("Status has been updated successfully.");
            handleClearSelection();
            getWorkItemList();
          } else {
            toast.error(data || "Error duplicating task.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Error duplicating task.");
        }
      }
    } catch (error) {
      console.error(error);
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
              IsAll: selectedRowClientId.length > 1 ? true : false,
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
                toast.error("Something went wrong, Please try again later..");
              } else {
                toast.error(data);
              }
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Something went wrong, Please try again later..");
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
    try {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      const isInvalidStatus = selectedRowStatusId.some((statusId: any) =>
        [7, 8, 9, 13].includes(statusId)
      );

      if (selectedRowsCount >= 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change Assignee for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else {
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
          const data = response.data.Message;
          if (response.data.ResponseStatus === "Success") {
            toast.success("Assignee has been updated successfully.");
            handleClearSelection();
            getWorkItemList();
          } else {
            toast.error(data || "Error duplicating task.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Error duplicating task.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Manager
  const updateManager = async (id: number[], manager: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemmanager`,
        {
          WorkitemIds: id,
          ManagerId: manager,
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
          toast.success("Manager has been updated successfully.");
          handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update date
  const updateDate = async (id: number[], date: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const selectedDate = dayjs(date);
    let nextDate: any = selectedDate;
    if (selectedDate.day() === 4 || selectedDate.day() === 5) {
      nextDate = nextDate.add(4, "day");
    } else {
      nextDate = dayjs(date).add(2, "day").toDate();
    }
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemreceiverdate`,
        {
          WorkitemIds: id,
          ReceiverDate: dayjs(date).format("YYYY/MM/DD"),
          DueDate: dayjs(nextDate).format("YYYY/MM/DD"),
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
          toast.success("Reciever Date has been updated successfully.");
          handleClearSelection();
          handleCloseDateReceived();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Return Year
  const updateReturnYear = async (id: number[], retunYear: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemreturnyear`,
        {
          workitemIds: id,
          returnYear: retunYear,
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
          toast.success("Return Year has been updated successfully.");
          handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Client
  const updateClient = async (id: number[], clientId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemclient`,
        {
          workitemIds: id,
          ClientId: clientId,
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
          toast.success("Client has been updated successfully.");
          handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Process
  const updateProject = async (id: number[], processId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemproject`,
        {
          workitemIds: id,
          ProjectId: processId,
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
          toast.success("Project has been updated successfully.");
          handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Process
  const updateProcess = async (id: number[], processId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemprocess`,
        {
          workitemIds: id,
          ProcessId: processId,
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
          toast.success("Process has been updated successfully.");
          handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
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
      await getWorkItemList();
      onDataFetch(() => fetchData());
    };
    fetchData();
    getWorkItemList();
    //Calling getAllStatus API
    getAllStatus();
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

  const generateCustomeClientNameBody = (bodyValue: any, TableMeta: any) => {
    const IsHasErrorlog = TableMeta.rowData[18];
    return (
      <div>
        {IsHasErrorlog && (
          <div
            className={
              "w-[10px] h-[10px] rounded-full inline-block mr-2 bg-defaultRed"
            }
          ></div>
        )}
        {bodyValue === null || bodyValue === "" ? "-" : bodyValue}
      </div>
    );
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

  // Table Columns
  const columns = [
    {
      name: "WorkitemId",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Task ID"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        viewColumns: false,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Client"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateCustomeClientNameBody(value, tableMeta);
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        // display: false,
        customHeadLabelRender: () => generateCustomHeaderName("Project"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        // viewColumns: true,
        customHeadLabelRender: () => generateCustomHeaderName("Task"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateCustomTaskNameBody(value, tableMeta);
        },
      },
    },
    {
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        // display: false,
        customHeadLabelRender: () => generateCustomHeaderName("Process"),
        customBodyRender: (value: any) => {
          const shortProcessName = value && value.split(" ");
          return (
            <div className="font-semibold">
              {value === null || value === "" ? (
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
      name: "SubProcessName",
      options: {
        filter: true,
        sort: true,
        // display: false,
        customHeadLabelRender: () => generateCustomHeaderName("Sub-Process"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
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
              {tableMeta.rowData[tableMeta.rowData.length - 2] !== 3 &&
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
                tableMeta.rowData[tableMeta.rowData.length - 1] !== isRunning &&
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
    },
    {
      name: "AssignedToName",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Assigned To"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "PriorityName",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Priority"),
        customBodyRender: (value: any) => generatePriorityWithColor(value),
      },
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
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Status"),
        customBodyRender: (value: any, tableMeta: any) =>
          generateStatusWithColor(value, tableMeta.rowData[10]),
      },
    },
    {
      name: "EstimateTime",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Est. Time"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "Quantity",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Qty."),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    // {
    //   name: "ActualTime",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     viewColumns: false,
    //     customHeadLabelRender: () => (
    //       <span className="font-bold text-sm">Actual Time</span>
    //     ),
    //     customBodyRender: (value: any) => {
    //       return <div>{value === null || value === "" ? "-" : value}</div>;
    //     },
    //   },
    // },
    {
      name: "STDTime",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Total Time"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Start Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "EndDate",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("End Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "AssignedByName",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => generateCustomHeaderName("Assigned By"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
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

  const options: any = {
    filterType: "checkbox",
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
    selectableRows: "multiple",
    selectAllRows: isPopupOpen && selectedRowsCount === 0,
    rowsSelected: selectedRows,
    // isRowSelectable,
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
  };

  const runningTimerData: any = workItemData.filter(
    (data: any) => data.WorkitemId === isRunning
  );

  const isWeekend = (date: any) => {
    const day = date.day();
    return day === 6 || day === 0;
  };

  return (
    <div>
      {loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={workItemData}
            columns={columns}
            title={undefined}
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
            }}
            data-tableid="Datatable"
          />
          <TablePagination
            component="div"
            // rowsPerPageOptions={[5, 10, 15]}
            count={tableDataCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ThemeProvider>
      ) : (
        <div className="h-screen w-full flex justify-center my-[20%]">
          <CircularProgress />
        </div>
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

      {/* Delete Dialog Box */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onActionClick={deleteWorkItem}
        Title={"Delete Process"}
        firstContent={"Are you sure you want to delete Task?"}
        secondContent={
          "If you delete task, you will permanently loose task and task related data."
        }
      />

      {/* Popup Filter */}
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-start mx-8">
          <Card
            className={`rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg  ${
              selectedRowsCount === 1 ? "w-[80%]" : "w-[71%]"
            } bottom-12 -translate-y-1/2`}
          >
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[25%]">
                <span className="cursor-pointer" onClick={handleClearSelection}>
                  <Minus />
                </span>
                <span className="pl-2 pt-[1px] pr-6 text-[14px]">
                  {selectedRowsCount || selectedRows} task selected
                </span>
              </div>

              <div
                className={`flex flex-row z-10 h-8 justify-center ${
                  selectedRowsCount === 1 ? "w-[100%]" : "w-[80%]"
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

                {hasPermissionWorklog("Task/SubTask", "Delete", "WorkLogs") && (
                  <ColorToolTip title="Delete" arrow>
                    <span
                      className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                      onClick={() => handleDeleteClick(selectedRowStatusId)}
                    >
                      <Delete />
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
                      {priorityOptions.map((option) => (
                        <span
                          key={option.id}
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
                    <div className="mr-4 ml-4 mt-4">
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
                    <List>
                      {assignee.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredAssignees.map((assignee: any) => {
                          return (
                            <span
                              key={assignee.value}
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
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

                <ColorToolTip title="Status" arrow>
                  <span
                    aria-describedby={idStatus}
                    onClick={handleClickStatus}
                    className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                  >
                    <DetectorStatus />
                  </span>
                </ColorToolTip>

                {/* Status Popover */}
                <Popover
                  id={idStatus}
                  open={openStatus}
                  anchorEl={anchorElStatus}
                  onClose={handleCloseStatus}
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
                      {allStatus.map((option: any) => {
                        return (
                          <span
                            key={option.value}
                            className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                          >
                            <span
                              className="p-1 cursor-pointer"
                              onClick={() => handleOptionStatus(option.value)}
                            >
                              {option.label}
                            </span>
                          </span>
                        );
                      })}
                    </List>
                  </nav>
                </Popover>

                <ColorToolTip title="Duplicate Task" arrow>
                  <span
                    className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                    onClick={duplicateWorkItem}
                  >
                    <ContentCopy />
                  </span>
                </ColorToolTip>

                {hasPermissionWorklog("Reccuring", "View", "WorkLogs") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Recurring" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        onClick={() => onRecurring(true, selectedRowId)}
                      >
                        <Recurring />
                      </span>
                    </ColorToolTip>
                  )}

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

                {/* Change client */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ClientId === 0 || i.ClientId === null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) && i.ClientId > 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <ColorToolTip title="Client" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idClient}
                        onClick={handleClickClient}
                      >
                        <ClientIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Client Popover */}
                <Popover
                  id={idClient}
                  open={openClient}
                  anchorEl={anchorElClient}
                  onClose={handleCloseClient}
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
                    <div className="mr-4 ml-4 mt-4">
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
                            value={clientSearchQuery}
                            onChange={handleClientSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {clientDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredClient.map((client: any) => {
                          return (
                            <span
                              key={client.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() => handleOptionClient(client.value)}
                              >
                                <span className="pt-[0.8px]">
                                  {client.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

                {/* Change Project */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProjectId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) && i.ClientId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProjectId !== 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 &&
                  Array.from(new Set(selectedRowClientId)).length === 1 && (
                    <ColorToolTip title="Project" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idProject}
                        onClick={handleClickProject}
                      >
                        <ProjectIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Process Popover */}
                <Popover
                  id={idProject}
                  open={openProject}
                  anchorEl={anchorElProject}
                  onClose={handleCloseProject}
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
                    <div className="mr-4 ml-4 mt-4">
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
                            value={projectSearchQuery}
                            onChange={handleProjectSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {projectDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredProject.map((project: any) => {
                          return (
                            <span
                              key={project.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() =>
                                  handleOptionProject(project.value)
                                }
                              >
                                <span className="pt-[0.8px]">
                                  {project.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

                {/* Change Process */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProcessId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) && i.ClientId === 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      i.ClientId > 0 &&
                      i.ProcessId !== 0
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <ColorToolTip title="Process" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idProcess}
                        onClick={handleClickProcess}
                      >
                        <ProcessIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Process Popover */}
                <Popover
                  id={idProcess}
                  open={openProcess}
                  anchorEl={anchorElProcess}
                  onClose={handleCloseProcess}
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
                    <div className="mr-4 ml-4 mt-4">
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
                            value={processSearchQuery}
                            onChange={handleProcessSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {processDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredProcess.map((process: any) => {
                          return (
                            <span
                              key={process.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() =>
                                  handleOptionProcess(process.value)
                                }
                              >
                                <span className="pt-[0.8px]">
                                  {process.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

                {/* Change Return Year */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ReturnYear === 0 || i.ReturnYear === null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ReturnYear > 0 || i.ReturnYear !== null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <ColorToolTip title="Return Year" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idReturnYear}
                        onClick={handleClickReturnYear}
                      >
                        <ReturnYearIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Return Year Popover */}
                <Popover
                  id={idReturnYear}
                  open={openReturnYear}
                  anchorEl={anchorElReturnYear}
                  onClose={handleCloseReturnYear}
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
                      {Years.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        Years.map((yr: any) => {
                          return (
                            <span
                              key={yr.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() => handleOptionreturnYear(yr.value)}
                              >
                                <span className="pt-[0.8px]">{yr.label}</span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

                {/* Change manager */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ManagerId === 0 || i.ManagerId === null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ManagerId > 0 || i.ManagerId !== null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <ColorToolTip title="Manager" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idManager}
                        onClick={handleClickManager}
                      >
                        <ManagerIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Manager Popover */}
                <Popover
                  id={idManager}
                  open={openManager}
                  anchorEl={anchorElManager}
                  onClose={handleCloseManager}
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
                    <div className="mr-4 ml-4 mt-4">
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
                            value={managerSearchQuery}
                            onChange={handleManagerSearchChange}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {managerDropdownData.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredManager.map((manager: any) => {
                          return (
                            <span
                              key={manager.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() =>
                                  handleOptionManager(manager.value)
                                }
                              >
                                <span className="pt-[0.8px]">
                                  {manager.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

                {/* Change date received */}
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ReceiverDate?.length === 0 || i.ReceiverDate === null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length > 0 &&
                  workItemData
                    .map((i: any) =>
                      selectedRowIds.includes(i.WorkitemId) &&
                      (i.ReceiverDate?.length > 0 || i.ReceiverDate !== null)
                        ? i.WorkitemId
                        : undefined
                    )
                    .filter((j: any) => j !== undefined).length <= 0 && (
                    <ColorToolTip title="Date Received" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        aria-describedby={idDateReceived}
                        onClick={handleClickDateReceived}
                      >
                        <DateIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {/* Date Received Popover */}
                <Popover
                  id={idDateReceived}
                  open={openDateReceived}
                  anchorEl={anchorElDateReceived}
                  onClose={handleCloseDateReceived}
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
                    <div className="mx-4 my-2">
                      <div className="flex items-center h-16 rounded-md pl-2 flex-row">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                Received Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            className="b-lightgray"
                            shouldDisableDate={isWeekend}
                            maxDate={dayjs(Date.now())}
                            onChange={(newDate: any) =>
                              updateDate(selectedRowIds, newDate.$d)
                            }
                            slotProps={{
                              textField: {
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </nav>
                </Popover>

                <span className="pl-2 pr-2 border-t-0 cursor-pointer border-b-0 border-l-[1.5px] border-r-[1.5px] border-gray-300">
                  <Button
                    variant="outlined"
                    className=" rounded-[4px] h-8 !text-[10px]"
                    onClick={submitWorkItem}
                  >
                    Submit Task
                  </Button>
                </span>
              </div>

              <div className="flex right-0 justify-end pr-3 pt-1 w-[40%]">
                <span className="text-gray-400 italic text-[14px] pl-2">
                  shift+click to select, esc to deselect all
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Datatable;
