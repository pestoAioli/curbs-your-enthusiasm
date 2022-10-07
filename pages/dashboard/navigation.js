import DashboardLayout from './layout.js';

export default function Navigation() {
  return (
    <h1 style={{ color: '#d4c0be' }}>Boobs!</h1>
  )
}


Navigation.getLayout = function getLayout(navigation) {
  return (
    <DashboardLayout>
      {navigation}
    </DashboardLayout>
  )
}
