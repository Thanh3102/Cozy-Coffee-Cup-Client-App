import { Fragment, useEffect, useState } from "react";
import { RevenueOverview } from "../../utils/types/type";
import { ContentContainer } from "../ui/ContentContainer";
import Sidebar from "../ui/Sidebar";
import Loading from "../ui/Loading";
import AnimateNumber from "../ui/AnimateNumber";
import RevenueChart from "../feature/charts/RevenueChart";
import { toast } from "react-toastify";
import axiosClient from "../../lib/axios";
import OrderTypePercentChart from "../feature/charts/OrderTypePercentChart";
import ProductCategoryPercentChart from "../feature/charts/ProductCategoryPercentChart";
import TopSaleProductTable from "../feature/tables/TopSaleProductTable";
import RunOutMaterialTable from "../feature/tables/RunOutMaterialTable";

const HomeContent = () => {
  const [revenueOverview, setRevenueOverview] = useState<RevenueOverview>({
    revenue: 0,
    numberOfOrder: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRevenueOverview = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient<void, { data: RevenueOverview }>(
        "/api/statistic/getRevenueOverview"
      );
      setRevenueOverview(data);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueOverview();
  }, []);

  return (
    <ContentContainer>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <div className="p-4 rounded-lg bg-white shadow-md">
            <h1 className="text-[20px] font-bold">Thống kê trong ngày</h1>
            <ul className="flex justify-between mt-4 [&>li]:px-10 [&>:first-child]:pl-0 [&>:last-child]:pr-0 [&>:last-child]:border-none">
              <li className="flex-1 border-r-[1px] border-gray-200">
                <p className="font-bold text-blue-500">Doanh thu</p>
                <AnimateNumber from={0} to={revenueOverview.revenue} currency />
              </li>
              <li className="flex-1 border-r-[1px] border-gray-200">
                <p className="font-bold text-amber-500">Số đơn hàng</p>
                <div className="font-semibold flex justify-between">
                  <AnimateNumber from={0} to={revenueOverview.numberOfOrder} />
                </div>
              </li>
              <li className="flex-1 border-r-[1px] border-gray-200">
                <p className="font-bold text-purple-500">
                  Doanh thu trung bình
                </p>
                <p className="font-semibold ">
                  <AnimateNumber
                    from={0}
                    to={
                      revenueOverview.numberOfOrder
                        ? revenueOverview.revenue /
                          revenueOverview.numberOfOrder
                        : 0
                    }
                    currency
                  />
                </p>
              </li>
            </ul>
          </div>
          <RevenueChart />
          <div className="flex mt-8 h-[300px] gap-4">
            <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
              <OrderTypePercentChart />
            </div>
            <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
              {/* <ProductCategoryPercentChart /> */}
              Hình thức thanh toán
            </div>
            <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
              <ProductCategoryPercentChart />
            </div>
          </div>

          <div className="flex mt-8 gap-10">
            <div className="p-4 bg-white rounded-lg h-[400px] shadow-md flex-1 flex flex-col">
              <h4 className="font-bold text-[20px] mb-4">
                Sản phẩm bán chạy trong tháng
              </h4>
              <TopSaleProductTable />
            </div>
            <div className="p-4 bg-white rounded-lg h-[400px] shadow-md flex-1 flex flex-col">
              <h4 className="font-bold text-[20px] mb-4">
                Nguyên liệu cần bổ sung
              </h4>
              <RunOutMaterialTable />
            </div>
          </div>
        </Fragment>
      )}
    </ContentContainer>
  );
};

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <HomeContent />
    </div>
  );
};

export default Home;
