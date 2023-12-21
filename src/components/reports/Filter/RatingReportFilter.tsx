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

//custom component
import DeleteDialog from "@/components/common/workloags/DeleteDialog";

//Filter Type
import { FilterType } from "../types/ReportsFilterType";

//Admin Rating Enum
import { AdminRatingsReports } from "../Enum/Filtertype";

//filter body for rating
import { rating_InitialFilter } from "@/utils/reports/getFilters";

//dropdown apis
import { getProjectData } from "./api/getDropDownData";

//icons
import { Edit, Delete } from "@mui/icons-material";
import SearchIcon from "@/assets/icons/SearchIcon";
import { isWeekend } from "@/utils/commonFunction";
import { getClientDropdownData } from "@/utils/commonDropdownApiCall";

const RatingReportFilter = ({
  isFiltering,
  sendFilterToPage,
  onDialogClose,
}: FilterType) => {
  const [ratingreport_clients, setRatingReport_Clients] = useState<any[]>([]);
  const [ratingreport_clientName, setRatingReport_ClientName] = useState<any[]>(
    []
  );
  const [ratingreport_projectName, setRatingReport_ProjectName] = useState<
    number | string
  >(0);
  const [ratingreport_returnType, setRatingReport_ReturnType] = useState<
    null | number
  >(0);
  const [ratingreport_startDate, setRatingReport_StartDate] = useState<
    null | string
  >(null);
  const [ratingreport_endDate, setRatingReport_EndDate] = useState<
    null | string
  >(null);
  const [ratingreport_ratings, setRatingReport_Ratings] = useState<
    null | number
  >(0);
  const [ratingreport_filterName, setRatingReport_FilterName] =
    useState<string>("");
  const [ratingreport_saveFilter, setRatingReport_SaveFilter] =
    useState<boolean>(false);
  const [ratingreport_clientDropdown, setRatingReport_ClientDropdown] =
    useState<any[]>([]);
  const [ratingreport_projectDropdown, setRatingReport_ProjectDropdown] =
    useState<any[]>([]);
  const [ratingreport_anyFieldSelected, setRatingReport_AnyFieldSelected] =
    useState(false);
  const [ratingreport_currentFilterId, setRatingReport_CurrentFilterId] =
    useState<any>("");
  const [ratingreport_savedFilters, setRatingReport_SavedFilters] = useState<
    any[]
  >([]);
  const [ratingreport_defaultFilter, setRatingReport_DefaultFilter] =
    useState<boolean>(false);
  const [ratingreport_searchValue, setRatingReport_SearchValue] =
    useState<string>("");
  const [ratingreport_isDeleting, setRatingReport_IsDeleting] =
    useState<boolean>(false);
  const [ratingreport_resetting, setRatingReport_Resetting] =
    useState<boolean>(false);
  const [ratingreport_error, setRatingReport_Error] = useState("");

  const anchorElFilter: HTMLButtonElement | null = null;
  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const handleRatingReport_ResetAll = () => {
    setRatingReport_Clients([]);
    setRatingReport_ClientName([]);
    setRatingReport_ProjectName(0);
    setRatingReport_ReturnType(0);
    setRatingReport_StartDate(null);
    setRatingReport_EndDate(null);
    setRatingReport_Ratings(0);
    setRatingReport_Resetting(true);
    setRatingReport_Error("");

    sendFilterToPage({
      ...rating_InitialFilter,
    });
  };

  const handleRatingReport_Close = () => {
    onDialogClose(false);
    setRatingReport_Resetting(false);
    setRatingReport_FilterName("");
    setRatingReport_DefaultFilter(false);
    setRatingReport_ClientName([]);
    setRatingReport_Clients([]);
    setRatingReport_ProjectName(0);
    setRatingReport_ReturnType(0);
    setRatingReport_StartDate(null);
    setRatingReport_EndDate(null);
    setRatingReport_Ratings(0);
    setRatingReport_Error("");
  };

  const handleRatingReport_FilterApply = () => {
    sendFilterToPage({
      ...rating_InitialFilter,
      Clients: ratingreport_clientName,
      Projects:
        ratingreport_projectName === 0 || ratingreport_projectName === ""
          ? []
          : [ratingreport_projectName],
      ReturnTypeId:
        ratingreport_returnType !== 0 ? ratingreport_returnType : null,
      Ratings: ratingreport_ratings !== 0 ? ratingreport_ratings : null,
      StartDate:
        ratingreport_startDate !== null
          ? new Date(
              new Date(ratingreport_startDate).getTime() + 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0]
          : ratingreport_endDate !== null
          ? new Date(
              new Date(ratingreport_endDate).getTime() + 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0]
          : null,
      EndDate:
        ratingreport_endDate !== null
          ? new Date(
              new Date(ratingreport_endDate).getTime() + 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0]
          : ratingreport_startDate !== null
          ? new Date(
              new Date(ratingreport_startDate).getTime() + 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0]
          : null,
    });

    onDialogClose(false);
  };

  const handleRatingReport_SavedFilterApply = (index: number) => {
    if (Number.isInteger(index)) {
      if (index !== undefined) {
        sendFilterToPage({
          ...rating_InitialFilter,
          Clients: ratingreport_savedFilters[index].AppliedFilter.Clients,
          Projects:
            ratingreport_savedFilters[index].AppliedFilter.Projects.length > 0
              ? []
              : ratingreport_savedFilters[index].AppliedFilter.Projects[0],
          ReturnTypeId:
            ratingreport_savedFilters[index].AppliedFilter.ReturnTypeId,
          Ratings: ratingreport_savedFilters[index].AppliedFilter.Ratings,
          StartDate: ratingreport_savedFilters[index].AppliedFilter.StartDate,
          EndDate: ratingreport_savedFilters[index].AppliedFilter.EndDate,
        });
      }
    }

    onDialogClose(false);
  };

  const handleRatingReport_SaveFilter = async () => {
    if (ratingreport_filterName.trim().length === 0) {
      setRatingReport_Error("This is required field!");
    } else if (ratingreport_filterName.trim().length > 15) {
      setRatingReport_Error("Max 15 characters allowed!");
    } else {
      setRatingReport_Error("");

      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/filter/savefilter`,
          {
            filterId:
              ratingreport_currentFilterId !== ""
                ? ratingreport_currentFilterId
                : null,
            name: ratingreport_filterName,
            AppliedFilter: {
              Clients:
                ratingreport_clientName.length > 0
                  ? ratingreport_clientName
                  : [],
              Projects:
                ratingreport_projectName === 0 ||
                ratingreport_projectName === ""
                  ? []
                  : [ratingreport_projectName],
              ReturnTypeId:
                ratingreport_returnType !== 0 ? ratingreport_returnType : null,
              Ratings: ratingreport_ratings !== 0 ? ratingreport_ratings : null,
              StartDate:
                ratingreport_startDate !== null
                  ? new Date(
                      new Date(ratingreport_startDate).getTime() +
                        24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : ratingreport_endDate !== null
                  ? new Date(
                      new Date(ratingreport_endDate).getTime() +
                        24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : null,
              EndDate:
                ratingreport_endDate !== null
                  ? new Date(
                      new Date(ratingreport_endDate).getTime() +
                        24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : ratingreport_startDate !== null
                  ? new Date(
                      new Date(ratingreport_startDate).getTime() +
                        24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : null,
            },
            type: AdminRatingsReports,
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
            handleRatingReport_Close();
            getRatingReport_FilterList();
            handleRatingReport_FilterApply();
            setRatingReport_SaveFilter(false);
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

  const getRatingReport_FilterList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/getfilterlist`,
        {
          type: AdminRatingsReports,
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
          setRatingReport_SavedFilters(response.data.ResponseData);
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

  const handleRatingReport_SavedFilterEdit = (index: number) => {
    setRatingReport_SaveFilter(true);
    setRatingReport_DefaultFilter(true);
    setRatingReport_FilterName(ratingreport_savedFilters[index].Name);
    setRatingReport_CurrentFilterId(ratingreport_savedFilters[index].FilterId);

    setRatingReport_Clients(
      ratingreport_savedFilters[index].AppliedFilter.Clients.length > 0
        ? ratingreport_clientDropdown.filter((client: any) =>
            ratingreport_savedFilters[index].AppliedFilter.Clients.includes(
              client.value
            )
          )
        : []
    );
    setRatingReport_ClientName(
      ratingreport_savedFilters[index].AppliedFilter.Clients
    );
    setRatingReport_ProjectName(
      ratingreport_savedFilters[index].AppliedFilter.Projects.length > 0
        ? ratingreport_savedFilters[index].AppliedFilter.Projects[0]
        : 0
    );
    setRatingReport_ReturnType(
      ratingreport_savedFilters[index].AppliedFilter.ReturnTypeId ?? 0
    );
    setRatingReport_StartDate(
      ratingreport_savedFilters[index].AppliedFilter.StartDate ?? ""
    );
    setRatingReport_EndDate(
      ratingreport_savedFilters[index].AppliedFilter.EndDate ?? ""
    );
    setRatingReport_Ratings(
      ratingreport_savedFilters[index].AppliedFilter.Ratings ?? ""
    );
  };

  const handleRatingReport_SavedFilterDelete = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/delete`,
        {
          filterId: ratingreport_currentFilterId,
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
          handleRatingReport_Close();
          getRatingReport_FilterList();
          setRatingReport_CurrentFilterId("");
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
    getRatingReport_FilterList();
  }, []);

  const ALL = -1;

  useEffect(() => {
    const isAnyFieldSelected =
      ratingreport_clientName.length > 0 ||
      ratingreport_projectName !== 0 ||
      ratingreport_returnType !== 0 ||
      ratingreport_ratings !== 0 ||
      ratingreport_startDate !== null ||
      ratingreport_endDate !== null;

    setRatingReport_AnyFieldSelected(isAnyFieldSelected);
    setRatingReport_SaveFilter(false);
    setRatingReport_Resetting(false);
  }, [
    ratingreport_clientName,
    ratingreport_projectName,
    ratingreport_returnType,
    ratingreport_ratings,
    ratingreport_startDate,
    ratingreport_endDate,
  ]);

  useEffect(() => {
    const filterDropdowns = async () => {
      setRatingReport_ClientDropdown([
        { label: "Select All", value: ALL },
        ...(await getClientDropdownData()),
      ]);
      setRatingReport_ProjectDropdown(
        await getProjectData(
          ratingreport_clientName.length > 0 ? ratingreport_clientName[0] : 0
        )
      );
    };
    filterDropdowns();

    if (ratingreport_clientName.length > 0 || ratingreport_resetting) {
      onDialogClose(true);
    }
  }, [ratingreport_clientName]);

  return (
    <>
      {ratingreport_savedFilters.length > 0 && !ratingreport_defaultFilter ? (
        <Popover
          id={idFilter}
          open={isFiltering}
          anchorEl={anchorElFilter}
          onClose={handleRatingReport_Close}
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
                setRatingReport_DefaultFilter(true);
                setRatingReport_CurrentFilterId(0);
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
                value={ratingreport_searchValue}
                onChange={(e: any) =>
                  setRatingReport_SearchValue(e.target.value)
                }
                sx={{ fontSize: 14 }}
              />
              <span className="absolute top-4 right-3 text-slatyGrey">
                <SearchIcon />
              </span>
            </span>
            {ratingreport_savedFilters.map((i: any, index: number) => {
              return (
                <>
                  <div
                    key={i.FilterId}
                    className="group px-2 cursor-pointer bg-whiteSmoke hover:bg-lightSilver flex justify-between items-center h-9"
                  >
                    <span
                      className="pl-1"
                      onClick={() => {
                        setRatingReport_CurrentFilterId(i.FilterId);
                        onDialogClose(false);
                        handleRatingReport_SavedFilterApply(index);
                      }}
                    >
                      {i.Name}
                    </span>
                    <span className="flex gap-[10px] pr-[10px]">
                      <span
                        onClick={() =>
                          handleRatingReport_SavedFilterEdit(index)
                        }
                      >
                        <Tooltip title="Edit" placement="top" arrow>
                          <Edit className="hidden group-hover:inline-block w-5 h-5 ml-2 text-slatyGrey fill-current" />
                        </Tooltip>
                      </span>
                      <span
                        onClick={() => {
                          setRatingReport_IsDeleting(true);
                          setRatingReport_CurrentFilterId(i.FilterId);
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
            <Button
              onClick={handleRatingReport_ResetAll}
              className="mt-2"
              color="error"
            >
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
          onClose={handleRatingReport_Close}
        >
          <DialogTitle className="h-[64px] p-[20px] flex items-center justify-between border-b border-b-lightSilver">
            <span className="text-lg font-medium">Filter</span>
            <Button color="error" onClick={handleRatingReport_ResetAll}>
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
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={
                      ratingreport_clientDropdown.length - 1 ===
                      ratingreport_clients.length
                        ? []
                        : ratingreport_clientDropdown.filter(
                            (option) =>
                              !ratingreport_clients.find(
                                (client) => client.value === option.value
                              )
                          )
                    }
                    getOptionLabel={(option: any) => option.label}
                    onChange={(e: any, data: any) => {
                      if (data.some((d: any) => d.value === -1)) {
                        setRatingReport_Clients(
                          ratingreport_clientDropdown.filter(
                            (d: any) => d.value !== -1
                          )
                        );
                        setRatingReport_ClientName(
                          ratingreport_clientDropdown
                            .filter((d: any) => d.value !== -1)
                            .map((d: any) => d.value)
                        );
                        setRatingReport_ProjectName(0);
                      } else {
                        setRatingReport_Clients(data);
                        setRatingReport_ClientName(
                          data.map((d: any) => d.value)
                        );
                        setRatingReport_ProjectName(0);
                      }
                    }}
                    value={ratingreport_clients}
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
                    value={
                      ratingreport_projectName === 0
                        ? ""
                        : ratingreport_projectName
                    }
                    onChange={(e) =>
                      setRatingReport_ProjectName(e.target.value)
                    }
                    disabled={ratingreport_clientName.length > 1}
                  >
                    {ratingreport_projectDropdown.map(
                      (i: any, index: number) => (
                        <MenuItem value={i.value} key={i.value}>
                          {i.label}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 210 }}
                >
                  <InputLabel id="workTypes-label">Return Type</InputLabel>
                  <Select
                    labelId="workTypes-label"
                    id="workTypes-select"
                    value={
                      ratingreport_returnType === 0
                        ? ""
                        : ratingreport_returnType
                    }
                    onChange={(e: any) =>
                      setRatingReport_ReturnType(e.target.value)
                    }
                  >
                    <MenuItem value={1}>Individual Return</MenuItem>
                    <MenuItem value={2}>Business Return</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-[20px]">
                <div className="inline-flex mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[210px]">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      shouldDisableDate={isWeekend}
                      maxDate={dayjs(Date.now())}
                      value={
                        ratingreport_startDate === null
                          ? null
                          : dayjs(ratingreport_startDate)
                      }
                      onChange={(newDate: any) =>
                        setRatingReport_StartDate(newDate.$d)
                      }
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
                      label="End Date"
                      shouldDisableDate={isWeekend}
                      maxDate={dayjs(Date.now())}
                      value={
                        ratingreport_endDate === null
                          ? null
                          : dayjs(ratingreport_endDate)
                      }
                      onChange={(newDate: any) =>
                        setRatingReport_EndDate(newDate.$d)
                      }
                      slotProps={{
                        textField: {
                          readOnly: true,
                        } as Record<string, any>,
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 210 }}
                >
                  <InputLabel id="ratings">Ratings</InputLabel>
                  <Select
                    labelId="ratings"
                    id="ratings"
                    value={
                      ratingreport_ratings === 0 ? "" : ratingreport_ratings
                    }
                    onChange={(e: any) =>
                      setRatingReport_Ratings(e.target.value)
                    }
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
            {!ratingreport_saveFilter ? (
              <>
                <Button
                  variant="contained"
                  color="info"
                  className={`${
                    ratingreport_anyFieldSelected && "!bg-secondary"
                  }`}
                  disabled={!ratingreport_anyFieldSelected}
                  onClick={handleRatingReport_FilterApply}
                >
                  Apply Filter
                </Button>

                <Button
                  variant="contained"
                  color="info"
                  className={`${
                    ratingreport_anyFieldSelected && "!bg-secondary"
                  }`}
                  onClick={() => setRatingReport_SaveFilter(true)}
                  disabled={!ratingreport_anyFieldSelected}
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
                    value={ratingreport_filterName}
                    onChange={(e) => {
                      setRatingReport_FilterName(e.target.value);
                      setRatingReport_Error("");
                    }}
                    error={ratingreport_error.length > 0 ? true : false}
                    helperText={ratingreport_error}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleRatingReport_SaveFilter}
                  className={`${
                    ratingreport_filterName.length === 0 ? "" : "!bg-secondary"
                  }`}
                  disabled={ratingreport_filterName.length === 0}
                >
                  Save & Apply
                </Button>
              </>
            )}

            <Button
              variant="outlined"
              color="info"
              onClick={handleRatingReport_Close}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <DeleteDialog
        isOpen={ratingreport_isDeleting}
        onClose={() => setRatingReport_IsDeleting(false)}
        onActionClick={handleRatingReport_SavedFilterDelete}
        Title={"Delete Filter"}
        firstContent={"Are you sure you want to delete this saved filter?"}
        secondContent={
          "If you delete this, you will permanently loose this saved filter and selected fields."
        }
      />
    </>
  );
};

export default RatingReportFilter;
