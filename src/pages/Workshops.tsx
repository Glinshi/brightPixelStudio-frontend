import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavigationArrows from "../components/NavigationArrows";
import WorkshopCard from "../components/WorkshopCard";

export const allWorkshops = [
  {
    id: 1,
    title: "Python Programming Fundamentals",
    date: "March 15, 2026 14:00",
    description:
      "Master Python basics, data structures, and algorithms. Perfect for beginners entering the programming world",
     imageSrc: "/src/assets/images/shopping.png",
    imageAlt: "Web Development"
  },
  {
    id: 2,
    title: "Machine Learning with TensorFlow",
    date: "March 22, 2026 10:00",
    description:
      "Build and train neural networks using TensorFlow. Learn deep learning concepts and practical AI applications",
    workshopId: "workshopcard2",
     imageSrc: "",
    imageAlt: "No image available",
  },
  {
    id: 3,
    title: "Full-Stack JavaScript Development",
    date: "March 29, 2026 16:30",
    description:
      "Complete web development with Node.js, Express, React, and MongoDB. Build real-world applications",
    workshopId: "workshopcard3",
     imageSrc: "",
    imageAlt: "No image available",
  },
  {
    id: 4,
    title: "Cloud Computing with AWS",
    date: "April 5, 2026 13:00",
    description:
      "Deploy scalable applications on Amazon Web Services. Learn EC2, S3, Lambda, and cloud architecture",
    workshopId: "workshopcard4",
     imageSrc: "",
    imageAlt: "No image available",     
  },
  {
    id: 5,
    title: "Cybersecurity Essentials",
    date: "April 12, 2026 15:30",
    description:
      "Protect systems and networks from cyber threats. Learn penetration testing, encryption, and security protocols",
    workshopId: "workshopcard5",
        imageSrc: "",       
    imageAlt: "No image available",
  },
  {
    id: 6,
    title: "Data Science with Python",
    date: "April 19, 2026 11:00",
    description:
      "Analyze big data using Pandas, NumPy, and Matplotlib. Extract insights from complex datasets",
    workshopId: "workshopcard6",
        imageSrc: "",       
    imageAlt: "No image available",
  },
  {
    id: 7,
    title: "Mobile App Development (Flutter)",
    date: "April 26, 2026 17:00",
    description:
      "Create cross-platform mobile apps with Flutter and Dart. Build for iOS and Android simultaneously",
    workshopId: "workshopcard7",
        imageSrc: "",       
    imageAlt: "No image available",
  },
  {
    id: 8,
    title: "DevOps & Containerization",
    date: "May 3, 2026 12:30",
    description:
      "Master Docker, Kubernetes, and CI/CD pipelines. Streamline development and deployment processes",
    workshopId: "workshopcard8",
    imageSrc: "",
    imageAlt: "No image available",
  },
];

export default function Workshops() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(allWorkshops.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentWorkshops = allWorkshops.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Workshops
          </h1>
          <p className="text-gray-600">
            Interactive learning experiences designed to help you and your team
            develop new skills, explore creative processes, and unlock
            innovation.
          </p>
        </div>

        <div className="relative">
          <div className="space-y-4 mb-8">
            {currentWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
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
  );
}
