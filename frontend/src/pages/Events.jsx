import React, { use, useEffect, useState } from "react";
import { Search, Filter, Calendar, Plus, MoreHorizontal, ChevronRight } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import {Link, Navigate} from "react-router-dom";
import Slidebar from "../components/Slidebar";

// Mock useAuth for demo
// const useAuth = () => ({
//   authFetch: (url) => ({ url: "http://localhost:5000" })
// });



export const EventCard = ({ event, onDelete }) => {
  const { user, token } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user && !token) {
    return <Navigate to="/Login" />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-600";
      case "pending":
        return "bg-green-600";
      case "closed":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getEventIcon = (name) => {
    const titleLower = name.toLowerCase();
    if (titleLower.includes("music")) return "🎵";
    if (titleLower.includes("car") || titleLower.includes("supercar"))
      return "🏎️";
    if (titleLower.includes("rock")) return "🎸";
    if (titleLower.includes("food")) return "🍛";
    if (titleLower.includes("tech")) return "💻";
    if (titleLower.includes("art")) return "🎨";
    if (titleLower.includes("literary") || titleLower.includes("book"))
      return "📚";
    if (titleLower.includes("fireworks")) return "🎆";
    if (titleLower.includes("cricket")) return "🏏";
    return "📅";
  };

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* النقطة الخاصة بالحالة في الزاوية اليسرى السفلية */}
      <div
        className={`absolute bottom-2 left-2 w-3 h-3 rounded-full ${getStatusColor(
          event.status
        )}`}
        title={event.status}
      ></div>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getEventIcon(event.name)}</span>
          <h3 className="font-semibold text-gray-900 text-sm">{event.name}</h3>
        </div>

        {/* زر الثلاث نقاط للأدمن */}
        {user?.role === "admin" && (
          <div className="relative">
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* تفاصيل التذاكر */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
            <span className="text-green-600 text-xs">₹</span>
          </div>
          <span className="text-gray-900 font-medium">
            {event.ticketPrice || 0} LKR
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center">
            <span className="text-red-600 text-xs">🎟️</span>
          </div>
          <span className="text-gray-900 font-medium">
            {event.seatAmount || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
            <span className="text-purple-600 text-xs">✅</span>
          </div>
          <span className="text-gray-900 font-medium">
            {(event.seatAmount - event.availableSeats) || 0}
          </span>
        </div>
      </div>

      {/* تفاصيل المكان والوقت */}
      <div className="mb-3 text-xs text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Venue:</span>{" "}
          {event.venue || "Open Air Theater, Colombo"}
        </p>
        <p>
          <span className="font-medium">Date:</span>{" "}
          {new Date(event.date).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Time:</span>{" "}
          {new Date(event.date).toLocaleTimeString()} to{" "}
          {new Date(
            new Date(event.date).getTime() + 2.5 * 60 * 60 * 1000
          ).toLocaleTimeString()}
        </p>
      </div>

      {/* زر الدخول لصفحة الحدث */}
      <div className="flex justify-end">
        <button
          onClick={() => window.open(`/event/${event._id}`, "_self")}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};





export default function Events() {
  const { authFetch , user } = useAuth();
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState('Status');

  const load = async () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    
    try {
      const res = await fetch(`${authFetch("").url || "http://localhost:5000"}/api/events?${params.toString()}`);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Mock data for demo
      
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const getFilteredEvents = () => {
    let filtered = events;
    
    if (q) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(q.toLowerCase()) ||
        event.description?.toLowerCase().includes(q.toLowerCase())
      );
    }
    
    if (status) {
      filtered = filtered.filter(event => event.status === status);
    }
    
    return filtered;
  };

  const getEventsByStatus = (targetStatus) => {
    return getFilteredEvents().filter(event => event.status === targetStatus);
  };

  const upcomingEvents = getEventsByStatus('upcoming');
  const pendingEvents = getEventsByStatus('pending');
  const closedEvents = getEventsByStatus('closed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      
    {user && user.role === "admin" && (<Slidebar />)}

      {/* Main Content */}
      
      <div className={` mt-20 p-6 ${user && user.role === "admin" ? " ml-64 " : "mx-auto "}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Management Section</h1>
          
          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-600" />
              <button className="text-sm text-gray-600 hover:text-gray-900">Filter</button>
            </div> */}
            
            {/* <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div> */}
          </div>
        </div>

        {/* Action Bar */}
        <div className={user && user.role === "admin" ? "flex items-center justify-between mb-6" : "flex justify-start mb-6"}>
          <div className="flex items-center gap-4">
           
           {user && user.role === "admin" && (<div className="flex items-center gap-2">
            <Link to="./dashboard/addevent" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Plus size={16} />
              New Event
            </Link>
          
            <button className="border border-orange-300 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Attendee Insights ▼
            </button>
            </div>
          
          )}
            
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sort By:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Status</option>
                <option>Date</option>
                <option>Name</option>
              </select>
            </div>
            <button className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
              <Calendar size={16} />
              Pick Date
            </button>
          </div>
        </div>

        {/* Original Filter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 items-center">
            <input 
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Search events..." 
              value={q} 
              onChange={e => setQ(e.target.value)} 
            />
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={status} 
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
            <button 
              className="bg-black hover:bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" 
              onClick={load}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Up-Coming Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-gray-700">Pending Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="text-gray-700">Closed Events</span>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Show filtered events or all events */}
          {(status ? getEventsByStatus(status) : getFilteredEvents()).map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {/* Empty State */}
        {getFilteredEvents().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}