import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { useEffect, useState } from "react";
import L from 'leaflet';

export default function Map() {


  return (
    <MapContainer
      center={[51, -0.09]}
      zoom={13}
      maxZoom={24}
      minZoom={10}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: "100%", width: "100%", position: 'absolute' }}
    >
      <Locator />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[51.505, -0.09]}
        draggable={true}
        animate={true}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

function NewSpot() {
  const [spot, addSpot] = useState([]);
}

function Locator() {

  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
    })
  }, [map])

  return null
}
