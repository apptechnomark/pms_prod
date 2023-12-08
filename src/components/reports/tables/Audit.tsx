import { callAPI } from "@/utils/API/callAPI";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  TablePagination,
  ThemeProvider,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { options } from "@/utils/datatable/TableOptions";
import { audit_InitialFilter } from "@/utils/reports/getFilters";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { reportsAuditCols } from "@/utils/datatable/columns/ReportsDatatableColumns";

const Audit = ({ filteredData, searchValue, onHandleExport }: any) => {
  const [auditFields, setAuditFields] = useState({
    loaded: false,
    page: 0,
    data: [],
    rowsPerPage: 10,
    dataCount: 0,
  });

  const getData = async (arg1: any) => {
    const url = `${process.env.report_api_url}/report/audit`;

    const successCallback = (ResponseData: any, error: any) => {
      if (ResponseData !== null && error === false) {
        onHandleExport(ResponseData.List.length > 0);
        setAuditFields({
          ...auditFields,
          loaded: true,
          data: ResponseData.List,
          dataCount: ResponseData.TotalCount,
        });
      } else {
        setAuditFields({
          ...auditFields,
          loaded: false,
        });
      }
    };
    callAPI(url, arg1, successCallback, "post");
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setAuditFields({
      ...auditFields,
      page: newPage,
    });
    getData({
      ...audit_InitialFilter,
      pageNo: newPage + 1,
      pageSize: auditFields.rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAuditFields({
      ...auditFields,
      page: 0,
      rowsPerPage: parseInt(event.target.value),
    });

    getData({
      ...audit_InitialFilter,
      pageNo: 1,
      pageSize: event.target.value,
    });
  };

  useEffect(() => {
    getData(audit_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, GlobalSearch: searchValue });
      setAuditFields({
        ...auditFields,
        page: 0,
        rowsPerPage: 10,
      });
    } else {
      getData({ ...audit_InitialFilter, GlobalSearch: searchValue });
    }
  }, [filteredData, searchValue]);

  return auditFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={undefined}
        columns={reportsAuditCols}
        data={auditFields.data}
        options={options}
      />
      <TablePagination
        component="div"
        count={auditFields.dataCount}
        page={auditFields.page}
        onPageChange={handleChangePage}
        rowsPerPage={auditFields.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  ) : (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <CircularProgress />
    </div>
  );
};

export default Audit;
