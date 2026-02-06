import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import shoppingPng from "../assets/images/shopping.png";

export default function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.style.display = "none";
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = "flex";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Signup failed");
      }

     
      navigate("/signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex min-h-[40vh] items-center justify-center px-6">
        <div className="max-w-4xl py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {" "}
            <div className="relative  flex items-center justify-center overflow-hidden">
              <img
                src={shoppingPng}
                alt="Sign up illustration"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="p-8 lg:p-12">
              <h2 className="mb-8 text-center text-3xl font-semibold text-gray-900">
                Sign Up
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Firstname"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Lastname"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Password"
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button variant="primary" className="w-full py-3 text-lg mt-6" disabled={loading}>
                  {loading ? "Loading..." : "Sign Up"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-500 font-medium">
                  Sign In
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
