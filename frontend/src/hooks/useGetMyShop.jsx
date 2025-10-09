import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice"; // Import from ownerSlice

function useGetMyShop() {
  const dispatch = useDispatch();
  const {userData} = useSelector((state) => state.user);
  
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/my-shop`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(result.data)); // This should work now
      } catch (error) {
        console.log(error);
      }
    };
    fetchShop();
  }, [userData]);
}

export default useGetMyShop;
