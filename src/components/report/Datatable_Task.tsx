import { ThemeProvider } from "@emotion/react";
import { CircularProgress, createTheme } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generatePriorityWithColor,
  generateStatusWithColor,
} from "@/utils/datatable/CommonFunction";
import { useRouter } from "next/navigation";
import { handleLogoutUtil } from "@/utils/commonFunction";
import { callAPI } from "@/utils/API/callAPI";

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

const Datatable_Task = ({
  currentFilterData,
  onSearchData,
  onHandleExport,
}: any) => {
  const router = useRouter();

  const [allFields, setAllFields] = useState<any>({
    loaded: false,
    taskData: [],
    filteredObject: initialFilter,
    page: 0,
    rowsPerPage: pageSize,
    tableDataCount: 0,
  });

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setAllFields({
      ...allFields,
      filteredObject: { ...allFields.filteredObject, PageNo: newPage + 1 },
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAllFields({
      ...allFields,
      filteredObject: {
        ...allFields.filteredObject,
        PageNo: 1,
        PageSize: event.target.value,
      },
    });
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchData) {
      setAllFields({
        ...allFields,
        taskData: onSearchData,
      });
    } else {
      getTaskList();
    }
  }, [onSearchData]);

  // TaskList API
  const getTaskList = async () => {
    const params = allFields.filteredObject;
    const url = `${process.env.report_api_url}/report/client/task`;
    const successCallback = (ResponseData: any, error: any) => {
      if (ResponseData !== null && error === false) {
        onHandleExport(ResponseData.List.length > 0);
        setAllFields({
          ...allFields,
          loaded: true,
          taskData: ResponseData.List,
          tableDataCount: ResponseData.TotalCount,
        });
      } else {
        setAllFields({
          ...allFields,
          loaded: false,
        });
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  // const getTaskList = async () => {
  //   const token = await localStorage.getItem("token");
  //   const Org_Token = await localStorage.getItem("Org_Token");

  //   try {
  //     const { data, status } = await axios.post(
  //       `${process.env.report_api_url}/report/client/task`,
  //       allFields.filteredObject,
  //       {
  //         headers: {
  //           Authorization: `bearer ${token}`,
  //           org_token: `${Org_Token}`,
  //         },
  //       }
  //     );

  //     if (status === 200) {
  //       const { ResponseStatus, ResponseData } = data;

  //       if (ResponseStatus === "Success") {
  //         onHandleExport(ResponseData.List.length > 0);
  //         setAllFields({
  //           ...allFields,
  //           loaded: true,
  //           taskData: ResponseData.List,
  //           tableDataCount: ResponseData.TotalCount,
  //         });
  //       } else {
  //         handleErrorResponse(data);
  //       }
  //     } else {
  //       handleErrorResponse(data);
  //     }
  //   } catch (error: any) {
  //     setAllFields({
  //       ...allFields,
  //       loaded: false,
  //     });
  //     if (error.response?.status === 401) {
  //       router.push("/login");
  //       handleLogoutUtil();
  //     }
  //   }
  // };

  const handleErrorResponse = (data: { Message: string }) => {
    setAllFields({
      ...allFields,
      loaded: false,
    });
    const errorMessage = data.Message || "Please try again later.";
    toast.error(errorMessage);
  };

  useEffect(() => {
    setAllFields({
      ...allFields,
      filteredObject: { ...allFields.filteredObject, ...currentFilterData },
    });
  }, [currentFilterData]);

  useEffect(() => {
    getTaskList();
  }, [allFields.filteredObject]);

  // Table Columns
  const columns = [
    {
      name: "WorkItemId",
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
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Process"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Type"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Priority"),
        customBodyRender: (value: any) => generatePriorityWithColor(value),
      },
    },
    {
      name: "Status",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Status"),
        customBodyRender: (value: any, tableMeta: any) =>
          generateStatusWithColor(value, tableMeta.rowData[11]),
      },
    },
    {
      name: "AssignedTo",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Assigned To"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Hours Logged"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Start Date"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Due Date"),
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

  return allFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        data={allFields.taskData}
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
        count={allFields.tableDataCount}
        page={allFields.page}
        onPageChange={handleChangePage}
        rowsPerPage={allFields.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default Datatable_Task;
