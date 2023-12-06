import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  TablePagination,
  ThemeProvider,
} from "@mui/material";

import MUIDataTable from "mui-datatables";
//MUIDataTable Options
import { options } from "@/utils/datatable/TableOptions";

//filter for audit
import { rating_InitialFilter } from "@/utils/reports/getFilters";

// common functions for datatable
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generateRatingsBodyRender,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";

const RatingReport = ({ filteredData, searchValue, onHandleExport }: any) => {
  const [loaded, setLoaded] = useState<boolean>(false);
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
          onHandleExport(
            response.data.ResponseData.List.length > 0 ? true : false
          );
          setLoaded(true);
          setRatingData(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
        } else {
          setLoaded(true);
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else toast.error(data);
        }
      } else {
        setLoaded(true);
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else toast.error(data);
      }
    } catch (error) {
      setLoaded(true);
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
        pageSize: event.target.value,
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
  }, [filteredData, searchValue]);

  // Table Columns
  const columns = [
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
        customHeadLabelRender: () => generateCustomHeaderName("Client"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Project"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Task"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Return Type"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Rating Date"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Date Submitted"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Hours Logged"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Ratings"),
        customBodyRender: (value: any) => {
          return generateRatingsBodyRender(value);
        },
      },
    },
    {
      name: "Comments",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Comments"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
  ];

  return loaded ? (
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
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default RatingReport;
