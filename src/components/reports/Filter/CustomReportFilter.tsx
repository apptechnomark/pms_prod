import axios from "axios";
import dayjs from "dayjs";
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
import { Transition } from "./Transition/Transition";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

// filter type
import { FilterType } from "./types/ReportsFilterType";

// filter type enum
import { client, customReport } from "../Enum/Filtertype";

//filter body for client
import { customreport_InitialFilter } from "@/utils/reports/getFilters";

// dropdown api
import { getUserData } from "./api/getDropDownData";
import {
  getClientDropdownData,
  getProcessDropdownData,
  getProjectDropdownData,
  getTypeOfReturnDropdownData,
} from "@/utils/commonDropdownApiCall";

//icons
import SearchIcon from "@/assets/icons/SearchIcon";
import { Delete, Edit } from "@mui/icons-material";

const getYears = () => {
  const currentYear = new Date().getFullYear();
  const Years = [];

  for (let year = 2010; year <= currentYear; year++) {
    Years.push({ label: String(year), value: year });
  }

  return Years;
};

const getFormattedDate = (newValue: any) => {
  if (newValue !== "") {
    return `${newValue.$y}-${
      (newValue.$M + 1).toString().length > 1
        ? newValue.$M + 1
        : `0${newValue.$M + 1}`
    }-${newValue.$D.toString().length > 1 ? newValue.$D : `0${newValue.$D}`}`;
  }
};

const CustomReportFilter = ({
  isFiltering,
  onDialogClose,
  sendFilterToPage,
}: FilterType) => {
  const [clients, setClients] = useState<any[]>([]);
  const [clientName, setClientName] = useState<any[]>([]);
  const [projectName, setProjectName] = useState<number | string>(0);
  const [processName, setProcessName] = useState<number | string>(0);
  const [assignByName, setAssignByName] = useState<number | string>(0);
  const [assigneeName, setAssigneeName] = useState<number | string>(0);
  const [reviewerName, setReviewerName] = useState<number | string>(0);
  const [returnTypeName, setReturnTypeName] = useState<number | string>(0);
  const [typeofReturnName, setTypeofReturnName] = useState<number | string>(0);
  const [noofPages, setNoofPages] = useState<number | string>("");
  const [returnYear, setReturnYear] = useState<number | string>(0);
  const [currentYear, setCurrentYear] = useState<number | string>(0);
  const [complexity, setComplexity] = useState<number | string>(0);
  const [priority, setPriority] = useState<string | number>(0);
  const [receivedDate, setReceivedDate] = useState<string | number>("");
  const [dueDate, setDueDate] = useState<string | number>("");
  const [allInfoDate, setAllInfoDate] = useState<string | number>("");

  const [filterName, setFilterName] = useState<string>("");
  const [saveFilter, setSaveFilter] = useState<boolean>(false);

  const [clientDropdown, setClientDropdown] = useState<any[]>([]);
  const [projectDropdown, setProjectDropdown] = useState<any[]>([]);
  const [processDropdown, setProcessDropdown] = useState<any[]>([]);
  const [userDropdown, setUserDropdown] = useState<any[]>([]);
  const [returnTypeDropdown, setReturnTypeDropdown] = useState<any[]>([
    {
      label: "Individual Return",
      value: 1,
    },
    {
      label: "Business Return",
      value: 2,
    },
  ]);
  const [typeOfReturnDropdown, setTypeOfReturnDropdown] = useState<any[]>([]);
  const [yearDropdown, setYearDropdown] = useState<any[]>(getYears());
  const [complexityDropdown, setComplexityDropdown] = useState<any[]>([
    {
      label: "Moderate",
      value: 1,
    },
    {
      label: "Intermediate",
      value: 2,
    },
    {
      label: "Complex",
      value: 3,
    },
  ]);
  const [priorityDropdown, setPriorityDropdown] = useState<any[]>([
    {
      label: "High",
      value: 1,
    },
    {
      label: "Medium",
      value: 2,
    },
    {
      label: "Low",
      value: 3,
    },
  ]);

  const [anyFieldSelected, setAnyFieldSelected] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState<any>("");
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

  const handleNoOfPageChange = (e: any) => {
    if (/^\d+$/.test(e.target.value.trim())) {
      setNoofPages(e.target.value);
    } else {
      return;
    }
  };

  const handleResetAll = () => {
    setClientName([]);
    setClients([]);
    setProjectName(0);
    setProcessName(0);
    setAssignByName(0);
    setAssigneeName(0);
    setReviewerName(0);
    setReturnTypeName(0);
    setTypeofReturnName(0);
    setNoofPages("");
    setReturnYear(0);
    setCurrentYear(0);
    setComplexity(0);
    setPriority(0);
    setReceivedDate("");
    setDueDate("");
    setAllInfoDate("");

    sendFilterToPage({
      ...customreport_InitialFilter,
    });
  };

  const handleClose = () => {
    setFilterName("");
    onDialogClose(false);
    setDefaultFilter(false);
    // resetting filter fields
    setClientName([]);
    setClients([]);
    setProjectName(0);
    setProcessName(0);
    setAssignByName(0);
    setAssigneeName(0);
    setReviewerName(0);
    setReturnTypeName(0);
    setTypeofReturnName(0);
    setNoofPages("");
    setReturnYear(0);
    setCurrentYear(0);
    setComplexity(0);
    setPriority(0);
    setReceivedDate("");
    setDueDate("");
    setAllInfoDate("");
  };

  const handleFilterApply = () => {
    sendFilterToPage({
      ...customreport_InitialFilter,
      clientIdsJSON: clientName.length > 0 ? clientName : [],
      projectIdsJSON:
        projectName === 0 || projectName === "" ? [] : [projectName],
      processIdsJSON:
        processName === 0 || processName === "" ? [] : [processName],
      assignedById:
        assignByName === 0 || assignByName === "" ? null : assignByName,
      assigneeId:
        assigneeName === 0 || assigneeName === "" ? null : assigneeName,
      reviewerId:
        reviewerName === 0 || reviewerName === "" ? null : reviewerName,
      returnTypeId:
        returnTypeName === 0 || returnTypeName === "" ? null : returnTypeName,
      typeOfReturnId:
        typeofReturnName === 0 || typeofReturnName === ""
          ? null
          : typeofReturnName,
      numberOfPages: noofPages.toString().trim().length <= 0 ? null : noofPages,
      returnYear: returnYear === 0 || returnYear === "" ? null : returnYear,
      currentYear: currentYear === 0 || currentYear === "" ? null : currentYear,
      complexity: complexity === 0 || complexity === "" ? null : complexity,
      priority: priority === 0 || priority === "" ? null : priority,
      receivedDate:
        receivedDate.toString().trim().length <= 0
          ? null
          : getFormattedDate(receivedDate),
      dueDate:
        dueDate.toString().trim().length <= 0
          ? null
          : getFormattedDate(dueDate),
      allInfoDate:
        allInfoDate.toString().trim().length <= 0
          ? null
          : getFormattedDate(allInfoDate),
    });

    onDialogClose(false);
  };

  const handleSavedFilterApply = (index: number) => {
    if (Number.isInteger(index)) {
      if (index !== undefined) {
        sendFilterToPage({
          ...customreport_InitialFilter,
          clientIdsJSON: savedFilters[index].AppliedFilter.clientIdsJSON,
          projectIdsJSON: savedFilters[index].AppliedFilter.projectIdsJSON,
          processIdsJSON: savedFilters[index].AppliedFilter.processIdsJSON,
          assignedById: savedFilters[index].AppliedFilter.assignedById,
          assigneeId: savedFilters[index].AppliedFilter.assigneeId,
          reviewerId: savedFilters[index].AppliedFilter.reviewerId,
          returnTypeId: savedFilters[index].AppliedFilter.returnTypeId,
          typeOfReturnId: savedFilters[index].AppliedFilter.typeOfReturnId,
          numberOfPages: savedFilters[index].AppliedFilter.numberOfPages,
          returnYear: savedFilters[index].AppliedFilter.returnYear,
          currentYear: savedFilters[index].AppliedFilter.currentYear,
          complexity: savedFilters[index].AppliedFilter.complexity,
          priority: savedFilters[index].AppliedFilter.priority,
          receivedDate: savedFilters[index].AppliedFilter.receivedDate,
          dueDate: savedFilters[index].AppliedFilter.dueDate,
          allInfoDate: savedFilters[index].AppliedFilter.allInfoDate,
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
          filterId: currentFilterId !== "" ? currentFilterId : null,
          name: filterName,
          AppliedFilter: {
            clientIdsJSON: clientName.length > 0 ? clientName : [],
            projectIdsJSON:
              projectName === 0 || projectName === "" ? [] : [projectName],
            processIdsJSON:
              processName === 0 || processName === "" ? [] : [processName],
            assignedById:
              assignByName === 0 || assignByName === "" ? null : assignByName,
            assigneeId:
              assigneeName === 0 || assigneeName === "" ? null : assigneeName,
            reviewerId:
              reviewerName === 0 || reviewerName === "" ? null : reviewerName,
            returnTypeId:
              returnTypeName === 0 || returnTypeName === ""
                ? null
                : returnTypeName,
            typeOfReturnId:
              typeofReturnName === 0 || typeofReturnName === ""
                ? null
                : typeofReturnName,
            numberOfPages:
              noofPages.toString().trim().length <= 0 ? null : noofPages,
            returnYear:
              returnYear === 0 || returnYear === "" ? null : returnYear,
            currentYear:
              currentYear === 0 || currentYear === "" ? null : currentYear,
            complexity:
              complexity === 0 || complexity === "" ? null : complexity,
            priority: priority === 0 || priority === "" ? null : priority,
            receivedDate:
              receivedDate.toString().trim().length <= 0
                ? null
                : getFormattedDate(receivedDate),
            dueDate:
              dueDate.toString().trim().length <= 0
                ? null
                : getFormattedDate(dueDate),
            allInfoDate:
              allInfoDate.toString().trim().length <= 0
                ? null
                : getFormattedDate(allInfoDate),
          },
          type: customReport,
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
      clientName.length > 0 ||
      projectName !== 0 ||
      processName !== 0 ||
      assignByName !== 0 ||
      assigneeName !== 0 ||
      reviewerName !== 0 ||
      returnTypeName !== 0 ||
      typeofReturnName !== 0 ||
      noofPages.toString().trim().length > 0 ||
      returnYear !== 0 ||
      currentYear !== 0 ||
      complexity !== 0 ||
      priority !== 0 ||
      receivedDate.toString().trim().length > 0 ||
      dueDate.toString().trim().length > 0 ||
      allInfoDate.toString().trim().length > 0;

    setAnyFieldSelected(isAnyFieldSelected);
    setSaveFilter(false);
  }, [
    clientName,
    projectName,
    processName,
    assignByName,
    assigneeName,
    reviewerName,
    returnTypeName,
    typeofReturnName,
    noofPages,
    returnYear,
    currentYear,
    complexity,
    priority,
    receivedDate,
    dueDate,
    allInfoDate,
  ]);

  useEffect(() => {
    // handleFilterApply();
    const customDropdowns = async () => {
      setClientDropdown(await getClientDropdownData());
      setProjectDropdown(
        await getProjectDropdownData(clientName.length > 0 ? clientName[0] : 0)
      );
      setProcessDropdown(
        await getProcessDropdownData(clientName.length > 0 ? clientName[0] : 0)
      );
      setUserDropdown(await getUserData());
      setTypeOfReturnDropdown(await getTypeOfReturnDropdownData());
    };
    customDropdowns();

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
          type: client,
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

    setClientName(savedFilters[index].AppliedFilter.clientIdsJSON);
    setProjectName(savedFilters[index].AppliedFilter.projectIdsJSON);
    setProcessName(savedFilters[index].AppliedFilter.processIdsJSON);
    setAssignByName(savedFilters[index].AppliedFilter.assignedById);
    setAssigneeName(savedFilters[index].AppliedFilter.assigneeId);
    setReviewerName(savedFilters[index].AppliedFilter.reviewerId);
    setReturnTypeName(savedFilters[index].AppliedFilter.returnTypeId);
    setTypeofReturnName(savedFilters[index].AppliedFilter.typeOfReturnId);
    setNoofPages(savedFilters[index].AppliedFilter.numberOfPages);
    setReturnYear(savedFilters[index].AppliedFilter.returnYear);
    setCurrentYear(savedFilters[index].AppliedFilter.currentYear);
    setComplexity(savedFilters[index].AppliedFilter.complexity);
    setPriority(savedFilters[index].AppliedFilter.priority);
    setReceivedDate(savedFilters[index].AppliedFilter.receivedDate);
    setDueDate(savedFilters[index].AppliedFilter.dueDate);
    setAllInfoDate(savedFilters[index].AppliedFilter.allInfoDate);
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
          setCurrentFilterId("");
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

  const isWeekend = (date: any) => {
    const day = date.day();
    return day === 6 || day === 0;
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
                  sx={{ mx: 0.75, my: 0.5, minWidth: 200 }}
                >
                  {/* <InputLabel id="clientName">Client Name</InputLabel>
                  <Select
                    labelId="clientName"
                    id="clientName"
                    value={clientName === 0 ? "" : clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  >
                    {clientDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={clientDropdown}
                    getOptionLabel={(option: any) => option.label}
                    onChange={(e: any, data: any) => {
                      setClients(data);
                      setClientName(data.map((d: any) => d.value));
                      setProjectName(0);
                      setProcessName(0);
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
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="projectName">Project Name</InputLabel>
                  <Select
                    labelId="projectName"
                    id="projectName"
                    value={projectName === 0 ? "" : projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={clients.length > 1}
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
                  <InputLabel id="processName">Process Name</InputLabel>
                  <Select
                    labelId="processName"
                    id="processName"
                    value={processName === 0 ? "" : processName}
                    onChange={(e) => setProcessName(e.target.value)}
                    disabled={clients.length > 1}
                  >
                    {processDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.Id} key={index}>
                        {i.Name}
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
                  <InputLabel id="assignBy">Assign By</InputLabel>
                  <Select
                    labelId="assignBy"
                    id="assignBy"
                    value={assignByName === 0 ? "" : assignByName}
                    onChange={(e) => setAssignByName(e.target.value)}
                  >
                    {userDropdown.map((i: any, index: number) => (
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
                  <InputLabel id="assigneeName">Prepared/Assignee</InputLabel>
                  <Select
                    labelId="assigneeName"
                    id="assigneeName"
                    value={assigneeName === 0 ? "" : assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                  >
                    {userDropdown.map((i: any, index: number) => (
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
                  <InputLabel id="reviewer">Reviewer</InputLabel>
                  <Select
                    labelId="reviewer"
                    id="reviewer"
                    value={reviewerName === 0 ? "" : reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                  >
                    {userDropdown.map((i: any, index: number) => (
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
                  <InputLabel id="returnType">Return Type</InputLabel>
                  <Select
                    labelId="returnType"
                    id="returnType"
                    value={returnTypeName === 0 ? "" : returnTypeName}
                    onChange={(e) => setReturnTypeName(e.target.value)}
                  >
                    {returnTypeDropdown.map((i: any, index: number) => (
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
                  <InputLabel id="typeOfReturn">Type of Return</InputLabel>
                  <Select
                    labelId="typeOfReturn"
                    id="typeOfReturn"
                    value={typeofReturnName === 0 ? "" : typeofReturnName}
                    onChange={(e) => setTypeofReturnName(e.target.value)}
                  >
                    {typeOfReturnDropdown.map((i: any, index: number) => (
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
                  <TextField
                    id="noOfPages"
                    label="Number of Pages"
                    variant="standard"
                    value={noofPages}
                    onChange={handleNoOfPageChange}
                  />
                </FormControl>
              </div>
              <div className="flex gap-[20px]">
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="returnYear">Return Year</InputLabel>
                  <Select
                    labelId="returnYear"
                    id="returnYear"
                    value={returnYear === 0 ? "" : returnYear}
                    onChange={(e) => setReturnYear(e.target.value)}
                  >
                    {yearDropdown.map((i: any, index: number) => (
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
                  <InputLabel id="=currentYear">Current Year</InputLabel>
                  <Select
                    labelId="=currentYear"
                    id="=currentYear"
                    value={currentYear === 0 ? "" : currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                  >
                    {yearDropdown.map((i: any, index: number) => (
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
                  <InputLabel id="complexity">Complexity</InputLabel>
                  <Select
                    labelId="complexity"
                    id="complexity"
                    value={complexity === 0 ? "" : complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                  >
                    {complexityDropdown.map((i: any, index: number) => (
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
                  <InputLabel id="priority">Priority</InputLabel>
                  <Select
                    labelId="priority"
                    id="priority"
                    value={priority === 0 ? "" : priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {priorityDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div
                  className={`inline-flex mx-[6px] muiDatepickerCustomizer w-full max-w-[200px]`}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Received Date"
                      value={receivedDate === "" ? null : dayjs(receivedDate)}
                      shouldDisableDate={isWeekend}
                      maxDate={dayjs(Date.now()) || dayjs(dueDate)}
                      onChange={(newValue: any) => setReceivedDate(newValue)}
                      slotProps={{
                        textField: {
                          readOnly: true,
                        } as Record<string, any>,
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div
                  className={`inline-flex mx-[6px] muiDatepickerCustomizer w-full max-w-[200px]`}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
                      value={dueDate === "" ? null : dayjs(dueDate)}
                      shouldDisableDate={isWeekend}
                      minDate={dayjs(receivedDate)}
                      maxDate={dayjs(Date.now())}
                      onChange={(newValue: any) => setDueDate(newValue)}
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
                <div
                  className={`inline-flex mx-[6px] muiDatepickerCustomizer w-full max-w-[200px]`}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="All Info Date"
                      value={allInfoDate === "" ? null : dayjs(allInfoDate)}
                      onChange={(newValue: any) => setAllInfoDate(newValue)}
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

export default CustomReportFilter;
