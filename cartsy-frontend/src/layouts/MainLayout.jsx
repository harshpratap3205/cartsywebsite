import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ScrollProgressBar from '../components/common/ScrollProgressBar'

const MainLayout = () => {
  const location = useLocation()
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </>
  )
}

export default MainLayout