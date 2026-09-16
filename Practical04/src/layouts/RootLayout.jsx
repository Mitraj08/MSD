import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

/**
 * ROUTER LAYOUT EXAMPLE: this component renders once and stays
 * mounted across every page — the Navbar never unmounts and
 * remounts as you navigate. <Outlet /> is the placeholder where
 * React Router swaps in whichever child route currently matches
 * the URL (Home, Trails, TrailDetail, About, or NotFound).
 */
function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default RootLayout
