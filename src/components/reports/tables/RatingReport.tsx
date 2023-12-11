import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { callAPI } from "@/utils/API/callAPI";
import { FieldsType } from "../types/FieldsType";
import { options } from "@/utils/datatable/TableOptions";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import ReportLoader from "@/components/common/ReportLoader";
import { TablePagination, ThemeProvider } from "@mui/material";
import { rating_InitialFilter } from "@/utils/reports/getFilters";
import { reportsRatingCols } from "@/utils/datatable/columns/ReportsDatatableColumns";

const RatingReport = ({ filteredData, searchValue, onHandleExport }: any) => {
  const [ratingReportFields, setRatingReportFields] = useState<FieldsType>({
    loaded: false,
    data: [],
    dataCount: 0,
  });
  const [ratingCurrentPage, setRatingCurrentPage] = useState<number>(0);
  const [ratingRowsPerPage, setRatingRowsPerPage] = useState<number>(10);

  const getData = async (arg1: any) => {
    const url = `${process.env.report_api_url}/report/admin/rating`;

    const successCallback = (data: any, error: any) => {
      if (data !== null && error === false) {
        onHandleExport(data.List.length > 0);
        setRatingReportFields({
          ...ratingReportFields,
          loaded: true,
          data: data.List,
          dataCount: data.TotalCount,
        });
      } else {
        setRatingReportFields({ ...ratingReportFields, loaded: false });
      }
    };

    callAPI(url, arg1, successCallback, "post");
  };

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setRatingCurrentPage(newPage);
    if (filteredData !== null) {
      getData({
        ...filteredData,
        pageNo: newPage + 1,
        pageSize: ratingRowsPerPage,
      });
    } else {
      getData({
        ...rating_InitialFilter,
        pageNo: newPage + 1,
        pageSize: ratingRowsPerPage,
      });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRatingCurrentPage(0);
    setRatingRowsPerPage(parseInt(event.target.value));

    if (filteredData !== null) {
      getData({
        ...filteredData,
        pageNo: 1,
        pageSize: ratingRowsPerPage,
      });
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
      setRatingCurrentPage(0);
      setRatingRowsPerPage(10);
    } else {
      getData({ ...rating_InitialFilter, GlobalSearch: searchValue });
    }
  }, [filteredData, searchValue]);

  return ratingReportFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={undefined}
        columns={reportsRatingCols}
        data={ratingReportFields.data}
        options={options}
      />
      <TablePagination
        component="div"
        count={ratingReportFields.dataCount}
        page={ratingCurrentPage}
        onPageChange={handleChangePage}
        rowsPerPage={ratingRowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  ) : (
    <ReportLoader />
  );
};

export default RatingReport;
