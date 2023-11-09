import React, { useEffect, useState } from "react";
// material imports
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import SearchIcon from "@/assets/icons/SearchIcon";
import Datatable_ProjectStatus from "../Datatables/Datatable_ProjectStatus";

interface Status {
  Type: string;
  label: string;
  value: number;
}

interface ProjectStatusDialogProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedWorkType: number;
  onSelectedProjectStatus: string;
  onSelectedProjectIds: number[];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_ProjectStatus: React.FC<ProjectStatusDialogProps> = ({
  onOpen,
  onClose,
  onSelectedWorkType,
  onSelectedProjectStatus,
  onSelectedProjectIds,
}) => {
  const [allProjectStatus, setAllProjectStatus] = useState<Status[]>([]);
  const [projectStatus, setProjectStatus] = useState<string>("");
  //   const [searchValue, setSearchValue] = useState("");

  const handleClose = () => {
    onClose();
    setProjectStatus("");
  };

  // API for Project Status
  useEffect(() => {
    if (onOpen === true) {
      const getProjectStatusList = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.report_api_url}/dashboard/projectstatusgraph`,
            {
              WorkTypeId: onSelectedWorkType === 0 ? null : onSelectedWorkType,
              ProjectId:
                onSelectedProjectIds.length === 0 ? null : onSelectedProjectIds,
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

              setAllProjectStatus(statusName);
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
      getProjectStatusList();
    }
  }, [onSelectedWorkType, onSelectedProjectIds, onOpen]);

  return (
    <div>
      <Dialog
        fullWidth
        open={onOpen}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xl"
        onClose={handleClose}
      >
        <DialogTitle className="flex justify-between p-5 bg-whiteSmoke">
          <span className="font-semibold text-lg">Project Status</span>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col gap-5 mt-[10px]">
          <div className="flex justify-end items-center">
            {/* <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <div className="flex items-center h-full relative">
                <TextField
                  className="m-0"
                  placeholder="Search"
                  fullWidth
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  margin="normal"
                  variant="standard"
                  sx={{ mx: 0.75, maxWidth: 300 }}
                />
                <span className="absolute right-1 pl-1">
                  <SearchIcon />
                </span>
              </div>
            </FormControl> */}

            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <Select
                labelId="Project Staus"
                id="Project Staus"
                value={projectStatus ? projectStatus : onSelectedProjectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                sx={{ height: "36px" }}
              >
                {allProjectStatus.map((i: any, index: number) => (
                  <MenuItem value={i.name} key={index}>
                    {i.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Datatable_ProjectStatus
            onSelectedWorkType={onSelectedWorkType}
            onSelectedProjectStatus={onSelectedProjectStatus}
            onSelectedProjectIds={onSelectedProjectIds}
            onCurrSelectedProjectStatus={projectStatus}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_ProjectStatus;
