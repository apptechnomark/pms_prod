import React, { useState } from "react";
import axios from "axios";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import DeleteIcon from "@/assets/icons/worklogs/Delete";
import { toast } from "react-toastify";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";

const Delete = ({
  workItemData,
  selectedRowId,
  selectedRowIds,
  selectedRowStatusId,
  handleClearSelection,
  getWorkItemList,
}: any) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  // For Closing Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

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

  return (
    <div>
      <ColorToolTip title="Delete" arrow>
        <span onClick={() => handleDeleteClick(selectedRowStatusId)}>
          <DeleteIcon />
        </span>
      </ColorToolTip>

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

export default Delete;
