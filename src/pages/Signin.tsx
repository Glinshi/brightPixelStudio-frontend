import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import shoppingPng from "../assets/images/shopping.png";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Signin() {
  const { login, user } = useApp();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Invalid email address");
      return;
    }
    if (!formData.password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      setIsSignedIn(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      

      if (message.includes("Incorrect email or password")) {
        setError("Incorrect email or password");
      } else if (message.includes("Internal server error")) {
        setError("Something went wrong. Please try again later");
      } else if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setError("Unable to connect to the server");
      } else {
        setError("Sign in failed. Please check your credentials");
      }
    } finally {
      setLoading(false);
    }
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
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <div className="p-8 lg:p-12">
              {isSignedIn ? (
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-semibold text-gray-900">
                    You are signed in
                  </h2>
                  <p className="text-gray-600">
                    Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
                    !
                  </p>
                  <Button
                    variant="primary"
                    to="/"
                    className="w-full py-3 text-lg"
                  >
                    Go to Homepage
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="mb-8 text-center text-3xl font-semibold text-gray-900">
                    Sign In
                  </h2>

                  <form className="space-y-6" onSubmit={handleSubmit}>
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
                      className="w-full py-3 text-lg"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Sign In"}
                    </Button>
                  </form>
                  <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 font-medium">
                      Sign Up
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
