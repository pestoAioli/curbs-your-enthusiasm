import DashboardLayout from './layout.js';
import ListOfSpots from '../../components/ListOfSpots.js';
//import styles from '../../styles/Home.module.css';
import prisma from '../../prisma/prisma.js'

export default function List({ spots }) {

  return (
    <>
      <ListOfSpots spots={spots} />
    </>
  )
}

List.getLayout = function getLayout(list) {
  return (
    <DashboardLayout>
      {list}
    </DashboardLayout>
  )
}

export async function getServerSideProps() {
  const spots = await prisma.Spot.findMany();
  console.log(spots, 'butt')
  return { props: { spots } };
}
