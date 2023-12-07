import React, { useEffect, useState } from "react";
import { Avatar, Card, InputBase, List, Popover } from "@mui/material";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import Assignee from "@/assets/icons/worklogs/Assignee";
import Minus from "@/assets/icons/worklogs/Minus";
import Priority from "@/assets/icons/worklogs/Priority";
import DetectorStatus from "@/assets/icons/worklogs/DetectorStatus";
import Comments from "@/assets/icons/worklogs/Comments";
import SearchIcon from "@/assets/icons/SearchIcon";
import EditIcon from "@/assets/icons/worklogs/EditIcon";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";
import AcceptIcon from "@/assets/icons/worklogs/AcceptIcon";
import AcceptNote from "@/assets/icons/worklogs/AcceptNote";
import EditUserIcon from "@/assets/icons/EditUserIcon";
import ErrorLogs from "@/assets/icons/worklogs/ErrorLogs";
import EditDialog from "../EditDialog";
import AcceptDiloag from "../AcceptDiloag";
import RejectDialog from "../RejectDialog";

const priorityOptions = [
  { id: 3, text: "Low" },
  { id: 2, text: "Medium" },
  { id: 1, text: "High" },
];

const ApprovalsActionBar = ({
  selectedRowsCount,
  selectedRows,
  selectedRowStatusId,
  selectedRowIds,
  selectedWorkItemIds,
  selectedRowClientId,
  selectedRowWorkTypeId,
  settingSelectedId,
  id,
  workitemId,
  onEdit,
  onComment,
  reviewList,
  getReviewList,
  getInitialPagePerRows,
  handleClearSelection,
}: any) => {
  const note: string = "";
  const [isAcceptOpen, setisAcceptOpen] = useState<boolean>(false);
  const [isEditOpen, setisEditOpen] = useState<boolean>(false);
  const [isRejectOpen, setisRejectOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryRW, setSearchQueryRW] = useState("");
  const [assignee, setAssignee] = useState<any | any[]>([]);
  const [reviewer, setReviewer] = useState<any | any[]>([]);
  const [allStatus, setAllStatus] = useState<any | any[]>([]);

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
    getAssignee();
  };

  const handleCloseAssignee = () => {
    setAnchorElAssignee(null);
  };

  const handleClickStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElStatus(event.currentTarget);
    getAllStatus();
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

  const handleClickReviewer = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElReviewer(event.currentTarget);
    getReviwer();
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
          getInitialPagePerRows();
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
  // Reject WorkItem or Reject with Note API
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
          getInitialPagePerRows();
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

  const closeModal = () => {
    setisEditOpen(false);
    setisAcceptOpen(false);
    setisRejectOpen(false);
  };

  return (
    <div>
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

export default ApprovalsActionBar;
