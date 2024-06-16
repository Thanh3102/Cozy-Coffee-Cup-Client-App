import { BaseProps } from "../../utils/types/interface";

const GroupButton = ({ children }: BaseProps) => {
  return <div className="flex gap-4">{children}</div>;
};

export default GroupButton;
