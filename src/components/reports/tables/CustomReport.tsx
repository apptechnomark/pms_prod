import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";
import { customreport_InitialFilter } from "@/utils/reports/getFilters";
import { haveSameData } from "@/utils/reports/commonFunctions";

// common functions for datatable
import {
  genrateCustomHeaderName,
  generateCommonBodyRender,
  generateInitialTimer,
  generateDateWithoutTime,
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

const CustomReport = ({ filteredData, searchValue }: any) => {
  const [page, setPage] = useState<number>(0);
  const [customReportData, setCustomReportData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/custom`,
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
          setCustomReportData(response.data.ResponseData.List);
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
    if (filteredData !== null) {
      if (!haveSameData(customreport_InitialFilter, filteredData)) {
        getData({
          ...filteredData,
          pageNo: newPage + 1,
          pageSize: rowsPerPage,
        });
      }
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    if (filteredData !== null) {
      if (!haveSameData(customreport_InitialFilter, filteredData)) {
        getData({
          ...filteredData,
          pageNo: 1,
          pageSize: event.target.value,
        });
      }
    }
  };

  useEffect(() => {
    if (filteredData !== null) {
      if (haveSameData(customreport_InitialFilter, filteredData)) {
        setCustomReportData([]);
        setTableDataCount(0);
      } else {
        getData({ ...filteredData, globalSearch: searchValue });
      }
    }
  }, [filteredData, searchValue]);

  const columns: any[] = [
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Client Name"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Project Name"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Task Name"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Process Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "AssignedBy",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Assigned By"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Assignee"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Reviewer"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TaxReturnType",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Return Type"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TypeOfReturnName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Type of Return"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "NoOfPages",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("No. of Pages"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ReturnYear",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Return Year"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "CurrentYear",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Current Year"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "Complexity",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Complexity"),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "-"
                : value === 1
                ? "Moderate"
                : value === 2
                ? "Intermediate"
                : value === 3
                ? "Complex"
                : "-"}
            </div>
          );
        },
      },
    },
    {
      name: "priority",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Priority"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ReceiverDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Recieved Date"),
        customBodyRender: (value: any) => {
          return generateDateWithoutTime(value);
        },
      },
    },
    {
      name: "DueDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Due Date"),
        customBodyRender: (value: any) => {
          return generateDateWithoutTime(value);
        },
      },
    },
    {
      name: "AllInfoDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("All Info Date"),
        customBodyRender: (value: any) => {
          return generateDateWithoutTime(value);
        },
      },
    },
    {
      name: "TotalEstimatedHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Total Est. Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "TotalSTDHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Total Std. Time"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Actual Time"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Edited Hours"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        columns={columns}
        data={customReportData}
        title={undefined}
        options={{
          ...options,
          textLabels: {
            body: {
              noMatch: (
                <div className="flex items-start">
                  <span>
                    {filteredData === null
                      ? "Please apply filter to view data."
                      : "Currently there is no record available."}
                  </span>
                </div>
              ),
              toolTip: "",
            },
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

export default CustomReport;
