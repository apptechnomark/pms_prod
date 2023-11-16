import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useMemo, useState } from "react";
import {
  TablePagination,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";

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
  const [raisedInvoice, setRaisedInvoice] = useState<any>([]);
  const [selectedRowsWorkItemId, setSelectedRowsWorkItemId] = useState<any[]>(
    []
  );
  const [btcTime, setBTCTime] = useState<string>("0000-00-00T00:00:00");
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

  const saveBTCData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/billing/savebtc`,
        { selectedArray: arg1 },
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
          setBTCTime("0000-00-00T00:00:00");
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
    if (newValue !== null) {
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
                  IsBTC:
                    raisedInvoice.length > 0
                      ? raisedInvoice.filter(
                          (data: any, index: number) =>
                            data.workItemId ===
                            billingReportData[index].WorkItemId
                        )[0].IsBTC
                      : null,
                }
              : obj
          );
        } else {
          // If workItemId doesn't exist, add a new object
          return [
            ...prevData,
            {
              workItemId: workItemId,
              btcValue: toSeconds(
                `${newValue.$H}:${newValue.$m}:${newValue.$s}`
              ),
              IsBTC:
                raisedInvoice.length > 0
                  ? raisedInvoice.filter(
                      (data: any, index: number) =>
                        data.workItemId === billingReportData[index].WorkItemId
                    )[0].IsBTC
                  : null,
            },
          ];
        }
      });
      setRaisedInvoice([]);
    } else {
      setBTCTime("0000-00-00T00:00:00");
    }
  };

  useEffect(() => {
    getData(billingreport_InitialFilter);
  }, []);

  useEffect(() => hasBTCData(btcData.length > 0), [btcData]);

  // useEffect(() => isRaisingInvoice(raisedInvoice.length > 0), [raisedInvoice]);

  useEffect(() => {
    if (isSavingBTCData) {
      if (btcData.length > 0) {
        saveBTCData(btcData);
      }
      if (raisedInvoice.length > 0) {
        saveBTCData(raisedInvoice);
      }
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
          <span className="font-bold text-sm capitalize">client name</span>
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
          <span className="font-bold text-sm capitalize">project name</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
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
          <span className="font-bold text-sm capitalize">process name</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
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
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
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
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "PreparationDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Preparation Time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || "" ? "-" : value.split("T")[1]}
            </div>
          );
        },
      },
    },
    {
      name: "ReviewerDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Reviewer Time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || "" ? "-" : value.split("T")[1]}
            </div>
          );
        },
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
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
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
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
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
      name: "IsBTC",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Invoice Status</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="capitalize">
              {value === 0 ? "invoice pending" : "invoice raised"}
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
          <span className="font-bold text-sm capitalize">BTC time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {!billingReportData[tableMeta.rowIndex].IsBTC ? (
                editingRowIndex.includes(tableMeta.rowIndex) ? (
                  <TimeField
                    label="BTC Time"
                    value={btcTime}
                    inputProps={<TextField placeholder="00:00:00" />}
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
                      setEditingRowIndex([
                        ...editingRowIndex,
                        tableMeta.rowIndex,
                      ])
                    }
                    onBlur={() => setEditingRowIndex([])}
                  />
                )
              ) : (
                <TimeField
                  readOnly
                  label="BTC Time"
                  format="HH:mm:ss"
                  variant="standard"
                  value={
                    value === null || value === 0
                      ? dayjs("0000-00-00T00:00:00")
                      : dayjs(`0000-00-00T${value}`)
                  }
                />
              )}
            </LocalizationProvider>
          );
        },
      },
    },
  ];

  console.log("btc data", btcData);
  console.log("raised invoice", raisedInvoice);

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        columns={columns}
        data={billingReportData}
        title={undefined}
        options={{
          ...options,
          selectableRows: "multiple",
          onRowSelectionChange: (i: any, j: any, selectedRowsIndex: any) => {
            if (selectedRowsIndex.length > 0) {
              const data = selectedRowsIndex.map(
                (d: any) =>
                  new Object({
                    workItemId: billingReportData[d].WorkItemId,
                    btcValue:
                      btcData.length > 0
                        ? btcData.filter(
                            (data: any) =>
                              data.workItemId ===
                              billingReportData[d].WorkItemId
                          )[0].btcValue
                        : billingReportData[d].BTC,
                    IsBTC: true,
                  })
              );
              setRaisedInvoice(data);
            } else {
              setRaisedInvoice([]);
            }
          },
        }}
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
