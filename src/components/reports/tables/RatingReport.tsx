import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  Rating,
  TablePagination,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "./Options/Options";

//filter for audit
import { rating_InitialFilter } from "@/utils/reports/getFilters";

// common functions for datatable
import {
  genrateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
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

const RatingReport = ({ filteredData, searchValue }: any) => {
  const [page, setPage] = useState<number>(0);
  const [ratingData, setRatingData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const getData = async (arg1: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/admin/rating`,
        { ...arg1 },
        { headers: { Authorization: `bearer ${token}`, org_token: Org_Token } }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          setRatingData(response.data.ResponseData.List);
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

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    if (filteredData !== null) {
      getData({ ...filteredData, pageNo: newPage + 1, pageSize: rowsPerPage });
    } else {
      getData({
        ...rating_InitialFilter,
        pageNo: newPage + 1,
        pageSize: rowsPerPage,
      });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    if (filteredData !== null) {
      getData({ ...filteredData, pageNo: 1, pageSize: rowsPerPage });
    } else {
      getData({
        ...rating_InitialFilter,
        pageNo: 1,
        pageSize: rowsPerPage,
      });
    }
  };

  useEffect(() => {
    getData(rating_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, GlobalSearch: searchValue });
      setPage(0);
      setRowsPerPage(10);
    } else {
      getData({ ...rating_InitialFilter, GlobalSearch: searchValue });
    }
  }, [filteredData]);

  // Table Columns
  const columns = [
    {
      name: "WorkItemId",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Task ID"),

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
        customHeadLabelRender: () => genrateCustomHeaderName("Client"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Project"),
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
        customHeadLabelRender: () => genrateCustomHeaderName("Task"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "ReturnTypes",
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
      name: "TypeOfReturn",
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
      name: "RatingOn",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Rating Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "DateSubmitted",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Date Submitted"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "HoursLogged",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Hours Logged"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "Ratings",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Ratings"),
        customBodyRender: (value: any) => {
          return <Rating name="read-only" value={value} readOnly />;
        },
      },
    },
    {
      name: "Comments",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Comments"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
  ];

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={undefined}
        columns={columns}
        data={ratingData}
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

export default RatingReport;
