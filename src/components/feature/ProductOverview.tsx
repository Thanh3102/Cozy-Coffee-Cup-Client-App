import AnimateNumber from "../ui/AnimateNumber";
import { ProductOverview as ProductOverviewType } from "../../utils/types/type";

interface Props {
  overview: ProductOverviewType;
}

const ProductOverview = ({ overview }: Props) => {
  return (
    <div className="p-4 rounded-lg bg-white shadow-md">
      <h1 className="text-base md:text-lg font-bold">Tổng quan sản phẩm</h1>
      <ul className="flex justify-between mt-4 [&>li]:px-5 [&>li]:md:px-10 [&>li]:lg:px-20 [&>:first-child]:pl-0 [&>:last-child]:pr-0 [&>:last-child]:border-none">
        <li className="flex-1 border-r-[1px] border-gray-200">
          <p className="font-bold text-blue-500">Danh mục</p>
          <AnimateNumber from={0} to={overview.categoryCount} />
        </li>
        <li className="flex-1 border-r-[1px] border-gray-200">
          <p className="font-bold text-amber-500">Số sản phẩm</p>
          <div className="font-semibold flex justify-between">
            <AnimateNumber from={0} to={overview.numberOfSellProduct} />
            <AnimateNumber from={0} to={overview.numberOfProduct} />
          </div>
          <div className="text-[14px] text-gray-500 flex justify-between">
            <p className="">Đang bán</p>
            <p className="">Tổng</p>
          </div>
        </li>
        <li className="flex-1 border-r-[1px] border-gray-200">
          <p className="font-bold text-purple-500">Doanh thu</p>
          <p className="font-semibold ">
            <AnimateNumber
              from={0}
              to={overview.revenueLast7Day}
              currency={true}
            />
          </p>
          <p className="text-[14px] text-gray-500">7 ngày gần nhất</p>
        </li>
      </ul>
    </div>
  );
};

export default ProductOverview;
