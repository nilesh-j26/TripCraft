
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const tripResponse = await api.get(`/trips/${id}`);
        setTrip(tripResponse.data);

        try {
          const itineraryResponse = await api.get(
            `/trips/${id}/itinerary`
          );
          setItinerary(itineraryResponse.data);
        } catch (err) {
          if (err.response?.status !== 404) {
            setError("Unable to load saved itinerary.");
          }
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load trip details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  const handleGenerateItinerary = async () => {
    setGenerating(true);
    setError("");

    try {
      const response = await api.post(
        `/trips/${id}/itinerary/generate`
      );

      setItinerary(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate itinerary. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteTrip = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await api.delete(`/trips/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete trip."
      );
      setDeleting(false);
    }
  };

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatBudget = (budget) =>
    Number(budget).toLocaleString("en-IN");

  const dayColors = [
    "bg-[#E8F0E8]",
    "bg-[#F4EBDD]",
    "bg-[#E9EDF2]",
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

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] p-8">
        <div className="max-w-3xl mx-auto bg-white border border-[#E7E8DF] rounded-xl p-8">
          <p className="text-red-600 text-sm">
            {error || "Trip not found."}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 text-sm font-medium text-[#244B38] hover:underline"
          >
            ← Back to Dashboard
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
          <button
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-semibold tracking-tight text-[#244B38]"
          >
            TripCraft<span className="text-[#B5A58A]">.</span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium text-[#62675F] hover:text-[#244B38] transition-colors"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-9">
          <div>
            <p className="text-sm font-medium text-[#7A806F] mb-3">
              YOUR JOURNEY
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              {trip.title}
            </h1>

            <p className="text-[#73786F] mt-2 text-base">
              {trip.destination}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/trips/${id}/edit`)}
              className="border border-[#E2E4DA] bg-white text-[#454A43] px-5 py-2.5 rounded-lg text-sm font-medium hover:border-[#244B38] hover:text-[#244B38] transition-colors"
            >
              Edit Trip
            </button>

            <button
              onClick={handleDeleteTrip}
              disabled={deleting}
              className="border border-red-200 text-red-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {deleting ? "Deleting..." : "Delete Trip"}
            </button>
          </div>
        </div>

        {/* Trip information */}
        <section className="bg-white border border-[#E7E8DF] rounded-xl p-6 sm:p-8 mb-12">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Trip overview
            </h2>

            <p className="text-sm text-[#858A81] mt-1">
              Your travel details at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F4EBDD] rounded-lg p-5">
              <p className="text-xs font-medium text-[#806744]">
                START DATE
              </p>
              <p className="text-base font-semibold mt-2">
                {formatDate(trip.startDate)}
              </p>
            </div>

            <div className="bg-[#E8F0E8] rounded-lg p-5">
              <p className="text-xs font-medium text-[#315A3F]">
                END DATE
              </p>
              <p className="text-base font-semibold mt-2">
                {formatDate(trip.endDate)}
              </p>
            </div>

            <div className="bg-[#E9EDF2] rounded-lg p-5">
              <p className="text-xs font-medium text-[#536174]">
                TOTAL BUDGET
              </p>
              <p className="text-base font-semibold mt-2">
                ₹{formatBudget(trip.budget)}
              </p>
            </div>

            <div className="bg-[#F7F7F2] rounded-lg p-5">
              <p className="text-xs font-medium text-[#73786F]">
                TRAVELERS
              </p>
              <p className="text-base font-semibold mt-2">
                {trip.numberOfTravelers}
              </p>
            </div>
          </div>
        </section>

        {/* AI itinerary heading */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-7">
            <div>
              <p className="text-sm font-medium text-[#7A806F] mb-2">
                YOUR PERSONALIZED PLAN
              </p>

              <h2 className="text-2xl font-semibold">
                AI Generated Itinerary
              </h2>

              <p className="text-sm text-[#73786F] mt-2">
                Explore your day-by-day travel plan.
              </p>
            </div>

            <button
              onClick={handleGenerateItinerary}
              disabled={generating}
              className="bg-[#244B38] hover:bg-[#1C3D2D] disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors w-fit"
            >
              {generating
                ? "Generating with AI..."
                : itinerary
                ? "Regenerate Itinerary"
                : "Generate AI Itinerary"}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          {/* Empty itinerary */}
          {!itinerary ? (
            <div className="bg-white border border-[#E7E8DF] rounded-xl p-10 text-center">
              <h3 className="text-lg font-semibold">
                No itinerary generated yet
              </h3>

              <p className="text-sm text-[#73786F] mt-2">
                Generate a personalized travel plan for your trip using AI.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {itinerary.days.map((day, index) => (
                <div
                  key={day.id}
                  className="bg-white border border-[#E7E8DF] rounded-xl overflow-hidden"
                >
                  <div className={`${dayColors[index % dayColors.length]} px-6 py-4`}>
                    <p className="text-sm font-semibold text-[#454A43]">
                      DAY {day.dayNumber}
                    </p>

                    <p className="text-xs text-[#62675F] mt-1">
                      {formatDate(day.date)}
                    </p>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold">
                      {day.title}
                    </h3>

                    <p className="text-sm text-[#62675F] mt-3 leading-7 whitespace-pre-line">
                      {day.activities}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E8DF] mt-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
          <p className="text-xs text-[#858A81] text-center">
            TripCraft · Make every journey memorable.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default TripDetails;
