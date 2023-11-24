import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for audit
import { audit_InitialFilter } from "@/utils/reports/getFilters";

// common functions for datatable
import {
  genrateCustomHeaderName,
  generateCommonBodyRender,
  generateInitialTimer,
  generateDateWithoutTime,
  generateDateWithTime,
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

const Audit = ({ filteredData, searchValue }: any) => {
  const [page, setPage] = useState<number>(0);
  const [auditData, setAuditData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/audit`,
        { ...arg1 },
        { headers: { Authorization: `bearer ${token}`, org_token: Org_Token } }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setAuditData(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else toast.error(data);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else toast.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    getData({
      ...audit_InitialFilter,
      pageNo: newPage + 1,
      pageSize: rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    getData({
      ...audit_InitialFilter,
      pageNo: 1,
      pageSize: event.target.value,
    });
  };

  useEffect(() => {
    getData(audit_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, GlobalSearch: searchValue });
      setPage(0);
      setRowsPerPage(10);
    } else {
      getData({ ...audit_InitialFilter, GlobalSearch: searchValue });
    }
  }, [filteredData, searchValue]);

  const columns: any[] = [
    {
      name: "UserName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("User Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "DepartmentName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Department"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TaskCreatedDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () =>
          genrateCustomHeaderName("Task Created Date"),
        customBodyRender: (value: any) => {
          return generateDateWithoutTime(value);
        },
      },
    },
    {
      name: "LoginTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Login Time"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateDateWithTime(value);
        },
      },
    },
    {
      name: "LogoutTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Logout Time"),
        customBodyRender: (value: any) => {
          return generateDateWithTime(value);
        },
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Client Name"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Project Name"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Process Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "SubProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () =>
          genrateCustomHeaderName("Sub Process Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "StandardTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Std. Time"),
      },
      customBodyRender: (value: any) => {
        return generateInitialTimer(value);
      },
    },
    {
      name: "TotalTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Total Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalBreakTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Break Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalIdleTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Idle Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={undefined}
        columns={columns}
        data={auditData}
        options={options}
      />
      <TablePagination
        component="div"
        count={tableDataCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  );
};

export default Audit;
