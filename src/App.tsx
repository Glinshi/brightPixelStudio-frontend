import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Offers from './pages/Offers'
import { AppProvider } from './context/AppContext'
import OffersZoom from './pages/OffersZoom'
import Cart from './pages/Cart'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Workshops from './pages/Workshops'
import WorkshopsZoom from './pages/WorkshopsZoom'
import Pay from './pages/Pay'




function App() {
  return (
    <AppProvider>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/offers-zoom" element={<OffersZoom />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops-zoom" element={<WorkshopsZoom />} />
            <Route path="/pay" element={<Pay />}/>
          </Routes>
          <Footer />
        </>
      </Router>
    </AppProvider>
  )
}

export default App
