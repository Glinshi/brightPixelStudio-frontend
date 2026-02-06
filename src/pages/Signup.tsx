import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import shoppingPng from "../assets/images/shopping.png";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.first_name.trim()) {
      setError("Please enter your first name");
      return;
    }
    if (formData.first_name.trim().length > 10) {
      setError("First name cannot exceed 10 characters");
      return;
    }
    if (!formData.last_name.trim()) {
      setError("Please enter your last name");
      return;
    }
    if (formData.last_name.trim().length > 40) {
      setError("Last name cannot exceed 40 characters");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address (e.g. name@example.com)");
      return;
    }
    if (!formData.password) {
      setError("Please enter a password");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

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

      navigate(redirectTo ? `/signin?redirect=${redirectTo}` : "/signin");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      
      if (message.includes("already exists") || message.includes("already registered")) {
        setError("An account with this email already exists");
      } else if (message.includes("Internal server error")) {
        setError("Something went wrong. Please try again later");
      } else if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setError("Unable to connect to the server");
      } else {
        setError(message || "Sign up failed. Please try again");
      }
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
                onError={(e) => (e.currentTarget.style.display = "none")}
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
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Firstname"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Lastname"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full rounded-[25px] border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Password"
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Button
                  variant="primary"
                  className="w-full py-3 text-lg mt-6"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Sign Up"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to={redirectTo ? `/signin?redirect=${redirectTo}` : "/signin"} className="text-blue-500 font-medium">
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
