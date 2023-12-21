import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { List, Popover } from "@mui/material";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import DetectorStatus from "@/assets/icons/worklogs/DetectorStatus";
import { getStatusDropdownData } from "@/utils/commonDropdownApiCall";

const Status = ({
  selectedWorkItemIds,
  selectedRowStatusId,
  reviewList,
  selectedRowsCount,
  handleClearSelection,
  getReviewList,
}: any) => {
  const [allStatus, setAllStatus] = useState<any | any[]>([]);

  const [anchorElStatus, setAnchorElStatus] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElStatus(event.currentTarget);
    getAllStatus();
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

  const openStatus = Boolean(anchorElStatus);
  const idStatus = openStatus ? "simple-popover" : undefined;

  const handleOptionStatus = (id: any) => {
    updateStatus(selectedWorkItemIds, id);
    handleCloseStatus();
  };

  // API for status dropdown in Filter Popup
  const getAllStatus = async () => {
    let isRework: any = [];
    let isNotRework: any = [];
    reviewList.map((i: any) => {
      if (selectedWorkItemIds.includes(i.WorkitemId)) {
        if (i.ErrorlogSignedOffPending) {
          isRework.push(i.WorkitemId);
        } else {
          isNotRework.push(i.WorkitemId);
        }
      }
    });
    const data = await getStatusDropdownData();
    data.length > 0 &&
      setAllStatus(
        data.filter(
          (item: any) =>
            item.Type === "Rework" ||
            (isNotRework.length > 0
              ? item.Type === "InReview" ||
                item.Type === "Submitted" ||
                item.Type === "Accept"
              : // ||
                // item.Type === "AcceptWithNotes"
                item.Type === "ReworkInReview" ||
                item.Type === "ReworkSubmitted" ||
                item.Type === "ReworkAccept") ||
            // ||
            // item.Type === "ReworkAcceptWithNotes"
            item.Type === "SecondManagerReview" ||
            item.Type === "OnHoldFromClient" ||
            item.Type === "WithDraw" ||
            item.Type === "WithdrawnbyClient"
        )
      );
  };

  // API for update status
  const updateStatus = async (ids: number[], statusId: number) => {
    let isRework: any = [];
    let isNotRework: any = [];
    reviewList.map((i: any) => {
      if (selectedWorkItemIds.includes(i.WorkitemId)) {
        if (i.ErrorlogSignedOffPending) {
          isRework.push(i.WorkitemId);
        } else {
          isNotRework.push(i.WorkitemId);
        }
      }
    });
    try {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      // const isInvalidStatus = selectedRowStatusId.some((status: number) =>
      //   [7, 8, 9, 13].includes(status)
      // );

      // const hasRunningTasks = reviewList.some((item: any) =>
      //   ids.includes(item.WorkitemId)
      //     ? item.TimelogId !== null
      //       ? true
      //       : false
      //     : false
      // );

      // if (isInvalidStatus) {
      //   if (selectedRowsCount > 1 || selectedRowsCount === 1) {
      //     toast.warning(
      //       "Cannot change status for 'Accept', 'Accept with Notes', or 'Signed-off' tasks."
      //     );
      //   }
      // } else if (hasRunningTasks) {
      //   toast.warning("Cannot change status for running task.");
      // } else {
      // const filteredWorkitemIds = reviewList
      //   .map(
      //     (item: { WorkitemId: number; TimelogId: null; StatusId: number }) => {
      //       if (ids.includes(item.WorkitemId)) {
      //         if (
      //           item.TimelogId === null &&
      //           ![7, 8, 9, 13].includes(item.StatusId)
      //         ) {
      //           return item.WorkitemId;
      //         } else {
      //           return false;
      //         }
      //       } else {
      //         return undefined;
      //       }
      //     }
      //   )
      //   .filter((i: boolean | undefined) => i !== undefined && i !== false);

      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/UpdateStatus`,
        {
          workitemIds: isNotRework.length > 0 ? isNotRework : isRework,
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
          isNotRework = [];
          isRework = [];
          handleClearSelection();
          getReviewList();
        } else if (response.data.ResponseStatus === "Warning" && !!data) {
          toast.warning(data);
          handleClearSelection();
          isNotRework = [];
          isRework = [];
          getReviewList();
        } else {
          toast.error(data || "Please try again later.");
          handleClearSelection();
          getReviewList();
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

  return (
    <div>
      <ColorToolTip title="Status" arrow>
        <span aria-describedby={idStatus} onClick={handleClickStatus}>
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
    </div>
  );
};

export default Status;
