import React from "react";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";
import { Popover } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import { isWeekend } from "@/utils/commonFunction";
import DateIcon from "@/assets/icons/worklogs/DateIcon";

const DateReceived = ({ getWorkItemList, selectedRowIds, getOverLay }: any) => {
  const [anchorElDateReceived, setAnchorElDateReceived] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickDateReceived = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElDateReceived(event.currentTarget);
  };

  const handleCloseDateReceived = () => {
    setAnchorElDateReceived(null);
  };

  const openDateReceived = Boolean(anchorElDateReceived);
  const idDateReceived = openDateReceived ? "simple-popover" : undefined;

  const updateDate = async (id: number[], date: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const selectedDate = dayjs(date);
    let nextDate: any = selectedDate;
    if (selectedDate.day() === 4 || selectedDate.day() === 5) {
      nextDate = nextDate.add(4, "day");
    } else {
      nextDate = dayjs(date).add(2, "day").toDate();
    }
    try {
      getOverLay(true);
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemreceiverdate`,
        {
          WorkitemIds: id,
          ReceiverDate: dayjs(date).format("YYYY/MM/DD"),
          DueDate: dayjs(nextDate).format("YYYY/MM/DD"),
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
          toast.success("Reciever Date has been updated successfully.");
          handleCloseDateReceived();
          getWorkItemList();
          getOverLay(false);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
          getOverLay(false);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
        getOverLay(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ColorToolTip title="Date Received" arrow>
        <span
          aria-describedby={idDateReceived}
          onClick={handleClickDateReceived}
        >
          <DateIcon />
        </span>
      </ColorToolTip>

      {/* Date Received Popover */}
      <Popover
        id={idDateReceived}
        open={openDateReceived}
        anchorEl={anchorElDateReceived}
        onClose={handleCloseDateReceived}
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
          <div className="mx-4 my-2">
            <div className="flex items-center h-16 rounded-md pl-2 flex-row">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <span>
                      Received Date
                      <span className="!text-defaultRed">&nbsp;*</span>
                    </span>
                  }
                  className="b-lightgray"
                  shouldDisableDate={isWeekend}
                  maxDate={dayjs(Date.now())}
                  onChange={(newDate: any) =>
                    updateDate(selectedRowIds, newDate.$d)
                  }
                  slotProps={{
                    textField: {
                      readOnly: true,
                    } as Record<string, any>,
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </nav>
      </Popover>
    </div>
  );
};

export default DateReceived;
