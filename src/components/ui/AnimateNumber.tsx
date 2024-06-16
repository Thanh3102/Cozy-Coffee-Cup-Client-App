import { KeyframeOptions, useAnimate } from "framer-motion";
import { BaseProps } from "../../utils/types/interface";
import { currencyFormatter } from "../../utils/currencyFormat";
import { memo, useEffect } from "react";

interface AnimateProps extends BaseProps {
  from: number;
  to: number;
  currency?: boolean;
  options?: KeyframeOptions;
}

const AnimateNumber = ({
  from,
  to,
  currency = false,
  options,
  className = "",
}: AnimateProps) => {
  const [scope, animate] = useAnimate<HTMLSpanElement>();


  useEffect(() => {
    animate(from, to, {
      ...options,
      onUpdate: (value) => {
        scope.current.textContent = currency
          ? currencyFormatter.format(parseInt(value.toFixed(0)))
          : String(value.toFixed(0));
      },
    });
  }, [to]);

  return <span ref={scope} className={`font-semibold ${className}`}></span>;
};

export default memo(AnimateNumber);
