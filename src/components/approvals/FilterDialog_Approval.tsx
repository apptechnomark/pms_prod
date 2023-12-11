import React, { useEffect, useState } from "react";
// material imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getProcessDropdownData,
  getProjectDropdownData,
} from "@/utils/commonDropdownApiCall";
import { DialogTransition } from "@/utils/style/DialogTransition";

interface FilterModalProps {
  onOpen: boolean;
  onClose: () => void;
  onActionClick?: () => void;
  onDataFetch: () => void;
  currentFilterData?: any;
}

const initialFilter = {
  ClientId: null,
  userId: null,
  ProjectId: null,
  ProcessId: null,
  StatusId: 6,
};

const FilterDialog_Approval: React.FC<FilterModalProps> = ({
  onOpen,
  onClose,
  currentFilterData,
}) => {
  const [clientName, setClientName] = useState<any>(0);
  const [userName, setUser] = useState<number | string>(0);
  const [projectName, setProjectName] = useState<number | string>(0);
  const [status, setStatus] = useState<number | string>(0);
  const [processName, setProcessName] = useState<number | string>(0);
  const [clientDropdownData, setClientDropdownData] = useState([]);
  const [userDropdownData, setUserData] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [anyFieldSelected, setAnyFieldSelected] = useState<any>(false);
  const [currSelectedFields, setCurrSelectedFileds] = useState<any | any[]>([]);
  const [statusDropdownData, setStatusDropdownData] = useState([]);
  const [processDropdownData, setProcessDropdownData] = useState([]);

  const sendFilterToPage = () => {
    currentFilterData(currSelectedFields);
    onClose();
  };

  const handleResetAll = () => {
    setClientName(0);
    setUser(0);
    setProjectName(0);
    setProjectDropdownData([]);
    setStatus(0);
    setProcessName(0);
    setProcessDropdownData([]);
    currentFilterData(initialFilter);
  };

  const handleClose = () => {
    handleResetAll();
    onClose();
  };

  const getClientData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/client/getdropdownforgroup`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setClientDropdownData(response.data.ResponseData);
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

  const getEmployeeData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.api_url}/user/getdropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setUserData(response.data.ResponseData);
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
          setStatusDropdownData(
            response.data.ResponseData.filter(
              (i: any) =>
                //     i.Type !== "Errorlogs" &&
                //     i.Type !== "InProgress" &&
                //     i.Type !== "NotStarted" &&
                //     i.Type !== "PartialSubmitted" &&
                i.Type !== "Reject"
              // &&
              //     i.Type !== "Rework" &&
              //     i.Type !== "Stop"
            )
          );
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

  const getAllData = async (clientName: any) => {
    setProcessDropdownData(await getProcessDropdownData(clientName));
    setProjectDropdownData(await getProjectDropdownData(clientName));
  };

  useEffect(() => {
    if (onOpen === true) {
      getClientData();
      getEmployeeData();
      getAllStatus();
    }
  }, [onOpen]);

  useEffect(() => {
    clientName > 0 && getAllData(clientName);
  }, [clientName]);

  // Check if any field is selected
  useEffect(() => {
    const isAnyFieldSelected: any =
      clientName !== 0 ||
      userName !== 0 ||
      projectName !== 0 ||
      status !== 0 ||
      processName !== 0;

    setAnyFieldSelected(isAnyFieldSelected);
  }, [clientName, userName, projectName, processName, status]);

  useEffect(() => {
    const selectedFields = {
      ClientId: clientName || null,
      userId: userName || null,
      ProjectId: projectName || null,
      StatusId: status || null,
      ProcessId: processName || null,
    };
    setCurrSelectedFileds(selectedFields);
  }, [clientName, userName, projectName, processName, status]);

  return (
    <div>
      <Dialog
        open={onOpen}
        TransitionComponent={DialogTransition}
        keepMounted
        maxWidth="md"
        onClose={handleClose}
      >
        <DialogTitle className="h-[64px] p-[20px] flex items-center justify-between border-b border-b-lightSilver">
          <span className="text-lg font-medium">Filter</span>
          <Button color="error" onClick={handleResetAll}>
            Reset all
          </Button>
        </DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-[20px] pt-[15px]">
            <div className="flex gap-[20px]">
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="client_Name">Client Name</InputLabel>
                <Select
                  labelId="client_Name"
                  id="client_Name"
                  value={clientName === 0 ? "" : clientName}
                  onChange={(e) => setClientName(e.target.value)}
                >
                  {clientDropdownData.map((i: any) => (
                    <MenuItem value={i.value} key={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="employee">Employee Name</InputLabel>
                <Select
                  labelId="employee"
                  id="employee"
                  value={userName === 0 ? "" : userName}
                  onChange={(e) => setUser(e.target.value)}
                >
                  {userDropdownData.map((i: any) => (
                    <MenuItem value={i.value} key={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="project_Name">Project Name</InputLabel>
                <Select
                  labelId="project_Name"
                  id="project_Name"
                  value={projectName === 0 ? "" : projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                >
                  {projectDropdownData.map((i: any) => (
                    <MenuItem value={i.value} key={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex gap-[20px]">
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="process_Name">Process Name</InputLabel>
                <Select
                  labelId="process_Name"
                  id="process_Name"
                  value={processName === 0 ? "" : processName}
                  onChange={(e) => setProcessName(e.target.value)}
                >
                  {processDropdownData.map((i: any) => (
                    <MenuItem value={i.Id} key={i.Id}>
                      {i.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  value={status === 0 ? "" : status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusDropdownData.map((i: any) => (
                    <MenuItem value={i.value} key={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
          <Button
            variant="contained"
            color="info"
            className={`${anyFieldSelected && "!bg-secondary"}`}
            disabled={!anyFieldSelected}
            onClick={sendFilterToPage}
          >
            Apply Filter
          </Button>

          <Button variant="outlined" color="info" onClick={() => onClose()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FilterDialog_Approval;
