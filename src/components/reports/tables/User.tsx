import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for user
import { user_InitialFilter } from "@/utils/reports/getFilters";

//common functions
import { getDates } from "@/utils/timerFunctions";
import { getColor } from "@/utils/reports/getColor";

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

const User = ({ filteredData }: any) => {
  const [dates, setDates] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [userData, setUserData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/user`,
        { ...arg1 },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setUserData(response.data.ResponseData.List);
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
    getData(user_InitialFilter);
    setDates(getDates());
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
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">user name</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex flex-col">
              <span>{value}</span>
              <span>{userData[tableMeta.rowIndex].DepartmentName}</span>
            </div>
          );
        },
      },
    },
    {
      name: "RoleType",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">designation</span>
        ),
      },
    },
    ...dates.slice(-7).map(
      (date: any) =>
        new Object({
          name: "DateTimeLogs",
          options: {
            filter: true,
            sort: true,
            customHeadLabelRender: () => {
              const formattedDate = date.split("-");
              return (
                <span className="font-bold text-sm">
                  {`${formattedDate[2]}/${formattedDate[1]}/${formattedDate[0]}`}
                </span>
              );
            },
            customBodyRender: (value: any) => {
              return (
                value !== undefined &&
                (value.filter((v: any) => v.LogDate.split("T")[0] === date)
                  .length > 0 ? (
                  <span
                    style={{
                      color: getColor(
                        value.filter(
                          (v: any) => v.LogDate.split("T")[0] === date
                        )[0].AttendanceColor
                      ),
                    }}
                  >
                    {
                      value.filter(
                        (v: any) => v.LogDate.split("T")[0] === date
                      )[0].AttendanceStatus
                    }
                  </span>
                ) : (
                  <span className="text-defaultRed">A</span>
                ))
              );
            },
          },
        })
    ),
    {
      name: "PresentDays",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">present days</span>
        ),
      },
    },
    {
      name: "TotalStdTimeOfUser",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">std. time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 ? "00:00:00" : value}
            </div>
          );
        },
      },
    },
    {
      name: "TotalTimeSpentByUser",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">total time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 ? "00:00:00" : value}
            </div>
          );
        },
      },
    },
    {
      name: "TotalBreakTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">total break time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 ? "00:00:00" : value}
            </div>
          );
        },
      },
    },
    {
      name: "TotalIdleTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">total idle time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 ? "00:00:00" : value}
            </div>
          );
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        columns={columns}
        data={userData}
        title={undefined}
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

export default User;
