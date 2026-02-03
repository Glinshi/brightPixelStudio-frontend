import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NavigationArrows from '../components/NavigationArrows'
import OfferCard from '../components/OfferCard'

export const allOffers = [
  {
    id: 1,
    title: "Web Development",
    price: 1249.99,
    description: "Modern performant web applications built with the latest technologies and best practices for your business success.",
    features: ["Responsive design", "Progressive web apps", "E-commerce solutions", "Custom solutions"]
  },
  {
    id: 2,
    title: "E-Commerce Platform", 
    price: 2199.95,
    description: "Complete online store solutions with payment integration, inventory management, and customer analytics.",
    features: ["Payment gateway setup", "Inventory management", "Customer dashboard", "Order tracking"]
  },
  {
    id: 3,
    title: "Brand Identity Design",
    price: 949.50,
    description: "Comprehensive brand identity packages including logo design, color schemes, and brand guidelines.", 
    features: ["Logo design", "Brand guidelines", "Color palette", "Typography selection"]
  },
  {
    id: 4,
    title: "SEO Optimization",
    price: 749.99,
    description: "Boost your online visibility with comprehensive SEO strategies and technical optimization services.",
    features: ["Keyword research", "Technical SEO", "Content optimization", "Performance tracking"]
  },
  {
    id: 5,
    title: "Social Media Management",
    price: 499.95,
    description: "Professional social media management to grow your online presence and engage with your audience.",
    features: ["Content creation", "Post scheduling", "Community management", "Analytics reporting"]
  },
  {
    id: 6,
    title: "Database Development",
    price: 1799.99,
    description: "Custom database solutions and data management systems designed for scalability and security.",
    features: ["Database design", "Data migration", "Security setup", "Performance optimization"]
  },
  {
    id: 7,
    title: "Mobile App Development",
    price: 2499.00,
    description: "Native and cross-platform mobile applications that deliver exceptional user experiences across all devices.",
    features: ["iOS & Android apps", "React Native solutions", "App store optimization", "Mobile UI/UX design"]
  },
  {
    id: 8,
    title: "UI/UX Design",
    price: 799.50,
    description: "Beautiful, intuitive user interfaces and experiences that convert visitors into customers and drive engagement.",
    features: ["User research", "Wireframing & prototyping", "Design systems", "Usability testing"]
  },
  {
    id: 9,
    title: "Digital Marketing",
    price: 599.99,
    description: "Strategic digital marketing campaigns that grow your online presence and drive qualified traffic to your business.",
    features: ["SEO optimization", "Social media marketing", "Content strategy", "Analytics & reporting"]
  },
  {
    id: 10,
    title: "Cloud Hosting Setup",
    price: 399.95,
    description: "Professional cloud hosting solutions with SSL certificates, CDN setup, and 24/7 monitoring.",
    features: ["Cloud deployment", "SSL certificates", "CDN configuration", "Monitoring setup"]
  },
  {
    id: 11,
    title: "API Development",
    price: 1499.99,
    description: "Custom REST and GraphQL APIs for seamless data integration and third-party service connections.",
    features: ["REST API design", "GraphQL implementation", "Authentication setup", "API documentation"]
  },
  {
    id: 12,
    title: "WordPress Development",
    price: 899.50,
    description: "Custom WordPress websites and plugins tailored to your specific business needs and requirements.",
    features: ["Custom themes", "Plugin development", "WordPress optimization", "Content management"]
  }
]

export default function Offers() {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6

  const totalPages = Math.ceil(allOffers.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const currentOffers = allOffers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Our Offers</h1>
          <p className="text-gray-600 max-w-2xl">
            We offer comprehensive suite of services and products to help you build, launch and 
            grow digital products that make a difference.
          </p>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          <NavigationArrows
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}