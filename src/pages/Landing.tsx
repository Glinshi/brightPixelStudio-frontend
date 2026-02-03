import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/Button'
import DarkVeil from '../components/Darkveil'

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col">
      <Navbar />
      <div className="relative flex-1 flex items-center justify-center px-6 min-h-[80vh]">
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <DarkVeil
            hueShift={-155}
            noiseIntensity={0.18}
            scanlineIntensity={0}
            speed={0.4}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1.5}
          />
        </div>
        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .scale-in-animation {
            animation: scaleIn 0.8s ease-out forwards;
          }
        `}</style>
        <div className="relative z-10 text-center w-full">
          <div className="scale-in-animation">
            <h1 className="text-5xl font-light text-[hsla(45,59%,52%,1)] md:text-6xl">
              Where Creativity
            </h1>
            <h1 className="text-5xl font-light text-slate-700 md:text-6xl">
              Meets Technology
            </h1>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
            We blend design thinking with cutting-edge technology to create
            experiences that inspire, educate, and transform.
          </p>
            <div className="mt-8 flex flex-row gap-4 justify-end items-end sm:pr-8 md:pr-16 lg:pr-32 sm:pt-5">
              <Button to="/offers" variant="primary" className="whitespace-nowrap">
                Explore Offers →
              </Button>
              <Button to="/workshops" variant="secondary" className="whitespace-nowrap">
                View Workshops
              </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}