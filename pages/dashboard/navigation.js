import DashboardLayout from './layout.js';
import styles from '../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import prisma from '../../utils/db.js'


export default function Navigation({ spots }) {

  const MapWithNoSSR = dynamic(() => import("../../components/Map.js"), {
    ssr: false,
  })
  return (
    <div className={styles.map}>
      <MapWithNoSSR spots={spots} />
    </div>
  )
}

Navigation.getLayout = function getLayout(navigation) {
  return (
    <DashboardLayout>
      {navigation}
    </DashboardLayout>
  )
}

export async function getServerSideProps() {
  const spots = await prisma.spots.findMany();
  return { props: { spots: JSON.parse(JSON.stringify(spots)) } };
}
