import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseProps } from "../../utils/types/interface";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const ErrorMessage = ({ children }: BaseProps) => {
  return (
    <div className="flex items-center text-red-500 gap-2">
      <FontAwesomeIcon icon={faTriangleExclamation} />
      <span>{children}</span>
    </div>
  );
};

export default ErrorMessage;
