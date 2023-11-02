import React, { useEffect, useState } from "react";
// material imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";
// import { DateRangePicker } from "@mui/x-date-pickers-pro";

interface FilterModalProps {
  onOpen: boolean;
  onClose: () => void;
  currentFilterData?: any;
  isCompletedTaskClicked?: any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const initialFilter = {
  ProjectIds: null,
  PriorityId: null,
  StatusId: null,
  WorkTypeId: null,
  StartDate: null,
  EndDate: null,
  DueDate: null,
  AssignedTo: null,
  OverdueBy: null,
  IsSignedOff: false,
};

const FilterDialog: React.FC<FilterModalProps> = ({
  onOpen,
  onClose,
  currentFilterData,
  isCompletedTaskClicked,
}) => {
  // Dropdown Data
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [statusDropdownWorklogData, setStatusDropdownWorklogData] = useState(
    []
  );
  const [statusDropdownCompletedData, setStatusDropdownCompletedData] =
    useState([]);
  const [typeOfWorkDropdownData, setTypeOfWorkDropdownData] = useState([]);
  const [assigneeDropdownData, setAssigneeDropdownData] = useState([]);

  const [project, setProject] = useState<null | number>(0);
  const [priority, setPriority] = useState<null | number>(0);
  const [status, setStatus] = useState<null | number>(0);
  const [typeOfWork, setTypeOfWork] = useState<null | number>(0);
  const [startDate, setStartDate] = useState<null | string>(null);
  const [endDate, setEndDate] = useState<null | string>(null);
  const [dueDate, setDueDate] = useState<null | string>(null);
  const [assignee, setAssignee] = useState<null | number>(0);
  const [overDue, setOverDue] = useState<null | number>(0);
  const [anyFieldSelected, setAnyFieldSelected] = useState(false);
  const [currSelectedFields, setCurrSelectedFileds] = useState<any | any[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    currentFilterData(initialFilter);
    handleResetAll();
  }, [isCompletedTaskClicked]);

  const handleClose = () => {
    handleResetAll();
    onClose();
  };

  const handleResetAll = () => {
    setProject(0);
    setPriority(0);
    setStatus(0);
    setTypeOfWork(0);
    setDueDate(null);
    setStartDate(null);
    setEndDate(null);
    setAssignee(0);
    setOverDue(0);
    setIsChecked(false);
    currentFilterData(initialFilter);
  };

  // Check if any field is selected
  useEffect(() => {
    const isAnyFieldSelected =
      project !== 0 ||
      priority !== 0 ||
      status !== 0 ||
      typeOfWork !== 0 ||
      dueDate !== null ||
      startDate !== null ||
      endDate !== null ||
      assignee !== 0 ||
      overDue !== 0 ||
      isChecked !== false;

    setAnyFieldSelected(isAnyFieldSelected);
  }, [
    project,
    priority,
    status,
    typeOfWork,
    dueDate,
    startDate,
    endDate,
    assignee,
    overDue,
    isChecked,
  ]);

  useEffect(() => {
    const selectedFields = {
      ProjectIds: project === 0 ? [] : [project] || null,
      PriorityId: priority || null,
      StatusId: status || null,
      WorkTypeId: typeOfWork || null,
      DueDate:
        dueDate !== null
          ? new Date(
              new Date(dueDate).getTime() + 24 * 60 * 60 * 1000
            ).toISOString()
          : null,
      StartDate:
        startDate !== null
          ? new Date(
              new Date(startDate).getTime() + 24 * 60 * 60 * 1000
            ).toISOString()
          : null,
      EndDate:
        endDate !== null
          ? new Date(
              new Date(endDate).getTime() + 24 * 60 * 60 * 1000
            ).toISOString()
          : null,
      AssignedTo: assignee || null,
      OverdueBy: overDue || null,
      IsSignedOff: isChecked,
    };
    setCurrSelectedFileds(selectedFields);
  }, [
    project,
    priority,
    status,
    typeOfWork,
    dueDate,
    startDate,
    endDate,
    assignee,
    overDue,
    isChecked,
  ]);

  const sendFilterToPage = () => {
    currentFilterData(currSelectedFields);
    onClose();
  };

  const getProjectData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const clientId = await localStorage.getItem("clientId");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/getdropdown`,
        {
          clientId: clientId,
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
          setProjectDropdownData(response.data.ResponseData.List);
          getWorkTypeData();
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

  const getWorkTypeData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const clientId = await localStorage.getItem("clientId");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/WorkType/GetDropdown`,
        {
          clientId: clientId,
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
          setTypeOfWorkDropdownData(response.data.ResponseData);
          getAllStatus();
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
          setStatusDropdownWorklogData(
            response.data.ResponseData.filter(
              (i: any) =>
                i.Type !== "Accept" &&
                i.Type !== "AcceptWithNotes" &&
                i.Type !== "Reject" &&
                i.Type !== "SignedOff"
            )
          );
          setStatusDropdownCompletedData(
            response.data.ResponseData.filter(
              (i: any) =>
                i.Type !== "Errorlogs" &&
                i.Type !== "InProgress" &&
                i.Type !== "InReview" &&
                i.Type !== "NotStarted" &&
                i.Type !== "OnHoldFromClient" &&
                i.Type !== "PartialSubmitted" &&
                i.Type !== "Rework" &&
                i.Type !== "Reject" &&
                i.Type !== "Stop" &&
                i.Type !== "WithDraw"
            )
          );
          getAssignee();
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

  const getAssignee = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.api_url}/user/GetAssigneeFilterDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setAssigneeDropdownData(response.data.ResponseData);
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

  useEffect(() => {
    onOpen && getProjectData();
  }, [onOpen]);

  const isWeekend = (date: any) => {
    const day = date.day();
    return day === 6 || day === 0;
  };

  return (
    <div>
      <Dialog
        open={onOpen}
        TransitionComponent={Transition}
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
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="project">Project</InputLabel>
                <Select
                  labelId="project"
                  id="project"
                  value={project === 0 ? "" : project}
                  onChange={(e: any) => setProject(e.target.value)}
                >
                  {projectDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="priority">Priority</InputLabel>
                <Select
                  labelId="priority"
                  id="priority"
                  value={priority === 0 ? "" : priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                >
                  <MenuItem value={1}>High</MenuItem>
                  <MenuItem value={2}>Medium</MenuItem>
                  <MenuItem value={3}>Low</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  value={status === 0 ? "" : status}
                  onChange={(e: any) => {
                    setStatus(e.target.value);
                    e.target.value === 13
                      ? setIsChecked(true)
                      : setIsChecked(false);
                  }}
                >
                  {isCompletedTaskClicked
                    ? statusDropdownCompletedData.map(
                        (i: any, index: number) => (
                          <MenuItem value={i.value} key={index}>
                            {i.label}
                          </MenuItem>
                        )
                      )
                    : statusDropdownWorklogData.map((i: any, index: number) => (
                        <MenuItem value={i.value} key={index}>
                          {i.label}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex gap-[20px]">
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="workTypes-label">Types of Work</InputLabel>
                <Select
                  labelId="workTypes-label"
                  id="workTypes-select"
                  value={typeOfWork === 0 ? "" : typeOfWork}
                  onChange={(e: any) => setTypeOfWork(e.target.value)}
                >
                  {typeOfWorkDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="inline-flex mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[210px]">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    value={startDate === null ? null : dayjs(startDate)}
                    onChange={(newDate: any) => setStartDate(newDate.$d)}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="inline-flex mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[210px]">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    value={endDate === null ? null : dayjs(endDate)}
                    onChange={(newDate: any) => setEndDate(newDate.$d)}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="flex gap-[20px]">
              <div className="inline-flex mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[210px]">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date"
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    value={dueDate === null ? null : dayjs(dueDate)}
                    onChange={(newDate: any) => setDueDate(newDate.$d)}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="assignee-label">Assignee</InputLabel>
                <Select
                  labelId="assignee-label"
                  id="assignee-select"
                  value={assignee === 0 ? "" : assignee}
                  onChange={(e: any) => setAssignee(e.target.value)}
                >
                  {assigneeDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="overdueBy-label">Overdue By</InputLabel>
                <Select
                  labelId="overdueBy-label"
                  id="overdueBy-select"
                  value={overDue === 0 ? "" : overDue}
                  onChange={(e: any) => setOverDue(e.target.value)}
                >
                  <MenuItem value={1}>All</MenuItem>
                  <MenuItem value={2}>Yesterday</MenuItem>
                  <MenuItem value={3}>LastWeek</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex gap-[20px]">
              {isCompletedTaskClicked && (
                <FormControlLabel
                  required
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />
                  }
                  className="ml-[0.5px]"
                  label="IsSignedOff"
                />
              )}
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

          <Button variant="outlined" color="info" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FilterDialog;
