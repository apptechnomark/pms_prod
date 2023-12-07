import React, { useEffect, useState } from "react";
// material imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  IconButton,
  TextField,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";
import { DialogTransition } from "@/utils/style/DialogTransition";

interface EditModalProps {
  onOpen: boolean;
  onClose: () => void;
  onActionClick?: () => void;
  onReviewerDataFetch?: any;
  onClearSelection?: any;
  onSelectWorkItemId: number;
  onSelectedSubmissionId: number;
}

const ColorToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#0281B9",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#0281B9",
  },
}));

const EditDialog: React.FC<EditModalProps> = ({
  onOpen,
  onClose,
  onActionClick,
  onSelectWorkItemId,
  onReviewerDataFetch,
  onClearSelection,
  onSelectedSubmissionId,
}) => {
  const [estTime, setEstTime] = useState<any>(0);
  const [totalTime, setTotalTime] = useState<any>(0);
  const [actualTime, setActualTime] = useState<any>(0);
  const [quantity, setQuantity] = useState<any>(0);
  const [editTime, setEditTime] = useState<any>("00:00:00");
  const [initialEditTime, setInitialEditTime] = useState<string>("00:00:00");

  const handleClose = () => {
    setEditTime("00:00:00");
    onClose();
    onReviewerDataFetch();
  };

  // for formatting edit time
  const handleEditTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    newValue = newValue.replace(/\D/g, "");
    if (newValue.length > 8) {
      return;
    }

    let formattedValue = "";
    if (newValue.length >= 1) {
      const hours = parseInt(newValue.slice(0, 2));
      if (hours >= 0 && hours <= 23) {
        formattedValue = newValue.slice(0, 2);
      } else {
        formattedValue = "23";
      }
    }

    if (newValue.length >= 3) {
      const minutes = parseInt(newValue.slice(2, 4));
      if (minutes >= 0 && minutes <= 59) {
        formattedValue += ":" + newValue.slice(2, 4);
      } else {
        formattedValue += ":59";
      }
    }

    if (newValue.length >= 5) {
      const seconds = parseInt(newValue.slice(4, 6));
      if (seconds >= 0 && seconds <= 59) {
        formattedValue += ":" + newValue.slice(4, 6);
      } else {
        formattedValue += ":59";
      }
    }

    // Convert formattedValue to seconds
    let totalSeconds = 0;

    if (formattedValue) {
      const timeComponents = formattedValue.split(":");
      const hours = parseInt(timeComponents[0]);
      const minutes = parseInt(timeComponents[1]);
      const seconds = parseInt(timeComponents[2]);
      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    }

    setEditTime(formattedValue);
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

  // API for get Edit time contents
  useEffect(() => {
    if (onSelectedSubmissionId > 0 && onSelectedSubmissionId !== null) {
      const getDataForManualTime = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/approval/GetDataForManulTime`,
            {
              SubmissionId: onSelectedSubmissionId,
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
              const data = response.data.ResponseData;
              setEstTime(formatTime(data.EstimateTime));
              setQuantity(data.Quantity);
              setActualTime(formatTime(data.ActualTime));
              setTotalTime(formatTime(data.TotalEstimateTime));
              setActualTime(formatTime(data.ActualTime));
              setInitialEditTime(formatTime(data.ManagerTime));
              setEditTime(formatTime(data.ManagerTime));
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

      // calling api function
      getDataForManualTime();
    }
  }, [onSelectedSubmissionId]);

  // API for update manager time
  const updateManualTime = async () => {
    const [hours, minutes, seconds] = editTime.split(":");
    const convertedEditTime =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/updateManualTime`,
        {
          WorkItemId: onSelectWorkItemId,
          managerTime: convertedEditTime,
          SubmissionId: onSelectedSubmissionId,
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
          toast.success("Time has been updated successfully.");
          onClose();
          onClearSelection();
          onReviewerDataFetch();
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

  // for disable button when nothing changed
  const hasEditTimeChanged = () => {
    return editTime !== initialEditTime;
  };

  return (
    <div>
      <Dialog
        open={onOpen}
        TransitionComponent={DialogTransition}
        keepMounted
        maxWidth="md"
        onClose={handleClose}
        className="ml-80"
      >
        <DialogTitle className="h-[64px] p-[20px] flex items-center justify-between border-b border-b-lightSilver">
          <span className="text-lg font-medium">Edit Time</span>
          <ColorToolTip title="Close" placement="top" arrow>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </ColorToolTip>
        </DialogTitle>
        <DialogContent className="!pt-[20px]">
          <div className="flex flex-col gap-[20px]">
            <div className="flex gap-[20px]">
              <FormControl variant="standard">
                <TextField
                  label="Est. Time"
                  type="text"
                  fullWidth
                  value={estTime}
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 100 }}
                  InputProps={{ readOnly: true }}
                />
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  label="Qty"
                  type="text"
                  fullWidth
                  value={quantity}
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 100 }}
                  InputProps={{ readOnly: true }}
                />
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  label="Actual Time"
                  type="text"
                  fullWidth
                  value={actualTime}
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 100 }}
                  InputProps={{ readOnly: true }}
                />
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  label="Total Time"
                  type="text"
                  fullWidth
                  value={totalTime}
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 100 }}
                  InputProps={{ readOnly: true }}
                />
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  label="Edited Time"
                  placeholder="00:00:00"
                  variant="standard"
                  fullWidth
                  value={editTime}
                  onChange={handleEditTimeChange}
                  sx={{ mx: 0.75, maxWidth: 100 }}
                />
              </FormControl>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={updateManualTime}
            className={`${hasEditTimeChanged() && "!bg-secondary"}`}
            variant="contained"
            disabled={!hasEditTimeChanged()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditDialog;
