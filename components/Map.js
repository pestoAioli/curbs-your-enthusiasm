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
  const [removingASpot, setRemovingASpot] = useState(false);

  useEffect(() => {
    if (addingASpot || removingASpot || !removingASpot) {
      refresh();
    }
    return () => console.log('unmounting')
  }, [addingASpot, removingASpot]);

  async function refresh() {
    const endpoint = '/api/hello'
    const options = {
      method: 'GET',
    }
    const refresh = await fetch(endpoint, options);
    const res = await refresh.json();
    console.log(res, 'reds');
    console.log(allSpots, 'reds 2');
    setAllSpots(() => res);
  };

  console.log(allSpots, 'spit')
  const noMasMarker = () => {
    setPosition(() => null);
  }

  const addMe = () => {
    console.log(spots, 'boobs', map, 'p', position);
    setAddingASpot(() => true);
    map.closePopup();
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
          <Popup>
            <p>This is exactly where you are, <br /> wanna add this spot?</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
              <p onClick={addMe} style={{ fontSize: '50px', margin: '0' }}>🫡</p>
              <p onClick={noMasMarker} style={{ fontSize: '50px', margin: '0' }}>🙅</p>
            </div>
          </Popup>
        </Marker>
      )}
      {allSpots.map((spot) =>
        <Marker position={[Number(spot.lat), Number(spot.lon)]}>
          <Popup>
            <h1>{spot.name}</h1>
            <p>{spot.description}</p>
            <RemoveThisSpot spot={spot} map={map} setRemovingASpot={setRemovingASpot} />
          </Popup>
        </Marker>
      )}
      {addingASpot && (
        <FormForSubmittingASpot position={position} setAddingASpot={setAddingASpot} />
      )}
      {!addingASpot && (
        <NewSpot map={map} setPosition={setPosition} ></NewSpot>
      )}
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

function FormForSubmittingASpot({ position, setAddingASpot, refresh }) {
  const addANewSpotToTheMap = async (e) => {
    e.preventDefault()

    // Get data from the form.
    const data = {
      name: e.target.name.value,
      description: e.target.description.value,
      imagePath: e.target.imagePath.value,
      lat: e.target.lat.value,
      lon: e.target.lon.value
    }
    console.log(data);
    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/hello'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    console.log(result.data);
    setAddingASpot(() => false);
  }

  return (
    <form className={styles.formForNewSpot} onSubmit={addANewSpotToTheMap} method="post" >
      <label htmlFor="name">Name da spot foo</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="description">Description</label>
      <input type="text" id="description" name="description" required />
      <label htmlFor="imagePath">Add a photo</label>
      <input type="text" id="imagePath" name="imagePath" required />
      <input type='hidden' id="lat" name="lat" value={`${position.lat.toString()}`} required />
      <input type='hidden' id="lon" name="lon" value={`${position.lng.toString()}`} required />
      <button type="submit">Submit</button>
    </form>
  )
}

function RemoveThisSpot({ spot, map, setRemovingASpot }) {
  const spotBeGone = async () => {
    const JSONdata = JSON.stringify(spot);
    const endpoint = '/api/hello';
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }
    console.log(spot, 'helo');
    const byeBye = await fetch(endpoint, options);
    const result = await byeBye.json();
    console.log(result);
    map.closePopup();
    return setRemovingASpot((prev) => !prev);
  }

  return (
    <button onClick={spotBeGone} style={{ padding: '12px', backgroundColor: '#e34d4d', borderRadius: '12px' }}>Delete</button>
  )
}
