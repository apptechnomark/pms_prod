import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";
import { customreport_InitialFilter } from "@/utils/reports/getFilters";

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

const haveSameData = function (obj1: any, obj2: any) {
  const obj1Length = Object.keys(obj1).length;
  const obj2Length = Object.keys(obj2).length;

  if (obj1Length === obj2Length) {
    return Object.keys(obj1).every(
      (key) => obj2.hasOwnProperty(key) && obj2[key] === obj1[key]
    );
  }
  return false;
};

const CustomReport = ({ filteredData }: any) => {
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

  // useEffect(() => {
  //   getData(client_project_InitialFilter);
  // }, []);

  useEffect(() => {
    if (filteredData !== null) {
      if (haveSameData(customreport_InitialFilter, filteredData)) {
        setCustomReportData([]);
        setTableDataCount(0);
      } else {
        getData(filteredData);
      }
    }
  }, [filteredData]);

  const columns: any[] = [
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize ">client name</span>
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
      name: "AssignedBy",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">assign by</span>
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
          <span className="font-bold text-sm capitalize">assignee</span>
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
      name: "TaxReturnType",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">return type</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "TypeOfReturnName",
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
      name: "ReturnYear",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">return year</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "CurrentYear",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">current year</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "Complexity",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">complexity</span>
        ),
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">priority</span>
        ),
        customBodyRender: (value: any) => {
          return <div>{value === null || value === "" ? "-" : value}</div>;
        },
      },
    },
    {
      name: "ReceiverDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">received date</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "-"
                : value.split("T")[0]}
            </div>
          );
        },
      },
    },
    {
      name: "DueDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">due date</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "-"
                : value.split("T")[0]}
            </div>
          );
        },
      },
    },
    {
      name: "AllInfoDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm capitalize">all info date</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <div className="flex items-center gap-2">
              {value === null || value === 0 || value === ""
                ? "-"
                : value.split("T")[0]}
            </div>
          );
        },
      },
    },
    {
      name: "TotalEstimatedHours",
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
      name: "TotalSTDHours",
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
          <span className="font-bold text-sm capitalize">edited hours</span>
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