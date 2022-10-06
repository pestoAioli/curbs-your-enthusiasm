import dynamic from 'next/dynamic'
import HoldUp from '../components/HoldUp.js'
export default function Home() {

  const DynamicHomepage = dynamic(() => import('../components/HomePage.js'), {
    loading: () => <HoldUp />,
  })
  return (
    <>
      <DynamicHomepage />
    </>
  )
}
