import DashboardLayout from './layout.js';
import styles from '../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import prisma from '../../utils/db.tsx'
export default function Navigation() {
  const MapWithNoSSR = dynamic(() => import("../../components/Map.js"), {
    ssr: false,
  })
  return (
    <div className={styles.map}>
      <MapWithNoSSR />
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

export async function getStaticProps(context) {

}
