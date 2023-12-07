import { ThemeProvider } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { callAPI } from "@/utils/API/callAPI";
import { report_Options } from "@/utils/datatable/TableOptions";
import { reportDatatatbleRatingCols } from "@/utils/datatable/columns/ReportsDatatableColumns";

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

  return allFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        data={allFields.ratingData}
        columns={reportDatatatbleRatingCols}
        title={undefined}
        options={{
          ...report_Options,
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
