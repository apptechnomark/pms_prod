import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  TablePagination,
  ThemeProvider,
} from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "@/utils/datatable/TableOptions";

//filter for user
import { user_InitialFilter } from "@/utils/reports/getFilters";

//common functions
import { getDates } from "@/utils/timerFunctions";
import { getColor } from "@/utils/reports/getColor";
import dayjs from "dayjs";

// common functions for datatable
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateInitialTimer,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { isWeekend } from "@/utils/commonFunction";

const User = ({ filteredData, searchValue, onHandleExport }: any) => {
  const [loaded, setLoaded] = useState<boolean>(false);
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
          onHandleExport(
            response.data.ResponseData.List.length > 0 ? true : false
          );
          setLoaded(true);
          setUserData(response.data.ResponseData.List);
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

  const generateUserNameBodyRender = (bodyValue: any, TableMeta: any) => {
    return (
      <div className="flex flex-col">
        {bodyValue === null || "" ? (
          "-"
        ) : (
          <>
            <span>{bodyValue}</span>
            <span>{userData[TableMeta.rowIndex].DepartmentName}</span>
          </>
        )}
      </div>
    );
  };

  const columns: any[] = [
    {
      name: "UserName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("User Name"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateUserNameBodyRender(value, tableMeta);
        },
      },
    },
    {
      name: "RoleType",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Destination"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Present Day"),
      },
    },
    {
      name: "TotalStdTimeOfUser",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("STd. Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalTimeSpentByUser",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Total Time"),
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
        customHeadLabelRender: () =>
          generateCustomHeaderName("Total Break Time"),
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
        customHeadLabelRender: () =>
          generateCustomHeaderName("Total Idle Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
  ];

  return loaded ? (
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
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default User;
