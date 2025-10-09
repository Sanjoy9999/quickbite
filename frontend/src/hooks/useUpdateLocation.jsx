import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData?._id) return;

    let lastSent = 0;
    const throttleMs = 3000; // ✅ Set to 3 seconds as requested

    const send = async (lat, lon) => {
      try {
        const response = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );

        // ✅ Show success message every 3 seconds
        // console.log(`✅ Update location successfully`);
        // console.log(`📍 Coordinates - Lat: ${lat}, Lon: ${lon}`);
        // console.log(`👤 Role: ${userData.role}, Name: ${userData.fullName}`);
        // console.log("⏰ Time:", new Date().toLocaleTimeString());
        // console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      } catch (e) {
        console.log("❌ Update location error:", e?.response?.data || e.message);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastSent >= throttleMs) {
          lastSent = now;
          send(pos.coords.latitude, pos.coords.longitude);
        }
      },
      (err) => console.log("❌ Geolocation watch error:", err),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData]);
}

export default useUpdateLocation;
