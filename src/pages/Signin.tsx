import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import shoppingPng from "../assets/images/shopping.png";

export default function Signin() {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.style.display = "none";
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = "flex";
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="relative  flex items-center justify-center overflow-hidden">
              <img
                src={shoppingPng}
                alt="Sign in illustration"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />

            </div>
            <div className="p-8 lg:p-12">
              <h2 className="mb-8 text-center text-3xl font-semibold text-gray-900">
                Sign In
              </h2>

              <form className="space-y-6">
                <div>
                  <input
                    type="email"
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Password"
                  />
                </div>
                <Button variant="primary" className="w-full py-3 text-lg">
                  Sign In
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-500 font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
