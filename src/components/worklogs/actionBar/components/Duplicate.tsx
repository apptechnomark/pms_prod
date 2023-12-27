import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import ContentCopy from "@/assets/icons/worklogs/ContentCopy";

const Duplicate = ({
  workItemData,
  selectedRowIds,
  handleClearSelection,
  getWorkItemList,
  getOverLay,
}: any) => {
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
      getOverLay(true);
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
            getOverLay(false);
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
            getOverLay(false);
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
          getOverLay(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div>
      <ColorToolTip title="Duplicate Task" arrow>
        <span onClick={duplicateWorkItem}>
          <ContentCopy />
        </span>
      </ColorToolTip>
    </div>
  );
};

export default Duplicate;
