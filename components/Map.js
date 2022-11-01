import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility';
import styles from '../styles/Home.module.css';
import { useCallback, useEffect, useState } from "react";
import L from 'leaflet';

let circle;

export default function Map({ spots }) {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);

  return (
    <MapContainer
      center={[51, -0.09]}
      zoom={13}
      maxZoom={24}
      minZoom={5}
      scrollWheelZoom={true}
      zoomControl={false}
      className={styles.containertwo}
      ref={setMap}
    >
      <Locator />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position ? (
        <Marker position={position}>
          <Popup>
            <p>This is exactly where you are, <br /> wanna add this spot?</p>
          </Popup>
        </Marker>) : null
      }
      {spots.map((spot, i) => (
        <Marker position={[spot.lat, spot.lon]}>
        </Marker>
      ))}
      <NewSpot map={map} setPosition={setPosition}></NewSpot>
    </MapContainer>
  )
}

function NewSpot({ map, setPosition }) {

  const onButtonPress = useCallback(() => {
    map.locate().on("locationfound", (e) => {
      setPosition(() => {
        const copy = JSON.parse(JSON.stringify(e.latlng));
        return copy;
      })
      map.removeLayer(circle);
    })
  })
  return (
    <button onClick={onButtonPress} className={styles.newspot}>+</button>
  )
}

function Locator() {

  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy
      circle = L.circle(e.latlng, radius);
      circle.addTo(map);

    })
  }, [map])

  return null
}
