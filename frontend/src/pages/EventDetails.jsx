import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Plus,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PreviewSeat } from "../components/PreviewSeat";
import SeattMap from "../components/SeattMap";
import { useAuth } from "../context/AuthContext";
import { useSeat } from "../context/SeatContext";

export async function getEventbyId(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/events/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to load events:", error);
  }
}

export default function EventDetails() {
  const [event, setEvent] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const { user } = useAuth();
  const { selectedSeats, setSelectedSeats } = useSeat();

  const navigate = useNavigate();
  const params = useParams();

  const handleBack = () => navigate(-1);

  useEffect(() => {
    async function fetchEvent() {
      const data = await getEventbyId(params.id);
      setEvent(data);
      setEditedEvent(data);
    }
    fetchEvent();
  }, [params.id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Loading event details...</p>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedEvent({ ...event });
  };

  const handleSave = () => {
    setEvent({ ...editedEvent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEvent({ ...event });
    setIsEditing(false);
  };

  const addTag = () => {
    const newTag = prompt("Enter new tag:");
    if (newTag && !editedEvent.tags.includes(`#${newTag}`)) {
      setEditedEvent({
        ...editedEvent,
        tags: [...editedEvent.tags, `#${newTag}`],
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setEditedEvent({
      ...editedEvent,
      tags: editedEvent.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="min-h-screen bg-white text-black mt-14">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Event Details</h1>
        </div>

        {!isEditing && user?.role === "admin" && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          >
            <Edit className="inline-block w-4 h-4 mr-1" />
            Edit
          </button>
        )}

        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Event Info */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-extrabold mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editedEvent.name}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, name: e.target.value })
                }
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              event.name
            )}
          </h2>
          <p className="text-gray-700 mb-6">
            {isEditing ? (
              <textarea
                value={editedEvent.description}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    description: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              event.description
            )}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-black" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-black" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-black" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-black" />
              <span>{event.availableSeats} seats</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-black" />
              <span>{event.ticketPrice} SAR</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {editedEvent.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-black text-white rounded-full flex items-center gap-2"
              >
                {tag}
                {isEditing && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {isEditing && (
              <button
                onClick={addTag}
                className="flex items-center gap-1 px-3 py-1 border border-black text-black rounded-full hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
                Add Tag
              </button>
            )}
          </div>
        </div>

        {/* Seat Map + Buy Tickets */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6 space-y-6">
          {user?.role === "admin" ? (
            <PreviewSeat seatData={event.seatMap} />
          ) : (
            <SeattMap
              seatData={event.seatMap}
              selectedSeats={selectedSeats}
              onSelectSeats={setSelectedSeats}
            />
          )}

          <Link
            to={`/checkout/${event._id}`}
            className="block w-full text-center px-6 py-3 bg-black hover:bg-gray-900 text-white rounded-xl font-bold tracking-wide shadow-md transition"
          >
            BUY TICKETS
          </Link>
        </div>
      </main>
    </div>
  );
}
