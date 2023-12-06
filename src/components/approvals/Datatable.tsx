import React, { useEffect, useState } from "react";

import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
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
  CircularProgress,
} from "@mui/material";
import Popover from "@mui/material/Popover";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import TablePagination from "@mui/material/TablePagination";
import axios, { AxiosResponse } from "axios";
// icons imports
import PlayButton from "@/assets/icons/worklogs/PlayButton";
import Minus from "@/assets/icons/worklogs/Minus";
import EditIcon from "@/assets/icons/worklogs/EditIcon";
import AcceptIcon from "@/assets/icons/worklogs/AcceptIcon";
import AcceptNote from "@/assets/icons/worklogs/AcceptNote";
import ErrorLogs from "@/assets/icons/worklogs/ErrorLogs";
import Priority from "@/assets/icons/worklogs/Priority";
import SearchIcon from "@/assets/icons/SearchIcon";
import EditUserIcon from "@/assets/icons/EditUserIcon";
import DetectorStatus from "@/assets/icons/worklogs/DetectorStatus";

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
import Comments from "@/assets/icons/worklogs/Comments";
import Assignee from "@/assets/icons/worklogs/Assignee";
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generatePriorityWithColor,
  generateStatusWithColor,
  generateParentProcessBodyRender,
  handlePageChangeWithFilter,
  handleChangeRowsPerPageWithFilter,
} from "@/utils/datatable/CommonFunction";
import { approvals_Dt_Options } from "@/utils/datatable/TableOptions";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";

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
  onErrorLog,
  onManualTime,
  onHandleExport,
  searchValue,
}: any) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditOpen, setisEditOpen] = useState<boolean>(false);
  const [isAcceptOpen, setisAcceptOpen] = useState<boolean>(false);
  const [isRejectOpen, setisRejectOpen] = useState<boolean>(false);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [selectedWorkItemIds, setSelectedWorkItemIds] = useState<
    number[] | any
  >([]);
  const [allStatus, setAllStatus] = useState<any | any[]>([]);
  const [workitemId, setWorkitemId] = useState(0);
  const [id, setId] = useState(0);
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
  const [searchQueryRW, setSearchQueryRW] = useState("");
  const [assignee, setAssignee] = useState<any | any[]>([]);
  const [reviewer, setReviewer] = useState<any | any[]>([]);
  const [selectedRowClientId, setSelectedRowClientId] = useState<
    any | number[]
  >([]);
  const [selectedRowWorkTypeId, setSelectedRowWorkTypeId] = useState<
    any | number[]
  >([]);
  const note: string = "";

  // States for popup/shortcut filter management using table
  const [anchorElPriority, setAnchorElPriority] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElAssignee, setAnchorElAssignee] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElStatus, setAnchorElStatus] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElReviewer, setAnchorElReviewer] =
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

  const handleClickReviewer = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElReviewer(event.currentTarget);
  };

  const handleCloseReviewer = () => {
    setAnchorElReviewer(null);
  };

  const openPriority = Boolean(anchorElPriority);
  const idPriority = openPriority ? "simple-popover" : undefined;

  const openAssignee = Boolean(anchorElAssignee);
  const idAssignee = openAssignee ? "simple-popover" : undefined;

  const openStatus = Boolean(anchorElStatus);
  const idStatus = openStatus ? "simple-popover" : undefined;

  const openReviewer = Boolean(anchorElReviewer);
  const idReviewer = openReviewer ? "simple-popover" : undefined;

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchChangeRW = (event: any) => {
    setSearchQueryRW(event.target.value);
  };

  const filteredAssignees = assignee.filter((assignee: any) =>
    assignee.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReviewer = reviewer.filter((reviewer: any) =>
    reviewer.label.toLowerCase().includes(searchQueryRW.toLowerCase())
  );

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
            getReviewList();
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

  // API for get Assignee with all conditions
  const getReviwer = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.api_url}/user/GetReviewerDropdown`,
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
          setReviewer(response.data.ResponseData);
        } else {
          toast.error("Please try again later.");
        }
      } else {
        toast.error("Please try again.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
      }
    }
  };

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
            toast.error("Please try again after some time.");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again after some time.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedRowClientId.length > 0 && selectedRowWorkTypeId.length > 0) {
      getAssignee();
      getReviwer();
    }
  }, [selectedRowClientId, selectedRowWorkTypeId]);

  useEffect(() => {
    onHandleExport(reviewList.length > 0 ? true : false);
  }, [reviewList]);

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
            getReviewList();
          } else {
            toast.error(data || "Please try again after some time.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Please try again after some time.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for update Assignee
  const updateReviewer = async (id: number[], reviewerId: number) => {
    try {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      const isInvalidStatus = selectedRowStatusId.some((statusId: any) =>
        [7, 8, 9, 13].includes(statusId)
      );

      if (selectedRowsCount >= 1 && isInvalidStatus) {
        toast.warning(
          "Cannot change Reviewer for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
        );
      } else {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdateReviewer`,
          {
            workitemIds: id,
            ReviewerId: reviewerId,
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
            toast.success("Reviewer has been updated successfully.");
            handleClearSelection();
            getReviewList();
          } else {
            toast.error(data || "Please try again after some time.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Please try again after some time.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // API for status dropdown in Filter Popup
  const getAllStatus = async () => {
    try {
      const token = await localStorage.getItem("token");
      const orgToken = await localStorage.getItem("Org_Token");

      const response = await axios.get(
        `${process.env.pms_api_url}/status/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: orgToken,
          },
        }
      );

      handleResponseStatus(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResponseStatus = (response: AxiosResponse<any, any>) => {
    const { status, data } = response;

    if (status === 200) {
      handleSuccessResponse(data);
    } else {
      handleErrorResponse(data);
    }
  };

  const handleSuccessResponse = (data: {
    ResponseStatus: string;
    ResponseData: any[];
  }) => {
    if (data.ResponseStatus === "Success") {
      const filteredStatus = data.ResponseData.filter(
        (item) => item.Type === "OnHoldFromClient" || item.Type === "WithDraw"
      );

      setAllStatus(filteredStatus);
    } else {
      handleErrorResponse(data);
    }
  };

  const handleErrorResponse = (data: {
    ResponseStatus?: string;
    ResponseData?: any[];
    Message?: any;
  }) => {
    const errorMessage = data
      ? data.Message
      : "Please try again after some time.";
    toast.error(errorMessage);
  };

  // API for update status
  const updateStatus = async (id: number[], statusId: number) => {
    try {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      const isInvalidStatus = selectedRowStatusId.some((status: number) =>
        [7, 8, 9, 13].includes(status)
      );

      const hasRunningTasks = reviewList.some((item: any) =>
        id.includes(item.WorkitemId)
          ? item.TimelogId !== null
            ? true
            : false
          : false
      );

      if (isInvalidStatus) {
        if (selectedRowsCount > 1 || selectedRowsCount === 1) {
          toast.warning(
            "Cannot change status for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
          );
        }
      } else if (hasRunningTasks) {
        toast.warning("Cannot change status for running task.");
      } else {
        const filteredWorkitemIds = reviewList
          .map(
            (item: {
              WorkitemId: number;
              TimelogId: null;
              StatusId: number;
            }) => {
              if (id.includes(item.WorkitemId)) {
                if (
                  item.TimelogId === null &&
                  ![7, 8, 9, 13].includes(item.StatusId)
                ) {
                  return item.WorkitemId;
                } else {
                  return false;
                }
              } else {
                return undefined;
              }
            }
          )
          .filter((i: boolean | undefined) => i !== undefined && i !== false);

        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/UpdateStatus`,
          {
            workitemIds: filteredWorkitemIds,
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
            getReviewList();
          } else {
            toast.error(data || "Please try again after some time.");
          }
        } else {
          const data = response.data.Message;
          toast.error(data || "Please try again after some time.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // actions for priority popup
  const handleOptionPriority = (id: any) => {
    updatePriority(selectedWorkItemIds, id);
    handleClosePriority();
  };

  const handleOptionAssignee = (id: any) => {
    updateAssignee(selectedWorkItemIds, id);
    handleCloseAssignee();
  };

  const handleOptionReviewer = (id: any) => {
    updateReviewer(selectedWorkItemIds, id);
    handleCloseReviewer();
  };

  const handleOptionStatus = (id: any) => {
    updateStatus(selectedRowIds, id);
    handleCloseStatus();
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

    // adding all selected Ids in an array
    const selectedWorkItemIds: any =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow?.WorkitemId)
        : [];

    setSelectedWorkItemIds(selectedWorkItemIds);

    // adding selected workItem Id
    const workitem =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1]?.WorkitemId
        : null;
    setWorkitemId(workitem);

    // adding selected workItem Id
    const Id =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1]?.SubmissionId
        : null;
    setId(Id);

    // adding all selected Ids in an array
    const selectedSubmissionIds =
      selectedData.length > 0
        ? selectedData?.map((selectedRow: any) => selectedRow?.SubmissionId)
        : [];

    setSelectedRowIds(selectedSubmissionIds);

    // adding all selected row's Client Ids in an array
    const selectedWorkItemClientIds =
      selectedData.length > 0
        ? selectedData?.map((selectedRow: any) => selectedRow?.ClientId)
        : [];

    setSelectedRowClientId(selectedWorkItemClientIds);

    // adding all selected row's WorkType Ids in an array
    const selectedWorkItemWorkTypeIds =
      selectedData.length > 0
        ? selectedData?.map((selectedRow: any) => selectedRow?.WorkTypeId)
        : [];

    setSelectedRowWorkTypeId(selectedWorkItemWorkTypeIds);

    // adding all selected row's status Ids in an array
    const selectedWorkItemStatusIds =
      selectedData.length > 0
        ? selectedData?.map((selectedRow: any) => selectedRow?.StatusId)
        : [];

    setSelectedRowStatusId(selectedWorkItemStatusIds);

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
    onErrorLog(true, workitemId);
    handleClearSelection();
  };

  const handleReviewerManualTime = (id1: any, id2: any) => {
    // onEdit(workitemId, id, 2);
    onEdit(id1, id2, 2);
    onManualTime(true, id1);
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
          setRunning((prev) => (workitemId !== prev ? workitemId : -1));
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
            prev.map((data: any) => {
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
          onHandleExport(response.data.ResponseData.List > 0 ? true : false);
          setLoaded(true);
          setReviewList(response.data.ResponseData.List);
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

  // Applying filter data
  useEffect(() => {
    setFilteredOject({
      ...filteredObject,
      ...currentFilterData,
      globalSearch: searchValue,
    });
    getReviewList();
  }, [currentFilterData, searchValue]);

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
      await getReviewList();
      onDataFetch(() => fetchData());
    };
    fetchData();
    getReviewList();
    getAllStatus();
  }, []);

  const generateManualTimeBodyRender = (bodyValue: any) => {
    return <div>{bodyValue ? formatTime(bodyValue) : "00:00:00"}</div>;
  };

  const generateIsManualBodyRender = (bodyValue: any) => {
    return <div>{bodyValue === true ? "Yes" : "No"}</div>;
  };

  // Table columns
  const columns = [
    {
      name: "WorkitemId",
      options: {
        filter: true,
        sort: true,
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
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Client"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
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
        // display: false,
        customHeadLabelRender: () => generateCustomHeaderName("Task"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ParentProcess",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Process"),
        customBodyRender: (value: any) => {
          return generateParentProcessBodyRender(value);
        },
      },
    },
    {
      name: "SubProcess",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Sub-Process"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "Timer",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Review Timer"),
        customBodyRender: (value: any, tableMeta: any) => {
          const timerValue =
            value === 0 ? "00:00:00" : toHoursAndMinutes(value);

          return (
            <div className="w-40 h-7 flex items-center">
              <ColorToolTip
                title={`Estimated Time: ${toHoursAndMinutes(
                  tableMeta.rowData[11] * tableMeta.rowData[12]
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
                reviewList[tableMeta.rowIndex].StatusId === 6 &&
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
              {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                tableMeta.rowData[tableMeta.rowData.length - 4] !== false && (
                  <ColorToolTip
                    title="Reviewer Manual Time"
                    placement="top"
                    arrow
                  >
                    <span
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        handleReviewerManualTime(
                          tableMeta.rowData[tableMeta.rowData.length - 1],
                          tableMeta.rowData[tableMeta.rowData.length - 3]
                        )
                      }
                    >
                      <ClockIcon />
                    </span>
                  </ColorToolTip>
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
        customHeadLabelRender: () => generateCustomHeaderName("Status"),
        customBodyRender: (value: any, tableMeta: any) =>
          generateStatusWithColor(value, tableMeta.rowData[9]),
      },
    },
    {
      name: "EstimateTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Est. Hours"),
        // converting time (Seconnds) into HH:MM:SS
        customBodyRender: (value: any) => {
          return generateManualTimeBodyRender(value);
        },
      },
    },
    {
      name: "Quantity",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Qty."),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TotalTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Total Hrs"),
        // converting time (Seconnds) into HH:MM:SS
        customBodyRender: (value: any) => {
          return generateManualTimeBodyRender(value);
        },
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
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
        customHeadLabelRender: () => generateCustomHeaderName("End Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "EmpolyeeName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Employees"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "Role",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Designation"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "EmployeeManualTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Edited Time"),
        customBodyRender: (value: any) => {
          return generateManualTimeBodyRender(value);
        },
      },
    },
    {
      name: "EmployeeIsManual",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Is Manual"),
        customBodyRender: (value: any) => {
          return generateIsManualBodyRender(value);
        },
      },
    },

    {
      name: "ManagerName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Manager"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ReviewerIsManual",
      options: {
        display: false,
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

  const closeModal = () => {
    setisEditOpen(false);
    setisAcceptOpen(false);
    setisRejectOpen(false);
  };

  return (
    <div>
      {loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={reviewList}
            columns={columns}
            title={undefined}
            data-tableid="approval_Datatable"
            options={{
              ...approvals_Dt_Options,
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
        <div className="h-screen w-full flex justify-center my-[20%]">
          <CircularProgress />
        </div>
      )}

      {/* filter popup box*/}
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-start ml-12">
          <Card className="rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg w-[65%] bottom-12 -translate-y-1/2">
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[40%]">
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
                          onEdit(workitemId, id);
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

                {/* Status Popover */}
                <ColorToolTip title="Status" arrow>
                  <span
                    aria-describedby={idStatus}
                    onClick={handleClickStatus}
                    className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                  >
                    <DetectorStatus />
                  </span>
                </ColorToolTip>

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

                {/* update assignee option */}
                <ColorToolTip title="Assignee" arrow>
                  <span
                    aria-describedby={idAssignee}
                    onClick={handleClickAssignee}
                    className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                  >
                    <Assignee />
                  </span>
                </ColorToolTip>

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

                {/* Update Reviewer option */}
                <ColorToolTip title="Reviewer" arrow>
                  <span
                    aria-describedby={idReviewer}
                    onClick={handleClickReviewer}
                    className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300 mt-[1px]"
                  >
                    <EditUserIcon />
                  </span>
                </ColorToolTip>

                {/* Reviewer Popover */}
                <Popover
                  id={idReviewer}
                  open={openReviewer}
                  anchorEl={anchorElReviewer}
                  onClose={handleCloseReviewer}
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
                            value={searchQueryRW}
                            onChange={handleSearchChangeRW}
                            style={{ fontSize: "13px" }}
                          />
                        </span>
                      </div>
                    </div>
                    <List>
                      {reviewer.length === 0 ? (
                        <span className="flex flex-col py-2 px-4  text-sm">
                          No Data Available
                        </span>
                      ) : (
                        filteredReviewer.map((reviewer: any) => {
                          return (
                            <span
                              key={reviewer.value}
                              className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                            >
                              <span
                                className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() =>
                                  handleOptionReviewer(reviewer.value)
                                }
                              >
                                <Avatar
                                  sx={{ width: 32, height: 32, fontSize: 14 }}
                                >
                                  {reviewer.label
                                    ?.split(" ")
                                    .map((word: any) =>
                                      word.charAt(0).toUpperCase()
                                    )
                                    .join("")}
                                </Avatar>

                                <span className="pt-[0.8px]">
                                  {reviewer.label}
                                </span>
                              </span>
                            </span>
                          );
                        })
                      )}
                    </List>
                  </nav>
                </Popover>

                {hasPermissionWorklog("Comment", "View", "WorkLogs") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Comments" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-t-0 border-b-0 border-l-[1.5px] border-gray-300"
                        onClick={() => onComment(true, workitemId)}
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

                {/* {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  reviewList.filter(
                    (list: any) => list.WorkitemId === workitemId
                  )[0]?.ReviewerIsManual !== false &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Reviewer Manual Time" arrow>
                      <span
                        onClick={handleReviewerManualTime}
                        className="pl-2 pr-2 pt-[6px] cursor-pointer border-l-[1.5px] border-gray-300"
                      >
                        <ClockIcon />
                      </span>
                    </ColorToolTip>
                  )} */}

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
        onSelectWorkItemId={workitemId}
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
