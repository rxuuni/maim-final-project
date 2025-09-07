import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  CreditCard, 
  Ticket,
  ChevronRight,
  Download,
  Share
} from "lucide-react";

export default function MyTickets() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await authFetch("/api/tickets/tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [authFetch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage and view all your event tickets</p>
        </div>

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">You haven't purchased any tickets yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => handleTicketClick(ticket._id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-black-300"
              >
                {/* Ticket Header */}
                <div className="bg-black from-blue-600 to-purple-600 p-4 text-white relative">
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status || 'Active'}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1 pr-20">
                    {ticket.event?.name || 'Event Name'}
                  </h3>
                  
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="p-4">
                  {/* QR Code Section */}
                  <div className="flex justify-center mb-4 p-3 bg-gray-50 rounded-lg">
                    <QRCode
                      value={ticket._id}
                      size={80}
                      style={{ height: "auto", maxWidth: "100%", width: "80px" }}
                    />
                  </div>

                  {/* Ticket Details */}
                  <div className="space-y-3">
                    {/* Seat Information */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span className="text-sm">Seat</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {ticket.seatNumber || 'General Admission'}
                      </span>
                    </div>

                    {/* Seat Allocation */}
                    {ticket.selectedSeats && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">Allocation</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {ticket.selectedSeats}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="text-sm">Price Paid</span>
                      </div>
                      <span className="font-bold text-green-600">
                        ${ticket.pricePaid || '0.00'}
                      </span>
                    </div>

                    {/* Purchase Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">Purchased</span>
                      </div>
                      <span className="text-sm text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download functionality
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add share functionality
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute left-0 top-32 w-6 h-6 bg-gray-50 rounded-r-full transform -translate-x-3"></div>
                <div className="absolute right-0 top-32 w-6 h-6 bg-gray-50 rounded-l-full transform translate-x-3"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}