import React, { useEffect, useState } from "react";
import axios from "axios";

import DeleteDialog from "@/components/common/workloags/DeleteDialog";
import { Card } from "@mui/material";
// icons imports
import Minus from "@/assets/icons/worklogs/Minus";
import Rating_Star from "@/assets/icons/worklog_Client/Rating_Star";
import { toast } from "react-toastify";
import Comments from "@/assets/icons/worklogs/Comments";
import ErrorLogs from "@/assets/icons/worklogs/ErrorLogs";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import RatingDialog from "../RatingDialog";

const CompletedTaskActionBar = ({
  selectedRowsCount,
  selectedRows,
  selectedRowId,
  handleClearSelection,
  onComment,
  onErrorLog,
  getWorkItemList,
  selectedRowIds,
  selectedRowStatusId,
  workItemData,
  onDataFetch,
}: any) => {
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

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

  const closeRatingDialog = () => {
    setIsRatingOpen(false);
    getWorkItemList();
  };

  // For Closing Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  // Delete WorkItem API
  const deleteWorkItem = async () => {
    const warningStatusIds = [3, 4, 5, 6, 7, 8, 9, 10, 11];
    let shouldWarn;

    shouldWarn = selectedRowStatusId
      .map((id: number) => {
        if (!warningStatusIds.includes(id)) {
          return id;
        }
        return undefined;
      })
      .filter((id: number) => id !== undefined);

    if (selectedRowIds.length > 0) {
      if (
        (shouldWarn.includes(1) && selectedRowIds.length > 1) ||
        (shouldWarn.includes(2) && selectedRowIds.length > 1)
      ) {
        toast.warning(
          "Only tasks in 'In Progress' or 'Not Started' status will be deleted.123"
        );
      }
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/deleteworkitem`,
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

        if (
          response.status === 200 &&
          response.data.ResponseStatus === "Success"
        ) {
          toast.success("Task has been deleted successfully.");
          handleClearSelection();
          getWorkItemList();
          shouldWarn.splice(0, shouldWarn.length);
        } else {
          const data = response.data.Message || "An error occurred.";
          toast.error(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the task.");
      }
    } else if (shouldWarn.includes[1] || shouldWarn.includes[2]) {
      toast.warning(
        "Only tasks in 'In Progress' or 'Not Started' status will be deleted."
      );
    }
  };

  return (
    <div>
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-center">
          <Card className="rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg w-[45%] bottom-0 -translate-y-1/2">
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[40%]">
                <span className="cursor-pointer" onClick={handleClearSelection}>
                  <Minus />
                </span>
                <span className="pl-2 pt-[1px] pr-6 text-[14px]">
                  {selectedRowsCount || selectedRows} task selected
                </span>
              </div>

              <div className="flex flex-row z-10 h-8 justify-center">
                <ColorToolTip title="Rating" arrow>
                  <span
                    className="px-2 pt-1 text-slatyGrey cursor-pointer border-l border-r border-lightSilver"
                    onClick={() => setIsRatingOpen(true)}
                  >
                    <Rating_Star />
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

                {selectedRowsCount === 1 && (
                  <ColorToolTip title="Error logs" arrow>
                    <span
                      className="pl-2 pr-2 pt-1 cursor-pointer border-l border-r border-lightSilver"
                      onClick={() => onErrorLog(true, selectedRowId)}
                    >
                      <ErrorLogs />
                    </span>
                  </ColorToolTip>
                )}
              </div>

              <div className="flex right-0 justify-end pr-3 pt-1 w-[55%]">
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

      <RatingDialog
        onOpen={isRatingOpen}
        onClose={closeRatingDialog}
        ratingId={workItemData
          .map((item: any) =>
            selectedRowIds.includes(item.WorkitemId) && item.StatusId !== 13
              ? item.WorkitemId
              : undefined
          )
          .filter((i: any) => i !== undefined)}
        noRatingId={workItemData
          .map((item: any) =>
            selectedRowIds.includes(item.WorkitemId) && item.StatusId === 13
              ? item.WorkitemId
              : undefined
          )
          .filter((i: any) => i !== undefined)}
        onDataFetch={onDataFetch}
        handleClearSelection={handleClearSelection}
      />
    </div>
  );
};

export default CompletedTaskActionBar;
