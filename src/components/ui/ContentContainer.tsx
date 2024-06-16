import { BaseProps } from "../../utils/types/interface";

export const ContentContainer = ({ children }: BaseProps) => {
  return (
    <div className="ml-[--sidebar-width] py-4 px-8 flex-1">{children}</div>
  );
};
