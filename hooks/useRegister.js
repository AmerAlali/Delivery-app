import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../features/userSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
export const useRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const Register = async (name, email, phone, password) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    await axios
      .post(`${API_URL}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          userAgent: "CraveMobile",
        },
      })
      .then((response) => {
        //save the user to local storage
        AsyncStorage.setItem("user", JSON.stringify(response.data));

        //navigate the user to the home screen
        navigation.navigate("Home");

        // update the user
        dispatch(loginAction(response.data));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response.data.message);
        console.log(error, error.response.data);
      });
  };

  return { Register, isLoading, error };
};
