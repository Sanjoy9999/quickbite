import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCity,setCurrentState,setCurrentAddress, setUserData} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEO_API_KEY;
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        dispatch(setLocation({ lat: latitude, lon: longitude }));
        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
        );
        // console.log(result.data);

        dispatch(setCurrentCity(result?.data?.results[0].city ||
          result?.data?.results[0].country
        ));
        dispatch(setCurrentState(result?.data?.results[0].state));
        dispatch(setCurrentAddress(`${result?.data?.results[0].address_line1 || ''} ${result?.data?.results[0].address_line2 || ''}`.trim()));
        dispatch(setAddress(result?.data?.results[0].formatted || ''));
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  }, [userData]);
}

export default useGetCity;
