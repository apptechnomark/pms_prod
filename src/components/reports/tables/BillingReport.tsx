import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
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
  hasRaisedInvoiceData,
  isSavingBTCData,
  onSaveBTCDataComplete,
  searchValue,
}: any) => {
  const [page, setPage] = useState<number>(0);
  const [btcData, setBTCData] = useState<any>([]);
  const [raisedInvoice, setRaisedInvoice] = useState<any>([]);
  const [finalBTCData, setFinalBTCData] = useState<any>([]);
  const [isBTCSaved, setBTCSaved] = useState<boolean>(false);

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

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
          setBTCSaved(true);
          onSaveBTCDataComplete(false);
          setBTCData([]);
          setRaisedInvoice([]);
          setFinalBTCData([]);
          getData(
            filteredData !== null ? filteredData : billingreport_InitialFilter
          );
          toast.success("BTC Data saved successfully!");
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
              IsBTC: false,
            },
          ];
        }
      });
    }
  };

  const mergeBTCDataAndRaisedInvoiceArrays = (array1: any, array2: any) => {
    const map = new Map();

    array1.forEach((item: any) => {
      map.set(item.workItemId, item);
    });

    array2.forEach((item: any) => {
      const existingItem = map.get(item.workItemId);

      if (existingItem) {
        existingItem.btcValue = existingItem.btcValue || item.btcValue;
        existingItem.IsBTC = true;
      } else {
        map.set(item.workItemId, item);
      }
    });

    const mergedArray = Array.from(map.values());

    return mergedArray;
  };

  //useEffect for getting data of billing report table
  useEffect(() => {
    getData(billingreport_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, globalSearch: searchValue });
      setPage(0);
      setRowsPerPage(10);
    } else {
      getData({ ...billingreport_InitialFilter, globalSearch: searchValue });
    }
  }, [filteredData]);

  //handling btcData as well as raisedInvoice props
  useEffect(
    () => hasBTCData(btcData.length > 0 && raisedInvoice.length === 0),
    [btcData, raisedInvoice]
  );

  useEffect(
    () => hasRaisedInvoiceData(raisedInvoice.length > 0),
    [raisedInvoice]
  );

  //handling saveBTCData api call
  useEffect(() => {
    if (isSavingBTCData) {
      saveBTCData(finalBTCData);
    }
  }, [isSavingBTCData]);

  //handling the merge of btcData & raisedInvoice
  useEffect(() => {
    setFinalBTCData(mergeBTCDataAndRaisedInvoiceArrays(btcData, raisedInvoice));
  }, [btcData, raisedInvoice]);

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
          <span className="font-bold text-sm capitalize">Preparation Date</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || "" ? (
                "-"
              ) : (
                <>
                  {value.split("T")[0]}&nbsp;
                  {value.split("T")[1]}
                </>
              )}
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
          <span className="font-bold text-sm capitalize">Reviewer Date</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || "" ? (
                "-"
              ) : (
                <>
                  {value.split("T")[0]}&nbsp;
                  {value.split("T")[1]}
                </>
              )}
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
          <span className="font-bold text-sm capitalize">est. time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "Quantity",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Qty.</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "StandardTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">std. time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "PreparationTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Preparation Time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "00:00:00"
                : value}
            </div>
          );
        },
      },
    },
    {
      name: "ReviewerTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">Reviewer Time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "00:00:00"
                : value}
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
          <span className="font-bold text-sm capitalize">Total time</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "00:00:00"
                : value}
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
                // <TextField
                //   label="BTC Time"
                //   placeholder="00:00:00"
                //   variant="standard"
                //   fullWidth
                //   value={
                //     billingReportData[tableMeta.rowIndex].BTC === null ||
                //     billingReportData[tableMeta.rowIndex].BTC === 0
                //       ? "00:00:00"
                //       : value
                //   }
                //   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                //     let newValue = event.target.value;
                //     newValue = newValue.replace(/[^0-9]/g, "");
                //     // if (newValue.length > 8) {
                //     //   return;
                //     // }

                //     let formattedValue = "";
                //     if (newValue.length >= 1) {
                //       const hours = parseInt(newValue.slice(0, 2));
                //       if (hours >= 0 && hours <= 23) {
                //         formattedValue = newValue.slice(0, 2);
                //       } else {
                //         formattedValue = "23";
                //       }
                //     }

                //     if (newValue.length >= 3) {
                //       const minutes = parseInt(newValue.slice(2, 4));
                //       if (minutes >= 0 && minutes <= 59) {
                //         formattedValue += ":" + newValue.slice(2, 4);
                //       } else {
                //         formattedValue += ":59";
                //       }
                //     }

                //     if (newValue.length >= 5) {
                //       const seconds = parseInt(newValue.slice(4, 6));
                //       if (seconds >= 0 && seconds <= 59) {
                //         formattedValue += ":" + newValue.slice(4, 6);
                //       } else {
                //         formattedValue += ":59";
                //       }
                //     }

                //     // Convert formattedValue to seconds
                //     let totalSeconds = 0;

                //     if (formattedValue) {
                //       const timeComponents = formattedValue.split(":");
                //       const hours = parseInt(timeComponents[0]);
                //       const minutes = parseInt(timeComponents[1]);
                //       const seconds = parseInt(timeComponents[2]);
                //       totalSeconds = hours * 3600 + minutes * 60 + seconds;
                //     }

                //     console.log(formattedValue);
                //   }}
                // />
                <TimeField
                  label="BTC Time"
                  value={
                    billingReportData[tableMeta.rowIndex].BTC === null ||
                    billingReportData[tableMeta.rowIndex].BTC === 0
                      ? dayjs("0000-00-00T00:00:00")
                      : dayjs(`0000-00-00T${value}`)
                  }
                  onChange={(newValue: any) => {
                    setBiliingReportData((prevData: any) =>
                      prevData.map((data: any, index: number) =>
                        index === tableMeta.rowIndex
                          ? {
                              ...data,
                              BTC:
                                newValue !== null
                                  ? `${
                                      isNaN(newValue.$H) ? "00" : newValue.$H
                                    }:${
                                      isNaN(newValue.$m) ? "00" : newValue.$m
                                    }:${
                                      isNaN(newValue.$s) ? "00" : newValue.$s
                                    }`
                                  : // `${newValue.$H}:${newValue.$m}:${newValue.$s}`
                                    "00:00:00",
                            }
                          : { ...data }
                      )
                    );
                    handleBTCData(
                      newValue,
                      billingReportData[tableMeta.rowIndex].WorkItemId
                    );
                  }}
                  format="HH:mm:ss"
                  variant="standard"
                />
              ) : (
                <TextField
                  disabled
                  label="BTC Time"
                  placeholder="00:00:00"
                  variant="standard"
                  fullWidth
                  value={value === null || value === 0 ? "00:00:00" : value}
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
        options={{
          ...options,
          selectableRows: "multiple",
          rowsSelected: isBTCSaved ? [] : undefined,
          onRowSelectionChange: (i: any, j: any, selectedRowsIndex: any) => {
            if (selectedRowsIndex.length > 0) {
              const data = selectedRowsIndex.map(
                (d: any) =>
                  new Object({
                    workItemId: billingReportData[d].WorkItemId,
                    btcValue:
                      billingReportData[d].BTC !== null
                        ? toSeconds(billingReportData[d].BTC)
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
