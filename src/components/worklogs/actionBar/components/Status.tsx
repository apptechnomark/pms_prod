import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { List, Popover } from "@mui/material";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import DetectorStatus from "@/assets/icons/worklogs/DetectorStatus";

const Status = ({
  selectedRowIds,
  selectedRowStatusId,
  workItemData,
  selectedRowsCount,
  getWorkItemList,
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
    updateStatus(selectedRowIds, id);
    handleCloseStatus();
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
            // handleClearSelection();
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

  return (
    <div>
      <ColorToolTip title="Status" arrow>
        <span aria-describedby={idStatus} onClick={handleClickStatus}>
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
            {allStatus.length === 0 ? (
              <span className="flex flex-col py-2 px-4  text-sm">
                No Data Available
              </span>
            ) : (
              allStatus.map((option: any) => {
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
              })
            )}
          </List>
        </nav>
      </Popover>
    </div>
  );
};

export default Status;
