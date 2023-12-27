import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import {
  handleChangePage,
  handleChangeRowsPerPage,
} from "@/utils/datatable/CommonFunction";
import { getMuiTheme } from "@/utils/datatable/CommonStyle";
import { dashboard_Options } from "@/utils/datatable/TableOptions";
import { adminDashboardBillingTypeCols } from "@/utils/datatable/columns/AdminDatatableColumns";

interface BillingTypeProps {
  onSelectedWorkType: number;
  onSelectedStatusName: string;
  onCurrentSelectedBillingType: any;
  onSearchValue: string;
}

const Datatable_BillingType: React.FC<BillingTypeProps> = ({
  onSelectedWorkType,
  onSelectedStatusName,
  onCurrentSelectedBillingType,
  onSearchValue,
}) => {
  const [data, setData] = useState<any | any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableDataCount, setTableDataCount] = useState(0);

  const getBillingTypeData = async (value: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.report_api_url}/dashboard/billingstatuslist`,
        {
          PageNo: page + 1,
          PageSize: rowsPerPage,
          SortColumn: null,
          IsDesc: true,
          WorkTypeId: onSelectedWorkType === 0 ? null : onSelectedWorkType,
          GlobalSearch: value,
          BillingTypeId:
            onCurrentSelectedBillingType === 0
              ? null
              : onCurrentSelectedBillingType,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setData(response.data.ResponseData.List);
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (onSearchValue.length >= 3) {
      getBillingTypeData(onSearchValue);
    } else {
      getBillingTypeData("");
    }
  }, [
    onSelectedWorkType,
    onSelectedStatusName,
    onCurrentSelectedBillingType,
    onSearchValue,
    page,
    rowsPerPage,
  ]);

  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={data}
          columns={adminDashboardBillingTypeCols}
          title={undefined}
          options={dashboard_Options}
          data-tableid="taskStatusInfo_Datatable"
        />
        <TablePagination
          component="div"
          count={tableDataCount}
          page={page}
          onPageChange={(event: any, newPage) => {
            handleChangePage(event, newPage, setPage);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            handleChangeRowsPerPage(event, setRowsPerPage, setPage);
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default Datatable_BillingType;
