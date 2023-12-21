import React, { useEffect, useState } from "react";
import axios from "axios";

import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
// icons imports
import { toast } from "react-toastify";
import {
  handlePageChangeWithFilter,
  handleChangeRowsPerPageWithFilter,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { worklogs_Options } from "@/utils/datatable/TableOptions";
import { datatableWorklogCols } from "@/utils/datatable/columns/ClientDatatableColumns";
import WorklogActionbar from "./actionBar/WorklogActionbar";

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
  IsCompletedTaskPage: false,
  IsSignedOff: false,
};

const Datatable_Worklog = ({
  onEdit,
  onDrawerOpen,
  onDataFetch,
  onComment,
  currentFilterData,
  onSearchWorkTypeData,
  onCloseDrawer,
}: any) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [workItemData, setWorkItemData] = useState<any | any[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<any | number[]>([]);
  const [selectedRowStatusId, setSelectedRowStatusId] = useState<
    any | number[]
  >([]);
  const [selectedRowId, setSelectedRowId] = useState<any | number>(null);
  const [isCreatedByClient, setIsCreatedByClient] = useState<any | number>(
    null
  );
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);

  // for showing value according to search
  useEffect(() => {
    if (onSearchWorkTypeData) {
      setWorkItemData(onSearchWorkTypeData);
    } else {
      getWorkItemList();
    }
  }, [onSearchWorkTypeData]);

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
        ? selectedData.map((selectedRow: any) => selectedRow.WorkitemId)
        : [];
    setSelectedRowIds(selectedWorkItemIds);

    // adding only one or last selected id
    const lastSelectedWorkItemId =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].WorkitemId
        : null;
    setSelectedRowId(lastSelectedWorkItemId);

    // adding only one or last selected id
    const IsCreatedByClient =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].IsCreatedByClient
        : null;
    setIsCreatedByClient(IsCreatedByClient);

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

  useEffect(() => {
    setFilteredOject({ ...filteredObject, ...currentFilterData });
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
    if (!onCloseDrawer || onCloseDrawer === false) {
      handleClearSelection();
      setRowsPerPage(10);
    }
  }, [onCloseDrawer]);

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

  useEffect(() => {
    const fetchData = async () => {
      await getWorkItemList();
      onDataFetch(() => fetchData());
    };
    fetchData();
    getWorkItemList();
  }, []);

  const propsForActionBar = {
    selectedRowsCount,
    selectedRows,
    selectedRowStatusId,
    selectedRowId,
    selectedRowIds,
    onEdit,
    handleClearSelection,
    onComment,
    workItemData,
    getWorkItemList,
    isCreatedByClient,
  };

  return loaded ? (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={workItemData}
          columns={datatableWorklogCols}
          title={undefined}
          options={{
            ...worklogs_Options,
            selectAllRows: isPopupOpen && selectedRowsCount === 0,
            rowsSelected: selectedRows,
            textLabels: {
              body: {
                noMatch: (
                  <div className="flex items-center">
                    <span>
                      Currently no record found, you have to&nbsp;
                      <a
                        className="text-secondary underline cursor-pointer"
                        onClick={onDrawerOpen}
                      >
                        create
                      </a>{" "}
                      process/task.
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
          data-tableid="worklog_Datatable"
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

      {/* WorkLog's Action Bar */}
      <WorklogActionbar {...propsForActionBar} />
    </div>
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default Datatable_Worklog;
