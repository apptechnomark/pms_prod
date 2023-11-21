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

const User = ({ filteredData, onUserSearchData }: any) => {
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

  // setting data from search
  useEffect(() => {
    if (onUserSearchData) {
      setUserData(onUserSearchData);
    } else {
      getData(user_InitialFilter);
    }
  }, [onUserSearchData]);

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
      setDates(
        getDates(
          filteredData.startDate === null ? "" : filteredData.startDate,
          filteredData.endDate === null ? "" : filteredData.endDate
        )
      );
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">designation</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
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
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
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
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFC107]"></span>
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
