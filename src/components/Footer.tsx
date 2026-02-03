import { Link } from 'react-router-dom'

export default function Footer() {
  return (<footer className="border-t border-gray-200 bg-[rgba(152,122,31,0.49)] opacity-65 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900">BrightPixel Studio</h3>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              We design and build digital products, services, and workshops for innovative team-building 
              experiences that elevate both people and technology as they grow!
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Company</h4>
            <ul className="mt-4 space-y-2">
              <li><span className="text-sm text-gray-400 cursor-not-allowed">About us</span></li>
              <li><span className="text-sm text-gray-400 cursor-not-allowed">Contact</span></li>
              <li><span className="text-sm text-gray-400 cursor-not-allowed">FAQ</span></li>
            </ul>
          </div>

          <div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><span className="text-sm text-gray-400 cursor-not-allowed">Privacy Policy</span></li>
                <li><span className="text-sm text-gray-400 cursor-not-allowed">Terms & Conditions</span></li>
                <li><span className="text-sm text-gray-400 cursor-not-allowed">Cookie Policy</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Explore</h4>
              <ul className="mt-4 space-y-2">
                <li><Link to="/offers" className="text-sm text-gray-600 hover:text-gray-900">Offers</Link></li>
                <li><Link to="/workshops" className="text-sm text-gray-600 hover:text-gray-900">Workshops</Link></li>
              </ul>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900">Account</h4>
              <ul className="mt-4 space-y-2">
                <li><Link to="/account" className="text-sm text-gray-600 hover:text-gray-900">My account</Link></li>
                <li><span className="text-sm text-gray-400 cursor-not-allowed">My workshops</span></li>
                <li><span className="text-sm text-gray-400 cursor-not-allowed">My orders</span></li>
                <li><span className="text-sm text-gray-400 cursor-not-allowed">Settings</span></li>
                <li><span className="text-sm text-gray-400 cursor-not-allowed">Logout</span></li>
              </ul>
            </div>

            <div className="text-sm text-gray-600">
              <p>Lichtstraat 42</p>
              <p>1015 AB Amsterdam</p>
              <p className="mt-2">info@brightpixel.nl</p>
              <p>+31 6 8128 4567</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}