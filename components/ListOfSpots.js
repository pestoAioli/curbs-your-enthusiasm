import { useEffect, useState } from "react"
import styles from '../styles/Home.module.css';

export default function ListOfSpots({ spots }) {
  const [allSpots, setAllSpots] = useState(spots);
  useEffect(() => {
    document.body.style.overflow = 'visible';
  }, [])

  console.log(allSpots, 'sdf')
  return (
    <>
      {
        allSpots.map((spot) => (
          <div style={{ paddingBottom: 12 }}>
            <div key={spot.id} className={styles.lust}>
              <div style={{ marginLeft: 16 }}>
                <h1 className={styles.namen}>{spot.name}</h1>
                <p className={styles.descy} >{spot.description}</p>
                <a style={{
                  padding: '6px', backgroundColor: '#3264a8', borderRadius: '12px', borderWidth: '2px',
                  borderColor: 'buttonborder', borderStyle: 'outset', color: 'whitesmoke'
                }}
                  href={`https://maps.google.com/?q=${spot.lat},${spot.lon}`}
                >Directions</a>
              </div>
              <div>
                <img src={spot.imagePath} className={styles.pikture} />
              </div>
            </div>
          </div>
        ))
      }
    </>
  )
}
