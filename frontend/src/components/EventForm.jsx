import React, { useState } from "react";

import {useAuth} from "../context/AuthContext"

export default function EventForm() {
  const {token} =useAuth()
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    ticketPrice: "",
    seatAmount: 50,
    availableSeats: 50,
    popularity: "Low Popularity",
    expectedAttendance: "",
    tags: [],
    seatMap: Array(6)
      .fill(null)
      .map(() => Array(7).fill(0)),
    status: "upcoming",
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
          "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Event created:", data);
      setFormData({
        name: "",
        date: "",
        time: "",
        venue: "",
        description: "",
        ticketPrice: "",
        seatAmount: 50,
        availableSeats: 50,
        popularity: "Low Popularity",
        expectedAttendance: "",
        tags: [],
        seatMap: Array(6)
        .fill(null)
          .map(() => Array(7).fill(0)),
          status: "upcoming",
        });
        alert("Event created successfully!");
       


    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-20">
      <h2 className="text-2xl font-bold mb-6">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block font-medium mb-1">Time</label>
          <input
            type="text"
            name="time"
            placeholder="20:00 - 22:30"
            value={formData.time}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block font-medium mb-1">Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ticket Price */}
        <div>
          <label className="block font-medium mb-1">Ticket Price</label>
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Seat Amount & Available Seats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Seat Amount</label>
            <input
              type="number"
              name="seatAmount"
              value={formData.seatAmount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Available Seats</label>
            <input
              type="number"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Popularity */}
        <div>
          <label className="block font-medium mb-1">Popularity</label>
          <select
            name="popularity"
            value={formData.popularity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option>Low Popularity</option>
            <option>Medium Popularity</option>
            <option>High Popularity</option>
          </select>
        </div>

        {/* Expected Attendance */}
        <div>
          <label className="block font-medium mb-1">Expected Attendance</label>
          <input
            type="text"
            name="expectedAttendance"
            value={formData.expectedAttendance}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-black text-white px-3 py-2 rounded hover:bg-black/70"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium transition"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
