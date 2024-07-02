import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Logo = () => {
  return (
    <div className=" text-amber-700 text-center font-bold flex items-center  cursor-default justify-center text-xl gap-2 py-3 md:py-5 md:text-lg md:gap-4">
      <FontAwesomeIcon icon={faMugHot} />
      <span className="hidden md:inline-block">Cozy Coffee Cup</span>
    </div>
  );
};

export default Logo;
