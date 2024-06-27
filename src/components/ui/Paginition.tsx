import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseProps } from "../../utils/types/interface";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface Props extends BaseProps {
  position?: "left" | "center" | "right";
  count: number;
  // itemPerPage: number;
  page: number;
  onPageChange: (page: number) => void;
  onItemPerPageChange: (itemPerPage: number) => void;
}

const positionOption = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const Paginition = ({
  position,
  count,
  // itemPerPage,
  page,
  onPageChange,
  onItemPerPageChange,
}: Props) => {
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const totalPage = Math.floor(count / itemPerPage) + 1;
  var startIndex = (page - 1) * itemPerPage + 1;
  const endIndex =
    startIndex + itemPerPage - 1 > count ? count : startIndex + itemPerPage - 1;

  return (
    <div className={`flex py-4 ${position ? positionOption[position] : ""}`}>
      <div className="flex items-center gap-8">
        <div className="">
          <span>Số dòng mỗi trang</span>
          <select
            name=""
            id=""
            className="mx-3 text-[14px] p-1 bg-gray-200"
            onChange={(e) => {
              onItemPerPageChange(parseInt(e.target.value));
              setItemPerPage(parseInt(e.target.value));
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="text-[16px] flex gap-2 items-center">
          <FontAwesomeIcon
            icon={faAngleLeft}
            onClick={() => {
              if (page !== 1) {
                page = page - 1;
                onPageChange(page);
              }
            }}
            className={`${
              page === 1
                ? "text-gray-300 hover:cursor-default"
                : "hover:cursor-pointer"
            } text-[22px]`}
          />
          <span>{`${startIndex} - ${endIndex} trên ${count}`}</span>

          <FontAwesomeIcon
            icon={faAngleRight}
            onClick={() => {
              if (page !== totalPage) {
                page = page + 1;
                onPageChange(page);
              }
            }}
            className={`${
              page === totalPage
                ? "text-gray-300 hover:cursor-default"
                : "hover:cursor-pointer"
            } text-[22px]`}
          />
        </div>
      </div>
    </div>
  );
};

export default Paginition;
