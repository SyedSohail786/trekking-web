import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const TrekManagement = () => {
  const [treks, setTreks] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list', 'add', 'edit', 'view'
  const [currentTrek, setCurrentTrek] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all treks
  const fetchTreks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/places`);
      setTreks(res.data);
    } catch (err) {
      toast.error("Failed to load treks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreks();
  }, []);

  // Handle delete trek
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trek?")) {
      try {
        await axios.delete(`${backendURL}/api/places/${id}`);
        toast.success("Trek deleted successfully");
        fetchTreks();
      } catch (err) {
        toast.error("Failed to delete trek");
      }
    }
  };

  // Handle form submit (add/edit)
  const handleSubmit = async () => {
  fetchTreks(); 
};

  return (
    <div className="container mx-auto p-4">
      {viewMode === "list" ? (
        <TrekList
          treks={treks}
          isLoading={isLoading}
          onAdd={() => {
            setCurrentTrek(null);
            setViewMode("add");
          }}
          onEdit={(trek) => {
            setCurrentTrek(trek);
            setViewMode("edit");
          }}
          onView={(trek) => {
            setCurrentTrek(trek);
            setViewMode("view");
          }}
          onDelete={handleDelete}
        />
      ) : (
        <TrekForm
          mode={viewMode}
          trekData={currentTrek}
          onSubmit={handleSubmit}
          onCancel={() => setViewMode("list")}
        />
      )}
    </div>
  );
};

// Trek List Component
const TrekList = ({ treks, isLoading, onAdd, onEdit, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Manage Trek Places</h2>
        <button
          onClick={onAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Trek
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trek Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treks.map((trek) => (
                <tr key={trek._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{trek.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{trek.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex -space-x-2">
                      {trek.gallery?.slice(0, 3).map((img, i) => (
                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {trek.gallery?.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                          +{trek.gallery.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(trek)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit(trek)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(trek._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Trek Form Component
const TrekForm = ({ mode, trekData, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    image: "",
    location: "",
    description: "",
    fullDetails: [""],
    stats: [{ label: "", value: "" }],
    gallery: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  // Initialize form
  useEffect(() => {
    if (mode !== "add" && trekData) {
      setForm({
        title: trekData.title || "",
        image: trekData.image || "",
        location: trekData.location || "",
        description: trekData.description || "",
        fullDetails: trekData.fullDetails?.length ? trekData.fullDetails : [""],
        stats: trekData.stats?.length ? trekData.stats : [{ label: "", value: "" }],
        gallery: trekData.gallery || []
      });
      if (trekData.image) setImagePreview(trekData.image);
    }
  }, [mode, trekData]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value, key = null) => {
    const updated = [...form[field]];
    if (key) updated[index][key] = value;
    else updated[index] = value;
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const addToArray = (field, item) => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeFromArray = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    setGalleryFiles(e.target.files);
  };

  const handleRemoveGalleryImage = (index) => {
    const updatedGallery = [...form.gallery];
    updatedGallery.splice(index, 1);
    setForm(prev => ({ ...prev, gallery: updatedGallery }));
  };

 const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return; // prevent double-submit

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("location", form.location);
    formData.append("description", form.description);
    formData.append("fullDetails", JSON.stringify(form.fullDetails));
    formData.append("stats", JSON.stringify(form.stats));
    if (imageFile) formData.append("image", imageFile);
    Array.from(galleryFiles).forEach(file => {
      formData.append("gallery", file);
    });

    const response = await axios({
      method: mode === "add" ? "post" : "put",
      url: mode === "add"
        ? `${backendURL}/api/places`
        : `${backendURL}/api/places/${trekData._id}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    toast.success(`Trek ${mode === "add" ? "added" : "updated"} successfully`);

    // ✅ Tell parent to refresh list
    await onSubmit(); 
    onCancel(); // switch back to list mode

  } catch (err) {
    toast.error(`Failed to ${mode === "add" ? "add" : "update"} trek`);
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};




  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
        <h1 className="text-2xl font-bold text-center">
          {mode === "add" ? "Add New Trek" : mode === "edit" ? "Edit Trek" : "Trek Details"}
        </h1>
      </div>

      <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter trek title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            readOnly={mode === "view"}
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image*</label>
          {mode !== "view" ? (
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-full max-w-xs border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="p-4 text-center">
                  <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">
                    {imageFile ? imageFile.name : form.image ? "Current image" : "Click to upload"}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  required={mode === "add" && !form.image}
                  disabled={mode === "view"}
                />
              </label>
              {(imagePreview || form.image) && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview || form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={form.image}
                alt="Trek"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter location"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            required
            readOnly={mode === "view"}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description*</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter short description"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
            readOnly={mode === "view"}
          />
        </div>

        {/* Full Details */}
        {(mode !== "view" || form.fullDetails.some(d => d.trim() !== "")) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Details</label>
            <div className="space-y-3">
              {form.fullDetails.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <textarea
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={2}
                    value={item}
                    onChange={(e) => handleArrayChange("fullDetails", i, e.target.value)}
                    placeholder="Enter detail"
                    readOnly={mode === "view"}
                  />
                  {mode !== "view" && (
                    <button
                      type="button"
                      onClick={() => removeFromArray("fullDetails", i)}
                      className="self-center p-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {mode !== "view" && (
                <button
                  type="button"
                  onClick={() => addToArray("fullDetails", "")}
                  className="flex items-center text-sm text-green-600 hover:text-green-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Detail
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        {(mode !== "view" || form.stats.some(s => s.label.trim() !== "" || s.value.trim() !== "")) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trek Statistics</label>
            <div className="space-y-3">
              {form.stats.map((stat, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Label (e.g. Difficulty)"
                    value={stat.label}
                    onChange={(e) => handleArrayChange("stats", i, e.target.value, "label")}
                    readOnly={mode === "view"}
                  />
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Value (e.g. Moderate)"
                    value={stat.value}
                    onChange={(e) => handleArrayChange("stats", i, e.target.value, "value")}
                    readOnly={mode === "view"}
                  />
                  {mode !== "view" && (
                    <button
                      type="button"
                      onClick={() => removeFromArray("stats", i)}
                      className="self-center p-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {mode !== "view" && (
                <button
                  type="button"
                  onClick={() => addToArray("stats", { label: "", value: "" })}
                  className="flex items-center text-sm text-green-600 hover:text-green-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Stat
                </button>
              )}
            </div>
          </div>
        )}

        {/* Gallery Images */}
        {(mode !== "view" || form.gallery.length > 0) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
            <div className="space-y-4">
              {/* Existing gallery images */}
              {form.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {form.gallery.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {mode !== "view" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* File upload for new images */}
              {mode !== "view" && (
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 p-6">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500 mt-1">
                      {galleryFiles.length > 0
                        ? `${galleryFiles.length} new file(s) selected`
                        : "Click to upload multiple images"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {mode === "view" ? "Back to List" : "Cancel"}
          </button>
          {mode !== "view" && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg shadow-md transition-all ${isSubmitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                } text-white font-medium flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                mode === "add" ? "Add Trek" : "Update Trek"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TrekManagement;