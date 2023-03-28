import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearBasketItems } from "../features/basketSlice";

export const useCreateOrder = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const disptach = useDispatch();

  const createOrder = async (
    restaurant_id,
    address,
    payment,
    note,
    total,
    discount,
    deliveryCost,
    datalist,
    voucher,
    phone
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://cravecorner.shop/api/storeOrder",
        {
          token: user.token,
          restaurant_id: restaurant_id,
          address: address,
          payment: payment,
          note: note,
          total: total,
          discount: discount,
          deliveryCost: deliveryCost,
          datalist: datalist,
          voucher: voucher,
          phone: phone,
        }
      );
      disptach(clearBasketItems());
      return response.data;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { createOrder, isLoading, error };
};
