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
  size?: "normal" | "small";
}

const TabOptions = {
  size: {
    normal: "p-3 sm:p-5 sm:text-sm md:text-base",
    small: "py-3 px-4 text-[15px]",
  },
};

export const TabContainer = ({ tabs, size = "normal" }: Props) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  return (
    <div>
      <ul className="bg-white flex border-b-[1px]">
        {tabs.map((tab, index) => {
          return (
            <motion.li
              whileTap={{
                scale: 0.95,
              }}
              key={index}
              className={`${
                TabOptions.size[size]
              } font-semibold hover:cursor-pointer hover:text-amber-700 text-sm lg:text-base ${
                selectedTab === index
                  ? "border-b-[2px] border-amber-700 text-amber-700"
                  : ""
              }`}
              onClick={() => setSelectedTab(index)}
            >
              {tab.icon}
              <span className={`${tab.icon ? "ml-2" : ""}`}>{tab.title}</span>
            </motion.li>
          );
        })}
      </ul>
      <div className="mt-3">{tabs[selectedTab].content}</div>
    </div>
  );
};
