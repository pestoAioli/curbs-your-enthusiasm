import styles from '../../styles/Home.module.css';
export default function DashboardLayout({ children }) {
  const viewOpts = {
    map: 'map',
    list: 'list',
    login: 'login'
  }
  const viewContext = createContext(viewOpts.map);

  return (
    <>
      <viewContext.Provider  >
        <DashboardNavigator />
        {children}
      </viewContext.Provider>
    </>
  )
}


function DashboardNavigator() {
  return (
    <div className={styles.nav}>
      <h1>Curbs</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', letterSpacing: '0.5px' }}>
        <p>View all spots</p>
        <p>Login</p>
      </div>
    </div>
  )
}
