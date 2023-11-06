import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
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
import { Transition } from "./Transition/Transition";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";

// filter type
import { FilterType } from "./types/ReportsFilterType";

// filter type enum
import { project } from "../Enum/Filtertype";

//filter body for project
import { client_project_InitialFilter } from "@/utils/reports/getFilters";

// dropdown api
import {
  getBillingTypeData,
  getClientData,
  getDeptData,
  getProjectData,
  getWorkTypeData,
} from "./api/getDropDownData";

//icons
import SearchIcon from "@/assets/icons/SearchIcon";
import { Edit, Delete } from "@mui/icons-material";

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

  const [clientName, setClientName] = useState<number | string>(0);
  const [projectName, setProjectName] = useState<number | string>(0);
  const [filterName, setFilterName] = useState<string>("");
  const [saveFilter, setSaveFilter] = useState<boolean>(false);

  const [workTypeDropdown, setWorkTypeDropdown] = useState<any[]>([]);
  const [billingTypeDropdown, setBillingTypeDropdown] = useState<any[]>([]);
  const [clientDropdown, setClientDropdown] = useState<any[]>([]);
  const [projectDropdown, setProjectDropdown] = useState<any[]>([]);
  const [anyFieldSelected, setAnyFieldSelected] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState<any>();
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [defaultFilter, setDefaultFilter] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);

  const [anchorElFilter, setAnchorElFilter] =
    React.useState<HTMLButtonElement | null>(null);

  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleResetAll = () => {
    setClientName(0);
    setProjectName(0);
    setTypeOfWork(0);
    setBillingType(0);
    setResetting(true);

    sendFilterToPage({
      ...project_InitialFilter,
      clients: [],
      projects: [],
      typeOfWork: null,
      billType: null,
    });
  };

  const handleClose = () => {
    setResetting(false);
    setFilterName("");
    onDialogClose(false);
    setDefaultFilter(false);
    setClientName(0);
    setProjectName(0);
    setTypeOfWork(0);
    setBillingType(0);
  };

  const handleFilterApply = () => {
    sendFilterToPage({
      ...project_InitialFilter,
      clients: clientName === 0 || clientName === "" ? [] : [clientName],
      projects: projectName === 0 || projectName === "" ? [] : [projectName],
      typeOfWork: typeOfWork === 0 || typeOfWork === "" ? null : typeOfWork,
      billType: billingType === 0 || billingType === "" ? null : billingType,
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
        });
      }
    }

    onDialogClose(false);
  };

  const handleSaveFilter = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/savefilter`,
        {
          filterId: currentFilterId ? currentFilterId : null,
          name: filterName,
          AppliedFilter: {
            clients: clientName === 0 ? [] : [clientName],
            projects: projectName === 0 ? [] : [projectName],
            TypeOfWork: typeOfWork === 0 ? null : typeOfWork,
            BillingType: billingType === 0 ? null : billingType,
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
          getFilterList();
          setSaveFilter(false);
          onDialogClose(false);
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

  useEffect(() => {
    getFilterList();
  }, []);

  useEffect(() => {
    const isAnyFieldSelected =
      clientName !== 0 ||
      projectName !== 0 ||
      typeOfWork !== 0 ||
      billingType !== 0;

    setAnyFieldSelected(isAnyFieldSelected);
    setSaveFilter(false);
    setResetting(false);
  }, [typeOfWork, billingType, clientName, projectName]);

  useEffect(() => {
    // handleFilterApply();
    const filterDropdowns = async () => {
      setClientDropdown(await getClientData());
      setProjectDropdown(await getProjectData(clientName));
      setWorkTypeDropdown(await getWorkTypeData(clientName));
      setBillingTypeDropdown(await getBillingTypeData());
    };
    filterDropdowns();

    if (parseInt(clientName.toString()) > 0 || resetting) {
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

    setClientName(savedFilters[index].AppliedFilter.clients[0]);
    setProjectName(savedFilters[index].AppliedFilter.projects[0]);
    setTypeOfWork(savedFilters[index].AppliedFilter.TypeOfWork);
    setBillingType(savedFilters[index].AppliedFilter.BillingType);
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
          getFilterList();
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
          <div className="flex flex-col py-2 w-[200px] ">
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
                className="border-b border-b-slatyGrey"
                placeholder="Search saved filters"
                inputProps={{ "aria-label": "search" }}
                value={searchValue}
                onChange={handleSearchChange}
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
                    key={index}
                    className="group px-2 cursor-pointer bg-whiteSmoke hover:bg-lightSilver flex justify-between items-center h-9"
                  >
                    <span
                      className="pl-1"
                      onClick={() => {
                        setCurrentFilterId(i.FilterId);
                        onDialogClose(false);
                        handleSavedFilterApply(index);
                        // setFilterApplied(true);
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
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="client_Name">Client Name</InputLabel>
                  <Select
                    // multiple
                    labelId="client_Name"
                    id="client_Name"
                    value={clientName === 0 ? "" : clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  >
                    {clientDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="project_Name">Project Name</InputLabel>
                  <Select
                    labelId="project_Name"
                    id="project_Name"
                    value={projectName === 0 ? "" : projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  >
                    {projectDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="typeOfWork">Type Of Work</InputLabel>
                  <Select
                    labelId="typeOfWork"
                    id="typeOfWork"
                    value={typeOfWork === 0 ? "" : typeOfWork}
                    onChange={(e) => setTypeOfWork(e.target.value)}
                  >
                    {workTypeDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-[20px]">
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="billingType">Billing Type</InputLabel>
                  <Select
                    labelId="billingType"
                    id="billingType"
                    value={billingType === 0 ? "" : billingType}
                    onChange={(e) => setBillingType(e.target.value)}
                  >
                    {billingTypeDropdown.map((i: any, index: number) => (
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
                  sx={{ marginRight: 3, minWidth: 400 }}
                >
                  <TextField
                    placeholder="Enter Filter Name"
                    fullWidth
                    required
                    variant="standard"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleSaveFilter}
                  className={`${
                    filterName.length === 0 ? "" : "!bg-secondary"
                  }`}
                  disabled={filterName.length === 0}
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
