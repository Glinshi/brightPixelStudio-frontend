import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Offers from './pages/Offers'
import { AppProvider } from './context/AppContext'
import OffersZoom from './pages/OffersZoom'
import Cart from './pages/Cart'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Account from './pages/Account'




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
          <Route path="/Account" element={<Account />} />

        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
