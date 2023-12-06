import { ThemeProvider } from "@emotion/react";
import { CircularProgress, createTheme } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generateRatingsBodyRender,
} from "@/utils/datatable/CommonFunction";
import { callAPI } from "@/utils/API/callAPI";

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

const Datatable_Rating = ({
  currentFilterData,
  onSearchData,
  onHandleExport,
}: any) => {
  const [allFields, setAllFields] = useState<any>({
    loaded: false,
    ratingData: [],
    page: 0,
    rowsPerPage: pageSize,
    tableDataCount: 0,
  });
  const [filteredObject, setFilteredOject] = useState<any>(initialFilter);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setAllFields({
      ...allFields,
      page: newPage,
    });
    setFilteredOject({ ...filteredObject, PageNo: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilteredOject({
      ...filteredObject,
      PageNo: 1,
      PageSize: event.target.value,
    });
  };

  useEffect(() => {
    if (onSearchData) {
      setAllFields({
        ...allFields,
        ratingData: onSearchData,
      });
    } else {
      getRatingList();
    }
  }, [onSearchData]);

  const getRatingList = async () => {
    const params = filteredObject;
    const url = `${process.env.report_api_url}/report/client/rating`;
    const successCallback = (ResponseData: any, error: any) => {
      if (ResponseData !== null && error === false) {
        onHandleExport(ResponseData.List.length > 0);
        setAllFields({
          ...allFields,
          loaded: true,
          ratingData: ResponseData.List,
          tableDataCount: ResponseData.TotalCount,
        });
      } else {
        setAllFields({
          ...allFields,
          loaded: false,
        });
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  useEffect(() => {
    setFilteredOject({ ...filteredObject, ...currentFilterData });
  }, [currentFilterData]);

  useEffect(() => {
    getRatingList();
  }, [filteredObject]);

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
      name: "ProcessName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Process"),
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

  return allFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        data={allFields.ratingData}
        columns={columns}
        title={undefined}
        options={{
          ...options,
        }}
        data-tableid="rating_Datatable"
      />
      <TablePagination
        component="div"
        count={allFields.tableDataCount}
        page={allFields.page}
        onPageChange={handleChangePage}
        rowsPerPage={allFields.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default Datatable_Rating;
