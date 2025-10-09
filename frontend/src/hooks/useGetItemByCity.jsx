import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice";

function useGetItemByCity() {
  const dispatch = useDispatch()
  const {currentCity} = useSelector((state) => state.user);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`, {
          withCredentials: true,
        });
       dispatch(setItemsInMyCity(result.data))
      //  console.log(result.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [currentCity]);
}

export default useGetItemByCity;
