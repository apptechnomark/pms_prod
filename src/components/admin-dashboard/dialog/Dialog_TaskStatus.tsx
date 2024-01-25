import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import SearchIcon from "@/assets/icons/SearchIcon";
import Datatable_TaskStatus from "@/components/admin-dashboard/Datatables/Datatable_TaskStatus";
import { DialogTransition } from "@/utils/style/DialogTransition";
import { getStatusDropdownData } from "@/utils/commonDropdownApiCall";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import Loading from "@/assets/icons/reports/Loading";
import ExportIcon from "@/assets/icons/ExportIcon";
import axios from "axios";
import { toast } from "react-toastify";

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

const Dialog_TaskStatus: React.FC<TaskStatusInfoDialogProps> = ({
  onOpen,
  onClose,
  onSelectedWorkType,
  onSelectedStatusName,
}) => {
  const [allStatus, setAllStatus] = useState<any>([]);
  const [status, setStatus] = useState<number | any>(0);
  const [clickedStatusName, setClickedStatusName] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleClose = () => {
    onClose();
    setStatus(0);
    setClickedStatusName("");
    setSearchValue("");
  };

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

  const handleChangeValue = (e: any) => {
    setStatus(e.target.value);
    setSearchValue("");
  };

  useEffect(() => {
    setClickedStatusName(onSelectedStatusName);
    const statusValue: number = getValueByLabelOrType(clickedStatusName);
    setStatus(statusValue);
  }, [clickedStatusName, onSelectedStatusName]);

  const getAllStatus = async () => {
    const statusData = await getStatusDropdownData();
    setAllStatus(statusData);
  };

  useEffect(() => {
    getAllStatus();
  }, []);

  const exportTaskStatusListReport = async () => {
    try {
      setIsExporting(true);

      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      const response = await axios.post(
        `${process.env.report_api_url}/dashboard/taskstatuslist/export`,
        {
          PageNo: 1,
          PageSize: 50000,
          SortColumn: null,
          IsDesc: true,
          WorkTypeId: onSelectedWorkType === 0 ? null : onSelectedWorkType,
          GlobalSearch: searchValue,
          StatusId: status === 0 ? null : status,
          IsDownload: true,
        },
        {
          headers: { Authorization: `bearer ${token}`, org_token: Org_Token },
          responseType: "arraybuffer",
        }
      );

      handleExportResponse(response);
    } catch (error: any) {
      setIsExporting(false);
      toast.error(error);
    }
  };

  const handleExportResponse = (response: any) => {
    if (response.status === 200) {
      if (response.data.ResponseStatus === "Failure") {
        setIsExporting(false);
        toast.error("Please try again later.");
      } else {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Dashboard_TaskList_report.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setIsExporting(false);
      }
    } else {
      setIsExporting(false);
      toast.error("Please try again.");
    }
  };

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

            <div className="flex items-center justify-center">
              <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
                <Select
                  labelId="status"
                  id="status"
                  value={status ? status : 0}
                  onChange={handleChangeValue}
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
              {/* <ColorToolTip title="Export" placement="top" arrow>
                <span
                  className={`${
                    isExporting ? "cursor-default" : "cursor-pointer"
                  } ml-5 mt-5`}
                  onClick={exportTaskStatusListReport}
                >
                  {isExporting ? <Loading /> : <ExportIcon />}
                </span>
              </ColorToolTip> */}
            </div>
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
