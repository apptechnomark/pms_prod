import axios from "axios";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import {
  Popover,
  TablePagination,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for client
import { timeSheet_InitialFilter } from "@/utils/reports/getFilters";

//common function
import { getDates, toSeconds } from "@/utils/timerFunctions";
import { getColor } from "@/utils/reports/getColor";

//icons
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import dayjs from "dayjs";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@/assets/icons/reports/CloseIcon";
import { Transition } from "../Filter/Transition/Transition";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "12px",
  },
  bar1: {
    backgroundColor: "#0CC6AA",
  },
  bar2: {
    backgroundColor: "#FDB663",
  },
  bar3: {
    backgroundColor: "#2323434D",
  },
}));

const CustomProgressBar = ({
  totalTimeSpentForDay,
  trackedTime,
  manualTime,
  breakTime,
}: any) => {
  const classes = useStyles();

  const trackedTimePercent = Math.round(
    ((toSeconds(trackedTime)?.valueOf() ?? 0) /
      (toSeconds(totalTimeSpentForDay)?.valueOf() ?? 1)) *
      100
  );
  const manualTimePercent = Math.round(
    ((toSeconds(manualTime)?.valueOf() ?? 0) /
      (toSeconds(totalTimeSpentForDay)?.valueOf() ?? 1)) *
      100
  );
  const breakTimePercent = Math.round(
    ((toSeconds(breakTime)?.valueOf() ?? 0) /
      (toSeconds(totalTimeSpentForDay)?.valueOf() ?? 1)) *
      100
  );

  return (
    <div className={classes.root}>
      <div
        style={{
          width: `${trackedTimePercent}%`,
        }}
        className={classes.bar1}
      ></div>
      <div
        style={{
          width: `${manualTimePercent}%`,
        }}
        className={classes.bar2}
      ></div>
      <div
        style={{
          width: `${breakTimePercent}%`,
        }}
        className={classes.bar3}
      ></div>
    </div>
  );
};

const DateWiseLogsContent = ({ data, date, tableMeta }: any) => {
  const dateWiseLogsTable = useRef<HTMLDivElement>(null);
  const [clickedColumnIndex, setClickedColumnIndex] = useState<number>(-1);
  const [showDateWiseLogs, setShowDateWiseLogs] = useState<boolean>(false);
  const [dateWiseLogsData, setDateWiseLogsData] = useState<any[]>([]);

  const [anchorElFilter, setAnchorElFilter] =
    useState<HTMLButtonElement | null>(null);
  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const datewiselogsColumn: any = [
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">Task</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">client</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">project</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">task/process</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "SubProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">sub process</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "IsManual",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">is manual</div>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return <span className="capitalize">{value ? "yes" : "no"}</span>;
        },
      },
    },
    {
      name: "Description",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">description</div>
        ),
      },
    },
    {
      name: "EstimateTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">estimated time</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Status",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">status</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Quantity",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">qty.</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "StartTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">start date</div>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return <span>{value && value.split("T")[0]}</span>;
        },
      },
    },
    {
      name: "EndTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">end date</div>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return <span>{value && value.split("T")[0]}</span>;
        },
      },
    },
    {
      name: "TotalStandardTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">std time</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "IsManual",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize !w-[100px]">
            total time
          </div>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <span>
              {!value
                ? dateWiseLogsData[0].LogsDetails[tableMeta.rowIndex]
                    .TotalTrackedTimeLogHrs
                : dateWiseLogsData[0].LogsDetails[tableMeta.rowIndex]
                    .TotalManualTimeLogHrs}
            </span>
          );
        },
      },
    },
    {
      name: "ReviewerStatus",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize">reviewer status</div>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
  ];

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        dateWiseLogsTable.current &&
        !dateWiseLogsTable.current.contains(event.target)
      ) {
        setShowDateWiseLogs(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div
        ref={dateWiseLogsTable}
        style={{
          color: getColor(
            data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
              .AttendanceColor
          ),
        }}
        className={`relative flex flex-col gap-[5px] ${
          data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
            .AttendanceColor !== 5
            ? "cursor-pointer"
            : "cursor-default"
        }`}
        onClick={() => {
          setClickedColumnIndex(tableMeta.columnIndex);
          setShowDateWiseLogs(!showDateWiseLogs);
          setDateWiseLogsData(
            data.filter((v: any) => v.LogDate.split("T")[0] === date)
          );
        }}
      >
        <span>
          {
            data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
              .AttendanceStatus
          }
        </span>
        {(data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
          .AttendanceColor === 1 ||
          data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
            .AttendanceColor === 2 ||
          data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
            .AttendanceColor === 3 ||
          data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
            .AttendanceColor === 4) && (
          <>
            <CustomProgressBar
              totalTimeSpentForDay={
                data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
                  .TotalTimeSpentForDay
              }
              trackedTime={
                data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
                  .TotalTrackedTimeLogHrsForDay
              }
              manualTime={
                data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
                  .TotalManualTimeLogHrsForDay
              }
              breakTime={
                data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
                  .TotalBreakTime
              }
            />
            <div className="flex items-center justify-between">
              <span>
                {
                  data.filter((v: any) => v.LogDate.split("T")[0] === date)[0]
                    .TotalTimeSpentForDay
                }
              </span>
              <ChevronDownIcon />
            </div>
          </>
        )}
      </div>
      <Popover
        sx={{ width: "60%" }}
        id={idFilter}
        open={showDateWiseLogs && tableMeta.columnIndex === clickedColumnIndex}
        anchorEl={anchorElFilter}
        TransitionComponent={Transition}
        onClose={() => setShowDateWiseLogs(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="my-4 px-4 w-full flex items-center justify-end">
          <div
            className="cursor-pointer"
            onClick={() => setShowDateWiseLogs(false)}
          >
            <CloseIcon />
          </div>
        </div>
        <MUIDataTable
          title={undefined}
          columns={datewiselogsColumn}
          data={
            dateWiseLogsData.length > 0 ? dateWiseLogsData[0].LogsDetails : []
          }
          options={{ ...options, tableBodyHeight: "350px" }}
        />
      </Popover>
    </>
  );
};

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

const TimeSheet = ({ filteredData, onTimesheetSearchData }: any) => {
  const [page, setPage] = useState<number>(0);
  const [dates, setDates] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [timesheetData, setTimesheetData] = useState<any>([]);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const [anchorElFilter, setAnchorElFilter] =
    useState<HTMLButtonElement | null>(null);
  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  // getting timesheet data by search
  useEffect(() => {
    if (onTimesheetSearchData) {
      setTimesheetData(onTimesheetSearchData);
    } else {
      getData(timeSheet_InitialFilter);
    }
  }, [onTimesheetSearchData]);

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/timesheet`,
        { ...arg1 },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_Token: Org_Token,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setTimesheetData(response.data.ResponseData.List);
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

  //functions for handling pagination
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
    getData(timeSheet_InitialFilter);
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
        customHeadLabelRender: () => (
          <div className="font-bold text-sm capitalize !w-[100px]">
            user name
          </div>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex flex-col">
              <span>{value}</span>
              <span>{timesheetData[tableMeta.rowIndex].DepartmentName}</span>
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
    {
      name: "ReportingManager",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">
            Reporting Manager
          </span>
        ),
      },
    },
    {
      name: "StdShiftHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Std Shift Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === "0"
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "PresentDays",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Present Days</span>
        ),
      },
    },
    {
      name: "TotalTimeSpentByUser",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Total time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === "0"
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "RejectedHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Rejected Hours</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === "0"
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "TotalStandardTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">std time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === "0"
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "AvgTotalTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">
            Average Total Time
          </span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === "0"
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "AvgBreakTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">
            Average Break Time
          </span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === "0"
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "AvgIdleTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">
            Average Idle Time
          </span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === "0"
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    ...dates.map(
      (date: any) =>
        new Object({
          name: "DateWiseLogs",
          options: {
            filter: true,
            sort: true,
            customHeadLabelRender: () => {
              const formattedDate = date.split("-");
              return (
                <span className={`font-bold text-sm`}>
                  {`${formattedDate[1]}/${formattedDate[2]}/${formattedDate[0]}`}
                </span>
              );
            },
            customBodyRender: (value: any, tableMeta: any) => {
              return isWeekend(date) ? (
                <span className="text-[#2323434D] text-xl">-</span>
              ) : (
                value !== undefined &&
                  (value.filter((v: any) => v.LogDate.split("T")[0] === date)
                    .length > 0 ? (
                    <DateWiseLogsContent
                      data={value}
                      date={date}
                      tableMeta={tableMeta}
                    />
                  ) : (
                    <span className="text-defaultRed">A</span>
                  ))
              );
            },
          },
        })
    ),
    {
      name: "TotalIdleTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Total Idle Time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === "0"
                ? "00:00:00"
                : value}
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
        data={timesheetData}
        title={undefined}
        options={{
          ...options,
          tableBodyHeight: "67vh",
        }}
      />
      <div className="w-full gap-5 flex items-center justify-center">
        <div className="my-4 flex gap-2 items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0CC6AA]"></span>
          <span className="text-sm font-normal capitalize">Tracker Time</span>
        </div>
        <div className="my-4 flex gap-2 items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FDB663]"></span>
          <span className="text-sm font-normal capitalize">manual time</span>
        </div>
        <div className="my-4 flex gap-2 items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2323434D]"></span>
          <span className="text-sm font-normal capitalize">break time</span>
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

export default TimeSheet;
