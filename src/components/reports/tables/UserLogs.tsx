import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { callAPI } from "@/utils/API/callAPI";
import { FieldsType } from "../types/FieldsType";
import { options } from "@/utils/datatable/TableOptions";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import ReportLoader from "@/components/common/ReportLoader";
import { TablePagination, ThemeProvider } from "@mui/material";
import { userLogs_InitialFilter } from "@/utils/reports/getFilters";
import { reportsUserLogsCols } from "@/utils/datatable/columns/ReportsDatatableColumns";

const UserLogs = ({ filteredData, searchValue, onHandleExport }: any) => {
  const [userlogFields, setUserlogFields] = useState<FieldsType>({
    loaded: false,
    page: 0,
    rowsPerPage: 10,
    data: [],
    dataCount: 0,
  });

  const getData = async (arg1: any) => {
    const url = `${process.env.report_api_url}/report/userLog`;

    const successCallBack = (data: any, error: any) => {
      if (data !== null && error === false) {
        onHandleExport(data.List.length > 0);
        setUserlogFields({
          ...userlogFields,
          loaded: true,
          data: data.List,
          dataCount: data.TableCount,
        });
      } else {
        setUserlogFields({ ...userlogFields, loaded: false });
      }
    };

    callAPI(url, arg1, successCallBack, "post");
  };

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setUserlogFields({ ...userlogFields, page: newPage });
    getData({
      ...filteredData,
      pageNo: newPage + 1,
      pageSize: userlogFields.rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserlogFields({
      ...userlogFields,
      page: 0,
      rowsPerPage: parseInt(event.target.value),
    });
    getData({
      ...filteredData,
      pageNo: 1,
      pageSize: event.target.value,
    });
  };

  useEffect(() => {
    getData(userLogs_InitialFilter);
  }, []);

  useEffect(() => {
    if (filteredData !== null) {
      getData({ ...filteredData, globalSearch: searchValue });
      setUserlogFields({
        ...userlogFields,
        page: 0,
        rowsPerPage: 10,
      });
    } else {
      getData({ ...userLogs_InitialFilter, globalSearch: searchValue });
    }
  }, [filteredData, searchValue]);

  return userlogFields.loaded ? (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={undefined}
        columns={reportsUserLogsCols}
        data={userlogFields.data}
        options={options}
      />
      <TablePagination
        component="div"
        count={userlogFields.dataCount}
        page={userlogFields.page}
        onPageChange={handleChangePage}
        rowsPerPage={userlogFields.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  ) : (
    <ReportLoader />
  );
};

export default UserLogs;
