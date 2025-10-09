import { useEffect, useState } from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";


// Fix Leaflet marker icons using CDN
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});



const deliveryBoyTcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryBoyTracking = ({ data }) => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: data.deliveryBoyLocation.lat,
    lon: data.deliveryBoyLocation.lon
  });

  // ✅ Update position when props change
  useEffect(() => {
    // console.log("🗺️ DeliveryBoyTracking - Position updated:", data.deliveryBoyLocation);
    setCurrentPosition({
      lat: data.deliveryBoyLocation.lat,
      lon: data.deliveryBoyLocation.lon
    });
  }, [data.deliveryBoyLocation.lat, data.deliveryBoyLocation.lon]);

  const deliveryBoyLat = currentPosition.lat;
  const deliveryBoyLon = currentPosition.lon;
  const customerLat = data.customerLocation.lat;
  const customerLon = data.customerLocation.lon;

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = {
    deliveryBoyLat,
    deliveryBoyLon,
  };

  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md border border-gray-400">
      <MapContainer
        className={"w-full h-full"}
        center={[center.deliveryBoyLat, center.deliveryBoyLon]}
        zoom={16}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        zoomControl={true}
        key={`${deliveryBoyLat}-${deliveryBoyLon}`} // ✅ Force re-render on position change
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyTcon}>
          <Popup>Delivery Boy - Live Location</Popup>
        </Marker>
        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>Customer Location</Popup>
        </Marker>
        <Polyline positions={path} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;