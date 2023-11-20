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
import { user } from "../Enum/Filtertype";

//filter body for user
import { userLogs_InitialFilter } from "@/utils/reports/getFilters";

//dropdown api
import { getDeptData, getUserData } from "./api/getDropDownData";

//icons
import SearchIcon from "@/assets/icons/SearchIcon";
import { Delete, Edit } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const defaultLoggedValue = 1;
const isLoggedIn = 2;
const isLoggedOut = 3;

const UserLogsFilter = ({
  isFiltering,
  sendFilterToPage,
  onDialogClose,
}: FilterType) => {
  const [userNames, setUserNames] = useState<number[]>([]);
  const [dept, setDept] = useState<string | number>(0);
  const [dateFilter, setDateFilter] = useState<any>("");
  const [filterName, setFilterName] = useState<string>("");
  const [isloggedIn, setIsloggedIn] = useState<number | string>(0);
  const [saveFilter, setSaveFilter] = useState<boolean>(false);
  const [deptDropdown, setDeptDropdown] = useState<any[]>([]);
  const [userDropdown, setUserDropdown] = useState<any[]>([]);
  const [anyFieldSelected, setAnyFieldSelected] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState<any>("");
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [defaultFilter, setDefaultFilter] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [anchorElFilter, setAnchorElFilter] =
    React.useState<HTMLButtonElement | null>(null);

  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleResetAll = () => {
    setUserNames([]);
    setDept(0);
    setIsloggedIn(0);
    setDateFilter("");

    sendFilterToPage({
      ...userLogs_InitialFilter,
      users: [],
      department: null,
      isLoggedInFilter: null,
    });
  };

  const handleClose = () => {
    setFilterName("");
    onDialogClose(false);
    setDefaultFilter(false);
    setUserNames([]);
    setDept(0);
    setIsloggedIn(0);
    setDateFilter("");
  };

  const handleFilterApply = () => {
    sendFilterToPage({
      ...userLogs_InitialFilter,
      users: userNames,
      department: dept === 0 || dept === "" ? null : dept,
      dateFilter: dateFilter === null || dateFilter === "" ? null : dateFilter,
      isLoggedInFilter:
        isloggedIn === defaultLoggedValue
          ? null
          : isloggedIn === isLoggedIn
          ? 1
          : 0,
    });

    onDialogClose(false);
  };

  const handleSavedFilterApply = (index: number) => {
    if (Number.isInteger(index)) {
      if (index !== undefined) {
        sendFilterToPage({
          ...userLogs_InitialFilter,
          users: savedFilters[index].AppliedFilter.users,
          department: savedFilters[index].AppliedFilter.Department,
          isLoggedInFilter: savedFilters[index].AppliedFilter.isLoggedInFilter,
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
            users: userNames.length > 0 ? userNames : [],
            Department: dept === 0 ? null : dept,
            dateFilter:
              dateFilter === null || dateFilter === "" ? null : dateFilter,
            isLoggedInFilter:
              isloggedIn === defaultLoggedValue
                ? null
                : isloggedIn === isLoggedIn
                ? 1
                : 0,
          },
          type: user,
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
      userNames.length > 0 ||
      dept !== 0 ||
      dateFilter !== null ||
      dateFilter !== "" ||
      isloggedIn !== 0;

    setAnyFieldSelected(isAnyFieldSelected);
    setSaveFilter(false);
  }, [dept, userNames, dateFilter, isloggedIn]);

  useEffect(() => {
    // handleFilterApply();
    const userDropdowns = async () => {
      setDeptDropdown(await getDeptData());
      setUserDropdown(await getUserData());
    };
    userDropdowns();
  }, []);

  const getFilterList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/getfilterlist`,
        {
          type: user,
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
    setCurrentFilterId(savedFilters[index].FilterId);
    setFilterName(savedFilters[index].Name);
    setUserNames(savedFilters[index].AppliedFilter.users);
    setDept(savedFilters[index].AppliedFilter.Department);
    setIsloggedIn(savedFilters[index].AppliedFilter.isLoggedInFilter);
    setDefaultFilter(true);
    setSaveFilter(true);
    setDateFilter(
      savedFilters[index].AppliedFilter.dateFilter === null
        ? ""
        : savedFilters[index].AppliedFilter.dateFilter
    );
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

  const handleUserNames = (e: any) => {
    setUserNames(e.target.value);
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
                  sx={{ mx: 0.75, minWidth: 210 }}
                >
                  <InputLabel id="billingType">User Name</InputLabel>
                  <Select
                    multiple
                    labelId="billingType"
                    id="billingType"
                    value={userNames}
                    onChange={handleUserNames}
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
                  sx={{ mx: 0.75, minWidth: 210 }}
                >
                  <InputLabel id="department">Department</InputLabel>
                  <Select
                    labelId="department"
                    id="department"
                    value={dept === 0 ? "" : dept}
                    onChange={(e) => setDept(e.target.value)}
                  >
                    {deptDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
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
                      label="Date"
                      shouldDisableDate={isWeekend}
                      maxDate={dayjs(Date.now())}
                      value={dateFilter === "" ? null : dayjs(dateFilter)}
                      onChange={(newValue: any) => setDateFilter(newValue)}
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
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 210 }}
                >
                  <InputLabel id="isLoggedInFilter">Is LoggedIn</InputLabel>
                  <Select
                    labelId="isLoggedInFilter"
                    id="isLoggedInFilter"
                    value={isloggedIn === 0 ? "" : isloggedIn}
                    onChange={(e) => setIsloggedIn(e.target.value)}
                  >
                    <MenuItem value={1}>All</MenuItem>
                    <MenuItem value={2}>Yes</MenuItem>
                    <MenuItem value={3}>No</MenuItem>
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
                  sx={{ marginRight: 3, minWidth: 370 }}
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

export default UserLogsFilter;
