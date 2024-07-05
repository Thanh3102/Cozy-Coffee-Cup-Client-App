import { Fragment } from "react/jsx-runtime";
import { Tab, TabContainer } from "../ui/TabContainer";
import { toast } from "react-toastify";
import { SetStateAction, useEffect, useState } from "react";
import axiosClient from "../../lib/axios";
import { BaseProps } from "../../utils/types/interface";
import { currencyFormatter } from "../../utils/currencyFormat";
import { Option, OrderItem, ProductOption } from "../../utils/types/type";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";

interface ProductListProps extends BaseProps {
  products: Product[];
  setSelected?: React.Dispatch<React.SetStateAction<Product | undefined>>;
}

type Product = {
  id: number;
  image: string | null;
  name: string;
  price: number;
  discount: number;
  status: boolean;
  type: {
    name: string;
  };
};

type ProductByCategory = {
  category: string;
  products: Product[];
};

const ProductList = ({ products, setSelected }: ProductListProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  return (
    <Fragment>
      <div className="flex flex-wrap -mx-3 -my-2 overflow-y-scroll h-[250px] lg:h-[calc(100vh-200px)] max-h-fit">
        {!(products && products.length !== 0) ? (
          <h1 className="mx-3">Không có sản phẩm</h1>
        ) : (
          products.map((product) => (
            <Fragment>
              <div className="px-3 w-[25%]" key={product.id}>
                <div
                  className={`${
                    product === selectedProduct
                      ? "border-amber-500 text-amber-500"
                      : " border-black text-black"
                  } border-[2px] rounded-lg py-4 px-2 h-[150px] lg:h-[180px] my-2`}
                  onClick={() => {
                    setSelectedProduct(product);
                    if (setSelected) setSelected(product);
                  }}
                >
                  <div className="flex flex-col justify-around items-center rounded-lg gap-4 relative">
                    {selectedProduct?.id === product.id && (
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="absolute top-0 right-0"
                      />
                    )}
                    <div className="w-[60px] h-[60px] lg:w-[90px] lg:h-[90px]">
                      <img
                        src={
                          product.image ??
                          "data:image/jpeg;base64,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"
                        }
                        alt=""
                        className="h-full w-full rounded-lg"
                      />
                    </div>
                    <p className="text-center font-medium lg:text-base text-xs">
                      {product.name}
                    </p>
                  </div>
                </div>
              </div>
            </Fragment>
          ))
        )}
      </div>
    </Fragment>
  );
};

interface OrderProductSelectProps {
  close: () => void;
  setOrderItems: React.Dispatch<SetStateAction<OrderItem[]>>;
}

const OrderProductSelect = ({
  close,
  setOrderItems,
}: OrderProductSelectProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>();
  const [productByCategory, setProductByCategory] = useState<
    ProductByCategory[]
  >([]);

  const { register, handleSubmit, setValue } = useForm<{
    quantity: number;
    is_gift: boolean;
  }>({
    defaultValues: {
      is_gift: false,
      quantity: 1,
    },
  });

  const fetchData = async () => {
    try {
      const { productByCategory } = await axiosClient.get<
        void,
        { productByCategory: ProductByCategory[] }
      >("/api/product/getAllByCategory");
      setProductByCategory(productByCategory);
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  const fetchOption = async () => {
    try {
      if (!selectedProduct) return;
      const { options } = await axiosClient.get<
        void,
        { options: ProductOption[] }
      >(`/api/product/getProductOption?id=${selectedProduct?.id}`);
      setProductOptions(options);

      for (let opt of options) {
        if (opt.required) {
          setSelectedOptions((selectedOpt) => {
            return [
              {
                id: opt.id,
                title: opt.title,
                values: [],
              },
              ...selectedOpt,
            ];
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  const getOption = (id: number): ProductOption | undefined => {
    return productOptions?.find((option) => option.id === id);
  };

  const getOptionValue = (option_id: number, value_id: number) => {
    const option = productOptions?.find((option) => option.id === option_id);
    if (option) {
      return option.values.find((value) => value.id === value_id);
    }
    return undefined;
  };

  const isAllowMulti = (option_id: number): boolean => {
    if (!productOptions) return false;
    const option = productOptions.find((opt) => opt.id === option_id);
    if (option) {
      if (option.allows_multiple) return true;
    }
    return false;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectId = parseInt(e.target.value);
    const option = getOption(selectId);

    let isContain = selectedOptions.find((option) => option.id === selectId);

    if (isContain) {
      setSelectedOptions((selectOption) => {
        const newSelectOption = selectOption.filter(
          (opt) => opt.id !== selectId
        );

        return newSelectOption;
      });
    } else {
      setSelectedOptions((selectedOptions) => {
        return [
          {
            id: selectId,
            title: option !== undefined ? option.title : "",
            values: [],
          },
          ...selectedOptions,
        ];
      });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectValueId = parseInt(e.target.value);
    const selectOptionId = e.target.getAttribute("data-option-id");
    if (!selectOptionId || !selectValueId) return;
    const value = getOptionValue(parseInt(selectOptionId), selectValueId);

    setSelectedOptions((selectOptions) => {
      const option = selectOptions.find(
        (opt) => opt.id === parseInt(selectOptionId)
      );

      if (option === undefined || value === undefined) return selectOptions;

      if (isAllowMulti(option.id)) {
        const isContainValue = option.values.find(
          (value) => value.id === selectValueId
        );
        if (isContainValue && option !== undefined) {
          const newValues = option.values.filter((v) => v.id !== selectValueId);

          const newSelectOptions = selectOptions.filter(
            (opt) => opt.id !== parseInt(selectOptionId)
          );

          const newOption = {
            id: option.id,
            title: option.title,
            values: newValues,
          };
          return [newOption, ...newSelectOptions];
        } else {
          const newValues = [value, ...option.values];
          const newSelectOptions = selectOptions.filter(
            (opt) => opt.id !== parseInt(selectOptionId)
          );
          const newOption = {
            id: option.id,
            title: option.title,
            values: newValues,
          };
          return [newOption, ...newSelectOptions];
        }
      } else {
        const newValues = [value];
        const newSelectOptions = selectOptions.filter(
          (opt) => opt.id !== parseInt(selectOptionId)
        );
        const newOption = {
          id: option.id,
          title: option.title,
          values: newValues,
        };
        return [newOption, ...newSelectOptions];
      }
    });
  };

  const onSubmit: SubmitHandler<{
    quantity: number;
    is_gift: boolean;
  }> = async (data) => {
    for (let option of selectedOptions) {
      if (option.values.length == 0) {
        toast.error("Có tùy chọn chưa chọn giá trị");
        return;
      }
    }

    setOrderItems((items) => {
      if (selectedProduct !== undefined) {
        const item: OrderItem = {
          product_id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          discount: selectedProduct.discount,
          is_gift: data.is_gift,
          quantity: data.quantity,
          options: selectedOptions,
        };

        return [item, ...items];
      }
      return items;
    });
    close();
  };

  const isValueChecked = (option_id: number, value_id: number) => {
    const findOption = selectedOptions.find(
      (option) => option.id === option_id
    );

    if (findOption) {
      const valueList = findOption.values;
      if (valueList.find((value) => value.id === value_id)) {
        return true;
      }
      return false;
    }
    return false;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedOptions([]);
    fetchOption();
    setValue("quantity", 1);
    setValue("is_gift", false);
  }, [selectedProduct]);

  const Tabs: Tab[] = productByCategory.map((item) => {
    return {
      title: item.category,
      content: (
        <ProductList
          products={item.products}
          setSelected={setSelectedProduct}
        />
      ),
    };
  });

  return (
    <Fragment>
      <div className="flex w-[calc(100vw-80px)] h-[calc(100vh-80px)] min-h-[500px] flex-col overflow-y-auto overflow-x-hidden lg:flex-row min-w-[600px]">
        <div className="lg:flex-[7] flex-1">
          {Tabs.length != 0 && <TabContainer tabs={Tabs} />}
        </div>
        <div className="w-full h-[1px] bg-slate-500 mb-2 mt-4 lg:h-full lg:w-[1px] lg:mx-4 lg:my-0"></div>
        <div className="lg:flex-[3] flex-[2] lg:px-6 lg:py-2 mt-2">
          {selectedProduct ? (
            <div className="flex flex-col justify-between h-full">
              <div className="h-fit">
                <p className="font-medium text-sm lg:text-lg">
                  Sản phẩm:{" "}
                  <span className="uppercase">{selectedProduct?.name}</span>
                </p>
                <p className="font-medium text-sm lg:text-lg">
                  Giá bán: {currencyFormatter.format(selectedProduct?.price)}
                </p>
                {productOptions && productOptions.length !== 0 ? (
                  <Fragment>
                    <p className="font-medium text-sm lg:text-lg">Tùy chọn</p>
                    <div className="overflow-y-scroll max-h-[40vh]">
                      {productOptions.map((productOtp) => (
                        <div>
                          <div className="flex items-center gap-2">
                            <input
                              key={`product_opt_key_${productOtp.id}`}
                              value={productOtp.id}
                              type="checkbox"
                              id={`product_option_title_${productOtp.id}`}
                              className="w-[16px] h-[16px]"
                              onChange={handleTitleChange}
                              checked={
                                selectedOptions.find(
                                  (selectOtp) => selectOtp.id === productOtp.id
                                )
                                  ? true
                                  : false
                              }
                              disabled={productOtp.required}
                            />
                            <label
                              htmlFor={`product_option_title_${productOtp.id}`}
                              className="font-medium lg:text-base text-sm"
                            >{`${productOtp.title} ${
                              productOtp.required ? "(Bắt buộc)" : ""
                            }`}</label>
                          </div>
                          <AnimatePresence>
                            {selectedOptions.find(
                              (selectOtp) => selectOtp.id === productOtp.id
                            ) && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  height: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                  height: "auto",
                                }}
                                exit={{
                                  opacity: 0,
                                  height: 0,
                                }}
                                className="ml-3 flex flex-wrap"
                              >
                                {productOtp.values.map((value) => (
                                  <div className="w-[50%] flex items-center gap-2">
                                    <input
                                      id={`product_option_${productOtp.id}_value_${value.id}`}
                                      data-option-id={productOtp.id}
                                      value={value.id}
                                      type={
                                        productOtp.allows_multiple
                                          ? "checkbox"
                                          : "radio"
                                      }
                                      name={`value_${productOtp.id}_${value.id}`}
                                      className="w-[16px] h-[16px]"
                                      onChange={handleValueChange}
                                      checked={isValueChecked(
                                        productOtp.id,
                                        value.id
                                      )}
                                    />
                                    <label
                                      htmlFor={`product_option_${productOtp.id}_value_${value.id}`}
                                      className="lg:text-base text-sm"
                                    >{`${
                                      value.name
                                    } (${currencyFormatter.format(
                                      value.price
                                    )})`}</label>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </Fragment>
                ) : null}
                <form className="my-3" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label htmlFor="">Số lượng</label>
                      <input
                        type="number"
                        className="input"
                        min={1}
                        max={99}
                        {...register("quantity", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-[16px] h-[16px]"
                        {...register("is_gift", {
                          setValueAs: (v) => Boolean(v),
                        })}
                      />
                      <label htmlFor="">Tặng kèm</label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 justify-end">
                    <Button
                      size="small"
                      type="button"
                      color="danger"
                      onClick={close}
                      icon={<FontAwesomeIcon icon={faX} />}
                    >
                      Đóng
                    </Button>
                    <Button
                      size="small"
                      color="success"
                      type="submit"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                    >
                      Thêm
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <Fragment>
              <h1>Chưa chọn sản phẩm</h1>
              <Button
                size="small"
                color="danger"
                onClick={close}
                icon={<FontAwesomeIcon icon={faX} />}
              >
                Đóng
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default OrderProductSelect;
