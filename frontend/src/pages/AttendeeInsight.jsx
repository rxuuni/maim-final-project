import React, { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, Music, BarChart3, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';

const AttendeeInsight = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create pie chart SVG segments
  const createPieChart = (data, size = 200) => {
    const radius = (size - 40) / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    let cumulativePercentage = 0;
    
    const colors = ['#8b5cf6', '#ef4444', '#10b981', '#f97316', '#3b82f6'];
    
    return data.map((item, index) => {
      const percentage = (parseInt(item.number) / data.reduce((sum, d) => sum + parseInt(d.number), 0)) * 100;
      const startAngle = (cumulativePercentage / 100) * 360 - 90;
      const endAngle = ((cumulativePercentage + percentage) / 100) * 360 - 90;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = percentage > 50 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      cumulativePercentage += percentage;
      
      return {
        path: pathData,
        color: colors[index % colors.length],
        percentage: percentage.toFixed(1),
        value: item.number,
        label: item.value
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen absolute right-24 bg-gray-50 p-6 mt-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen absolute right-24 bg-gray-50 p-6 mt-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  // Prepare metrics data from API response
  const metrics = [
    {
      title: analyticsData.ageDistribution[0]?.title || 'ATTENDEE AGE',
      value: analyticsData.ageDistribution[0]?.value || 'N/A',
      number: analyticsData.ageDistribution[0]?.number || '0',
      change: analyticsData.ageDistribution[0]?.change || '0%',
      changeType: analyticsData.ageDistribution[0]?.changeType || 'neutral',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      title: 'TOTAL ATTENDEES',
      value: analyticsData.overview.totalAttendees.value,
      number: analyticsData.overview.totalAttendees.number,
      change: analyticsData.overview.totalAttendees.change,
      changeType: analyticsData.overview.totalAttendees.changeType,
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'TOTAL EVENTS',
      value: analyticsData.overview.totalEvents.value + ' Events',
      number: analyticsData.overview.totalEvents.number,
      change: analyticsData.overview.totalEvents.change,
      changeType: analyticsData.overview.totalEvents.changeType,
      icon: <MapPin className="w-5 h-5" />
    },
    {
      title: 'OCCUPANCY RATE',
      value: analyticsData.overview.occupancyRate.value,
      number: analyticsData.overview.occupancyRate.number,
      change: analyticsData.overview.occupancyRate.change,
      changeType: analyticsData.overview.occupancyRate.changeType,
      icon: <Music className="w-5 h-5" />
    },
    {
      title: 'TOTAL REVENUE',
      value: analyticsData.overview.totalRevenue.value,
      number: analyticsData.overview.totalRevenue.number,
      change: analyticsData.overview.totalRevenue.change,
      changeType: analyticsData.overview.totalRevenue.changeType,
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  // Create event data for bar chart
  const eventData = analyticsData.rawData.events.map((event, index) => ({
    name: event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name,
    value: event.soldSeats,
    percentage: event.occupancy + '%',
    color: `bg-${['blue', 'red', 'green', 'purple', 'orange'][index % 5]}-600`,
    revenue: event.revenue
  }));

  const maxEventValue = Math.max(...eventData.map(d => d.value));

  // Create age distribution pie chart
  const agePieData = createPieChart(analyticsData.ageDistribution);

  // Create event status distribution
  const eventStatusData = [
    analyticsData.eventStatus.upcoming,
    analyticsData.eventStatus.closed,
    analyticsData.eventStatus.pending
  ].filter(item => parseInt(item.number) > 0);

  const statusPieData = createPieChart(eventStatusData);

  return (
    <div className="min-h-screen absolute right-24 bg-gray-50 p-6 mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Event Analytics Insights</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border">
            <span className="text-sm font-medium">Total Attendees: {analyticsData.overview.totalAttendees.value}</span>
            <Users className="w-4 h-4 text-gray-500" />
          </div>
          
          <button 
            onClick={fetchAnalyticsData}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 w-80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Metric Cards */}
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {metric.title}
                </span>
                <div className="text-gray-400">
                  {metric.icon}
                </div>
              </div>
              
              <div className="space-y-2">
                {metric.value && (
                  <div className="text-lg font-semibold text-gray-900">
                    {metric.value}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  {metric.number && (
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.number}
                    </span>
                  )}
                  
                  {metric.change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {metric.changeType === 'positive' ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <TrendingDown className="w-4 h-4" />
                      }
                      {metric.change}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Column - Event Performance Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold text-gray-900 mb-6">EVENT ATTENDANCE</h2>
          
          <div className="space-y-4">
            {eventData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-gray-600">{item.percentage}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${(item.value / maxEventValue) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                    {item.value} attendees
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Revenue: ${item.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Pie Charts */}
        <div className="space-y-6">
          {/* Age Distribution Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-bold text-gray-900 mb-6">ATTENDEE AGES</h2>
            
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg width="200" height="200">
                  {agePieData.map((segment, index) => (
                    <path
                      key={index}
                      d={segment.path}
                      fill={segment.color}
                      className="hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </svg>
                
                {/* Legend */}
                <div className="absolute -right-32 top-0 space-y-2">
                  {agePieData.map((segment, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <div>
                        <div className="font-medium">{segment.label}</div>
                        <div className="text-gray-600">{segment.value} ({segment.percentage}%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Event Status Pie Chart */}
          {statusPieData.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-bold text-gray-900 mb-6">EVENT STATUS</h2>
              
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg width="200" height="200">
                    {statusPieData.map((segment, index) => (
                      <path
                        key={index}
                        d={segment.path}
                        fill={segment.color}
                        className="hover:opacity-80 cursor-pointer"
                      />
                    ))}
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute -right-32 top-0 space-y-2">
                    {statusPieData.map((segment, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        ></div>
                        <div>
                          <div className="font-medium">{segment.label}</div>
                          <div className="text-gray-600">{segment.value} events</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-bold text-gray-900 mb-4">QUICK STATS</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Ticket Price</span>
                <span className="font-semibold">{analyticsData.metrics.avgTicketPrice.value}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Seats</span>
                <span className="font-semibold">{analyticsData.metrics.totalSeats.value}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Occupancy Rate</span>
                <span className="font-semibold text-green-600">{analyticsData.overview.occupancyRate.value}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-semibold text-blue-600">{analyticsData.overview.totalRevenue.value}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeInsight;