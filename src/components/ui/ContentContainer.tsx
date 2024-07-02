import { BaseProps } from "../../utils/types/interface";

export const ContentContainer = ({ children }: BaseProps) => {
  return (
    <div className="ml-[--sidebar-width-sm] md:ml-[--sidebar-width] py-2 px-4 md:py-2 md:px-4 lg:py-4 lg:px-8 flex-1">
      {children}
    </div>
  );
};
