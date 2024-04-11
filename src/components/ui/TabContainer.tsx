import { ReactElement, useState } from "react";
import { BaseProps } from "../../utils/types/interface";
import { motion } from "framer-motion";

export interface Tab {
  title: string;
  icon?: ReactElement;
  content: ReactElement;
}

interface Props extends BaseProps {
  tabs: Tab[];
  width?: number | string;
  height?: number | string;
}

export const TabContainer = ({
  tabs,
  width = "100%",
  height = "100%",
}: Props) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  return (
    <div style={{ width: width, height: height }}>
      <ul className="bg-white flex w-full border-b-[1px]">
        {tabs.map((tab, index) => {
          return (
            <motion.li
              whileTap={{
                scale: 0.95,
              }}
              key={index}
              className={`p-5 text-[16px] font-semibold hover:cursor-pointer hover:text-amber-700 hover:bg-amber-200 ${
                selectedTab === index
                  ? "border-b-[2px] border-amber-700 text-amber-700"
                  : ""
              }`}
              onClick={() => setSelectedTab(index)}
            >
              {tab.icon}
              <span className="ml-2">{tab.title}</span>
            </motion.li>
          );
        })}
      </ul>
      <div className="mt-3">{tabs[selectedTab].content}</div>
    </div>
  );
};
