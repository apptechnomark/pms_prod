import React, { useEffect, useState } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Popover from "@mui/material/Popover";
import {
  Avatar,
  Button,
  Card,
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
// Internal Component imports
import DeleteDialog from "@/components/common/workloags/DeleteDialog";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { toHoursAndMinutes, toSeconds } from "@/utils/timerFunctions";

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
  currentFilterData,
  onComment,
}: any) => {
  const [allStatus, setAllStatus] = useState<any | any[]>([]);
  const [assignee, setAssignee] = useState<any | any[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [id, setId] = useState(0);

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

  const filteredAssignees = assignee.filter((assignee: any) =>
    assignee.label.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Function for checking that All vlaues in the arrar are same or not
  function areAllValuesSame(arr: any[]) {
    return arr.every((value, index, array) => value === array[0]);
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

    // adding selected workItem Id
    const Id =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].SubmissionId
        : null;
    setId(Id);

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
          setWorkItemData(response.data.ResponseData.List);
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
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
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
        (selectedRowStatusId.includes(11) && selectedRowIds.length > 1)
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

  // API for update status
  const updateStatus = async (id: number[], statusId: number) => {
    if (
      selectedRowsCount === 1 &&
      (selectedRowStatusId.includes(7) ||
        selectedRowStatusId.includes(8) ||
        selectedRowStatusId.includes(9) ||
        selectedRowStatusId.includes(13))
    ) {
      toast.warning(
        "Cannot change status for 'Accept', 'Accept with Notes', 'Reject', or 'Signed-off' tasks."
      );
    }
    if (
      workItemData
        .map((item: any) =>
          id.includes(item.WorkitemId)
            ? item.TimelogId !== null
              ? item.WorkitemId
              : false
            : undefined
        )
        .filter((i: any) => i !== undefined)
        .filter((i: any) => i !== false).length > 0
    ) {
      toast.warning("Cannot change status for running task.");
    }
    if (
      selectedRowsCount > 1 &&
      (selectedRowStatusId.includes(7) ||
        selectedRowStatusId.includes(8) ||
        selectedRowStatusId.includes(9) ||
        selectedRowStatusId.includes(13))
    ) {
      toast.warning(
        "Cannot change status for 'Accept', 'Accept with Notes', 'Reject', or 'Signed-off' tasks."
      );
    }
    if (
      workItemData
        .map((item: any) =>
          id.includes(item.WorkitemId)
            ? item.TimelogId === null
              ? item.WorkitemId
              : false
            : undefined
        )
        .filter((i: any) => i !== undefined)
        .filter((i: any) => i !== false).length > 0
    ) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdateStatus`,
          {
            workitemIds: workItemData
              .map((item: any) =>
                id.includes(item.WorkitemId)
                  ? item.TimelogId === null &&
                    item.StatusId !== 7 &&
                    item.StatusId !== 8 &&
                    item.StatusId !== 9 &&
                    item.StatusId !== 13
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
          if (response.data.ResponseStatus === "Success") {
            toast.success("Status has been updated successfully.");
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

  useEffect(() => {
    // refreshing data from Drawer side
    const fetchData = async () => {
      const fetchedData = await getWorkItemList();
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

  // useEffect(() => {
  //   if (isOnBreak !== 0 && isRunning > -1) {
  //     handleTimer(
  //       2,
  //       isRunning,
  //       workitemTimeId !== -1 ? workitemTimeId : undefined
  //     );
  //   }
  // }, [isOnBreak]);

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

  // Table Columns
  const columns = [
    {
      name: "WorkitemId",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Task ID</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        viewColumns: false,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Client</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          const IsHasErrorlog = tableMeta.rowData[19];
          return (
            <div>
              {IsHasErrorlog && (
                <div
                  className={
                    "w-[10px] h-[10px] rounded-full inline-block mr-2 bg-defaultRed"
                  }
                ></div>
              )}
              {value === null || value === "" ? "-" : value}
            </div>
          );
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        // display: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Project</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        // viewColumns: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Task</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          const IsRecurring = tableMeta.rowData[20];
          return (
            <div className="flex items-center gap-2">
              {value === null || value === "" ? (
                "-"
              ) : (
                <>
                  {IsRecurring && (
                    <span className="text-secondary font-semibold">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="20px"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12.14 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                        <path d="M16.14 10a3 3 0 0 0-3-3h-5v10h2v-4h1.46l2.67 4h2.4l-2.75-4.12A3 3 0 0 0 16.14 10zm-3 1h-3V9h3a1 1 0 0 1 0 2z"></path>
                      </svg>
                    </span>
                  )}
                  {value}
                </>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        // display: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Process</span>
        ),
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Sub Process</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Timer</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          const estimatedTime = tableMeta.rowData[15].split(":");
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Assigned To</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
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
              {value === null || value === "" ? (
                "-"
              ) : (
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
                  {value}
                </div>
              )}
            </div>
          );
        },
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Status</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          const statusColorCode = tableMeta.rowData[10];
          return (
            <div>
              {value === null || value === "" ? (
                "-"
              ) : (
                <div className="inline-block mr-1">
                  <div
                    className="w-[10px] h-[10px] rounded-full inline-block mr-2"
                    style={{ backgroundColor: statusColorCode }}
                  ></div>
                  {value}
                </div>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "EstimateTime",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Est. Time</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Quantity",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Qty.</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ActualTime",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Actual Time</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "STDTime",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Total Time</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Start Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || value === "") {
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
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">End Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || value === "") {
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
      name: "AssignedByName",
      options: {
        filter: true,
        sort: true,
        viewColumns: false,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">Assigned By</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
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
    tableBodyHeight: "68vh",
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

  return (
    <div>
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
        <div className="flex items-center justify-start ml-12">
          <Card className="rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg  w-[65%] h-[8%] bottom-12 -translate-y-1/2">
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
                  selectedRowsCount === 1 ? "w-[90%]" : "w-[80%]"
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
                      {allStatus.map((option: any, index: any) => {
                        return (
                          <span
                            key={index}
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

              <div className="flex right-0 justify-end pr-3 pt-1 w-[50%]">
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
