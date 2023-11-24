import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for userlogs
import { userLogs_InitialFilter } from "@/utils/reports/getFilters";

// common functions for datatable
import {
  genrateCustomHeaderName,
  generateCommonBodyRender,
  generateInitialTimer,
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

const UserLogs = ({ filteredData, searchValue }: any) => {
  const [page, setPage] = useState<number>(0);
  const [userlogsData, setUserlogsData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/userLog`,
        { ...arg1 },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: Org_Token,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setUserlogsData(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later");
          } else toast.error(data);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later");
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
    getData({ ...filteredData, pageNo: newPage + 1, pageSize: rowsPerPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    getData({
      ...filteredData,
      pageNo: 1,
      pageSize: event.target.value,
    });
  };

  useEffect(() => {
    getData(userLogs_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, globalSearch: searchValue });
      setPage(0);
      setRowsPerPage(10);
    } else {
      getData({ ...userLogs_InitialFilter, globalSearch: searchValue });
    }
  }, [filteredData]);

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
      name: "ReportingManager",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Reporting To"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "DepartmentName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Department"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "LoginTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Login"),
        customBodyRender: (value: any) => {
          return generateDateWithTime(value);
        },
      },
    },
    {
      name: "LogoutTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Logout"),
        customBodyRender: (value: any) => {
          return generateDateWithTime(value);
        },
      },
    },
    {
      name: "TotalIdleTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Idle Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalBreakTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Break Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalProductiveTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Productive Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "IsLoggedIn",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Is Logged In"),
        customBodyRender: (value: any) => {
          return value === 0 ? <div>No</div> : value === 1 && <div>Yes</div>;
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={undefined}
        columns={columns}
        data={userlogsData}
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

export default UserLogs;
