import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react/jsx-runtime";

const Logo = () => {
  return (
    <div className="py-5 text-amber-700 text-center font-bold flex justify-center items-center gap-4 text-[18px] cursor-default">
      <FontAwesomeIcon icon={faMugHot} />
      <span>Cozy Coffee Cup</span>
    </div>
  );
};

export default Logo;
