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
interface OverallProjectCompletionProps {
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
}

const Chart_OverallProjectCompletion: React.FC<
  OverallProjectCompletionProps
> = ({ onSelectedProjectIds, onSelectedWorkType }) => {
  const [data, setData] = useState<any | any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    // if (onSelectedProjectIds.length > 0) {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/clientdashboard/overallprojectcompletion`,
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
          setData(response.data.ResponseData.List);
          setTotalCount(response.data.ResponseData.TotalCount);
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

  // Define the chart options
  const chartOptions = {
    chart: {
      type: "variablepie",
      width: 480,
      height: 240,
      spacingTop: 10,
    },
    title: {
      text: null,
    },
    tooltip: {
      headerFormat: "",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.key}</b><br/>' +
        "Count: <b>{point.y}</b><br/>" +
        "Percentage: <b>{point.z}</b><br/>",
    },
    plotOptions: {
      variablepie: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      width: 150,
      itemMarginBottom: 10,
    },
    series: [
      {
        type: "variablepie",
        minPointSize: 30,
        innerSize: "60%",
        zMin: 0,
        name: "projects",
        borderRadius: 4,
        showInLegend: true,
        data: data.map((item: { Key: any; Percentage: any; Count: any }) => {
          return {
            name: item.Key,
            key: item.Key,
            y: item.Count,
            z: `${item.Percentage} %`,
          };
        }),
        colors: data.map((item: { ColorCode: any }) => item.ColorCode),
      },
    ],
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="flex flex-col px-[20px]">
      <span className="flex items-start pt-[30px] px-[10px] text-lg font-medium">
        Overall Project Completion
      </span>
      <div className="flex justify-between relative">
        <div className="mt-5">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        {data.length > 0 && (
          <span
            className={`flex flex-col items-center absolute bottom-[5.9rem] z-0 ${
              totalCount <= 1 ? "left-[8.45rem]" : "left-[8.35rem]"
            }`}
          >
            <span className="text-xl font-semibold text-darkCharcoal">
              {totalCount}
            </span>
            <span className="text-lg text-slatyGrey">
              {totalCount > 1 ? "Tasks" : "Task"}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Chart_OverallProjectCompletion;
