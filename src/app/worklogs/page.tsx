/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Icons
import AddPlusIcon from "@/assets/icons/AddPlusIcon";
import ExportIcon from "@/assets/icons/ExportIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import ImportIcon from "@/assets/icons/ImportIcon";
import { Delete, Edit } from "@mui/icons-material";

// Material Import
import { Button, Popover, Tooltip, InputBase } from "@mui/material";
import { toast } from "react-toastify";

// Internal components
import DrawerOverlay from "@/components/settings/drawer/DrawerOverlay";
import Datatable from "@/components/worklogs/Datatable";
import Drawer from "@/components/worklogs/Drawer";
import FilterDialog from "@/components/worklogs/FilterDialog";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import SearchIcon from "@/assets/icons/SearchIcon";
import UnassigneeDatatable from "@/components/worklogs/UnassigneeDatatable";
import UnassigneeFilterDialog from "@/components/worklogs/UnassigneeFilterDialog";
import ImportDialog from "@/components/worklogs/worklogs_Import/ImportDialog";
import IdleTimer from "@/components/common/IdleTimer";
import Loading from "@/assets/icons/reports/Loading";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import CustomToastContainer from "@/utils/style/CustomToastContainer";

const exportBody = {
  PageNo: 1,
  PageSize: 50000,
  SortColumn: "",
  IsDesc: true,
  GlobalSearch: "",
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

const Page = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [hasEdit, setHasEdit] = useState(0);
  const [hasRecurring, setHasRecurring] = useState(false);
  const [hasComment, setHasComment] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [dataFunction, setDataFunction] = useState<(() => void) | null>(null);
  const [filterList, setFilterList] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [currentFilterId, setCurrentFilterId] = useState<number>(0);
  const [clickedFilterId, setclickedFilterId] = useState<number>(0);
  const [searchValue, setSearchValue] = useState("");
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [currentFilterData, setCurrentFilterData] = useState([]);
  const [breakId, setBreakID] = useState<number>(0);
  const [timer, setTimer] = useState<string>("00:00:00");
  const [loaded, setLoaded] = useState(false);
  const [isTaskClicked, setIsTaskClicked] = useState(true);
  const [isUnassigneeClicked, setIsUnassigneeClicked] = useState(false);
  const [hasId, setHasId] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [canExport, setCanExport] = useState<boolean>(false);

  const [anchorElFilter, setAnchorElFilter] =
    React.useState<HTMLButtonElement | null>(null);

  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const handleClickFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorElFilter(null);
  };

  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("isClient") === "false") {
      if (!hasPermissionWorklog("", "View", "WorkLogs")) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  // for searching the saved filters
  const filteredFilters = filterList.filter((filter: any) =>
    filter.Name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // For Closing Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  // For refreshing data in Datatable from drawer
  const handleDataFetch = (getData: () => void) => {
    setDataFunction(() => getData);
  };

  const handleUserDetailsFetch = (getData: () => void) => {
    setLoaded(true);
  };

  // To Toggle Drawer
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setHasEdit(0);
    setHasRecurring(false);
    setHasComment(false);
    setHasId("");
    setGlobalSearchValue("");
  };

  // To Toggle Drawer for Edit
  const handleEdit = (rowData: any, Id: any) => {
    setHasEdit(rowData);
    setOpenDrawer(true);
    setHasId(Id);
  };

  // To Toggle Drawer for Recurring
  const handleSetRecurring = (rowData: any, selectedId: number) => {
    setHasRecurring(true);
    setOpenDrawer(rowData);
    setHasEdit(selectedId);
  };

  // To Toggle Drawer for Comments
  const handleSetComments = (rowData: any, selectedId: number) => {
    setHasComment(true);
    setOpenDrawer(rowData);
    setHasEdit(selectedId);
  };

  // For Closing Filter Modal
  const closeFilterModal = () => {
    setIsFilterOpen(false);
  };

  const getFilterList = async () => {
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
          setFilterList(response.data.ResponseData);
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

  const deleteFilter = async (FilterId: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/delete`,
        {
          filterId: FilterId,
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

  useEffect(() => {
    getFilterList();
  }, []);

  const getIdFromFilterDialog = (data: any) => {
    setCurrentFilterData(data);
  };

  const getBreakData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.get(
        `${process.env.worklog_api_url}/workitem/break/getbyuser`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          if (
            response.data.ResponseData.BreakId === null &&
            response.data.ResponseData.TotalTime === null
          ) {
            setBreakID(0);
            setTimer("00:00:00");
          } else if (
            !response.data.ResponseData.IsStared &&
            response.data.ResponseData.TotalTime !== null
          ) {
            setTimer(response.data.ResponseData.TotalTime);
          } else if (
            response.data.ResponseData.IsStared &&
            response.data.ResponseData.BreakId !== null
          ) {
            setBreakID(response.data.ResponseData.BreakId);
            setTimer(response.data.ResponseData.TotalTime);
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

  const setBreak = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/break/setbreak`,
        {
          breakId: breakId,
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
          getBreakData();
          setBreakID((prev) =>
            response.data.ResponseData === prev ? 0 : response.data.ResponseData
          );
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
    getBreakData();
  }, []);

  const handleCanExport = (arg1: boolean) => {
    setCanExport(arg1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const token = localStorage.getItem("token");
    const Org_Token = localStorage.getItem("Org_Token");

    const response = await axios.post(
      `${process.env.worklog_api_url}/workitem/getexportexcellist`,
      {
        ...exportBody,
        ...currentFilterData,
        GlobalSearch: globalSearchValue,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
          org_token: Org_Token,
        },
        responseType: "arraybuffer",
      }
    );
    if (response.status === 200) {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "worklog_report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsExporting(false);
    } else {
      setIsExporting(false);
      toast.error("Failed to download, please try again later.");
    }
  };

  return (
    <Wrapper>
      <IdleTimer onIdle={() => window.location.reload()} />
      <div>
        <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
        <div className="bg-white flex justify-between items-center px-[20px]">
          <div className="flex gap-[16px] items-center py-[6.5px]">
            <label
              onClick={() => {
                setGlobalSearchValue("");
                setIsTaskClicked(true);
                setIsUnassigneeClicked(false);
              }}
              className={`py-[10px] text-[16px] cursor-pointer select-none ${
                isTaskClicked
                  ? "text-secondary font-semibold"
                  : "text-slatyGrey"
              }`}
            >
              Task
            </label>
            {hasPermissionWorklog("", "View", "WorkLogs") &&
              hasPermissionWorklog("", "ClientManager", "WorkLogs") &&
              hasPermissionWorklog("", "ManageAssignee", "WorkLogs") && (
                <span className="text-lightSilver">|</span>
              )}
            {hasPermissionWorklog("", "ClientManager", "WorkLogs") &&
              hasPermissionWorklog("", "ManageAssignee", "WorkLogs") && (
                <label
                  onClick={() => {
                    setGlobalSearchValue("");
                    setIsUnassigneeClicked(true);
                    setIsTaskClicked(false);
                  }}
                  className={`py-[10px] text-[16px] cursor-pointer select-none ${
                    isUnassigneeClicked
                      ? "text-secondary font-semibold"
                      : "text-slatyGrey"
                  }`}
                >
                  Unassigned Task
                </label>
              )}
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="relative">
              <InputBase
                className="pl-1 pr-7 border-b border-b-lightSilver w-52"
                placeholder="Search"
                value={globalSearchValue}
                onChange={(e: any) => setGlobalSearchValue(e.target.value)}
              />
              <span className="absolute top-2 right-2 text-slatyGrey">
                <SearchIcon />
              </span>
            </div>

            {filterList.length > 0 && isTaskClicked ? (
              <div>
                <span
                  aria-describedby={idFilter}
                  onClick={handleClickFilter}
                  className="cursor-pointer"
                >
                  <FilterIcon />
                </span>

                <Popover
                  id={idFilter}
                  open={openFilter}
                  anchorEl={anchorElFilter}
                  onClose={handleCloseFilter}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <div className="flex flex-col py-2 w-[250px]">
                    <span
                      className="p-2 cursor-pointer hover:bg-lightGray"
                      onClick={() => {
                        setIsFilterOpen(true);
                        setCurrentFilterId(0);
                        handleCloseFilter();
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
                        onChange={handleSearchChange}
                        sx={{ fontSize: 14 }}
                      />
                      <span className="absolute top-4 right-3 text-slatyGrey">
                        <SearchIcon />
                      </span>
                    </span>

                    {filteredFilters.map((i: any) => {
                      return (
                        <>
                          <div
                            key={i.FilterId}
                            className="group px-2 cursor-pointer bg-whiteSmoke hover:bg-lightSilver flex justify-between items-center h-9"
                          >
                            <span
                              className="pl-1"
                              onClick={() => {
                                setclickedFilterId(i.FilterId);
                                handleCloseFilter();
                              }}
                            >
                              {i.Name}
                            </span>
                            <span className="flex gap-[10px] pr-[10px]">
                              <span
                                onClick={() => {
                                  setCurrentFilterId(i.FilterId);
                                  setIsFilterOpen(true);
                                  handleCloseFilter();
                                }}
                              >
                                <Tooltip title="Edit" placement="top" arrow>
                                  <Edit className="hidden group-hover:inline-block w-5 h-5 ml-2 text-slatyGrey fill-current" />
                                </Tooltip>
                              </span>
                              <span
                                onClick={() => {
                                  setIsDeleteOpen(true);
                                  setCurrentFilterId(i.FilterId);
                                  handleCloseFilter();
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
                      onClick={() => {
                        setclickedFilterId(0);
                        handleCloseFilter();
                      }}
                      className="mt-2"
                      color="error"
                    >
                      clear all
                    </Button>
                  </div>
                </Popover>
              </div>
            ) : (
              <ColorToolTip title="Filter" placement="top" arrow>
                <span
                  className="cursor-pointer"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <FilterIcon />
                </span>
              </ColorToolTip>
            )}
            {isTaskClicked ? (
              <>
                <ColorToolTip title="Import" placement="top" arrow>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setIsImportOpen(true);
                    }}
                  >
                    <ImportIcon />
                  </span>
                </ColorToolTip>
                <ColorToolTip title="Export" placement="top" arrow>
                  <span
                    className={
                      canExport
                        ? "cursor-pointer"
                        : "pointer-events-none opacity-50"
                    }
                    onClick={canExport ? handleExport : undefined}
                  >
                    {isExporting ? <Loading /> : <ExportIcon />}
                  </span>
                </ColorToolTip>
              </>
            ) : (
              <></>
            )}
            {isTaskClicked && (
              <>
                <span className="text-secondary font-light">{timer}</span>
                <Button
                  type="submit"
                  variant="contained"
                  color="info"
                  className={`rounded-[4px] !h-[36px] !w-[125px] pt-2 ${
                    breakId === 0 ? "!bg-secondary" : "!bg-[#ff9f43]"
                  }`}
                  onClick={
                    loaded &&
                    hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")
                      ? setBreak
                      : () =>
                          toast.error("User not have permission to Break Task")
                  }
                >
                  {breakId === 0 ? "Break" : "Stop break"}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="rounded-[4px] !h-[36px] !bg-secondary"
                  onClick={
                    hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs")
                      ? handleDrawerOpen
                      : () =>
                          toast.error("User not have permission to Create Task")
                  }
                >
                  <span className="flex items-center justify-center gap-[10px] px-[5px]">
                    <span>
                      <AddPlusIcon />
                    </span>
                    <span className="pt-1">Create Task</span>
                  </span>
                </Button>
              </>
            )}
          </div>
        </div>
        {isTaskClicked && (
          <Datatable
            searchValue={globalSearchValue}
            isOnBreak={breakId}
            onGetBreakData={getBreakData}
            onSetBreak={setBreak}
            currentFilterData={currentFilterData}
            onCurrentFilterId={clickedFilterId}
            onDataFetch={handleDataFetch}
            onEdit={handleEdit}
            onRecurring={handleSetRecurring}
            onDrawerOpen={handleDrawerOpen}
            onDrawerClose={handleDrawerClose}
            onComment={handleSetComments}
            onHandleExport={handleCanExport}
            isTaskClicked={isTaskClicked}
            isUnassigneeClicked={isUnassigneeClicked}
          />
        )}
        {isUnassigneeClicked && (
          <UnassigneeDatatable
            searchValue={globalSearchValue}
            currentFilterData={currentFilterData}
            onCurrentFilterId={clickedFilterId}
            onDataFetch={handleDataFetch}
            onEdit={handleEdit}
            onRecurring={handleSetRecurring}
            onDrawerOpen={handleDrawerOpen}
            onDrawerClose={handleDrawerClose}
            onComment={handleSetComments}
            isUnassigneeClicked={isUnassigneeClicked}
          />
        )}
        <Drawer
          onDataFetch={dataFunction}
          onOpen={openDrawer}
          onClose={handleDrawerClose}
          onEdit={hasEdit}
          onRecurring={hasRecurring}
          onComment={hasComment}
          onHasId={hasId}
        />
        <DrawerOverlay isOpen={openDrawer} onClose={handleDrawerClose} />

        {/* Filter Dialog Box */}
        {isTaskClicked && (
          <FilterDialog
            currentFilterData={getIdFromFilterDialog}
            onOpen={isFilterOpen}
            onClose={closeFilterModal}
            onActionClick={() => {}}
            onDataFetch={getFilterList}
            onCurrentFilterId={currentFilterId}
          />
        )}
        {isUnassigneeClicked && (
          <UnassigneeFilterDialog
            onOpen={isFilterOpen}
            onClose={closeFilterModal}
            currentFilterData={getIdFromFilterDialog}
          />
        )}
      </div>

      <ImportDialog
        onOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onDataFetch={dataFunction}
      />

      {/* Delete Dialog Box */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onActionClick={() => {
          deleteFilter(currentFilterId);
        }}
        Title={"Delete Filter"}
        firstContent={"Are you sure you want to delete this saved filter?"}
        secondContent={
          "If you delete this, you will permanently loose this saved filter and selected fields."
        }
      />

      <CustomToastContainer />
    </Wrapper>
  );
};

export default Page;
