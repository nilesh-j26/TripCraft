
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      setMessage(response.data.message || "Registration successful!");

      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", label: "Username", type: "text" },
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#244B38]">
              TripCraft
            </h1>
            <span className="w-2 h-2 rounded-full bg-[#C6A879] mt-3"></span>
          </Link>

          <p className="text-[#73786F] mt-3">
            Your next adventure starts here
          </p>
        </div>

        <div className="bg-white border border-[#E7E8DF] rounded-xl p-7 sm:p-9">

          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-[#252923]">
              Create your account
            </h2>

            <p className="text-sm text-[#73786F] mt-2">
              Join TripCraft and start planning your trips.
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-3 mb-5">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-[#252923] mb-2"
                >
                  {field.label}
                </label>

                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full px-4 py-3 rounded-lg bg-[#F7F7F2] text-[#252923] border border-[#E7E8DF] placeholder:text-[#9A9E95] focus:outline-none focus:border-[#244B38] focus:ring-1 focus:ring-[#244B38] transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#244B38] hover:bg-[#1C3D2D] disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="border-t border-[#E7E8DF] mt-7 pt-6">
            <p className="text-sm text-center text-[#73786F]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#244B38] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>

        <p className="text-xs text-center text-[#9A9E95] mt-6">
          Plan better. Travel farther.
        </p>

      </div>
    </div>
  );
}

export default Register;
