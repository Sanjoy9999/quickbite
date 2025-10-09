import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch()
  const {currentCity} = useSelector((state) => state.user);
  
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`, {
          withCredentials: true,
        });
       dispatch(setShopInMyCity(result.data))
      //  console.log(result.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchShop();
  }, [currentCity]);
}

export default useGetShopByCity;
