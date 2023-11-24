import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import {
  genrateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generatePriorityWithColor,
  generateStatusWithColor,
} from "@/utils/datatable/CommonFunction";

const getMuiTheme = () =>
  createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: "#F6F6F6",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          },
        },
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          root: {
            overflowX: "auto",
            whiteSpace: "nowrap",
          },
        },
      },
    },
  });

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  PageNo: pageNo,
  PageSize: pageSize,
  GlobalSearch: null,
  IsDesc: false,
  SortColumn: null,
  Priority: null,
  StatusFilter: null,
  OverDueBy: 1,
  WorkType: null,
  AssignedIdsForFilter: [],
  ProjectIdsForFilter: [],
  StartDate: null,
  EndDate: null,
  IsDownload: false,
};

const Datatable_Task = ({ currentFilterData, onSearchData }: any) => {
  const [taskData, setTaskData] = useState<any>([]);
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    setFilteredOject({ ...filteredObject, PageNo: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setFilteredOject({
      ...filteredObject,
      PageNo: 1,
      PageSize: event.target.value,
    });
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchData) {
      setTaskData(onSearchData);
    } else {
      getTaskList();
    }
  }, [onSearchData]);

  // TaskList API
  const getTaskList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/client/task`,
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
          setTaskData(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
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
    setFilteredOject({ ...filteredObject, ...currentFilterData });
  }, [currentFilterData]);

  useEffect(() => {
    getTaskList();
  }, [filteredObject]);

  // Table Columns
  const columns = [
    {
      name: "WorkItemId",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Task ID"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Project"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Task"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Process"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "Type",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Type"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "Priority",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Priority"),
        customBodyRender: (value: any) => generatePriorityWithColor(value),
      },
    },
    {
      name: "Status",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Status"),
        customBodyRender: (value: any, tableMeta: any) =>
          generateStatusWithColor(value, tableMeta.rowData[11]),
      },
    },
    {
      name: "AssignedTo",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Assigned To"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    // {
    //   name: "",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customHeadLabelRender: () => (
    //       <span className="font-bold">MONTH CLOSE</span>
    //     ),
    // customBodyRender: (value: any) => {
    //   return <div>{value === null || value === "" ? "-" : value}</div>;
    // },
    //   },
    // },
    {
      name: "HoursLogged",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Hours Logged"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Start Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "DueDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Due Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "ColorCode",
      options: {
        display: false,
      },
    },
  ];

  // Table Customization Options
  const options: any = {
    responsive: "standard",
    tableBodyHeight: "73vh",
    viewColumns: false,
    filter: false,
    print: false,
    download: false,
    search: false,
    selectToolbarPlacement: "none",
    selectableRows: "none",
    elevation: 0,
    pagination: false,
  };

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        data={taskData}
        columns={columns}
        title={undefined}
        options={{
          ...options,
        }}
        data-tableid="task_Report_Datatable"
      />
      <TablePagination
        component="div"
        // rowsPerPageOptions={[5, 10, 15]}
        count={tableDataCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  );
};

export default Datatable_Task;
