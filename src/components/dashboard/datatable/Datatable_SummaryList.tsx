import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import {
  generateCustomHeaderName,
  generateCommonBodyRender,
  generateCustomFormatDate,
  generatePriorityWithColor,
  generateStatusWithColor,
} from "@/utils/datatable/CommonFunction";

interface SummaryListProps {
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
  onSelectedSummaryStatus: string;
  onCurrSelectedSummaryStatus: string;
}

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

const Datatable_SummaryList: React.FC<SummaryListProps> = ({
  onSelectedProjectIds,
  onSelectedWorkType,
  onSelectedSummaryStatus,
  onCurrSelectedSummaryStatus,
}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableDataCount, setTableDataCount] = useState(0);

  // functions for handling pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  // API for Project Status list
  const getSummaryData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.report_api_url}/clientdashboard/summarylist`,
        {
          PageNo: page + 1,
          PageSize: rowsPerPage,
          SortColumn: null,
          IsDesc: true,
          TypeOfWork: onSelectedWorkType === 0 ? null : onSelectedWorkType,
          ProjectIds: onSelectedProjectIds ? onSelectedProjectIds : [],
          Key: onCurrSelectedSummaryStatus
            ? onCurrSelectedSummaryStatus
            : onSelectedSummaryStatus,
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
    if (onSelectedSummaryStatus !== "") {
      getSummaryData();
    }
  }, [
    onSelectedWorkType,
    onSelectedSummaryStatus,
    onSelectedProjectIds,
    onCurrSelectedSummaryStatus,
    page,
    rowsPerPage,
  ]);

  // Table Columns
  const columns = [
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Project Name"),
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
        customHeadLabelRender: () => generateCustomHeaderName("Task Name"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TypeOfWorkName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Type of Work"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TypeOfReturnName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Type of Return"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "TaxReturnTypeName",
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
      name: "StatusName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Status"),
        customBodyRender: (value: any, tableMeta: any) =>
          generateStatusWithColor(value, tableMeta.rowData[11]),
      },
    },
    {
      name: "PriorityName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Priority"),
        customBodyRender: (value: any) => generatePriorityWithColor(value),
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Start Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "EndDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("End Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },
    {
      name: "EndDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Due Date"),
        customBodyRender: (value: any) => {
          return generateCustomFormatDate(value);
        },
      },
    },

    {
      name: "AssignedToName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => generateCustomHeaderName("Assigned To"),
        customBodyRender: (value: any) => {
          return generateCommonBodyRender(value);
        },
      },
    },
    {
      name: "StatusColorCode",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
  ];

  // Table Customization Options
  const options: any = {
    filterType: "checkbox",
    responsive: "standard",
    tableBodyHeight: "60vh",
    viewColumns: false,
    filter: false,
    print: false,
    download: false,
    search: false,
    pagination: false,
    selectToolbarPlacement: "none",
    draggableColumns: {
      enabled: true,
      transitionTime: 300,
    },
    selectableRows: "none",
    elevation: 0,
    textLabels: {
      body: {
        noMatch: (
          <div className="flex items-start">
            <span>Currently there is no record</span>
          </div>
        ),
        toolTip: "",
      },
    },
  };

  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={data}
          columns={columns}
          title={undefined}
          options={options}
          data-tableid="taskStatusInfo_Datatable"
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
    </div>
  );
};

export default Datatable_SummaryList;
