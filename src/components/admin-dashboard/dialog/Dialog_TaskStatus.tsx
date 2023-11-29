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
import Datatable_TaskStatus from "@/components/admin-dashboard/Datatables/Datatable_TaskStatus";

interface Status {
  Type: string;
  label: string;
  value: number;
}

interface TaskStatusInfoDialogProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedWorkType: number;
  onSelectedStatusName: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_TaskStatus: React.FC<TaskStatusInfoDialogProps> = ({
  onOpen,
  onClose,
  onSelectedWorkType,
  onSelectedStatusName,
}) => {
  const [allStatus, setAllStatus] = useState<Status[]>([]);
  const [status, setStatus] = useState<number | any>(0);
  const [clickedStatusName, setClickedStatusName] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");

  const handleClose = () => {
    onClose();
    setStatus(0);
    setClickedStatusName("");
  };

  //   function to extract values from label/type/name
  function getValueByLabelOrType(labelOrType: any): number {
    const status = allStatus.find(
      (status: Status) =>
        status.Type === labelOrType || status.label === labelOrType
    );
    if (status) {
      return status.value;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    setClickedStatusName(onSelectedStatusName);
    const statusValue: number = getValueByLabelOrType(clickedStatusName);
    setStatus(statusValue);
  }, [clickedStatusName, onSelectedStatusName]);

  // API for status dropdown list
  useEffect(() => {
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
            setAllStatus(response.data.ResponseData);
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Error duplicating task.");
            } else {
              toast.error(data);
            }
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Error duplicating task.");
          } else {
            toast.error(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    getAllStatus();
  }, []);

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
          <span className="font-semibold text-lg">Task Status</span>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col gap-5 mt-[10px]">
          <div className="flex justify-between items-center">
            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
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
            </FormControl>

            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <Select
                labelId="status"
                id="status"
                value={status ? status : 0}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ height: "36px" }}
              >
                <MenuItem value={0}>All</MenuItem>
                {allStatus.map((i: any) => (
                  <MenuItem value={i.value} key={i.value}>
                    {i.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Datatable_TaskStatus
            onSelectedWorkType={onSelectedWorkType}
            onSelectedStatusName={onSelectedStatusName}
            onCurrSelectedStatus={status}
            onSearchValue={searchValue}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_TaskStatus;
