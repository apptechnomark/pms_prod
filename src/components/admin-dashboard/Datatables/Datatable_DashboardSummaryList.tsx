import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";

interface DashboardSummaryListProps {
  onSelectedWorkType: number;
  onClickedSummaryTitle: string;
  onCurrSelectedSummaryTitle: string;
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

const Datatable_DashboardSummaryList: React.FC<DashboardSummaryListProps> = ({
  onSelectedWorkType,
  onClickedSummaryTitle,
  onCurrSelectedSummaryTitle,
}) => {
  const [dashboardSummaryData, setDashboardSummaryData] = useState([]);
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

  // API for List By Summary
  useEffect(() => {
    if (onCurrSelectedSummaryTitle !== "" || onClickedSummaryTitle !== "") {
      const getProjectSummaryData = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.report_api_url}/dashboard/dashboardsummarylist`,
            {
              PageNo: page + 1,
              PageSize: rowsPerPage,
              SortColumn: null,
              IsDesc: true,
              WorkTypeId: onSelectedWorkType === 0 ? null : onSelectedWorkType,
              Key: onCurrSelectedSummaryTitle
                ? onCurrSelectedSummaryTitle
                : onClickedSummaryTitle,
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
              setDashboardSummaryData(response.data.ResponseData.List);
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

      getProjectSummaryData();
    }
  }, [
    onSelectedWorkType,
    onClickedSummaryTitle,
    onCurrSelectedSummaryTitle,
    page,
    rowsPerPage,
  ]);
  // Table Columns
  const columns = [
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Task Name</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Project Name</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Client Name</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "StatusName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => <span className="font-bold">Status</span>,
        customBodyRender: (value: any, tableMeta: any) => {
          const statusColorCode = tableMeta.rowData[12];

          return (
            <div>
              {value === null || value === "" ? (
                "-"
              ) : (
                <div className="inline-block mr-1">
                  <div
                    className="w-[10px] h-[10px] rounded-full inline-block mr-2"
                    style={{ backgroundColor: statusColorCode }}
                  ></div>
                  {value}
                </div>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "TypeOfReturnName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Type Of Return</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "TaxReturnTypeName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Return Type</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "WorkTypeName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Type Of Work</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Start Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || "") {
            return "-";
          }

          const startDate = new Date(value);
          const month = startDate.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const day = startDate.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedYear = startDate.getFullYear();
          const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

          return <div>{formattedDate}</div>;
        },
      },
    },
    {
      name: "EndDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Due Date</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || "") {
            return "-";
          }

          const startDate = new Date(value);
          const month = startDate.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const day = startDate.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedYear = startDate.getFullYear();
          const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

          return <div>{formattedDate}</div>;
        },
      },
    },

    {
      name: "PriorityName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Priority</span>
        ),
        customBodyRender: (value: any) => {
          let isHighPriority;
          let isMediumPriority;
          let isLowPriority;

          if (value) {
            isHighPriority = value.toLowerCase() === "high";
            isMediumPriority = value.toLowerCase() === "medium";
            isLowPriority = value.toLowerCase() === "low";
          }

          return (
            <div>
              {value === null || value === "" ? (
                "-"
              ) : (
                <div className="inline-block mr-1">
                  <div
                    className={`w-[10px] h-[10px] rounded-full inline-block mr-2 ${
                      isHighPriority
                        ? "bg-defaultRed"
                        : isMediumPriority
                        ? "bg-yellowColor"
                        : isLowPriority
                        ? "bg-primary"
                        : "bg-lightSilver"
                    }`}
                  ></div>
                  {value}
                </div>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "AssignedByName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Assigned By</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "AssignedToName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold">Assigned To</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
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
          data={dashboardSummaryData}
          columns={columns}
          title={undefined}
          options={options}
          data-tableid="Datatable_DashboardSummaryList"
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

export default Datatable_DashboardSummaryList;
