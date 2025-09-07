import React, { useEffect, useState } from "react";
import { EventCard } from "./Events";
import Slidebar from "../components/Slidebar";

function ManageEvent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
    fetchEvents();
  }, []);

  // دالة حذف من الباك اند
  const handleDelete = async (eventId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // التوكن
      },
    });

    if (res.ok) {
      setEvents(events.filter((e) => e._id !== eventId)); // حدث حذف بنجاح
    } else {
      const err = await res.json();
      alert("Failed to delete: " + err.message);
    }
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Slidebar />

      {/* المحتوى */}
      <div className=" mt-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-gray-500 text-sm">
            Here you can manage and track all your events
          </p>
        </div>

        {/* Grid للكاردات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} onDelete={handleDelete} />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No events available to manage. Please add new events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageEvent;
