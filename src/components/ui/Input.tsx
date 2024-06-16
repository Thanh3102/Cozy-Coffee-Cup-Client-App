import { RefObject } from "react";
import { BaseProps } from "../../utils/types/interface";
import { UseFormRegister } from "react-hook-form";

interface Props extends BaseProps {
  type?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  readOnly?: boolean;
  className?: string;
  innerRef?: RefObject<HTMLInputElement>;
  value?: string | number;
  disable?: boolean;
  min?: number;
  max?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  children,
  readOnly,
  innerRef,
  className,
  value,
  disable,
  ...rest
}: Props) => {
  return (
    <input
      ref={innerRef}
      readOnly={readOnly}
      value={value}
      {...rest}
      className={`px-4 py-1 border-black border-solid border-[1px] outline-none rounded-md ${className} ${
        disable ? "bg-gray-200" : null
      }`}
    />
  );
};

export default Input;
