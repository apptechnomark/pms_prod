import React, { useEffect, useState } from "react";
// material imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

interface FilterModalProps {
  onOpen: boolean;
  onClose: () => void;
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
  // ProjectId: null,
  // DueDate: null,
  // StartDate: null,
  // EndDate: null,
  // Priority: null,
};

const UnassigneeFilterDialog: React.FC<FilterModalProps> = ({
  onOpen,
  onClose,
  currentFilterData,
}) => {
  // Dropdown Data
  const [clientDropdownData, setClientDropdownData] = useState([]);
  // const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [typeOfWorkDropdownData, setTypeOfWorkDropdownData] = useState([]);

  const [clientName, setClientName] = useState<any>(0);
  // const [project, setProject] = useState<any>(0);
  const [typeOfWork, setTypeOfWork] = useState<any>(0);
  // const [dueDate, setDueDate] = useState<null | string>(null);
  // const [startDate, setStartDate] = useState<null | string>(null);
  // const [endDate, setEndDate] = useState<null | string>(null);
  // const [priority, setPriority] = useState<any>(0);
  const [anyFieldSelected, setAnyFieldSelected] = useState(false);
  const [currSelectedFields, setCurrSelectedFileds] = useState<any | any[]>([]);

  const handleClose = () => {
    handleResetAll();
    onClose();
  };

  const handleResetAll = () => {
    setClientName(0);
    // setProject(0);
    setTypeOfWork(0);
    // setDueDate(null);
    // setStartDate(null);
    // setEndDate(null);
    // setPriority(0);
    currentFilterData(initialFilter);
  };

  // Check if any field is selected
  useEffect(() => {
    const isAnyFieldSelected =
      clientName !== 0 ||
      // project !== 0 ||
      typeOfWork !== 0 
      // ||
      // dueDate !== null ||
      // startDate !== null ||
      // endDate !== null ||
      // priority !== 0;

    setAnyFieldSelected(isAnyFieldSelected);
  }, [clientName, typeOfWork,
    //  project, dueDate, startDate, endDate, priority
    ]);

  useEffect(() => {
    const selectedFields = {
      ClientId: clientName || null,
      // ProjectId: project === 0 ? null : project,
      TypeOfWork: typeOfWork || null,
      // DueDate:
      //   dueDate !== null
      //     ? new Date(
      //         new Date(dueDate).getTime() + 24 * 60 * 60 * 1000
      //       ).toISOString()
      //     : null,
      // StartDate:
      //   startDate !== null
      //     ? new Date(
      //         new Date(startDate).getTime() + 24 * 60 * 60 * 1000
      //       ).toISOString()
      //     : null,
      // EndDate:
      //   endDate !== null
      //     ? new Date(
      //         new Date(endDate).getTime() + 24 * 60 * 60 * 1000
      //       ).toISOString()
      //     : null,
      // Priority: priority === 0 ? null : priority,
    };
    setCurrSelectedFileds(selectedFields);
  }, [clientName, typeOfWork, 
    // project, dueDate, startDate, endDate, priority
  ]);

  const sendFilterToPage = () => {
    currentFilterData(currSelectedFields);
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
          setTypeOfWorkDropdownData(response.data.ResponseData);
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

  // const getProjectData = async (clientName: string | number) => {
  //   const token = await localStorage.getItem("token");
  //   const Org_Token = await localStorage.getItem("Org_Token");
  //   try {
  //     const response = await axios.post(
  //       `${process.env.pms_api_url}/project/getdropdown`,
  //       {
  //         clientId: clientName ? clientName : 0,
  //       },
  //       {
  //         headers: {
  //           Authorization: `bearer ${token}`,
  //           org_token: `${Org_Token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       if (response.data.ResponseStatus === "Success") {
  //         setProjectDropdownData(response.data.ResponseData.List);
  //       } else {
  //         const data = response.data.Message;
  //         if (data === null) {
  //           toast.error("Please try again later.");
  //         } else {
  //           toast.error(data);
  //         }
  //       }
  //     } else {
  //       const data = response.data.Message;
  //       if (data === null) {
  //         toast.error("Please try again.");
  //       } else {
  //         toast.error(data);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    if (onOpen === true) {
      getClientData();
    }
  }, [onOpen]);

  useEffect(() => {
    getWorkTypeData(clientName);
    // getProjectData(clientName);
  }, [clientName]);

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
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="client_Name">Client Name</InputLabel>
                <Select
                  labelId="client_Name"
                  id="client_Name"
                  value={clientName === 0 ? "" : clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    // setProject(0);
                  }}
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
                  value={typeOfWork === 0 ? "" : typeOfWork}
                  onChange={(e) => setTypeOfWork(e.target.value)}
                >
                  {typeOfWorkDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="project_Name">Project Name</InputLabel>
                <Select
                  labelId="project_Name"
                  id="project_Name"
                  value={project === 0 ? "" : project}
                  onChange={(e) => setProject(e.target.value)}
                >
                  {projectDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            </div>

            {/* <div className="flex gap-[20px]">
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Priority
                  <span className="text-defaultRed">&nbsp;*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={priority === 0 ? "" : priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value={1}>High</MenuItem>
                  <MenuItem value={2}>Medium</MenuItem>
                  <MenuItem value={3}>Low</MenuItem>
                </Select>
              </FormControl>
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
            </div> */}

            {/* <div className="flex gap-[20px]">
              <div
                className={`inline-flex mx-[6px] muiDatepickerCustomizer w-[200px] max-w-[300px]`}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date"
                    value={dueDate === null ? null : dayjs(dueDate)}
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    onChange={(newDate: any) => {
                      setDueDate(newDate.$d);
                    }}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div> */}
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

export default UnassigneeFilterDialog;
