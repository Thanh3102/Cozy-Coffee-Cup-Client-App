import { Fragment } from "react/jsx-runtime";
import Sidebar from "../ui/Sidebar";
import { ContentContainer } from "../ui/ContentContainer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../lib/axios";
import { Table } from "../../utils/types/type";


const ServiceContent = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const fetchTable = async (floor: number) => {
    try {
      const { tables } = await axiosClient.get<void, { tables: Table[] }>(
        `/api/order/getTable?floor=${selectedFloor}`
      );
      setTables(tables);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể lấy dữ liệu bàn");
    }
  };

  useEffect(() => {
    fetchTable(selectedFloor);
  }, []);
  return (
    <ContentContainer>
      <h1 className="font-semibold text-[22px]">Bàn</h1>
      <div className="">
        <ul className="flex gap-3 mt my-2">
          {[1, 2, 3, 4].map((floor) => (
            <li
              key={floor}
              className={`py-2 px-4 hover:cursor-pointer ${
                selectedFloor === floor
                  ? "bg-amber-700 rounded-xl text-gray-100"
                  : ""
              }`}
              onClick={() => {
                setSelectedFloor(floor);
                fetchTable(floor);
              }}
            >{`Tầng ${floor}`}</li>
          ))}
        </ul>
        <div className="flex flex-wrap mx-[-8px]">
          {tables.map((table) => (
            <div className="w-[20%] px-[8px] mt-2">
              <div className="shadow-md hover:cursor-pointer">
                <h1 className="text-white font-[20px] p-2 rounded-t-xl bg-amber-700">{`Bàn ${table.number}`}</h1>
                <div className="p-2">Table content</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentContainer>
  );
};

const Service = () => {
  return (
    <Fragment>
      <Sidebar />
      <ServiceContent />
    </Fragment>
  );
};

export default Service;
