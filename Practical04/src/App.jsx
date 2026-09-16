import { Route, Routes } from 'react-router-dom'
import RootLayout from './layouts/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Trails from './pages/Trails.jsx'
import TrailDetail from './pages/TrailDetail.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

/**
 * ROUTE MAP: this is the one place that says "this URL renders that
 * component." RootLayout is the parent route — its Navbar and
 * Footer stay mounted, and whichever nested route below matches the
 * current URL renders into its <Outlet />.
 *
 *   /              -> Home
 *   /trails        -> Trails            (list + ?difficulty= filter)
 *   /trails/:id    -> TrailDetail       (dynamic segment via useParams)
 *   /about         -> About
 *   *              -> NotFound          (catches any unmatched URL)
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="trails" element={<Trails />} />
        <Route path="trails/:trailId" element={<TrailDetail />} />
        <Route path="about" element={<About />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
