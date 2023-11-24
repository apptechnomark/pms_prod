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
import dayjs from "dayjs";

// common functions for datatable
import {
  genrateCustomHeaderName,
  generateCommonBodyRender,
  generateInitialTimer,
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

const User = ({ filteredData, searchValue }: any) => {
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
      getData({ ...filteredData, globalSearch: searchValue });
      setPage(0);
      setRowsPerPage(10);
      setDates(
        getDates(
          filteredData.startDate === null ? "" : filteredData.startDate,
          filteredData.endDate === null ? "" : filteredData.endDate
        )
      );
    } else {
      getData({ ...user_InitialFilter, globalSearch: searchValue });
    }
  }, [filteredData, searchValue]);

  const isWeekend = (date: any) => {
    const day = dayjs(date).day();
    return day === 6 || day === 0;
  };

  const columns: any[] = [
    {
      name: "UserName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("User Name"),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex flex-col">
              {value === null || "" ? (
                "-"
              ) : (
                <>
                  <span>{value}</span>
                  <span>{userData[tableMeta.rowIndex].DepartmentName}</span>
                </>
              )}
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
        customHeadLabelRender: () => genrateCustomHeaderName("Destination"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    ...dates.map(
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
              return isWeekend(date) ? (
                <span className="text-[#2323434D] text-xl">-</span>
              ) : (
                value !== undefined &&
                  (value.filter((v: any) => v.LogDate.split("T")[0] === date)
                    .length > 0 ? (
                    <span
                      style={{
                        color: getColor(
                          value.filter(
                            (v: any) => v.LogDate.split("T")[0] === date
                          )[0].AttendanceColor,
                          true
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
        customHeadLabelRender: () => genrateCustomHeaderName("Present Day"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TotalStdTimeOfUser",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("STd. Time"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalTimeSpentByUser",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Total Time"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalBreakTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () =>
          genrateCustomHeaderName("Total Break Time"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalIdleTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Total Idle Time"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateInitialTimer(value);
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
        options={{
          ...options,
          tableBodyHeight: "67vh",
        }}
      />
      <div className="w-full gap-5 flex items-center justify-center">
        <div className="my-4 flex gap-2 items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1DA543]"></span>
          <span className="text-sm font-normal capitalize">present</span>
        </div>
        <div className="my-4 flex gap-2 items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FB2424]"></span>
          <span className="text-sm font-normal capitalize">absent</span>
        </div>
        <div className="my-4 flex gap-2 items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary"></span>
          <span className="text-sm font-normal capitalize">half day</span>
        </div>
        <div className="my-4 flex gap-2 items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF9F43]"></span>
          <span className="text-sm font-normal capitalize">
            Incomplete hours
          </span>
        </div>
      </div>
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
