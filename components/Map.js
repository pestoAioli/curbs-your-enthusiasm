import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility';
import styles from '../styles/Home.module.css';
import { useCallback, useEffect, useRef, useState } from "react";
import L from 'leaflet';

let circle;

export default function Map() {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);

  const noMasMarker = () => {
    setPosition(() => null);
  }
  return (
    <MapContainer
      center={[51, -0.09]}
      zoom={13}
      maxZoom={24}
      minZoom={10}
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
      {position && (
        <Marker position={position}>
          <Popup>
            <p>This is exactly where you are, <br /> wanna add this spot?</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
              <p style={{ fontSize: '50px', margin: '0' }}>🫡</p>
              <p onClick={noMasMarker} style={{ fontSize: '50px', margin: '0' }}>🙅</p>
            </div>
          </Popup>
        </Marker>
      )}
      <NewSpot map={map} setPosition={setPosition} ></NewSpot>
    </MapContainer>
  )
}

function NewSpot({ map, setPosition, position }) {
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const onButtonPress = useCallback(() => {
    setLoading(() => true);
    map.locate().on("locationfound", (e) => {
      setLoading(() => false);
      setPosition(() => {
        const copy = JSON.parse(JSON.stringify(e.latlng));
        return copy;
      })
      map.removeLayer(circle);
    })
  })
  return (
    <>
      {loading && (
        <h1 className={styles.loader}>As <br /> you wish...</h1>
      )}
      <button onClick={onButtonPress} className={styles.newspot}>Add a Spot<br /> where You <br /> currently are</button>
    </>
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
      console.log(map)
    })
  }, [map])

  return null
}
