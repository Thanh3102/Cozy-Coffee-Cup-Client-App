import { ReactElement } from "react";
import { motion } from "framer-motion";
import { BaseProps } from "../../utils/types/interface";
interface Props extends BaseProps {
  color?: "primary" | "danger" | "warning" | "success";
  size?: "tiny" | "small" | "medium" | "big";
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  form?: string;
  icon?: ReactElement;
  onClick?: () => void;
}

const ButtonOption = {
  color: {
    primary: {
      normal: "bg-blue-500",
      hover: "hover:bg-blue-600",
    },
    danger: {
      normal: "bg-red-500",
      hover: "hover:bg-red-600",
    },
    warning: {
      normal: "bg-yellow-500",
      hover: "hover:bg-yellow-600",
    },
    success: {
      normal: "bg-green-500",
      hover: "hover:bg-green-600",
    },
  },
  size: {
    tiny: "px-2 py-1 text-[12px]",
    small: "px-4 py-2 text-[14px]",
    medium: "px-6 py-3 text-[16px]",
    big: "px-8 py-4 text-[18px]",
  },
};

const Button = ({
  children,
  color = "primary",
  size = "medium",
  loading,
  icon,
  className = "",
  ...rest
}: Props) => {
  let buttonClassName = `rounded-md text-white w-fit flex items-center justify-center gap-4 ${ButtonOption.color[color].normal} ${ButtonOption.color[color].hover} ${ButtonOption.size[size]} ${className}`;

  if (loading) {
    return (
      <button className={`${buttonClassName}`}>
        <div className=" border-l-2 border-t-2 animate-spin border-white rounded-full h-4 w-4"></div>
        Loading...
      </button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 1.05 }}
      className={buttonClassName}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  );
};

export default Button;
