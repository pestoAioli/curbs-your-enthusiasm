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
  const [addingRandom, setAddingRandom] = useState(false);
  document.body.style.overflow = 'hidden';

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

  const addAnywhere = () => {
    console.log(map);
    setAddingRandom(() => true);
    map.doubleClickZoom.disable();
  }

  const dontAddAnywhere = () => {
    console.log(map);
    setAddingRandom(() => false);
    map.doubleClickZoom.enable();
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
              <p onClick={addMe} style={{ fontSize: '50px', margin: '0' }}>????</p>
              <p onClick={noMasMarker} style={{ fontSize: '50px', margin: '0' }}>????</p>
            </div>
          </Popup>
        </Marker>
      )}
      {allSpots.map((spot) =>
        <Marker key={spot.id} position={[Number(spot.lat), Number(spot.lon)]}>
          <Popup>
            <h1>{spot.name}</h1>
            <p>{spot.description}</p>
            <img src={spot.imagePath} style={{ objectFit: 'contain', width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
              <a style={{
                padding: '6px', backgroundColor: '#3264a8', borderRadius: '12px', borderWidth: '2px',
                borderColor: 'buttonborder', borderStyle: 'outset', color: 'whitesmoke'
              }}
                href={`https://maps.google.com/?q=${spot.lat},${spot.lon}`}
              >Directions</a>
              <RemoveThisSpot spot={spot} map={map} setRemovingASpot={setRemovingASpot} />
            </div>
          </Popup>
        </Marker>
      )}
      {addingASpot && (
        <FormForSubmittingASpot position={position} setAddingASpot={setAddingASpot} />
      )}
      {!addingASpot && (
        <NewSpot map={map} setPosition={setPosition} ></NewSpot>
      )}
      {!addingASpot && (
        <button onClick={addingRandom ? dontAddAnywhere : addAnywhere} className={styles.otherspot}>{addingRandom ? '???' : '???'}</button>
      )}
      {addingRandom && (
        <ForAddingSpotWherever setPosition={setPosition} setAddingRandom={setAddingRandom} />
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
      <button onClick={onButtonPress} className={styles.newspot}>????</button>
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


function FormForSubmittingASpot({ position, setAddingASpot }) {
  const addANewSpotToTheMap = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    const file = document.querySelector("[type=file]").files[0];
    console.log(file);
    formData.append("file", file);
    formData.append("upload_preset", "lki50l7d");
    const imageResponse = await fetch("https://api.cloudinary.com/v1_1/do02qffq1/image/upload", {
      method: 'POST',
      body: formData
    });
    const imageResult = await imageResponse.json();
    const actualImagePath = imageResult.secure_url;
    // Get data from the form.
    const data = {
      name: e.target.name.value,
      description: e.target.description.value,
      imagePath: actualImagePath,
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
    <form className={styles.formForNewSpot} onSubmit={addANewSpotToTheMap} method="post" encType="multipart/form-data" >
      <label htmlFor="name">Name da spot foo</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="description">Description</label>
      <input type="text" id="description" name="description" required />
      <label htmlFor="imagePath">Add a photo</label>
      <input type="file" id="imagePath" name="imagePath" accept="image/png, image/jpeg" required />
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
    <button onClick={spotBeGone} style={{ padding: '12px', backgroundColor: '#e34d4d', borderRadius: '12px', cursor: 'pointer' }}>Delete</button>
  )
}

function ForAddingSpotWherever({ setPosition, setAddingRandom }) {
  const map = useMapEvents({
    dblclick: (e) => {
      console.log(e);
      setPosition(() => e.latlng);
    },
  })
  return null;
}
