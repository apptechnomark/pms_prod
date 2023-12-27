import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsVariablePie from "highcharts/modules/variable-pie";

if (typeof Highcharts === "object") {
  HighchartsVariablePie(Highcharts);
}

interface ReturnTypeProps {
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
  sendData: any;
}

const Chart_ReturnType: React.FC<ReturnTypeProps> = ({
  onSelectedProjectIds,
  onSelectedWorkType,
  sendData,
}) => {
  const [data, setData] = useState<any | any[]>([]);

  useEffect(() => {
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

    getData();
  }, [onSelectedProjectIds, onSelectedWorkType]);

  const drilldownData = data;

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
        cursor: "pointer",
        point: {
          events: {
            click: (event: { point: { name: string } }) => {
              const selectedPointData = {
                name: (event.point && event.point.name) || "",
              };
              sendData(true, selectedPointData.name);
            },
          },
        },
      },
    },
    tooltip: {
      headerFormat: "",
      formatter(this: Highcharts.TooltipFormatterContextObject) {
        const count = this.point.y !== undefined ? this.point.y : 0;
        const percentage =
          this.point.percentage !== undefined ? this.point.percentage : 0;

        return (
          '<span style="color:' +
          this.point.color +
          '">\u25CF</span> <b>' +
          this.point.name +
          "</b><br/>" +
          "Count: <b>" +
          count +
          "</b><br/>" +
          "Percentage: <b>" +
          Highcharts.numberFormat(percentage, 2, ".") +
          "%</b>"
        );
      },
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
