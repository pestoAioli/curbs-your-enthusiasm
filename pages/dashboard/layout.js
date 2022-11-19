import Link from 'next/link';
import styles from '../../styles/Home.module.css';
export default function DashboardLayout({ children }) {

  return (
    <>

      <DashboardNavigator />
      {children}

    </>
  )
}


function DashboardNavigator() {
  return (
    <div className={styles.nav}>
      <Link href='/'> <h1>Curbs</h1></Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', letterSpacing: '0.05px' }}>
        <Link href='/dashboard/navigation'>Map</Link>
        <Link href='/dashboard/list'>View all spots</Link>
        <p>Login</p>
      </div>
    </div>
  )
}
