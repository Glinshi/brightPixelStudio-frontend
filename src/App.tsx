import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Offers from './pages/Offers'
import { AppProvider } from './context/AppContext'
import OffersZoom from './pages/OffersZoom'
import Cart from './pages/Cart'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Workshops from './pages/Workshops'
import WorkshopsZoom from './pages/WorkshopsZoom'




function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/offers-zoom" element={<OffersZoom />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops-zoom" element={<WorkshopsZoom />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
