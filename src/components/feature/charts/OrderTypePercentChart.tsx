import { ChartData, ChartOptions } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";
import axiosClient from "../../../lib/axios";

type Data = {
  labels: string[];
  values: number[];
  total: number;
};

const chartColor = [
  "#FF204E",
  "#4477CE",
  "#03C988",
  "#ECB365",
  "#C147E9",
  "#5C5470",
  "#A78295",
];

const OrderTypePercentChart = () => {
  const [data, setData] = useState<Data>({
    labels: [],
    values: [],
    total: 0,
  });

  const chartData: ChartData<"doughnut", any> = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: chartColor,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    plugins: {
      tooltip: {
        mode: "index",
        position: "average",
        backgroundColor: "#FFFFFF",
        titleColor: "#000000",
        bodyColor: "#000000",
        bodySpacing: 10,
        padding: 10,
        borderColor: "#000",
        borderWidth: 1,
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const fetchChartData = async () => {
    try {
      const { data } = await axiosClient.get<void, { data: Data }>(
        "/api/statistic/getOrderTypePercentChartData"
      );
      setData(data);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu");
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <Fragment>
      <div className="flex flex-col h-full">
        <h4 className="font-bold text-[20px] mb-4">
          Phương thức phục vụ
        </h4>
        <div className="flex flex-1">
          <div className="flex-1 flex flex-col justify-center">
            <span className="font-medium text-[18px]">Tổng: {data.total}</span>
            <ul>
              {data.labels.map((_, index) => (
                <li key={index} className="font-medium text-[14px]">
                  <p>
                    <span style={{ color: chartColor[index] }}>
                      {((data.values[index] / data.total) * 100).toFixed(0)}%
                    </span>
                    {` ${data.labels[index]}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <Doughnut
              data={chartData}
              options={options}
              width={"100%"}
              height={"100%"}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default OrderTypePercentChart;
