"use client";

import { useEffect, useState } from "react";
import {
  uploadPropertyImage,
  createProperty,
  getAllProperties,
} from "@/app/lib/propertiesService";

export default function AddPropertyPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let imageUrl = "";

      if (file) {
        const uploadRes = await uploadPropertyImage(file);
        imageUrl = uploadRes.url;
      }

      const newProperty = {
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        location: "Colombo",
        description: "A beautiful home located in the city center.",
        price: 250000,
        type: "Villa",
        status: "For Sale",
        area: 2000,
        image: imageUrl,
      };

      await createProperty(newProperty);
      await loadProperties();

      setTitle("");
      setFile(null);
      setPreview(null);
      alert("Property added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Property</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter property title"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-xs rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Property"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          All Properties
        </h3>

        {properties.length === 0 ? (
          <p className="text-gray-500 text-sm">No properties found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-800">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-500">{p.location}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    Rs. {p.price.toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {p.type} • {p.status}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Area: {p.area} sqft
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
