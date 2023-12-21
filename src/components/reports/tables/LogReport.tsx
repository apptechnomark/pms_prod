import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { callAPI } from "@/utils/API/callAPI";
import { FieldsType } from "../types/FieldsType";
import { options } from "@/utils/datatable/TableOptions";
import ReportLoader from "@/components/common/ReportLoader";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { TablePagination, ThemeProvider } from "@mui/material";
import { logReport_InitialFilter } from "@/utils/reports/getFilters";
import { reportsLogCols } from "@/utils/datatable/columns/ReportsDatatableColumns";

const LogReport = ({ filteredData, searchValue, onHandleExport }: any) => {
  const [logReportFields, setLogReportFields] = useState<FieldsType>({
    loaded: false,
    data: [],
    dataCount: 0,
  });
  const [logReportCurrentPage, setLogReportCurrentPage] = useState<number>(0);
  const [logReportRowsPerPage, setLogReportRowsPerPage] = useState<number>(10);

  const getData = async (arg1: any) => {
    const url = `${process.env.report_api_url}/report/auditlog`;

    const successCallback = (data: any, error: any) => {
      if (data !== null && error === false) {
        onHandleExport(data.List.length > 0);
        setLogReportFields({
          ...logReportFields,
          loaded: true,
          data: data.List,
          dataCount: data.TotalCount,
        });
      } else {
        setLogReportFields({ ...logReportFields, loaded: true });
      }
    };

    callAPI(url, arg1, successCallback, "post");
  };

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setLogReportCurrentPage(newPage);
    if (filteredData !== null) {
      getData({
        ...filteredData,
        pageNo: newPage + 1,
        pageSize: logReportRowsPerPage,
      });
    } else {
      getData({
        ...logReport_InitialFilter,
        pageNo: newPage + 1,
        pageSize: logReportRowsPerPage,
      });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLogReportCurrentPage(0);
    setLogReportRowsPerPage(parseInt(event.target.value));

    if (filteredData !== null) {
      getData({
        ...filteredData,
        pageNo: 1,
        pageSize: logReportRowsPerPage,
      });
    } else {
      getData({
        ...logReport_InitialFilter,
        pageNo: 1,
        pageSize: event.target.value,
      });
    }
  };

  useEffect(() => {
    getData(logReport_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, globalSearch: searchValue });
      setLogReportCurrentPage(0);
      setLogReportRowsPerPage(10);
    } else {
      getData({ ...logReport_InitialFilter, globalSearch: searchValue });
    }
  }, [filteredData, searchValue]);

  const columns: any = [];

  return logReportFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        columns={reportsLogCols}
        data={logReportFields.data}
        title={undefined}
        options={options}
      />
      <TablePagination
        component="div"
        count={logReportFields.dataCount}
        page={logReportCurrentPage}
        onPageChange={handleChangePage}
        rowsPerPage={logReportRowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  ) : (
    <ReportLoader />
  );
};

export default LogReport;
