import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, ChevronDown, Filter } from 'lucide-react';

const Insight = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/analytics');
      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock sales data for the line chart
  const generateSalesData = () => {
    return [
      { period: 'Jan', value: 35000, percentage: '17.3%' },
      { period: 'Feb', value: 22000, percentage: '10.9%' },
      { period: 'Mar', value: 15000, percentage: '7.4%' },
      { period: 'Apr', value: 46000, percentage: '22.7%' },
      { period: 'May', value: 34000, percentage: '16.8%' },
      { period: 'Jun', value: 29000, percentage: '14.3%' },
      { period: 'Jul', value: 22500, percentage: '11.1%' }
    ];
  };

  // Generate seat map data
  const generateSeatMap = () => {
    const rows = 8;
    const seatsPerRow = 12;
    const seatMap = [];
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const random = Math.random();
        let status = 'available';
        if (random < 0.6) status = 'sold';
        else if (random < 0.8) status = 'reserved';
        
        rowSeats.push({
          id: `${row}-${seat}`,
          status,
          row: row + 1,
          seat: seat + 1
        });
      }
      seatMap.push(rowSeats);
    }
    return seatMap;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const salesData = generateSalesData();
  const maxSales = Math.max(...salesData.map(d => d.value));
  const seatMap = generateSeatMap();

  // Customer engagement data (mock)
  const customerEngagement = [
    { name: 'Event-A', value: 450, color: '#8b5cf6', percentage: '29.4%' },
    { name: 'Event-B', value: 370, color: '#10b981', percentage: '24.2%' },
    { name: 'Event-C', value: 290, color: '#f59e0b', percentage: '19.0%' },
    { name: 'Event-D', value: 250, color: '#3b82f6', percentage: '16.3%' },
    { name: 'Event-E', value: 170, color: '#ef4444', percentage: '11.1%' }
  ];

  const totalEngagement = customerEngagement.reduce((sum, item) => sum + item.value, 0);

  // Create donut chart
  const createDonutChart = () => {
    const size = 180;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    let cumulativePercentage = 0;

    return customerEngagement.map((item, index) => {
      const percentage = (item.value / totalEngagement) * 100;
      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
      
      cumulativePercentage += percentage;
      
      return {
        ...item,
        strokeDasharray,
        strokeDashoffset,
        radius,
        circumference
      };
    });
  };

  const donutData = createDonutChart();

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Events Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">EVENTS</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalEvents.value} Events</p>
              </div>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">BOOKINGS</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalAttendees.value}</p>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">REVENUE</p>
                <p className="text-2xl font-bold text-gray-900">{parseInt(analyticsData.overview.totalRevenue.number).toLocaleString()}LKR</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  NET SALES <ChevronDown className="w-5 h-5" />
                </h2>
                <div className="flex items-center gap-6 mt-2 text-sm">
                  <div>
                    <span className="text-gray-600">Total Revenue</span>
                    <p className="font-semibold text-orange-500">{parseInt(analyticsData.overview.totalRevenue.number).toLocaleString()} LKR</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Tickets</span>
                    <p className="font-semibold">{analyticsData.overview.totalAttendees.value} Tickets</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Events</span>
                    <p className="font-semibold">{analyticsData.overview.totalEvents.value} Events</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm">
                <Filter className="w-4 h-4" />
                {selectedPeriod}
              </div>
            </div>

            {/* Line Chart */}
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 600 200">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="50" y1={40 + i * 40} x2="580" y2={40 + i * 40} stroke="#f3f4f6" strokeWidth="1" />
                ))}
                
                {/* Y-axis labels */}
                {['50,000', '40,000', '30,000', '20,000', '10,000'].map((label, i) => (
                  <text key={i} x="20" y={45 + i * 40} fill="#9ca3af" fontSize="12" textAnchor="end">
                    {label}
                  </text>
                ))}

                {/* Line path */}
                <path
                  d={`M 80 ${160 - (salesData[0].value / maxSales) * 120} ${salesData.map((point, i) => 
                    `L ${80 + i * 70} ${160 - (point.value / maxSales) * 120}`
                  ).join(' ')}`}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {salesData.map((point, i) => (
                  <g key={i}>
                    <circle
                      cx={80 + i * 70}
                      cy={160 - (point.value / maxSales) * 120}
                      r="4"
                      fill="#ec4899"
                    />
                    <text
                      x={80 + i * 70}
                      y={160 - (point.value / maxSales) * 120 - 15}
                      fill="#1f2937"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {point.value.toLocaleString()}
                    </text>
                    <text
                      x={80 + i * 70}
                      y={160 - (point.value / maxSales) * 120 - 5}
                      fill="#6b7280"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {point.percentage}
                    </text>
                    <text
                      x={80 + i * 70}
                      y={185}
                      fill="#6b7280"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {point.period}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Right Column - Customer Engagement */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Customer Engagement</h2>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg width="180" height="180" className="transform -rotate-90">
                  {donutData.map((segment, index) => (
                    <circle
                      key={index}
                      cx="90"
                      cy="90"
                      r={segment.radius}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="25"
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      className="transition-all duration-1000"
                    />
                  ))}
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{totalEngagement}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {customerEngagement.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Event Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Event</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Info */}
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Event Name:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analyticsData.rawData.events[0]?.name || 'No Events Available'}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Event Date:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analyticsData.rawData.events[0]?.date || 'N/A'}
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>Paid Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <span>Reserved Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span>To be sold</span>
                </div>
              </div>
            </div>

            {/* Seat Map */}
            <div className="flex justify-center">
              <div className="grid grid-cols-12 gap-1 p-4 bg-gray-50 rounded-xl">
                {seatMap.map((row, x) => 
                  row.map((seat, seatIndex) => (
                    <div
                      key={seat.id}
                      className={`w-6 h-6 rounded transition-colors cursor-pointer ${
                        seat.status === 'sold' ? 'bg-purple-600' :
                        seat.status === 'reserved' ? 'bg-purple-400' :
                        'bg-gray-300 hover:bg-gray-400'
                      }`}
                      title={`Row ${seat.row}, Seat ${seat.seat} - ${seat.status}`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insight;