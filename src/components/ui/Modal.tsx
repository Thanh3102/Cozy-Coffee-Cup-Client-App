import { AnimatePresence, motion } from "framer-motion";
import { BaseProps } from "../../utils/types/interface";

interface Props extends BaseProps {
  open: boolean;
}

export const ModalTitle = ({ children }: BaseProps) => {
  return <span className="text-[22px] font-semibold">{children}</span>;
};

export const ModalDescription = ({ children }: BaseProps) => {
  return <p className="max-w-[25vw] my-3">{children}</p>;
};

const Modal = ({ children, open }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 bottom-0 z-10 bg-[rgba(0,0,0,0.3)]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex justify-center items-center absolute top-0 left-0 right-0 bottom-0"
          >
            <div className="bg-white px-6 py-4 rounded-lg shadow-lg">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
