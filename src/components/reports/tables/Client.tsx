import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for client
import { client_project_InitialFilter } from "@/utils/reports/getFilters";

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

const Client = ({ filteredData }: any) => {
  const [page, setPage] = useState<number>(0);
  const [clientData, setClientData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/client`,
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
          setClientData(response.data.ResponseData.List);
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
    getData(client_project_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData(filteredData);
    }
  }, [filteredData]);

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
      name: "WorkType",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Type of Work"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "BillingType",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Billing Type"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "InternalHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Internal Hours"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "ContractedHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Cont. Hours"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "StandardTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Std. Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "EditHours",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Edited Hours"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Total Time"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "DifferenceTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Differences"),
        customBodyRender: (value: any) => {
          return generateInitialTimer(value);
        },
      },
    },
    {
      name: "ContractedDifference",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Cont. Diff"),
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
        data={clientData}
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

export default Client;
