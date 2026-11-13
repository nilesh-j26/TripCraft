
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileResponse, tripsResponse] = await Promise.all([
          api.get("/user/profile"),
          api.get("/trips"),
        ]);

        setUser(profileResponse.data);
        setTrips(tripsResponse.data);
      } catch (err) {
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = trips.filter(
    (trip) => new Date(`${trip.startDate}T00:00:00`) >= today
  );

  const completedTrips = trips.filter(
    (trip) => new Date(`${trip.endDate}T00:00:00`) < today
  );

  const filteredTrips = trips.filter((trip) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      trip.title.toLowerCase().includes(search) ||
      trip.destination.toLowerCase().includes(search);

    const startDate = new Date(`${trip.startDate}T00:00:00`);
    const endDate = new Date(`${trip.endDate}T00:00:00`);

    const matchesFilter =
      activeFilter === "ALL" ||
      (activeFilter === "UPCOMING" && startDate >= today) ||
      (activeFilter === "COMPLETED" && endDate < today);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatBudget = (budget) =>
    Number(budget).toLocaleString("en-IN");

  const getTripStatus = (trip) => {
    const startDate = new Date(`${trip.startDate}T00:00:00`);
    const endDate = new Date(`${trip.endDate}T00:00:00`);

    if (endDate < today) return "Completed";
    if (startDate >= today) return "Upcoming";

    return "In progress";
  };

  const filters = [
    { label: "All trips", value: "ALL" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Completed", value: "COMPLETED" },
  ];

  const statCards = [
    {
      label: "Total trips",
      value: trips.length,
      description: "All your planned journeys",
      background: "bg-[#F4EBDD]",
    },
    {
      label: "Upcoming trips",
      value: upcomingTrips.length,
      description: "Journeys ahead of you",
      background: "bg-[#E8F0E8]",
    },
    {
      label: "Completed trips",
      value: completedTrips.length,
      description: "Places you have explored",
      background: "bg-[#E9EDF2]",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
        <p className="text-sm text-[#666B64]">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#252923]">
      {/* Header */}
      <header className="border-b border-[#E7E8DF] bg-[#F7F7F2]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-semibold tracking-tight text-[#244B38]"
          >
            TripCraft<span className="text-[#B5A58A]">.</span>
          </button>

          <div className="flex items-center gap-5">
            {user && (
              <span className="hidden sm:block text-sm text-[#62675F]">
                {user.name}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-[#555B53] hover:text-[#244B38] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* Welcome section */}
        <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-medium text-[#7A806F] mb-3">
              YOUR TRAVEL SPACE
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </h1>

            <p className="text-[#73786F] mt-3 text-sm sm:text-base">
              Plan your next journey and revisit your travel memories.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-trip")}
            className="bg-[#244B38] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#1C3D2D] transition-colors w-fit"
          >
            + Create a trip
          </button>
        </section>

        {/* Error message */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.background} rounded-xl p-6 border border-black/[0.03]`}
            >
              <p className="text-sm font-medium text-[#62675F]">
                {stat.label}
              </p>

              <p className="text-3xl font-semibold mt-4 text-[#252923]">
                {stat.value}
              </p>

              <p className="text-xs text-[#74796F] mt-2">
                {stat.description}
              </p>
            </div>
          ))}
        </section>

        {/* Trips section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Your trips</h2>
              <p className="text-sm text-[#73786F] mt-1">
                Keep track of all your journeys.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search destination or trip..."
                className="w-full bg-white border border-[#E2E4DA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#244B38] transition-colors placeholder:text-[#9A9E95]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-7">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? "bg-[#244B38] text-white"
                    : "bg-white text-[#62675F] border border-[#E5E6DE] hover:border-[#244B38] hover:text-[#244B38]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Trip cards */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrips.map((trip) => {
                const status = getTripStatus(trip);

                return (
                  <div
                    key={trip.id}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="bg-white border border-[#E7E8DF] rounded-xl p-6 cursor-pointer hover:border-[#C4CCBF] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div>
                        <h3 className="text-lg font-semibold text-[#252923]">
                          {trip.title}
                        </h3>

                        <p className="text-sm text-[#73786F] mt-1">
                          {trip.destination}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full ${
                          status === "Completed"
                            ? "bg-[#E9EDF2] text-[#536174]"
                            : status === "Upcoming"
                            ? "bg-[#E8F0E8] text-[#315A3F]"
                            : "bg-[#F4EBDD] text-[#806744]"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="border-t border-[#ECEDE7] pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#858A81]">Dates</span>
                        <span className="text-[#454A43] text-right">
                          {formatDate(trip.startDate)} –{" "}
                          {formatDate(trip.endDate)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-[#858A81]">Budget</span>
                        <span className="text-[#454A43]">
                          ₹{formatBudget(trip.budget)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-[#858A81]">Travelers</span>
                        <span className="text-[#454A43]">
                          {trip.numberOfTravelers}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#ECEDE7] flex justify-between items-center">
                      <span className="text-sm font-medium text-[#244B38]">
                        View trip
                      </span>

                      <span className="text-[#244B38]">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#E7E8DF] rounded-xl py-16 px-6 text-center">
              {trips.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold">
                    No trips planned yet
                  </h3>

                  <p className="text-sm text-[#73786F] mt-2 mb-6">
                    Start planning your next adventure.
                  </p>

                  <button
                    onClick={() => navigate("/create-trip")}
                    className="bg-[#244B38] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1C3D2D] transition-colors"
                  >
                    Create your first trip
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">
                    No matching trips found
                  </h3>

                  <p className="text-sm text-[#73786F] mt-2">
                    Try changing your search or selected filter.
                  </p>
                </>
              )}
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

export default Dashboard;
