import { useState } from "react"
import styles from '../styles/Home.module.css';

export default function ListOfSpots({ spots }) {
  const [allSpots, setAllSpots] = useState(spots);
  console.log(allSpots, 'sdf')
  return (
    <>
      {
        allSpots.map((spot) => (
          <div key={spot.id} className={styles.lust}>
            <div>
              <h1>{spot.name}</h1>
              <p>{spot.description}</p>
            </div>
            <div>
              <p>{spot.imagePath}</p>
            </div>
          </div>
        ))
      }
    </>
  )
}
