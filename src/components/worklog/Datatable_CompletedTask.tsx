import React, { useEffect, useState } from "react";
import axios from "axios";

import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";
import RatingDialog from "./RatingDialog";
import { Card, CircularProgress } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
// icons imports
import Minus from "@/assets/icons/worklogs/Minus";
import Rating_Star from "@/assets/icons/worklog_Client/Rating_Star";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comments from "@/assets/icons/worklogs/Comments";
import ErrorLogs from "@/assets/icons/worklogs/ErrorLogs";
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generatePriorityWithColor,
  generateStatusWithColor,
  handlePageChangeWithFilter,
  handleChangeRowsPerPageWithFilter,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { worklogs_Options } from "@/utils/datatable/TableOptions";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  PageNo: pageNo,
  PageSize: pageSize,
  SortColumn: "",
  IsDesc: true,
  GlobalSearch: null,
  ProjectIds: null,
  OverdueBy: null,
  PriorityId: null,
  StatusId: null,
  WorkTypeId: null,
  AssignedTo: null,
  StartDate: null,
  EndDate: null,
  DueDate: null,
  IsCreatedByClient: null,
  IsCompletedTaskPage: true,
  IsSignedOff: false,
};

const Datatable_CompletedTask = ({
  onEdit,
  onDrawerOpen,
  onDataFetch,
  onComment,
  onErrorLog,
  currentFilterData,
  onSearchWorkTypeData,
  onCloseDrawer,
}: any) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [workItemData, setWorkItemData] = useState<any | any[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<any | number[]>([]);
  const [selectedRowStatusId, setSelectedRowStatusId] = useState<
    any | number[]
  >([]);
  const [selectedRowId, setSelectedRowId] = useState<any | number>(null);
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);

  useEffect(() => {
    if (!onCloseDrawer || onCloseDrawer === false) {
      handleClearSelection();
      setRowsPerPage(10);
    }
  }, [onCloseDrawer]);

  const closeRatingDialog = () => {
    setIsRatingOpen(false);
    getWorkItemList();
  };

  // For Closing Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  const handleRowSelect = (
    currentRowsSelected: any,
    allRowsSelected: any,
    rowsSelected: any
  ) => {
    const selectedData = allRowsSelected.map(
      (row: any) => workItemData[row.dataIndex]
    );
    setSelectedRowsCount(rowsSelected.length);
    setSelectedRows(rowsSelected);

    // adding all selected Ids in an array
    const selectedWorkItemIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow?.WorkitemId)
        : [];

    setSelectedRowIds(selectedWorkItemIds);

    // adding only one or last selected id
    const lastSelectedWorkItemId =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].WorkitemId
        : null;
    setSelectedRowId(lastSelectedWorkItemId);

    // adding all selected row's status Ids in an array
    const selectedWorkItemStatusIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow.StatusId)
        : [];

    setSelectedRowStatusId(selectedWorkItemStatusIds);

    setIsPopupOpen(allRowsSelected);
  };

  const handleClearSelection = () => {
    setSelectedRowsCount(0);
    setSelectedRows([]);
    setIsPopupOpen(false);
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchWorkTypeData) {
      setWorkItemData(onSearchWorkTypeData);
    } else {
      getWorkItemList();
    }
  }, [onSearchWorkTypeData]);

  useEffect(() => {
    setFilteredOject({ ...filteredObject, ...currentFilterData });
    getWorkItemList();
  }, [currentFilterData]);

  useEffect(() => {
    getWorkItemList();
  }, [filteredObject]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.href.includes("=");
      if (pathname) {
        const id = window.location.href.split("=")[1];
        onEdit(id);
        onDrawerOpen();
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        handleClearSelection();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // WorkItemList API
  const getWorkItemList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/ClientWorkitem/getworkitemlist`,
        filteredObject,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setLoaded(true);
          setWorkItemData(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
        } else {
          setLoaded(true);
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        setLoaded(true);
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      setLoaded(true);
      console.error(error);
    }
  };

  // Delete WorkItem API
  const deleteWorkItem = async () => {
    const warningStatusIds = [3, 4, 5, 6, 7, 8, 9, 10, 11];
    let shouldWarn;

    shouldWarn = selectedRowStatusId
      .map((id: number) => {
        if (!warningStatusIds.includes(id)) {
          return id;
        }
        return undefined;
      })
      .filter((id: number) => id !== undefined);

    if (selectedRowIds.length > 0) {
      if (
        (shouldWarn.includes(1) && selectedRowIds.length > 1) ||
        (shouldWarn.includes(2) && selectedRowIds.length > 1)
      ) {
        toast.warning(
          "Only tasks in 'In Progress' or 'Not Started' status will be deleted.123"
        );
      }
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");

      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/deleteworkitem`,
          {
            workitemIds: selectedRowIds,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (
          response.status === 200 &&
          response.data.ResponseStatus === "Success"
        ) {
          toast.success("Task has been deleted successfully.");
          handleClearSelection();
          getWorkItemList();
          shouldWarn.splice(0, shouldWarn.length);
        } else {
          const data = response.data.Message || "An error occurred.";
          toast.error(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the task.");
      }
    } else if (shouldWarn.includes[1] || shouldWarn.includes[2]) {
      toast.warning(
        "Only tasks in 'In Progress' or 'Not Started' status will be deleted."
      );
    }
  };

  useEffect(() => {
    // refreshing data from Drawer side
    const fetchData = async () => {
      await getWorkItemList();
      onDataFetch(() => fetchData());
    };
    fetchData();
    getWorkItemList();
  }, []);

  // Table Columns
  const columns = [
    {
      name: "WorkitemId",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Task ID"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Project"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Task"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "AssignedToName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Assigned To"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "PriorityName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Priority"),
        customBodyRender: (value: any) => generatePriorityWithColor(value),
      },
    },
    {
      name: "StatusName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Status"),
        customBodyRender: (value: any, tableMeta: any) =>
          generateStatusWithColor(value, tableMeta.rowData[9]),
      },
    },
    {
      name: "Quantity",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Qty."),
      },
      customBodyRender: (value: any) => {
        return generateCommonBodyRender(value);
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Start Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "EndDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Due Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "StatusColorCode",
      options: {
        display: false,
      },
    },
  ];

  return (
    <div>
      {loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={workItemData}
            columns={columns}
            title={undefined}
            options={{
              ...worklogs_Options,
              selectAllRows: isPopupOpen && selectedRowsCount === 0,
              rowsSelected: selectedRows,
              textLabels: {
                body: {
                  noMatch: (
                    <div className="flex items-start">
                      <span>
                        Currently there is no record, you may{" "}
                        <a
                          className="text-secondary underline cursor-pointer"
                          onClick={onDrawerOpen}
                        >
                          create task
                        </a>{" "}
                        to continue.
                      </span>
                    </div>
                  ),
                  toolTip: "",
                },
              },
              onRowSelectionChange: (
                currentRowsSelected: any,
                allRowsSelected: any,
                rowsSelected: any
              ) =>
                handleRowSelect(
                  currentRowsSelected,
                  allRowsSelected,
                  rowsSelected
                ),
            }}
            data-tableid="completedTask_Datatable"
          />
          <TablePagination
            className="mt-[10px]"
            component="div"
            count={tableDataCount}
            page={page}
            onPageChange={(
              event: React.MouseEvent<HTMLButtonElement> | null,
              newPage: number
            ) => {
              handlePageChangeWithFilter(newPage, setPage, setFilteredOject);
            }}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleChangeRowsPerPageWithFilter(
                event,
                setRowsPerPage,
                setPage,
                setFilteredOject
              );
            }}
          />
        </ThemeProvider>
      ) : (
        <div className="h-screen w-full flex justify-center my-[20%]">
          <CircularProgress />
        </div>
      )}

      {/* Delete Dialog Box */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onActionClick={deleteWorkItem}
        Title={"Delete Process"}
        firstContent={"Are you sure you want to delete Task?"}
        secondContent={
          "If you delete task, you will permanently loose task and task related data."
        }
      />

      <RatingDialog
        onOpen={isRatingOpen}
        onClose={closeRatingDialog}
        ratingId={workItemData
          .map((item: any) =>
            selectedRowIds.includes(item.WorkitemId) && item.StatusId !== 13
              ? item.WorkitemId
              : undefined
          )
          .filter((i: any) => i !== undefined)}
        noRatingId={workItemData
          .map((item: any) =>
            selectedRowIds.includes(item.WorkitemId) && item.StatusId === 13
              ? item.WorkitemId
              : undefined
          )
          .filter((i: any) => i !== undefined)}
        onDataFetch={onDataFetch}
        handleClearSelection={handleClearSelection}
      />

      {/* Popup Filter */}
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-center">
          <Card className="rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg w-[45%] bottom-0 -translate-y-1/2">
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[40%]">
                <span className="cursor-pointer" onClick={handleClearSelection}>
                  <Minus />
                </span>
                <span className="pl-2 pt-[1px] pr-6 text-[14px]">
                  {selectedRowsCount || selectedRows} task selected
                </span>
              </div>

              <div className="flex flex-row z-10 h-8 justify-center">
                <ColorToolTip title="Rating" arrow>
                  <span
                    className="px-2 pt-1 text-slatyGrey cursor-pointer border-l border-r border-lightSilver"
                    onClick={() => setIsRatingOpen(true)}
                  >
                    <Rating_Star />
                  </span>
                </ColorToolTip>
                {selectedRowsCount === 1 && (
                  <ColorToolTip title="Comments" arrow>
                    <span
                      className="pl-2 pr-2 pt-1 cursor-pointer border-l border-lightSilver"
                      onClick={() => onComment(true, selectedRowId)}
                    >
                      <Comments />
                    </span>
                  </ColorToolTip>
                )}

                {selectedRowsCount === 1 && (
                  <ColorToolTip title="Error logs" arrow>
                    <span
                      className="pl-2 pr-2 pt-1 cursor-pointer border-l border-r border-lightSilver"
                      onClick={() => onErrorLog(true, selectedRowId)}
                    >
                      <ErrorLogs />
                    </span>
                  </ColorToolTip>
                )}
              </div>

              <div className="flex right-0 justify-end pr-3 pt-1 w-[55%]">
                <span className="text-gray-400 italic text-[14px] pl-2">
                  shift+click to select, esc to deselect all
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Datatable_CompletedTask;
