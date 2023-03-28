import { useDispatch } from "react-redux";
import axios from "axios";
import { setAddress } from "../features/addressSlice";
import { API_URL } from "@env";
export const useAddress = () => {
  const dispatch = useDispatch();

  const fetchAddresses = async (user) => {
    if (user) {
      const response = await axios.post(
        `${API_URL}/user/addresses`,
        { token: user.token },
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      dispatch(setAddress(response.data));
      return response.data;
    }
  };

  return fetchAddresses;
};
