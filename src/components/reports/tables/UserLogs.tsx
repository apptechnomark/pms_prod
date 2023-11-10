import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for userlogs
import { userLogs_InitialFilter } from "@/utils/reports/getFilters";

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

const UserLogs = ({ filteredData }: any) => {
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
      getData(filteredData);
    }
  }, [filteredData]);

  const columns: any[] = [
    {
      name: "UserName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">user name</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ReportingManager",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">reporting to</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "DepartmentName",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">department</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "LoginTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">login</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div>
              {value === 0 || value === "0" || value === null
                ? "-"
                : value.split("T")[0]}
            </div>
          );
        },
      },
    },
    {
      name: "LogoutTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">logout</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div>
              {value === 0 || value === "0" || value === null
                ? "-"
                : value.split("T")[0]}
            </div>
          );
        },
      },
    },
    {
      name: "TotalIdleTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">idle time</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div>
              {value === 0 || value === "0" || value === null
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "TotalBreakTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">break time</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div>
              {value === 0 || value === "0" || value === null
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "TotalProductiveTime",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">productive time</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div>
              {value === 0 || value === "0" || value === null
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "IsLoggedIn",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">is logged in?</span>
        ),
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
