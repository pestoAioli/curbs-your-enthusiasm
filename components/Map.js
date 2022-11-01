import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility';
import styles from '../styles/Home.module.css';
import { useCallback, useEffect, useRef, useState } from "react";
import L from 'leaflet';

let circle;

export default function Map({ spots }) {
  const [map, setMap] = useState(null);
  const [allSpots, setAllSpots] = useState(spots);
  const [position, setPosition] = useState(null);
  const [addingASpot, setAddingASpot] = useState(false);

  const noMasMarker = () => {
    setPosition(() => null);
  }

  const addMe = () => {
    console.log(spots, 'boobs', map, 'p', position);
    setAddingASpot(() => true);

  }
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
      {position && (
        <Marker position={position} >
          <Popup open>
            <p>This is exactly where you are, <br /> wanna add this spot?</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
              <p onClick={addMe} style={{ fontSize: '50px', margin: '0' }}>🫡</p>
              <p onClick={noMasMarker} style={{ fontSize: '50px', margin: '0' }}>🙅</p>
            </div>
          </Popup>
        </Marker>
      )}
      {allSpots.map((spot) =>
        <Marker position={[spot.lat, spot.lon]}>
        </Marker>
      )}
      {addingASpot && (
        <FormForSubmittingASpot position={position} />
      )}
      <NewSpot map={map} setPosition={setPosition} ></NewSpot>
    </MapContainer>
  )
}

function NewSpot({ map, setPosition }) {
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const onButtonPress = useCallback(() => {
    setLoading(() => true);
    map.locate().on("locationfound", (e) => {
      setLoading(() => false);
      setPosition(() => {
        const copy = JSON.parse(JSON.stringify(e.latlng));
        console.log(copy)
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

    })
  }, [map])

  return null
}

function FormForSubmittingASpot({ position }) {
  return (
    <form action="/api/hello" method="post" style={{ position: 'absolute', zIndex: '400000' }}>
      <label htmlFor="name">Name da spot foo</label>
      <input type="text" id="name" name="name" required />

      <label htmlFor="description">Description</label>
      <input type="text" id="description" name="description" required />
      <input type='hidden' id="lat" name="lat" value={`${position.lat}`} required />
      <input type='hidden' id="lng" name="lng" value={`${position.lng}`} required />
      <button type="submit">Submit</button>
    </form>
  )
}
