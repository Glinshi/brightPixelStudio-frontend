import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/Button'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scale-in-animation {
          animation: scaleIn 0.8s ease-out forwards;
        }
      `}</style>
    
      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="text-center">
          <div className="scale-in-animation">
            <h1 className="text-5xl font-light text-gray-800 md:text-6xl">
              Where Creativity
            </h1>
            <h1 className="text-5xl font-light text-indigo-500 md:text-6xl">
              Meets Technology
            </h1>
          </div>
          

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
            We blend design thinking with cutting-edge technology to create
            experiences that inspire, educate, and transform.
          </p>
          
    
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button to="/offers" variant="primary">
              Explore Offers →
            </Button>
            <Button to="/workshops" variant="secondary">
              View Workshops
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}