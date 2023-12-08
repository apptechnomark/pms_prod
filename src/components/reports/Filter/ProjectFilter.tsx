import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { DialogTransition } from "@/utils/style/DialogTransition";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";
import { FilterType } from "../types/ReportsFilterType";
import { project } from "../Enum/Filtertype";
import { client_project_InitialFilter } from "@/utils/reports/getFilters";
import {
  getBillingTypeData,
  getClientData,
  getProjectData,
  getWorkTypeData,
} from "./api/getDropDownData";
import SearchIcon from "@/assets/icons/SearchIcon";
import { Edit, Delete } from "@mui/icons-material";
import { getFormattedDate } from "@/utils/timerFunctions";
import { isWeekend } from "@/utils/commonFunction";

const project_InitialFilter = {
  ...client_project_InitialFilter,
  isClientReport: false,
};

const ProjectFilter = ({
  isFiltering,
  sendFilterToPage,
  onDialogClose,
}: FilterType) => {
  const [typeOfWork, setTypeOfWork] = useState<string | number>(0);
  const [billingType, setBillingType] = useState<string | number>(0);

  const [clients, setClients] = useState<any[]>([]);
  const [clientName, setClientName] = useState<any[]>([]);
  const [projectName, setProjectName] = useState<number | string>(0);
  const [filterName, setFilterName] = useState<string>("");
  const [saveFilter, setSaveFilter] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string | number>("");
  const [endDate, setEndDate] = useState<string | number>("");

  const [workTypeDropdown, setWorkTypeDropdown] = useState<any[]>([]);
  const [billingTypeDropdown, setBillingTypeDropdown] = useState<any[]>([]);
  const [clientDropdown, setClientDropdown] = useState<any[]>([]);
  const [projectDropdown, setProjectDropdown] = useState<any[]>([]);
  const [anyFieldSelected, setAnyFieldSelected] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState<any>("");
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [defaultFilter, setDefaultFilter] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [error, setError] = useState("");

  const anchorElFilter: HTMLButtonElement | null = null;
  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const handleResetAll = () => {
    setClientName([]);
    setClients([]);
    setProjectName(0);
    setTypeOfWork(0);
    setBillingType(0);
    setResetting(true);
    setStartDate("");
    setEndDate("");
    setError("");

    sendFilterToPage({
      ...project_InitialFilter,
    });
  };

  const handleClose = () => {
    setResetting(false);
    setFilterName("");
    onDialogClose(false);
    setDefaultFilter(false);
    setClientName([]);
    setClients([]);
    setProjectName(0);
    setTypeOfWork(0);
    setBillingType(0);
    setStartDate("");
    setEndDate("");
    setError("");
  };

  const handleFilterApply = () => {
    sendFilterToPage({
      ...project_InitialFilter,
      clients: clientName.length > 0 ? clientName : [],
      projects: projectName === 0 || projectName === "" ? [] : [projectName],
      typeOfWork: typeOfWork === 0 || typeOfWork === "" ? null : typeOfWork,
      billType: billingType === 0 || billingType === "" ? null : billingType,
      startDate:
        startDate.toString().trim().length <= 0
          ? endDate.toString().trim().length <= 0
            ? null
            : getFormattedDate(endDate)
          : getFormattedDate(startDate),
      endDate:
        endDate.toString().trim().length <= 0
          ? startDate.toString().trim().length <= 0
            ? null
            : getFormattedDate(startDate)
          : getFormattedDate(endDate),
    });

    onDialogClose(false);
  };

  const handleSavedFilterApply = (index: number) => {
    if (Number.isInteger(index)) {
      if (index !== undefined) {
        sendFilterToPage({
          ...project_InitialFilter,
          clients: savedFilters[index].AppliedFilter.clients,
          projects: savedFilters[index].AppliedFilter.projects,
          typeOfWork: savedFilters[index].AppliedFilter.TypeOfWork,
          billType: savedFilters[index].AppliedFilter.BillingType,
          startDate: savedFilters[index].AppliedFilter.startDate,
          endDate: savedFilters[index].AppliedFilter.endDate,
        });
      }
    }

    onDialogClose(false);
  };

  const handleSaveFilter = async () => {
    if (filterName.trim().length === 0) {
      setError("This is required field!");
    } else if (filterName.trim().length > 15) {
      setError("Max 15 characters allowed!");
    } else {
      setError("");

      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/filter/savefilter`,
          {
            filterId: currentFilterId !== "" ? currentFilterId : null,
            name: filterName,
            AppliedFilter: {
              clients: clientName.length > 0 ? clientName : [],
              projects: projectName === 0 ? [] : [projectName],
              TypeOfWork: typeOfWork === 0 ? null : typeOfWork,
              BillingType: billingType === 0 ? null : billingType,
              startDate:
                startDate.toString().trim().length <= 0
                  ? endDate.toString().trim().length <= 0
                    ? null
                    : getFormattedDate(endDate)
                  : getFormattedDate(startDate),
              endDate:
                endDate.toString().trim().length <= 0
                  ? startDate.toString().trim().length <= 0
                    ? null
                    : getFormattedDate(startDate)
                  : getFormattedDate(endDate),
            },
            type: project,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus.toLowerCase() === "success") {
            toast.success("Filter has been successully saved.");
            handleClose();
            getFilterList();
            handleFilterApply();
            setSaveFilter(false);
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
    }
  };

  useEffect(() => {
    getFilterList();
  }, []);

  useEffect(() => {
    const isAnyFieldSelected =
      clientName.length > 0 ||
      projectName !== 0 ||
      typeOfWork !== 0 ||
      billingType !== 0 ||
      startDate.toString().trim().length > 0 ||
      endDate.toString().trim().length > 0;

    setAnyFieldSelected(isAnyFieldSelected);
    setSaveFilter(false);
    setResetting(false);
  }, [typeOfWork, billingType, clientName, projectName, startDate, endDate]);

  useEffect(() => {
    const filterDropdowns = async () => {
      setClientDropdown(await getClientData());
      setProjectDropdown(
        await getProjectData(clientName.length > 0 ? clientName[0] : 0)
      );
      setWorkTypeDropdown(
        await getWorkTypeData(clientName.length > 0 ? clientName[0] : 0)
      );
      setBillingTypeDropdown(await getBillingTypeData());
    };
    filterDropdowns();

    if (clientName.length > 0 || resetting) {
      onDialogClose(true);
    }
  }, [clientName]);

  const getFilterList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/getfilterlist`,
        {
          type: project,
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
          setSavedFilters(response.data.ResponseData);
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

  const handleSavedFilterEdit = (index: number) => {
    setSaveFilter(true);
    setDefaultFilter(true);
    setFilterName(savedFilters[index].Name);
    setCurrentFilterId(savedFilters[index].FilterId);

    setClients(
      savedFilters[index].AppliedFilter.clients.length > 0
        ? clientDropdown.filter((client: any) =>
            savedFilters[index].AppliedFilter.clients.includes(client.value)
          )
        : []
    );
    setClientName(savedFilters[index].AppliedFilter.clients);
    setProjectName(
      savedFilters[index].AppliedFilter.projects.length > 0
        ? savedFilters[index].AppliedFilter.projects[0]
        : 0
    );
    setTypeOfWork(
      savedFilters[index].AppliedFilter.TypeOfWork === null
        ? 0
        : savedFilters[index].AppliedFilter.TypeOfWork
    );
    setBillingType(savedFilters[index].AppliedFilter.BillingType ?? 0);
    setStartDate(savedFilters[index].AppliedFilter.startDate ?? "");
    setEndDate(savedFilters[index].AppliedFilter.endDate ?? "");
  };

  const handleSavedFilterDelete = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/delete`,
        {
          filterId: currentFilterId,
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
          toast.success("Filter has been deleted successfully.");
          handleClose();
          getFilterList();
          setCurrentFilterId("");
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

  return (
    <>
      {savedFilters.length > 0 && !defaultFilter ? (
        <Popover
          id={idFilter}
          open={isFiltering}
          anchorEl={anchorElFilter}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 130,
            horizontal: 1290,
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className="flex flex-col py-2 w-[250px] ">
            <span
              className="p-2 cursor-pointer hover:bg-lightGray"
              onClick={() => {
                setDefaultFilter(true);
                setCurrentFilterId(0);
              }}
            >
              Default Filter
            </span>
            <hr className="text-lightSilver mt-2" />

            <span className="py-3 px-2 relative">
              <InputBase
                className="pr-7 border-b border-b-slatyGrey w-full"
                placeholder="Search saved filters"
                inputProps={{ "aria-label": "search" }}
                value={searchValue}
                onChange={(e: any) => setSearchValue(e.target.value)}
                sx={{ fontSize: 14 }}
              />
              <span className="absolute top-4 right-3 text-slatyGrey">
                <SearchIcon />
              </span>
            </span>
            {savedFilters.map((i: any, index: number) => {
              return (
                <>
                  <div
                    key={i.FilterId}
                    className="group px-2 cursor-pointer bg-whiteSmoke hover:bg-lightSilver flex justify-between items-center h-9"
                  >
                    <span
                      className="pl-1"
                      onClick={() => {
                        setCurrentFilterId(i.FilterId);
                        onDialogClose(false);
                        handleSavedFilterApply(index);
                      }}
                    >
                      {i.Name}
                    </span>
                    <span className="flex gap-[10px] pr-[10px]">
                      <span onClick={() => handleSavedFilterEdit(index)}>
                        <Tooltip title="Edit" placement="top" arrow>
                          <Edit className="hidden group-hover:inline-block w-5 h-5 ml-2 text-slatyGrey fill-current" />
                        </Tooltip>
                      </span>
                      <span
                        onClick={() => {
                          setIsDeleting(true);
                          setCurrentFilterId(i.FilterId);
                        }}
                      >
                        <Tooltip title="Delete" placement="top" arrow>
                          <Delete className="hidden group-hover:inline-block w-5 h-5 ml-2 text-slatyGrey fill-current" />
                        </Tooltip>
                      </span>
                    </span>
                  </div>
                </>
              );
            })}
            <hr className="text-lightSilver mt-2" />
            <Button onClick={handleResetAll} className="mt-2" color="error">
              clear all
            </Button>
          </div>
        </Popover>
      ) : (
        <Dialog
          open={isFiltering}
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
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, my: 0.4, minWidth: 210 }}
                >
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={clientDropdown.filter(
                      (option) =>
                        !clients.find((client) => client.value === option.value)
                    )}
                    getOptionLabel={(option: any) => option.label}
                    // disableCloseOnSelect
                    onChange={(e: any, data: any) => {
                      setClients(data);
                      setClientName(data.map((d: any) => d.value));
                      setProjectName(0);
                    }}
                    value={clients}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Client Name"
                      />
                    )}
                  />
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 210 }}
                >
                  <InputLabel id="project_Name">Project Name</InputLabel>
                  <Select
                    labelId="project_Name"
                    id="project_Name"
                    value={projectName === 0 ? "" : projectName}
                    disabled={clientName.length > 1}
                    onChange={(e) => setProjectName(e.target.value)}
                  >
                    {projectDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={i.value}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 210 }}
                >
                  <InputLabel id="typeOfWork">Type Of Work</InputLabel>
                  <Select
                    labelId="typeOfWork"
                    id="typeOfWork"
                    value={typeOfWork === 0 ? "" : typeOfWork}
                    onChange={(e) => setTypeOfWork(e.target.value)}
                  >
                    {workTypeDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={i.value}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-[20px]">
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 210 }}
                >
                  <InputLabel id="billingType">Billing Type</InputLabel>
                  <Select
                    labelId="billingType"
                    id="billingType"
                    value={billingType === 0 ? "" : billingType}
                    onChange={(e) => setBillingType(e.target.value)}
                  >
                    {billingTypeDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={i.value}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div
                  className={`inline-flex mx-[6px] muiDatepickerCustomizer w-full max-w-[210px]`}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      shouldDisableDate={isWeekend}
                      maxDate={dayjs(Date.now()) || dayjs(endDate)}
                      value={startDate === "" ? null : dayjs(startDate)}
                      onChange={(newValue: any) => setStartDate(newValue)}
                      slotProps={{
                        textField: {
                          readOnly: true,
                        } as Record<string, any>,
                      }}
                    />
                  </LocalizationProvider>
                </div>

                <div
                  className={`inline-flex mx-[6px] muiDatepickerCustomizer w-full max-w-[210px]`}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      shouldDisableDate={isWeekend}
                      minDate={dayjs(startDate)}
                      maxDate={dayjs(Date.now())}
                      value={endDate === "" ? null : dayjs(endDate)}
                      onChange={(newValue: any) => setEndDate(newValue)}
                      slotProps={{
                        textField: {
                          readOnly: true,
                        } as Record<string, any>,
                      }}
                    />
                  </LocalizationProvider>
                </div>
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
                  onClick={handleFilterApply}
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
                  sx={{ marginRight: 3, minWidth: 420 }}
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
                    error={error.length > 0 ? true : false}
                    helperText={error}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleSaveFilter}
                  className={`${
                    filterName.trim().length === 0 ? "" : "!bg-secondary"
                  }`}
                  disabled={filterName.trim().length === 0}
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
      )}

      <DeleteDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onActionClick={handleSavedFilterDelete}
        Title={"Delete Filter"}
        firstContent={"Are you sure you want to delete this saved filter?"}
        secondContent={
          "If you delete this, you will permanently loose this saved filter and selected fields."
        }
      />
    </>
  );
};

export default ProjectFilter;
