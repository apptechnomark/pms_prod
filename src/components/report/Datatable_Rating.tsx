import { ThemeProvider } from "@emotion/react";
import { Rating, createTheme } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
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
const Data = new Date();

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  PageNo: pageNo,
  PageSize: pageSize,
  GlobalSearch: "",
  SortColumn: "",
  IsDesc: false,
  Projects: [],
  ReturnTypeId: null,
  TypeofReturnId: null,
  Ratings: null,
  Users: [],
  DepartmentId: null,
  DateSubmitted: null,
  StartDate: new Date(Data.getFullYear(), Data.getMonth(), 1),
  EndDate: Data,
};

const Datatable_Rating = ({ currentFilterData, onSearchData }: any) => {
  const [ratingData, setRatingData] = useState<any>([]);
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    setFilteredOject({ ...filteredObject, PageNo: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setFilteredOject({
      ...filteredObject,
      PageNo: 1,
      PageSize: event.target.value,
    });
  };

  // for showing value according to search
  useEffect(() => {
    if (onSearchData) {
      setRatingData(onSearchData);
    } else {
      getRatingList();
    }
  }, [onSearchData]);

  // TaskList API
  const getRatingList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.report_api_url}/report/client/rating`,
        filteredObject,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setRatingData(response.data.ResponseData.List);
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

  useEffect(() => {
    setFilteredOject({ ...filteredObject, ...currentFilterData });
  }, [currentFilterData]);

  useEffect(() => {
    getRatingList();
  }, [filteredObject]);

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
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => genrateCustomHeaderName("Process"),
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

  // Table Customization Options
  const options: any = {
    responsive: "standard",
    tableBodyHeight: "73vh",
    viewColumns: false,
    filter: false,
    print: false,
    download: false,
    search: false,
    selectToolbarPlacement: "none",
    selectableRows: "none",
    elevation: 0,
    pagination: false,
  };

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        data={ratingData}
        columns={columns}
        title={undefined}
        options={{
          ...options,
        }}
        data-tableid="rating_Datatable"
      />
      <TablePagination
        component="div"
        // rowsPerPageOptions={[5, 10, 15]}
        count={tableDataCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  );
};

export default Datatable_Rating;
