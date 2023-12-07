import React, { useEffect, useState } from "react";
// material imports
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import Datatable_OverallProjectSummary from "../datatable/Datatable_OverallProjectSummary";
import { DialogTransition } from "@/utils/style/DialogTransition";

interface OverallProjectSummaryDialogProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedWorkType: number;
  onSelectedTaskStatus: string;
  onSelectedProjectIds: number[];
}

const Dialog_OverallProjectSummary: React.FC<
  OverallProjectSummaryDialogProps
> = ({
  onOpen,
  onClose,
  onSelectedWorkType,
  onSelectedTaskStatus,
  onSelectedProjectIds,
}) => {
  const [allTaskList, setAllTaskList] = useState<string[] | any>([]);
  const [taskStatusName, setTaskStatusName] = useState<string>("");

  const handleClose = () => {
    onClose();
    setTaskStatusName("");
  };

  // API for Project Status
  const getTaskStatusList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.report_api_url}/clientdashboard/overallprojectcompletion`,
        {
          typeOfWork: onSelectedWorkType === 0 ? null : onSelectedWorkType,
          ProjectIds: onSelectedProjectIds ? onSelectedProjectIds : [],
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
          const statusName: any = response.data.ResponseData.List.map(
            (item: { Key: any }) => ({
              name: item.Key,
            })
          );

          setAllTaskList(statusName);
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (onOpen === true) {
      getTaskStatusList();
    }
  }, [onSelectedWorkType, onSelectedProjectIds, onSelectedProjectIds, onOpen]);

  return (
    <div>
      <Dialog
        fullWidth
        open={onOpen}
        TransitionComponent={DialogTransition}
        keepMounted
        maxWidth="xl"
        onClose={handleClose}
      >
        <DialogTitle className="flex justify-between p-5 bg-whiteSmoke">
          <span className="font-semibold text-lg">Task Status</span>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col gap-5 mt-[10px]">
          <div className="flex justify-end items-center">
            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <Select
                labelId="Project Staus"
                id="Project Staus"
                value={taskStatusName ? taskStatusName : onSelectedTaskStatus}
                onChange={(e) => setTaskStatusName(e.target.value)}
                sx={{ height: "36px" }}
              >
                {allTaskList.map((i: any) => (
                  <MenuItem value={i.name} key={i.name}>
                    {i.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Datatable_OverallProjectSummary
            onSelectedProjectIds={onSelectedProjectIds}
            onSelectedWorkType={onSelectedWorkType}
            onSelectedTaskStatus={onSelectedTaskStatus}
            onCurrselectedtaskStatus={taskStatusName}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_OverallProjectSummary;
