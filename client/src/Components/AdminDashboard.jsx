import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const token = localStorage.getItem("adminToken");
  const [districtName, setDistrictName] = useState("");
  const [trekName, setTrekName] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slotCapacity, setSlotCapacity] = useState("");
  const [selectedTrek, setSelectedTrek] = useState("");
  const [treks, setTreks] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotUpdates, setSlotUpdates] = useState({});
  const [isLoading, setIsLoading] = useState({
    districts: false,
    treks: false,
    addingDistrict: false,
    addingTrek: false,
    addingSlot: false,
    updatingSlot: false,
    deletingSlot: false
  });

  const axiosAuth = axios.create({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetchTreks(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedTrek && slotDate) {
      fetchSlots();
    }
  }, [selectedTrek, slotDate]);

  const fetchDistricts = async () => {
    setIsLoading(prev => ({...prev, districts: true}));
    try {
      const res = await axios.get("http://localhost:8000/api/districts");
      setDistricts(res.data);
    } catch (error) {
      toast.error("Failed to fetch districts");
    } finally {
      setIsLoading(prev => ({...prev, districts: false}));
    }
  };

  const fetchTreks = async (districtId) => {
    setIsLoading(prev => ({...prev, treks: true}));
    try {
      const res = await axios.get(`http://localhost:8000/api/treks/district/${districtId}`);
      setTreks(res.data);
    } catch (error) {
      toast.error("Failed to fetch treks");
    } finally {
      setIsLoading(prev => ({...prev, treks: false}));
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/slots?trekId=${selectedTrek}&date=${slotDate}`);
      setSlots(res.data);
      // Initialize updates object
      const updates = {};
      res.data.forEach(slot => {
        updates[slot._id] = {
          time: slot.time,
          capacity: slot.capacity
        };
      });
      setSlotUpdates(updates);
    } catch (error) {
      toast.error("Failed to fetch slots");
    }
  };

  const handleSlotChange = (slotId, field, value) => {
    setSlotUpdates(prev => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        [field]: value
      }
    }));
  };

  const handleSlotUpdate = async (slotId) => {
    if (!slotUpdates[slotId]) return;
    
    setIsLoading(prev => ({...prev, updatingSlot: true}));
    try {
      await axios.put(`http://localhost:8000/api/slots/${slotId}`, {
        time: slotUpdates[slotId].time,
        capacity: slotUpdates[slotId].capacity,
      });
      toast.success("Slot updated successfully");
      fetchSlots();
    } catch (error) {
      toast.error("Failed to update slot");
    } finally {
      setIsLoading(prev => ({...prev, updatingSlot: false}));
    }
  };

  const handleSlotDelete = async (slotId) => {
    setIsLoading(prev => ({...prev, deletingSlot: true}));
    try {
      await axios.delete(`http://localhost:8000/api/treks/${slotId}`);
      toast.success("Slot deleted successfully");
      fetchSlots();
    } catch (error) {
      toast.error("Failed to delete slot");
    } finally {
      setIsLoading(prev => ({...prev, deletingSlot: false}));
    }
  };

  const addDistrict = async () => {
    if (!districtName) {
      toast.warning("Please enter district name");
      return;
    }
    
    setIsLoading(prev => ({...prev, addingDistrict: true}));
    try {
      await axios.post("http://localhost:8000/api/districts", { name: districtName });
      setDistrictName("");
      toast.success("District added successfully");
      fetchDistricts();
    } catch (error) {
      toast.error("Failed to add district");
    } finally {
      setIsLoading(prev => ({...prev, addingDistrict: false}));
    }
  };

  const addTrek = async () => {
    if (!selectedDistrict || !trekName) {
      toast.warning("Please select district and enter trek name");
      return;
    }
    
    setIsLoading(prev => ({...prev, addingTrek: true}));
    try {
      await axios.post("http://localhost:8000/api/treks", {
        name: trekName,
        districtId: selectedDistrict,
      });
      setTrekName("");
      toast.success("Trek added successfully");
      fetchTreks(selectedDistrict);
    } catch (error) {
      toast.error("Failed to add trek");
    } finally {
      setIsLoading(prev => ({...prev, addingTrek: false}));
    }
  };

  const addSlot = async () => {
    if (!selectedTrek || !slotDate || !slotTime || !slotCapacity) {
      toast.warning("Please fill all slot details");
      return;
    }
    
    setIsLoading(prev => ({...prev, addingSlot: true}));
    try {
      await axios.post("http://localhost:8000/api/slots", {
        trekId: selectedTrek,
        date: slotDate,
        time: slotTime,
        capacity: slotCapacity,
      });
      setSlotDate("");
      setSlotTime("");
      setSlotCapacity("");
      toast.success("Slot added successfully");
      fetchSlots();
    } catch (error) {
      toast.error("Failed to add slot");
    } finally {
      setIsLoading(prev => ({...prev, addingSlot: false}));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage districts, treks, and slots</p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add District Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add District
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District Name</label>
                <input
                  type="text"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  placeholder="Enter district name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>
              <button
                onClick={addDistrict}
                disabled={isLoading.addingDistrict}
                className={`w-full py-2 px-4 rounded-lg font-medium text-white shadow-md transition-colors flex items-center justify-center ${
                  isLoading.addingDistrict ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isLoading.addingDistrict ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add District'
                )}
              </button>
              {districts.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-gray-700">Delete District</h3>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {districts.map(d => (
                      <li key={d._id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                        <span>{d.name}</span>
                        <button
                          onClick={async () => {
                            try {
                              await axios.delete(`http://localhost:8000/api/districts/${d._id}`);
                              toast.success("District deleted");
                              fetchDistricts();
                            } catch {
                              toast.error("Failed to delete district");
                            }
                          }}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Add Trek Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Add Trek
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select District</label>
                <select
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  value={selectedDistrict}
                  disabled={isLoading.districts}
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trek Name</label>
                <input
                  type="text"
                  value={trekName}
                  onChange={(e) => setTrekName(e.target.value)}
                  placeholder="Enter trek name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  disabled={!selectedDistrict}
                />
              </div>
              <button
                onClick={addTrek}
                disabled={isLoading.addingTrek || !selectedDistrict}
                className={`w-full py-2 px-4 rounded-lg font-medium text-white shadow-md transition-colors flex items-center justify-center ${
                  isLoading.addingTrek ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isLoading.addingTrek ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Trek'
                )}
              </button>

              {treks.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-gray-700">Delete Trek</h3>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {treks.map(t => (
                      <li key={t._id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                        <span>{t.name}</span>
                        <button
                          onClick={async () => {
                            try {
                              await axios.delete(`http://localhost:8000/api/treks/${t._id}`);
                              toast.success("Trek deleted");
                              fetchTreks(selectedDistrict);
                            } catch {
                              toast.error("Failed to delete trek");
                            }
                          }}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Slot Card (Full Width) */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add Slot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Trek</label>
              <select
                onChange={(e) => setSelectedTrek(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                value={selectedTrek}
                disabled={isLoading.treks || !selectedDistrict}
              >
                <option value="">Select Trek</option>
                {treks.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="text"
                placeholder="9:00 AM"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                placeholder="10"
                value={slotCapacity}
                onChange={(e) => setSlotCapacity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          </div>
          <button
            onClick={addSlot}
            disabled={isLoading.addingSlot}
            className={`mt-4 w-full md:w-auto py-2 px-6 rounded-lg font-medium text-white shadow-md transition-colors flex items-center justify-center ${
              isLoading.addingSlot ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading.addingSlot ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add Slot'
            )}
          </button>
          {slots.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-700">Existing Slots</h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {slots.map((s) => (
                  <li key={s._id} className="bg-gray-100 p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <p><span className="font-medium">Time:</span> {s.time}</p>
                      <p><span className="font-medium">Capacity:</span> {s.capacity}</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="New Time"
                        className="border px-2 py-1 rounded"
                        value={slotUpdates[s._id]?.time || ''}
                        onChange={(e) => handleSlotChange(s._id, 'time', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="New Capacity"
                        className="border px-2 py-1 rounded"
                        value={slotUpdates[s._id]?.capacity || ''}
                        onChange={(e) => handleSlotChange(s._id, 'capacity', e.target.value)}
                      />
                      <button
                        className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                        onClick={() => handleSlotUpdate(s._id)}
                        disabled={isLoading.updatingSlot}
                      >
                        {isLoading.updatingSlot ? 'Updating...' : 'Update'}
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleSlotDelete(s._id)}
                        disabled={isLoading.deletingSlot}
                      >
                        {isLoading.deletingSlot ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;