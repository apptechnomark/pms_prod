import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import {
  CircularProgress,
  TablePagination,
  TextField,
  ThemeProvider,
} from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "@/utils/datatable/TableOptions";

//filter for billing report
import { billingreport_InitialFilter } from "@/utils/reports/getFilters";
import { toSeconds } from "@/utils/timerFunctions";

// common functions for datatable
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateInitialTimer,
  generateDateWithTime,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";

const BTCField = ({
  billingReportData,
  setBiliingReportData,
  handleBTCData,
  value,
  tableMeta,
}: any) => {
  const getFormattedTime = (newValue: any) => {
    if (newValue !== null) {
      const hours = isNaN(newValue.$H) ? "00" : newValue.$H;
      const minutes = isNaN(newValue.$m) ? "00" : newValue.$m;
      const seconds = isNaN(newValue.$s) ? "00" : newValue.$s;

      return `${hours}:${minutes}:${seconds}`;
    }
    return "00:00:00";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {!billingReportData[tableMeta.rowIndex].IsBTC ? (
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
                      BTC: getFormattedTime(newValue),
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
};

const BillingReport = ({
  filteredData,
  hasBTCData,
  hasRaisedInvoiceData,
  isSavingBTCData,
  onSaveBTCDataComplete,
  searchValue,
  onHandleExport,
}: any) => {
  const [loaded, setLoaded] = useState<boolean>(false);
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
      if (
        response.status === 200 &&
        response.data.ResponseStatus === "Success"
      ) {
        onHandleExport(
          response.data.ResponseData.List.length > 0 ? true : false
        );
        setLoaded(true);
        setBiliingReportData(response.data.ResponseData.List);
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
    } catch (error) {
      setLoaded(true);
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
          setTimeout(() => setBTCSaved(false), 100);
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
  }, [filteredData, searchValue]);

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

  const generateBTCFieldBodyRender = (bodyValue: any, TableMeta: any) => {
    return (
      <BTCField
        billingReportData={billingReportData}
        setBiliingReportData={setBiliingReportData}
        handleBTCData={handleBTCData}
        value={bodyValue}
        tableMeta={TableMeta}
      />
    );
  };

  const columns: any[] = [
    {
      name: "WorkItemId",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Task ID"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Client Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Project Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Task Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Process Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "AssigneeName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () =>
          generateCustomHeaderName("Prepared/Assignee"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ReviewerName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Reviewer"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "PreparationDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () =>
          generateCustomHeaderName("Preparation Date"),
        customBodyRender: (value: any) => {
          return generateDateWithTime(value);
        },
      },
    },
    {
      name: "ReviewerDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Reviewer Date"),
        customBodyRender: (value: any) => {
          return generateDateWithTime(value);
        },
      },
    },
    {
      name: "NoOfPages",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("No. of Pages"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "EstimatedHour",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Est. Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "Quantity",
      options: {
        sort: true,
        filter: true,
        customHeadLabelRender: () => generateCustomHeaderName("Qty."),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "StandardTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Std. Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "PreparationTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () =>
          generateCustomHeaderName("Preparation Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "ReviewerTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Reviewer Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalTime",
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
      name: "EditedHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Edited Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "IsBTC",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Invoice Status"),
        customBodyRender: (value: any, tableMeta: any) => {
          return value === 0 ? "Invoice Pending" : "Invoice Raised";
        },
      },
    },
    {
      name: "BTC",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("BTC Time"),
        customBodyRender: (value: any, tableMeta: any) => {
          return generateBTCFieldBodyRender(value, tableMeta);
        },
      },
    },
  ];

  return loaded ? (
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
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default BillingReport;
