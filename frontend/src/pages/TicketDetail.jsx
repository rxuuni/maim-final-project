import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  CreditCard, 
  Ticket,
  ArrowLeft,
  Download,
  Share,
  Mail,
  Phone,
  Globe,
  Navigation,
  Users,
  Tag,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

export default function TicketDetail() {
  const { authFetch } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await authFetch(`/api/tickets/tickets/${id}`);
        if (!response.ok) {
          throw new Error('Ticket not found');
        }
        const data = await response.json();
        console.log(data);
        setTicket(data);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [authFetch, id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'active':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: <AlertCircle className="w-4 h-4" />
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: <XCircle className="w-4 h-4" />
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
    }
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading ticket...');
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Ticket for ${ticket?.event?.name}`,
        text: `Check out my ticket for ${ticket?.event?.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="bg-white rounded-xl h-96 shadow-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Ticket not found</h3>
          <p className="text-gray-600 mb-4">{error || 'The ticket you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/tickets')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusColor(ticket.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/mytickets')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Tickets
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Ticket Details</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Ticket Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Ticket Header */}
              <div className="bg-black p-6 text-white relative">
                <div className="absolute top-6 right-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    {statusStyle.icon}
                    {ticket.status || 'Active'}
                  </span>
                </div>
                
                <h2 className="font-bold text-2xl mb-2 pr-32">
                  {ticket.event?.name || 'Event Name'}
                </h2>
                
                <div className="flex items-center text-gray-300 mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                {/* Event Details */}
                {ticket.event && (
                  <div className="space-y-2 text-sm text-gray-300">
                    {ticket.event.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {ticket.event.location}
                      </div>
                    )}
                    {ticket.event.time && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {ticket.event.time}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ticket Body */}
              <div className="p-6">
                {/* QR Code Section */}
                <div className="flex justify-center mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <QRCode
                      value={`${window.location.origin}/${ticket._id}`}
                      size={150}
                      style={{ height: "auto", maxWidth: "100%", width: "150px" }}
                    />
                    <p className="text-xs text-gray-500 mt-3">Scan at venue entrance</p>
                  </div>
                </div>

                {/* Ticket Information Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-lg border-b pb-2">Ticket Information</h3>
                    
                    {/* Ticket ID */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <Tag className="w-4 h-4 mr-2" />
                        <span className="text-sm">Ticket ID</span>
                      </div>
                      <span className="font-mono text-sm text-gray-900">
                        {ticket._id.slice(-8)}
                      </span>
                    </div>

                    {/* Seat Information */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span className="text-sm">Seat Number</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {ticket.seatNumber || 'General Admission'}
                      </span>
                    </div>

                    {/* Seat Allocation */}
                    {ticket.selectedSeats && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600">
                          <Navigation className="w-4 h-4 mr-2" />
                          <span className="text-sm">Seat Allocation</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {ticket.selectedSeats}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-lg border-b pb-2">Purchase Details</h3>
                    
                    {/* Price */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="text-sm">Price Paid</span>
                      </div>
                      <span className="font-bold text-green-600 text-lg">
                        ${ticket.pricePaid || '0.00'}
                      </span>
                    </div>

                    {/* Purchase Date */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">Purchase Date</span>
                      </div>
                      <span className="text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Purchase Time */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">Purchase Time</span>
                      </div>
                      <span className="text-gray-900">
                        {new Date(ticket.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Ticket
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    <Share className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute left-0 top-40 w-8 h-8 bg-gray-50 rounded-r-full transform -translate-x-4"></div>
              <div className="absolute right-0 top-40 w-8 h-8 bg-gray-50 rounded-l-full transform translate-x-4"></div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Information */}
            {ticket.event && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Event Information</h3>
                <div className="space-y-3 text-sm">
                  {ticket.event.description && (
                    <p className="text-gray-600">{ticket.event.description}</p>
                  )}
                  {ticket.event.category && (
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-700">{ticket.event.category}</span>
                    </div>
                  )}
                  {ticket.event.capacity && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-700">Capacity: {ticket.event.capacity}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a
                  href="mailto:support@eventapp.com"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">support@eventapp.com</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">+1 (234) 567-8900</span>
                </a>
                <a
                  href="https://help.eventapp.com"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm">Help Center</span>
                </a>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 text-lg mb-3">Important</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Present this QR code at the venue</li>
                <li>• Arrive 30 minutes before the event</li>
                <li>• Bring valid ID for verification</li>
                <li>• No refunds after event start</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}