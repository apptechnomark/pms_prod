import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";

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
        customHeadLabelRender: () => <span className="font-bold">Task ID</span>,
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => <span className="font-bold">Task</span>,
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Type",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => <span className="font-bold">Type</span>,
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Priority",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Priority</span>
        ),
        customBodyRender: (value: any) => {
          let isHighPriority;
          let isMediumPriority;
          let isLowPriority;

          if (value) {
            isHighPriority = value.toLowerCase() === "high";
            isMediumPriority = value.toLowerCase() === "medium";
            isLowPriority = value.toLowerCase() === "low";
          }

          return (
            <div>
              {value === null || value === "" ? (
                "-"
              ) : (
                <>
                  <div className="inline-block mr-1">
                    <div
                      className={`w-[10px] h-[10px] rounded-full inline-block mr-2 ${
                        isHighPriority
                          ? "bg-defaultRed"
                          : isMediumPriority
                          ? "bg-yellowColor"
                          : isLowPriority
                          ? "bg-primary"
                          : "bg-lightSilver"
                      }`}
                    ></div>
                  </div>
                  {value}
                </>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "Status",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => <span className="font-bold">Status</span>,
        customBodyRender: (value: any, tableMeta: any) => {
          const statusColorCode = tableMeta.rowData[9];
          return (
            <div>
              {value === null || value === "" ? (
                "-"
              ) : (
                <>
                  <div className="inline-block mr-3">
                    <div
                      className="w-[10px] h-[10px] rounded-full inline-block"
                      style={{ backgroundColor: statusColorCode }}
                    ></div>
                  </div>
                  {value}
                </>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "AssignedTo",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Assigned To</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
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
        customHeadLabelRender: () => (
          <span className="font-bold">Hours Logged</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Start Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || value === "") {
            return "-";
          }

          const startDate = new Date(value);
          const month = startDate.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const day = startDate.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedYear = startDate.getFullYear();
          const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

          return <div>{formattedDate}</div>;
        },
      },
    },
    {
      name: "DueDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Due Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || value === "") {
            return "-";
          }

          const startDate = new Date(value);
          const month = startDate.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const day = startDate.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedYear = startDate.getFullYear();
          const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

          return <div>{formattedDate}</div>;
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
