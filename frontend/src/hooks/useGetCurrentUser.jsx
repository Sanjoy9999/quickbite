import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
       dispatch(setUserData(result.data))
       dispatch(setLoading(false));
      } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser;
