import { BaseProps } from "../../../utils/types/interface";
import { motion } from "framer-motion";
import { Product } from "../../../utils/types/type";
import { currencyFormatter } from "../../../utils/currencyFormat";
import { formatDate } from "../../../utils/dateFormat";

interface Props extends BaseProps {
  product: Product | undefined;
}

const TabProductInfo = ({ product }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex overflow-y-auto w-[80vw] h-[70vh]"
    >
      <div className="flex-[2] flex-col pr-2">
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Mã sản phẩm</span>
          <span className="flex-[2]">{product?.id}</span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Tên sản phẩm</span>
          <span className="flex-[2]">{product?.name}</span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Giá bán</span>
          <span className="flex-[2]">
            {product?.price
              ? currencyFormatter.format(product?.price)
              : "Không có dữ liệu"}
          </span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Danh mục</span>
          <span className="flex-[2]">{product?.category?.name ?? "Trống"}</span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Loại sản phẩm</span>
          <span className="flex-[2]">{product?.type.name}</span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Giám giá</span>
          <span className="flex-[2]">{`${product?.discount} %`}</span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Mô tả</span>
          <span className="flex-[2]">{product?.description}</span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Ghi chú</span>
          <span className="flex-[2]">{product?.note}</span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Ngày tạo</span>
          <span className="flex-[2]">
            {product?.created_at
              ? formatDate(product?.created_at)
              : "Không có dữ liệu"}
          </span>
        </div>
        <div className="flex py-3">
          <span className="flex-[1] text-[#858D9D]">Cập nhật lần cuối</span>
          <span className="flex-[2]">
            {" "}
            {product?.created_at
              ? formatDate(product?.updated_at)
              : "Không có dữ liệu"}
          </span>
        </div>
      </div>
      <div className="flex-[1] pl-2 flex justify-center">
        <div className="w-[160px] h-[160px] mt-4 border-[1px] border-black">
          <img
            src={product?.image ? product?.image : ""}
            alt=""
            className="w-full h-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TabProductInfo;
