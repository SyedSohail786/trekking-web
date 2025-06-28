import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const TrekSearch = () => {
  const [districts, setDistricts] = useState([]);
  const [treks, setTreks] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTrek, setSelectedTrek] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${backendURL}/api/districts`)
      .then(res => {
        setDistricts(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching districts:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      setIsLoading(true);
      axios.get(`${backendURL}/api/treks/district/${selectedDistrict}`)
        .then(res => {
          setTreks(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching treks:", err);
          setIsLoading(false);
        });
    }
  }, [selectedDistrict]);

  const handleSubmit = () => {
    if (!selectedDistrict || !selectedTrek || !selectedDate) {
      alert("Please select all fields");
      return;
    }
    navigate(`/availability?district=${selectedDistrict}&trek=${selectedTrek}&date=${selectedDate}`);
  };

  const today = new Date();
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const minDateStr = today.toISOString().split("T")[0];
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg mt-8 max-w-4xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Find Your Perfect Trek</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedTrek("");
              setTreks([]);
            }}
            disabled={isLoading}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trek</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={selectedTrek}
            onChange={(e) => setSelectedTrek(e.target.value)}
            disabled={!selectedDistrict || isLoading}
          >
            <option value="">Select Trek</option>
            {treks.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDateStr}
            max={maxDateStr}
          />
        </div>

        <div className="flex items-end">
          <button
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-md"
            onClick={handleSubmit}
          >
            {isLoading ? 'Searching...' : 'Check Availability'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrekSearch;