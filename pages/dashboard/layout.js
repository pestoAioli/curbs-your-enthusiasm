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
      <h1>Curbs</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center' }}>
        <p>Add a spot</p>
        <p>View map</p>
        <p>Login</p>
      </div>
    </div>
  )
}
