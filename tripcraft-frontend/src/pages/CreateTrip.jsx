
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function CreateTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    numberOfTravelers: 1,
  });

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

    setError("");
    setLoading(true);

    try {
      await api.post("/trips", {
        ...formData,
        budget: Number(formData.budget),
        numberOfTravelers: Number(formData.numberOfTravelers),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create trip."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "title",
      label: "Trip Title",
      type: "text",
      placeholder: "e.g. Summer Vacation",
    },
    {
      name: "destination",
      label: "Destination",
      type: "text",
      placeholder: "e.g. Manali, Himachal Pradesh",
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
    },
    {
      name: "budget",
      label: "Budget (₹)",
      type: "number",
      placeholder: "Enter your total budget",
    },
    {
      name: "numberOfTravelers",
      label: "Number of Travelers",
      type: "number",
      placeholder: "Enter number of travelers",
    },
  ];

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#252923]">

      {/* Header */}
      <header className="border-b border-[#E7E8DF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="text-2xl font-semibold tracking-tight text-[#244B38]"
          >
            TripCraft<span className="text-[#B5A58A]">.</span>
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-[#62675F] hover:text-[#244B38] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12 lg:py-16">

        <div className="mb-8">
          <p className="text-sm font-medium text-[#7A806F] mb-3">
            PLAN YOUR NEXT ADVENTURE
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Create a new trip
          </h1>

          <p className="text-[#73786F] mt-3">
            Add your travel details to start planning your journey.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-[#E7E8DF] rounded-xl p-6 sm:p-9">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Trip information */}
            <div className="pb-5 border-b border-[#ECEDE7]">
              <h2 className="text-base font-semibold">
                Trip information
              </h2>

              <p className="text-sm text-[#858A81] mt-1">
                Give your journey a name and choose your destination.
              </p>
            </div>

            {fields.slice(0, 2).map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-[#454A43] mb-2"
                >
                  {field.label}
                </label>

                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  maxLength={100}
                  className="w-full bg-[#F7F7F2] border border-[#E2E4DA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#244B38] transition-colors placeholder:text-[#A0A49C]"
                />
              </div>
            ))}

            {/* Travel dates */}
            <div className="pt-2 pb-2 border-b border-[#ECEDE7]">
              <h2 className="text-base font-semibold">
                Travel dates
              </h2>

              <p className="text-sm text-[#858A81] mt-1">
                When are you planning to travel?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.slice(2, 4).map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-[#454A43] mb-2"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    min={today}
                    required
                    className="w-full bg-[#F7F7F2] border border-[#E2E4DA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#244B38] transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Budget and travelers */}
            <div className="pt-2 pb-2 border-b border-[#ECEDE7]">
              <h2 className="text-base font-semibold">
                Budget and travelers
              </h2>

              <p className="text-sm text-[#858A81] mt-1">
                Set your estimated budget and group size.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.slice(4).map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-[#454A43] mb-2"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    min={1}
                    step={field.name === "budget" ? "0.01" : "1"}
                    required
                    className="w-full bg-[#F7F7F2] border border-[#E2E4DA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#244B38] transition-colors placeholder:text-[#A0A49C]"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
              <Link
                to="/dashboard"
                className="flex-1 text-center border border-[#E2E4DA] text-[#555B53] rounded-lg px-5 py-3 text-sm font-medium hover:bg-[#F7F7F2] transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#244B38] hover:bg-[#1C3D2D] disabled:opacity-50 text-white rounded-lg px-5 py-3 text-sm font-medium transition-colors"
              >
                {loading ? "Creating Trip..." : "Create Trip"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateTrip;
