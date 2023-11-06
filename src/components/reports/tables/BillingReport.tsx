import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for billing report
import { billingreport_InitialFilter } from "@/utils/reports/getFilters";
import { toSeconds } from "@/utils/timerFunctions";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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

const BillingReport = ({
  filteredData,
  hasBTCData,
  isSavingBTCData,
  onSaveBTCDataComplete,
}: any) => {
  const [page, setPage] = useState<number>(0);
  const [btcData, setBTCData] = useState<any>([]);

  const [btcTime, setBTCTime] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);
  const [editingRowIndex, setEditingRowIndex] = useState<number[]>([]);
  const [billingReportData, setBiliingReportData] = useState<any>([]);

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/billing`,
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
          setBiliingReportData(response.data.ResponseData.List);
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

  const saveBTCData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/billing/savebtc`,
        { selectedArray: btcData },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          toast.success("BTC Data saved successfully!");
          onSaveBTCDataComplete(false);
          setBTCData([]);
          getData(
            filteredData !== null ? filteredData : billingreport_InitialFilter
          );
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

  const handleBTCData = (newValue: any, workItemId: any) => {
    setBTCData((prevData: any) => {
      const existingIndex = prevData.findIndex(
        (obj: any) => obj.workItemId === workItemId
      );

      if (existingIndex !== -1) {
        // If workItemId exists, update btcValue
        return prevData.map((obj: any, index: number) =>
          index === existingIndex
            ? {
                ...obj,
                btcValue: toSeconds(
                  `${newValue.$H}:${newValue.$m}:${newValue.$s}`
                ),
              }
            : obj
        );
      } else {
        // If workItemId doesn't exist, add a new object
        return [
          ...prevData,
          {
            workItemId: workItemId,
            btcValue: toSeconds(`${newValue.$H}:${newValue.$m}:${newValue.$s}`),
          },
        ];
      }
    });
  };

  useEffect(() => {
    getData(billingreport_InitialFilter);
  }, []);

  useEffect(() => hasBTCData(btcData.length > 0), [btcData]);

  useEffect(() => {
    if (isSavingBTCData) {
      saveBTCData();
    }
  }, [isSavingBTCData]);

  useEffect(() => {
    if (filteredData !== null) {
      getData(filteredData);
    }
  }, [filteredData]);

  const columns: any[] = [
    {
      name: "WorkItemId",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold capitalize">Task ID</span>
        ),
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">client name</span>
        ),
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">project name</span>
        ),
      },
    },
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">task name</span>
        ),
      },
    },
    {
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">process name</span>
        ),
      },
    },
    {
      name: "AssigneeName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">
            prepared/assignee
          </span>
        ),
      },
    },
    {
      name: "ReviewerName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">reviewer</span>
        ),
      },
    },
    {
      name: "TypeOfReturn",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">type of return</span>
        ),
      },
    },
    {
      name: "NoOfPages",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">no. of pages</span>
        ),
      },
    },
    {
      name: "EstimatedHour",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">total est. time</span>
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
      name: "StandardTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">total std. time</span>
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
      name: "TotalTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">actual time</span>
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
      name: "EditedHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">edited time</span>
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
      name: "BTC",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">btc time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {editingRowIndex.includes(tableMeta.rowIndex) ? (
                <TimeField
                  label="BTC Time"
                  value={btcTime}
                  onChange={(newValue: any) =>
                    handleBTCData(
                      newValue,
                      billingReportData[tableMeta.rowIndex].WorkItemId
                    )
                  }
                  format="HH:mm:ss"
                  variant="standard"
                />
              ) : (
                <TimeField
                  readOnly={editingRowIndex.includes(tableMeta.rowIndex)}
                  label="BTC Time"
                  format="HH:mm:ss"
                  variant="standard"
                  value={
                    value === null || value === 0
                      ? dayjs("0000-00-00T00:00:00")
                      : dayjs(`0000-00-00T${value}`)
                  }
                  onChange={(newValue: any) => setBTCTime(newValue)}
                  onClick={() =>
                    setEditingRowIndex([...editingRowIndex, tableMeta.rowIndex])
                  }
                  onBlur={() => setEditingRowIndex([])}
                />
              )}
            </LocalizationProvider>
          );
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        columns={columns}
        data={billingReportData}
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

export default BillingReport;
