import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axios";

type ChartDataType = {
  label: string;
  value: { revenue: number; numberOfOrder: number };
};

const RevenueChart = () => {
  const [data, setData] = useState<ChartDataType[]>([]);
  const [type, setType] = useState<"day" | "week" | "month">("day");

  const fetchChartData = async () => {
    try {
      const { data } = await axiosClient.get<void, { data: ChartDataType[] }>(
        "/api/statistic/getRevenueChartData",
        {
          params: {
            type: type,
          },
        }
      );
      setData(data);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [type]);

  const chartData: ChartData<"line", ChartDataType[]> = {
    datasets: [
      {
        label: "Doanh thu",
        data: data,
        parsing: {
          xAxisKey: "label",
          yAxisKey: "value.revenue",
        },
        backgroundColor: "rgba(73, 103, 249, 0.2)",
        borderColor: "rgb(73, 103, 249)",
        hoverBackgroundColor: "#FFFFFF",
        pointBorderColor: "rgb(73, 103, 249)",
        borderWidth: 1,
        hoverBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
        fill: true,
        yAxisID: "yRevenue",
        tension: 0.3,
      },
      {
        label: "Số đơn hàng",
        data: data,
        parsing: {
          xAxisKey: "label",
          yAxisKey: "value.numberOfOrder",
        },
        backgroundColor: "rgba(72, 208, 173, 0.2)",
        borderColor: "rgb(72, 208, 173)",
        hoverBackgroundColor: "#FFFFFF",
        pointBorderColor: "rgb(72, 208, 173)",
        borderWidth: 1,
        hoverBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
        fill: true,
        yAxisID: "yNumberOfOrder",
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          padding: 10,
          //   minRotation: 45,
          //   maxRotation: 60,
        },
      },
      yRevenue: {
        beginAtZero: true,
        ticks: {
          padding: 10,
        },
        title: {
          display: true,
          text: "Doanh thu",
          color: "rgb(73, 103, 249)",
          font: {
            size: 16,
          },
        },
      },
      yNumberOfOrder: {
        beginAtZero: true,
        ticks: {
          padding: 10,
        },
        position: "right",
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Số đơn hàng",
          color: "rgb(72, 208, 173)",
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      tooltip: {
        mode: "index",
        position: "nearest",
        backgroundColor: "#FFFFFF",
        titleColor: "#000000",
        bodyColor: "#000000",
        bodySpacing: 10,
        padding: 10,
        borderColor: "#000",
        borderWidth: 1,
      },
      legend: {
        labels: {
          boxWidth: 10,
          boxHeight: 10,
        },
      },
    },
    layout: {
      padding: 10,
    },
    // responsive: true,
    aspectRatio: 3,
  };

  return (
    <Fragment>
      <div className="p-4 bg-white rounded-lg mt-8 xl:h-[500px] lg:h-[400px] shadow-md">
        <div className="flex justify-between rounded-lg">
          <h1 className="text-[20px] font-bold">Biểu đồ doanh thu</h1>
          <div className="p-1 bg-[#F5F7FA] flex gap-1 text-[12px] rounded-md">
            <button
              className={`${
                type == "day" && "bg-white"
              } text-black rounded-md py-1 px-3 font-medium`}
              onClick={() => setType("day")}
            >
              Ngày
            </button>
            <button
              className={`${
                type == "week" && "bg-white"
              } text-black rounded-md py-1 px-3 font-medium`}
              onClick={() => setType("week")}
            >
              Tuần
            </button>
            <button
              className={`${
                type == "month" && "bg-white"
              } text-black rounded-md py-1 px-3 font-medium`}
              onClick={() => setType("month")}
            >
              Tháng
            </button>
          </div>
        </div>
        <Line data={chartData} options={options} />
      </div>
    </Fragment>
  );
};

export default RevenueChart;
