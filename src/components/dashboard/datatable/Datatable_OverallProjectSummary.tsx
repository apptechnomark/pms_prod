import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";

interface OverallProjectSummaryProps {
  onSelectedWorkType: number;
  onSelectedTaskStatus: string;
  onSelectedProjectIds: number[];
  onCurrselectedtaskStatus: string;
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

const Datatable_OverallProjectSummary: React.FC<OverallProjectSummaryProps> = ({
  onSelectedWorkType,
  onSelectedTaskStatus,
  onSelectedProjectIds,
  onCurrselectedtaskStatus,
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
  useEffect(() => {
    if (onCurrselectedtaskStatus !== "" || onSelectedTaskStatus !== "") {
      const getOverallProjectSummaryData = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.report_api_url}/clientdashboard/overallprojectcompletionlist`,
            {
              PageNo: page + 1,
              PageSize: rowsPerPage,
              SortColumn: null,
              IsDesc: true,
              TypeOfWork: onSelectedWorkType === 0 ? null : onSelectedWorkType,
              ProjectIds: onSelectedProjectIds ? onSelectedProjectIds : [],
              Key: onCurrselectedtaskStatus
                ? onCurrselectedtaskStatus
                : onSelectedTaskStatus,
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

      getOverallProjectSummaryData();
    }
  }, [
    onSelectedWorkType,
    onSelectedTaskStatus,
    onSelectedProjectIds,
    onCurrselectedtaskStatus,
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
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Project Name</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "TaskName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Task Name</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
          );
        },
      },
    },
    {
      name: "TypeOfWorkName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Type of Work</span>
        ),
        customBodyRender: (value: any) => {
          return (
            <div className="ml-2">{value === null || "" ? "-" : value}</div>
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
          <span className="font-extrabold uppercase">Type of Return</span>
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
          <span className="font-extrabold uppercase">Return Type</span>
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
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">STATUS</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          const statusColorCode = tableMeta.rowData[11];

          return (
            <div className="">
              <div className="inline-block mr-1">
                <div
                  className="w-[10px] h-[10px] rounded-full inline-block mr-2"
                  style={{ backgroundColor: statusColorCode }}
                ></div>
              </div>
              {value === null || "" ? "-" : value}
            </div>
          );
        },
      },
    },
    {
      name: "PriorityName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm">PRIORITY</span>
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
            <div className="">
              <div className="inline-block mr-1">
                <div
                  className={`w-[10px] h-[10px] rounded-full inline-block mr-2 ${
                    isHighPriority
                      ? "bg-defaultRed"
                      : isMediumPriority
                      ? "bg-[#EA6A47]"
                      : isLowPriority
                      ? "bg-[#6AB187]"
                      : "bg-lightSilver"
                  }`}
                ></div>
              </div>
              {value === null || "" ? "-" : value}
            </div>
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
          <span className="font-extrabold">Start Date</span>
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
          <span className="font-extrabold">End Date</span>
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
          <span className="font-extrabold">Due Date</span>
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
      name: "AssignedToName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold uppercase">Assigned To</span>
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

export default Datatable_OverallProjectSummary;
