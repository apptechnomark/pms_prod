import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Import the Highcharts modules you need (e.g., variable-pie)
import HighchartsVariablePie from "highcharts/modules/variable-pie";

// Initialize the variable pie chart module
if (typeof Highcharts === "object") {
  HighchartsVariablePie(Highcharts);
}

interface ReturnTypeProps {
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
}

const Chart_ReturnType: React.FC<ReturnTypeProps> = ({
  onSelectedProjectIds,
  onSelectedWorkType,
}) => {
  const [data, setData] = useState<any | any[]>([]);

  useEffect(() => {
    // if (onSelectedProjectIds.length > 0) {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/clientdashboard/taxreturncount`,
          {
            projectIds: onSelectedProjectIds,
            typeOfWork: onSelectedWorkType === 0 ? null : onSelectedWorkType,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (
          response.status === 200 &&
          response.data.ResponseStatus === "Success"
        ) {
          const chartData = response.data.ResponseData.map(
            (item: { Percentage: any; Key: any; Value: any }) => ({
              name: item.Key,
              y: item.Value,
              z: item.Percentage,
            })
          );

          setData(chartData);
        } else {
          const errorMessage = response.data.Message || "Something went wrong.";
          toast.error(errorMessage);
        }
      } catch (error) {
        toast.error("Error fetching data. Please try again later.");
      }
    };

    // Fetch data when component mounts
    getData();
    // }
  }, [onSelectedProjectIds, onSelectedWorkType]);

  // Define the drilldown data
  const drilldownData = data;

  // Define the chart options
  const chartOptions = {
    chart: {
      type: "pie",
      width: 260,
      height: 280,
      spacingTop: 10,
    },
    title: {
      text: null,
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    tooltip: {
      headerFormat: "",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        "count: <b>{point.y}</b><br/>",
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemMarginTop: 10,
      width: 267,
      x: 9,
    },
    series: [
      {
        type: "pie",
        colorByPoint: true,
        data: data,
        showInLegend: true,
        colors: ["#0CC6AA", "#FF829D"],
      },
    ],
    drilldown: {
      series: drilldownData,
    },
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="flex flex-col px-[20px] relative">
      <span className="pt-[20px] text-lg font-medium">
        Individual Return / Business Return
      </span>
      <div className="flex flex-col mt-2">
        <div>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Chart_ReturnType;
