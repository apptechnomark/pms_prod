import React, { useEffect, useState } from "react";
// material imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormControl, InputLabel, MenuItem, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import axios from "axios";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface FilterModalProps {
  onOpen: boolean;
  onClose: () => void;
  onActionClick?: () => void;
  onDataFetch: () => void;
  onCurrentFilterId: number;
  currentFilterData?: any;
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
  ClientId: null,
  TypeOfWork: null,
  ProjectId: null,
  StatusId: null,
  AssignedTo: null,
  AssignedBy: null,
  DueDate: null,
  StartDate: null,
  EndDate: null,
  ReviewStatus: null,
};

const FilterDialog: React.FC<FilterModalProps> = ({
  onOpen,
  onClose,
  onActionClick,
  onDataFetch,
  onCurrentFilterId,
  currentFilterData,
}) => {
  const [saveFilter, setSaveFilter] = useState(false);
  const [clientName, setClientName] = useState<number | string>(0);
  const [workType, setWorkType] = useState<number | string>(0);
  const [projectName, setProjectName] = useState<number | string>(0);
  const [status, setStatus] = useState<number | string>(0);
  const [assignedTo, setAssignedTo] = useState<number | string>(0);
  const [assignedBy, setAssignedBy] = useState<number | string>(0);
  const [dueDate, setDueDate] = useState<null | string>(null);
  const [startDate, setStartDate] = useState<null | string>(null);
  const [endDate, setEndDate] = useState<null | string>(null);
  const [ReviewStatus, setReviewStatus] = useState<number | string>(0);
  const [filterName, setFilterName] = useState("");
  const [appliedFilterData, setAppliedFilterData] = useState<any | any[]>([]);
  const [clientDropdownData, setClientDropdownData] = useState([]);
  const [worktypeDropdownData, setWorktypeDropdownData] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [statusDropdownData, setStatusDropdownData] = useState([]);
  const [assignedByDropdownData, setAssignedByDropdownData] = useState([]);
  const [assignedToDropdownData, setAssignedToDropdownData] = useState([]);
  const [revwStatusDropdownData, setRevwStatusDropdownData] = useState([]);
  const [anyFieldSelected, setAnyFieldSelected] = useState(false);
  const [currSelectedFields, setCurrSelectedFileds] = useState<any | any[]>([]);
  const [error, setError] = useState("");

  let isHaveManageAssignee: any;

  useEffect(() => {
    isHaveManageAssignee = localStorage.getItem("IsHaveManageAssignee");
  }, []);

  const sendFilterToPage = () => {
    currentFilterData(currSelectedFields);
    onClose();
  };

  const handleResetAll = () => {
    setClientName(0);
    setWorkType(0);
    setProjectName(0);
    setStatus(0);
    setAssignedTo(0);
    setAssignedBy(0);
    setDueDate(null);
    setStartDate(null);
    setEndDate(null);
    setReviewStatus(0);
    setSaveFilter(false);
    setFilterName("");
    currentFilterData(initialFilter);
    setError("");
  };

  const handleResetAllOnEdit = () => {
    setClientName(0);
    setWorkType(0);
    setProjectName(0);
    setStatus(0);
    setAssignedTo(0);
    setAssignedBy(0);
    setDueDate(null);
    setStartDate(null);
    setEndDate(null);
    setReviewStatus(0);
    setError("");
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
        `${process.env.pms_api_url}/client/getdropdown`,
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

  const getWorkTypeData = async (clientName: string | number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/WorkType/GetDropdown`,
        {
          clientId: clientName ? clientName : 0,
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
          setWorktypeDropdownData(response.data.ResponseData);
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

  const getProjectData = async (clientName: string | number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/getdropdown`,
        {
          clientId: clientName ? clientName : 0,
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
          setStatusDropdownData(response.data.ResponseData);
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

  const getReviewStatusData = async () => {
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
          setRevwStatusDropdownData(
            response.data.ResponseData.map((i: any) =>
              i.Type === "Accept" ||
              i.Type === "AcceptWithNotes" ||
              i.Type === "Errorlogs" ||
              i.Type === "SignedOff"
                ? i
                : ""
            ).filter((i: any) => i !== "")
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
          setAssignedByDropdownData(response.data.ResponseData);
          setAssignedToDropdownData(response.data.ResponseData);
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
    if (onOpen === true) {
      getClientData();
      getAllStatus();
      getReviewStatusData();
      getAssignee();
    }
  }, [onOpen]);

  useEffect(() => {
    getWorkTypeData(clientName);
    getProjectData(clientName);
  }, [clientName]);

  const saveCurrentFilter = async () => {
    if (filterName.trim() === "") {
      setError("Filter name cannot be blank");
      return;
    }

    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/savefilter`,
        {
          filterId: onCurrentFilterId !== 0 ? onCurrentFilterId : null,
          name: filterName,
          AppliedFilter: {
            ClientId: clientName || 0,
            TypeOfWork: workType || 0,
            ProjectId: projectName || 0,
            Status: status || 0,
            AssignedTo: assignedTo || 0,
            AssignedBy: assignedBy || 0,
            DueDate: dueDate || null,
            StartDate: startDate || null,
            EndDate: endDate || null,
            ReviewStatus: ReviewStatus || 0,
          },
          type: 1,
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
          toast.success(
            `Filter has been ${
              onCurrentFilterId > 0 ? "updated" : "saved"
            } successully.`
          );
          setSaveFilter(false);
          onDataFetch();
          sendFilterToPage();
          onClose();
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

  const getFilterList = async (filterId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/getfilterlist`,
        {
          type: 1,
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
          const responseData = response.data.ResponseData;

          // Filter the data based on the given filterId
          const filteredData = responseData.filter(
            (filter: any) => filter.FilterId === filterId
          );

          if (filteredData.length > 0) {
            setAppliedFilterData(filteredData);
          }
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

  // Check if any field is selected
  useEffect(() => {
    const isAnyFieldSelected =
      clientName !== 0 ||
      workType !== 0 ||
      projectName !== 0 ||
      status !== 0 ||
      assignedTo !== 0 ||
      assignedBy !== 0 ||
      dueDate !== null ||
      startDate !== null ||
      endDate !== null ||
      ReviewStatus !== 0;

    setAnyFieldSelected(isAnyFieldSelected);
  }, [
    clientName,
    workType,
    projectName,
    status,
    assignedTo,
    assignedBy,
    dueDate,
    startDate,
    endDate,
    ReviewStatus,
  ]);

  // Fetch filter list based on the current filter ID
  useEffect(() => {
    getFilterList(onCurrentFilterId);
  }, [onCurrentFilterId]);

  // Set state values based on applied filter data
  useEffect(() => {
    if (appliedFilterData.length > 0) {
      const appliedFilter = appliedFilterData[0].AppliedFilter;

      if (appliedFilter) {
        const {
          ClientId,
          TypeOfWork,
          ProjectId,
          Status,
          AssignedTo,
          AssignedBy,
          DueDate,
          StartDate,
          EndDate,
          ReviewStatus,
        } = appliedFilter;

        setClientName(ClientId > 0 ? ClientId : "");
        setWorkType(TypeOfWork > 0 ? TypeOfWork : "");
        setProjectName(ProjectId > 0 ? ProjectId : "");
        setStatus(Status > 0 ? Status : "");
        setAssignedTo(AssignedTo > 0 ? AssignedTo : "");
        setAssignedBy(AssignedBy > 0 ? AssignedBy : "");
        setDueDate(DueDate ?? null);
        setStartDate(StartDate ?? null);
        setEndDate(EndDate ?? null);
        setReviewStatus(ReviewStatus > 0 ? ReviewStatus : "");
        onCurrentFilterId > 0
          ? setFilterName(appliedFilterData[0].Name)
          : setFilterName("");
        setSaveFilter(true);
      }
    }
  }, [appliedFilterData]);

  useEffect(() => {
    const selectedFields = {
      ClientId: clientName || null,
      TypeOfWork: workType || null,
      ProjectId: projectName || null,
      StatusId: status || null,
      AssignedTo: assignedTo || null,
      AssignedBy: assignedBy || null,
      DueDate:
        dueDate !== null
          ? new Date(
              new Date(dueDate).getTime() + 24 * 60 * 60 * 1000
            )?.toISOString()
          : null,
      StartDate:
        startDate !== null
          ? new Date(
              new Date(startDate).getTime() + 24 * 60 * 60 * 1000
            )?.toISOString()
          : null,
      EndDate:
        endDate !== null
          ? new Date(
              new Date(endDate).getTime() + 24 * 60 * 60 * 1000
            )?.toISOString()
          : null,
      ReviewStatus: ReviewStatus || null,
    };
    setCurrSelectedFileds(selectedFields);
  }, [
    clientName,
    workType,
    projectName,
    status,
    assignedTo,
    assignedBy,
    dueDate,
    startDate,
    endDate,
    ReviewStatus,
  ]);

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
          <Button
            color="error"
            onClick={
              onCurrentFilterId > 0 ? handleResetAllOnEdit : handleResetAll
            }
          >
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
                  {clientDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="workType">Type Of Work</InputLabel>
                <Select
                  labelId="workType"
                  id="workType"
                  value={workType === 0 ? "" : workType}
                  onChange={(e) => setWorkType(e.target.value)}
                >
                  {worktypeDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
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
                  {projectDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex gap-[20px]">
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  value={status === 0 ? "" : status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="assignedTo">Assigned To</InputLabel>
                <Select
                  labelId="assignedTo"
                  id="assignedTo"
                  value={assignedTo === 0 ? "" : assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  disabled={!isHaveManageAssignee}
                >
                  {assignedToDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="assignedBy">Assigned By</InputLabel>
                <Select
                  labelId="assignedBy"
                  id="assignedBy"
                  value={assignedBy === 0 ? "" : assignedBy}
                  onChange={(e) => setAssignedBy(e.target.value)}
                  disabled={!isHaveManageAssignee}
                >
                  {assignedByDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex gap-[20px]">
              <div
                className={`inline-flex mx-[6px] muiDatepickerCustomizer w-[200px] max-w-[300px]`}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date"
                    value={dueDate === null ? null : dayjs(dueDate)}
                    onChange={(newDate: any) => {
                      setDueDate(newDate.$d);
                    }}
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div
                className={`inline-flex mx-[6px] muiDatepickerCustomizer w-[200px] max-w-[300px]`}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    value={startDate === null ? null : dayjs(startDate)}
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    onChange={(newDate: any) => {
                      setStartDate(newDate.$d);
                    }}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div
                className={`inline-flex mx-[6px] muiDatepickerCustomizer w-[200px] max-w-[300px]`}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    value={endDate === null ? null : dayjs(endDate)}
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    onChange={(newDate: any) => {
                      setEndDate(newDate.$d);
                    }}
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
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="review_Status">Review Status</InputLabel>
                <Select
                  labelId="review_Status"
                  id="review_Status"
                  value={ReviewStatus === 0 ? "" : ReviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                >
                  {revwStatusDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
          {!saveFilter ? (
            <>
              <Button
                variant="contained"
                color="info"
                className={`${anyFieldSelected && "!bg-secondary"}`}
                disabled={!anyFieldSelected}
                onClick={sendFilterToPage}
              >
                Apply Filter
              </Button>

              <Button
                variant="contained"
                color="info"
                className={`${anyFieldSelected && "!bg-secondary"}`}
                onClick={() => setSaveFilter(true)}
                disabled={!anyFieldSelected}
              >
                Save Filter
              </Button>
            </>
          ) : (
            <>
              <FormControl
                variant="standard"
                sx={{ marginRight: 3, minWidth: 400 }}
              >
                <TextField
                  placeholder="Enter Filter Name"
                  fullWidth
                  required
                  variant="standard"
                  value={filterName}
                  onChange={(e) => {
                    setFilterName(e.target.value);
                    setError("");
                  }}
                  error={Boolean(error)}
                  helperText={error}
                />
              </FormControl>
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  saveCurrentFilter();
                }}
                className="!bg-secondary"
              >
                Save & Apply
              </Button>
            </>
          )}

          <Button variant="outlined" color="info" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FilterDialog;
