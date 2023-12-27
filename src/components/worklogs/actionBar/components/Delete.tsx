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
  getOverLay,
}: any) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  const deleteWorkItem = async () => {
    const deletedId = workItemData
      .map((item: any) =>
        selectedRowIds.includes(item.WorkitemId) && !item.IsCreatedByClient
          ? item.WorkitemId
          : undefined
      )
      .filter((i: any) => i !== undefined);

    if (selectedRowIds.length > 0) {
      if (
        workItemData.some(
          (item: any) =>
            selectedRowIds.includes(item.WorkitemId) && item.IsCreatedByClient
        )
      ) {
        toast.warning("You can not delete task which is created by Client.");
      }
      if (deletedId.length > 0) {
        getOverLay(true);
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
          if (response.status === 200) {
            const data = response.data.Message;
            if (response.data.ResponseStatus === "Success") {
              toast.success("Task has been deleted successfully.");
              handleClearSelection();
              getWorkItemList();
              getOverLay(false);
            } else if (response.data.ResponseStatus === "Warning" && !!data) {
              toast.warning(data);
              handleClearSelection();
              getWorkItemList();
              getOverLay(false);
            } else {
              toast.error(data || "Please try again later.");
              handleClearSelection();
              getWorkItemList();
              getOverLay(false);
            }
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred while deleting the task.");
        }
      }
    }
  };

  return (
    <div>
      <ColorToolTip title="Delete" arrow>
        <span onClick={() => setIsDeleteOpen(true)}>
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
