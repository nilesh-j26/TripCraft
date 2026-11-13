
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    numberOfTravelers: 1,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get(`/trips/${id}`);

        setFormData({
          title: response.data.title,
          destination: response.data.destination,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          budget: response.data.budget,
          numberOfTravelers: response.data.numberOfTravelers,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load trip."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.put(`/trips/${id}`, {
        ...formData,
        budget: Number(formData.budget),
        numberOfTravelers: Number(formData.numberOfTravelers),
      });

      navigate(`/trips/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update trip."
      );
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
        <p className="text-sm text-[#666B64]">
          Loading trip details...
        </p>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E7E8DF] rounded-xl p-8 max-w-md w-full">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 text-sm font-medium text-[#244B38] hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

          <button
            onClick={() => navigate(`/trips/${id}`)}
            className="text-sm font-medium text-[#62675F] hover:text-[#244B38] transition-colors"
          >
            ← Back to Trip
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12 lg:py-16">

        <div className="mb-8">
          <p className="text-sm font-medium text-[#7A806F] mb-3">
            UPDATE YOUR JOURNEY
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Edit trip details
          </h1>

          <p className="text-[#73786F] mt-3">
            Make changes to your travel plans whenever you need.
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
                Update your trip name and destination.
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
                  maxLength={100}
                  required
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
                Update your planned travel dates.
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
                Adjust your budget and number of travelers.
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
              <button
                type="button"
                onClick={() => navigate(`/trips/${id}`)}
                className="flex-1 text-center border border-[#E2E4DA] text-[#555B53] rounded-lg px-5 py-3 text-sm font-medium hover:bg-[#F7F7F2] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#244B38] hover:bg-[#1C3D2D] disabled:opacity-50 text-white rounded-lg px-5 py-3 text-sm font-medium transition-colors"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default EditTrip;
