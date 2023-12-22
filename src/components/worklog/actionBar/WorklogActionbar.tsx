import React, { useEffect, useState } from "react";
import { Card, List, Popover } from "@mui/material";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import Minus from "@/assets/icons/worklogs/Minus";
import Priority from "@/assets/icons/worklogs/Priority";
import DetectorStatus from "@/assets/icons/worklogs/DetectorStatus";
import Delete from "@/assets/icons/worklogs/Delete";
import ContentCopy from "@/assets/icons/worklogs/ContentCopy";
import Comments from "@/assets/icons/worklogs/Comments";
import EditIcon from "@/assets/icons/worklogs/EditIcon";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { toast } from "react-toastify";
import axios from "axios";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";

const priorityOptions = [
  { id: 3, text: "Low" },
  { id: 2, text: "Medium" },
  { id: 1, text: "High" },
];

const WorklogActionbar = ({
  selectedRowsCount,
  selectedRows,
  selectedRowStatusId,
  selectedRowId,
  selectedRowIds,
  onEdit,
  handleClearSelection,
  onComment,
  workItemData,
  getWorkItemList,
  isCreatedByClient,
}: any) => {
  const [allStatus, setAllStatus] = useState<any | any[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  // States for popup/shortcut filter management using table
  const [anchorElPriority, setAnchorElPriority] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElStatus, setAnchorElStatus] =
    React.useState<HTMLButtonElement | null>(null);

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

  const handleClickPriority = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPriority(event.currentTarget);
  };

  const handleClosePriority = () => {
    setAnchorElPriority(null);
  };

  const handleClickStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElStatus(event.currentTarget);
    getAllStatus();
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

  const openPriority = Boolean(anchorElPriority);
  const idPriority = openPriority ? "simple-popover" : undefined;

  const openStatus = Boolean(anchorElStatus);
  const idStatus = openStatus ? "simple-popover" : undefined;

  // actions for priority popup
  const handleOptionPriority = (id: any) => {
    updatePriority(selectedRowIds, id);
    handleClosePriority();
  };

  const handleOptionStatus = (id: any) => {
    updateStatus(selectedRowIds, id);
    handleCloseStatus();
  };

  // For Closing Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  // Function for handling conditionally delete task
  const handleDeleteClick = (selectedRowStatusId: any) => {
    const isInProgressOrNotStarted =
      selectedRowStatusId.includes(1) || selectedRowStatusId.includes(2);

    // if (selectedRowStatusId.length === 1) {
    //   if (isInProgressOrNotStarted) {
    //     setIsDeleteOpen(true);
    //   } else {
    //     toast.warning(
    //       "Only tasks in 'In Preparation' or 'Not Started' status will be deleted."
    //     );
    //   }
    // } else {
    setIsDeleteOpen(true);
    // }
  };

  // Update Priority API
  const updatePriority = async (id: number[], priorityId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      // const isInvalidStatus = selectedRowStatusId.some((statusId: any) =>
      //   [7, 8, 9, 13].includes(statusId)
      // );

      // if (selectedRowsCount >= 1 && isInvalidStatus) {
      //   toast.warning(
      //     "Cannot change Priority for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
      //   );
      // } else {
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
      // }
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
        selectedRowIds.includes(item.WorkitemId) && item.IsCreatedByClient
          ? item.WorkitemId
          : undefined
      )
      .filter((i: any) => i !== undefined);

    // shouldWarn = workItemData
    //   .map((item: any) =>
    //     selectedRowIds.includes(item.WorkitemId) && item.IsCreatedByClient
    //       ? item.StatusId
    //       : undefined
    //   )
    //   .filter((item: any) => item !== undefined)
    //   .map((id: number) => {
    //     if (!warningStatusIds.includes(id)) {
    //       return id;
    //     }
    //     return undefined;
    //   })
    //   .filter((id: number) => id !== undefined);

    if (selectedRowIds.length > 0) {
      if (
        workItemData.some(
          (item: any) =>
            selectedRowIds.includes(item.WorkitemId) && item.IsHasErrorlog
        )
      ) {
        toast.warning("After resolving the error log, users can delete it.");
      }
      // if (
      //   (selectedRowStatusId.includes(3) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(4) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(5) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(6) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(7) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(8) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(9) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(10) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(11) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(12) && selectedRowIds.length > 1) ||
      //   (selectedRowStatusId.includes(13) && selectedRowIds.length > 1)
      // ) {
      //   toast.warning(
      //     "Only tasks in 'In Progress' or 'Not Started' status will be deleted."
      //   );
      // }
      if (
        workItemData.some(
          (item: any) =>
            selectedRowIds.includes(item.WorkitemId) && !item.IsCreatedByClient
        )
      ) {
        toast.warning("You can not delete task which is created by PABS.");
      }
      if (
        // shouldWarn.length > 0 &&
        deletedId.length > 0
      ) {
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
            // shouldWarn.splice(0, shouldWarn.length);
          } else {
            const data = response.data.Message || "An error occurred.";
            toast.error(data);
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred while deleting the task.");
        }
      }
    }
    // else if (shouldWarn.includes[1] || shouldWarn.includes[2]) {
    //   toast.warning(
    //     "Only tasks in 'In Progress' or 'Not Started' status will be deleted."
    //   );
    // }
  };

  // Duplicate Task API
  const duplicateWorkItem = async () => {
    const dontDuplicateId = workItemData
      .map((item: any) =>
        selectedRowIds.includes(item.WorkitemId) && !item.IsCreatedByClient
          ? item.WorkitemId
          : undefined
      )
      .filter((i: any) => i !== undefined);

    const duplicateId = workItemData
      .map((item: any) =>
        selectedRowIds.includes(item.WorkitemId) && item.IsCreatedByClient
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
            workitemIds: selectedRowIds,
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
              i.Type === "WithdrawnbyClient" || i.Type === "OnHoldFromClient"
                ? i
                : ""
            ).filter((i: any) => i !== "")
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

  // API for update status
  const updateStatus = async (id: number[], statusId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    // const isInvalidStatus = selectedRowStatusId.some((statusId: any) =>
    //   [7, 8, 9, 13].includes(statusId)
    // );

    // if (selectedRowsCount >= 1 && isInvalidStatus) {
    //   toast.warning(
    //     "Cannot change status for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
    //   );
    // } else {
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/UpdateStatus`,
        {
          workitemIds: id,
          statusId: statusId,
          SecondManagerReviewId: null,
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
    // }
  };

  return (
    <div>
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-center">
          <Card className="rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg w-[65%] bottom-0 -translate-y-1/2">
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[40%]">
                <span className="cursor-pointer" onClick={handleClearSelection}>
                  <Minus />
                </span>
                <span className="pl-2 pt-[1px] pr-6 text-[14px]">
                  {selectedRowsCount || selectedRows} task selected
                </span>
              </div>

              <div className="flex flex-row z-10 h-8 justify-center w-[90%]">
                {hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  selectedRowsCount === 1 &&
                  isCreatedByClient && (
                    // !selectedRowStatusId.some((statusId: number) =>
                    //   [4, 7, 8, 9, 13].includes(statusId)
                    // ) &&
                    <ColorToolTip title="Edit" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 text-slatyGrey cursor-pointer border-l border-lightSilver"
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
                      className="pl-2 pr-2 pt-1 cursor-pointer border-l border-lightSilver"
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
                    className="pl-2 pr-2 pt-1 cursor-pointer border-l border-lightSilver"
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
                      {priorityOptions.map((option: any) => (
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
                <ColorToolTip title="Status" arrow>
                  <span
                    aria-describedby={idStatus}
                    onClick={handleClickStatus}
                    className="pl-2 pr-2 pt-1 cursor-pointer border-l border-lightSilver"
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
                    className={`pl-2 pr-2 pt-1 cursor-pointer border-l border-lightSilver ${
                      selectedRowsCount > 0 && "border-r"
                    }`}
                    onClick={duplicateWorkItem}
                  >
                    <ContentCopy />
                  </span>
                </ColorToolTip>

                {selectedRowsCount === 1 && (
                  <ColorToolTip title="Comments" arrow>
                    <span
                      className="pl-2 pr-2 pt-1 cursor-pointer border-l border-lightSilver"
                      onClick={() => onComment(true, selectedRowId)}
                    >
                      <Comments />
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
    </div>
  );
};

export default WorklogActionbar;
