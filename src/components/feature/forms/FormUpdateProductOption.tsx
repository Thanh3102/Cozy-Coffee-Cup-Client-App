import { Fragment } from "react/jsx-runtime";
import { ProductOption } from "../../../utils/types/type";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../lib/axios";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../ui/Button";
import { BaseProps } from "../../../utils/types/interface";

interface Props extends BaseProps {
  product_id: number;
  reFetchData: () => void;
  close: () => void;
}

type Option = {
  id: number;
  title: string;
  values: Array<{ id: number; name: string; price: number }>;
};

type SelectedOption = { option_id: number; values: number[] };

const FormUpdateProductOption = ({ product_id, close, reFetchData }: Props) => {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const fetchOptions = async () => {
    try {
      const { options } = await axiosClient.get<
        void,
        { options: ProductOption[] }
      >("/api/product/getOption");

      setOptions(options);
    } catch (error: any) {
      toast.error(error.message ?? "Không thể load dữ liệu tùy chọn");
    }
  };

  const fetchProductOption = async () => {
    try {
      const { options } = await axiosClient.get<void, { options: Option[] }>(
        `api/product/getProductOption?id=${product_id}`
      );

      const productOption = options.map((option) => {
        const values = option.values.map((v) => v.id);
        return {
          option_id: option.id,
          values: values,
        };
      });
      setSelectedOptions(productOption);
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchProductOption();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptions((options) => {
      const id = parseInt(e.target.value);
      if (options.find((option) => option.option_id === id)) {
        let newOptions = options.filter((item) => item.option_id !== id);
        return newOptions;
      } else {
        return [{ option_id: id, values: [] }, ...options];
      }
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueId = parseInt(e.target.value);
    const optionId = parseInt(e.target.getAttribute("data-option-id") ?? "-1");
    if (optionId === -1) return;

    setSelectedOptions((options) => {
      const itemIndex = options.findIndex(
        (option) => option.option_id === optionId
      );
      let updateOption;
      if (options[itemIndex].values.includes(valueId)) {
        const newValue = options[itemIndex].values.filter((v) => v !== valueId);
        updateOption = {
          option_id: optionId,
          values: newValue,
        };
      } else {
        updateOption = {
          option_id: optionId,
          values: [valueId, ...options[itemIndex].values],
        };
      }

      console.log(updateOption);

      const newOptions = options.filter((item) => item.option_id !== optionId);
      return [updateOption, ...newOptions];
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    for (let option of selectedOptions) {
      if (option.values.length == 0) {
        toast.error("Có tùy chọn chưa chọn giá trị. Vui lòng kiểm tra lại!");
        return;
      }
    }
    try {
      const { message } = await axiosClient.post<any, { message: string }>(
        "/api/product/updateProductOption",
        {
          product_id: product_id,
          options: selectedOptions,
        }
      );
      toast.success(message);
      reFetchData();
      close();
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    }
  };

  const isValueChecked = (option_id: number, value_id: number) => {
    const findOption = selectedOptions.find(
      (option) => option.option_id === option_id
    );

    if (findOption) {
      const valueList = findOption.values;
      if (valueList.find((value) => value === value_id)) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <Fragment>
      <form className="min-w-[30vw]" onSubmit={handleSubmit}>
        <h1>Danh sách tùy chọn</h1>
        {options.map((option) => (
          <div className="" key={option.id}>
            <div className="flex items-center gap-2" key={option.id}>
              <input
                key={option.id}
                value={option.id}
                type="checkbox"
                id="title"
                className="w-[16px] h-[16px]"
                onChange={handleTitleChange}
                checked={
                  selectedOptions.find((item) => item.option_id === option.id)
                    ? true
                    : false
                }
              />
              <label htmlFor="">{option.title}</label>
            </div>
            <AnimatePresence>
              {selectedOptions.find((item) => item.option_id === option.id) && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "100%",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="ml-3 flex flex-wrap"
                >
                  {option.values.map((value) => (
                    <div className="w-[50%] flex items-center gap-2">
                      <input
                        data-option-id={option.id}
                        value={value.id}
                        type="checkbox"
                        id="value"
                        className="w-[16px] h-[16px]"
                        onChange={handleValueChange}
                        checked={isValueChecked(option.id, value.id)}
                      />
                      <label htmlFor="">{value.name}</label>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div className="flex gap-4 items-center justify-center">
          <Button size="small" color="danger" type="button" onClick={close}>
            Hủy
          </Button>
          <Button size="small" type="submit">
            Lưu
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default FormUpdateProductOption;
