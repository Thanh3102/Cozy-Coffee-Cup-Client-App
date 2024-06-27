import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../ui/Button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const DeniedAccess = () => {
  return (
    <div className="w-screen h-screen bg-gray-400">
      <div className="flex items-center justify-center h-full">
        <div className="p-5 bg-white rounded-md">
          <h1 className="text-[24px]">Bạn không có quyền truy cập trang này</h1>
          <div className="mt-2 flex justify-center items-center">
            <Link to={"/"}>
              <Button
                size="small"
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
              >
                Quay lại trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeniedAccess;
