import { Router } from "express";
import Event from "../models/Event.js";
const router = Router();
router.get('/', async (req, res) => {
  try {
    // Get all events
    const events = await Event.find({});
    
    // Calculate total events
    const totalEvents = events.length;
    
    // Calculate total attendees (sold seats)
    const totalAttendees = events.reduce((sum, event) => {
      return sum + (event.seatAmount - event.availableSeats);
    }, 0);
    
    // Calculate revenue
    const totalRevenue = events.reduce((sum, event) => {
      const soldSeats = event.seatAmount - event.availableSeats;
      return sum + (soldSeats * event.ticketPrice);
    }, 0);
    
    // Calculate average ticket price
    const avgTicketPrice = events.length > 0 
      ? events.reduce((sum, event) => sum + event.ticketPrice, 0) / events.length 
      : 0;
    
    // Get events by status
    const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
    const closedEvents = events.filter(event => event.status === 'closed').length;
    const pendingEvents = events.filter(event => event.status === 'pending').length;
    
    // Get events by popularity
    const highPopularityEvents = events.filter(event => event.popularity === 'High Popularity').length;
    const mediumPopularityEvents = events.filter(event => event.popularity === 'Medium Popularity').length;
    const lowPopularityEvents = events.filter(event => event.popularity === 'Low Popularity').length;
    
    // Calculate occupancy rate
    const totalSeats = events.reduce((sum, event) => sum + event.seatAmount, 0);
    const occupancyRate = totalSeats > 0 ? ((totalSeats - events.reduce((sum, event) => sum + event.availableSeats, 0)) / totalSeats * 100).toFixed(1) : 0;
    
    // Since we don't have actual age data, we'll simulate age distribution
    // In a real app, you'd have a separate attendee collection with age data
    const simulateAgeData = () => {
      const ageGroups = [
        { range: '18-24 Years', percentage: 35 },
        { range: '25-34 Years', percentage: 28 },
        { range: '35-44 Years', percentage: 20 },
        { range: '45-54 Years', percentage: 12 },
        { range: '55+ Years', percentage: 5 }
      ];
      
      return ageGroups.map(group => ({
        title: 'ATTENDEE AGE',
        value: group.range,
        number: Math.floor((totalAttendees * group.percentage) / 100).toString(),
        change: `${Math.floor(Math.random() * 40 - 10)}% ${Math.random() > 0.5 ? 'Increase' : 'Decrease'}`,
        changeType: Math.random() > 0.3 ? 'positive' : 'negative'
      }));
    };
    
    // Calculate previous period comparison (simulated for demo)
    const previousTotalEvents = Math.floor(totalEvents * 0.85); // Simulate 15% growth
    const eventsGrowth = totalEvents > 0 
      ? ((totalEvents - previousTotalEvents) / previousTotalEvents * 100).toFixed(1)
      : 0;
    
    const previousRevenue = totalRevenue * 0.78; // Simulate 22% revenue growth
    const revenueGrowth = totalRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : 0;
    
    // Response data structure matching your frontend format
    const analyticsData = {
      // Main metrics
      overview: {
        totalEvents: {
          title: 'TOTAL EVENTS',
          value: totalEvents.toString(),
          number: totalEvents.toString(),
          change: `${eventsGrowth}% Increase`,
          changeType: eventsGrowth > 0 ? 'positive' : 'negative'
        },
        totalAttendees: {
          title: 'TOTAL ATTENDEES',
          value: totalAttendees.toString(),
          number: totalAttendees.toString(),
          change: '15% Increase', // Simulated
          changeType: 'positive'
        },
        totalRevenue: {
          title: 'TOTAL REVENUE',
          value: `$${totalRevenue.toLocaleString()}`,
          number: totalRevenue.toString(),
          change: `${revenueGrowth}% Increase`,
          changeType: revenueGrowth > 0 ? 'positive' : 'negative'
        },
        occupancyRate: {
          title: 'OCCUPANCY RATE',
          value: `${occupancyRate}%`,
          number: occupancyRate.toString(),
          change: '8% Increase', // Simulated
          changeType: 'positive'
        }
      },
      
      // Age demographics (simulated based on total attendees)
      ageDistribution: simulateAgeData(),
      
      // Event status breakdown
      eventStatus: {
        upcoming: {
          title: 'UPCOMING EVENTS',
          value: upcomingEvents.toString(),
          number: upcomingEvents.toString(),
          change: '5% Increase',
          changeType: 'positive'
        },
        closed: {
          title: 'CLOSED EVENTS', 
          value: closedEvents.toString(),
          number: closedEvents.toString(),
          change: '12% Increase',
          changeType: 'positive'
        },
        pending: {
          title: 'PENDING EVENTS',
          value: pendingEvents.toString(), 
          number: pendingEvents.toString(),
          change: '3% Decrease',
          changeType: 'negative'
        }
      },
      
      // Popularity breakdown
      popularity: {
        high: {
          title: 'HIGH POPULARITY',
          value: highPopularityEvents.toString(),
          number: highPopularityEvents.toString(),
          change: '20% Increase',
          changeType: 'positive'
        },
        medium: {
          title: 'MEDIUM POPULARITY',
          value: mediumPopularityEvents.toString(),
          number: mediumPopularityEvents.toString(),
          change: '5% Increase', 
          changeType: 'positive'
        },
        low: {
          title: 'LOW POPULARITY',
          value: lowPopularityEvents.toString(),
          number: lowPopularityEvents.toString(),
          change: '10% Decrease',
          changeType: 'negative'
        }
      },
      
      // Additional metrics
      metrics: {
        avgTicketPrice: {
          title: 'AVG TICKET PRICE',
          value: `$${avgTicketPrice.toFixed(2)}`,
          number: avgTicketPrice.toFixed(2),
          change: '7% Increase',
          changeType: 'positive'
        },
        totalSeats: {
          title: 'TOTAL SEATS',
          value: totalSeats.toString(),
          number: totalSeats.toString(),
          change: '25% Increase',
          changeType: 'positive'
        }
      },
      
      // Raw data for charts/tables
      rawData: {
        events: events.map(event => ({
          id: event._id,
          name: event.name,
          date: event.date,
          venue: event.venue,
          soldSeats: event.seatAmount - event.availableSeats,
          revenue: (event.seatAmount - event.availableSeats) * event.ticketPrice,
          occupancy: ((event.seatAmount - event.availableSeats) / event.seatAmount * 100).toFixed(1),
          status: event.status,
          popularity: event.popularity
        })),
        summary: {
          totalEvents,
          totalAttendees,
          totalRevenue,
          avgTicketPrice: parseFloat(avgTicketPrice.toFixed(2)),
          occupancyRate: parseFloat(occupancyRate)
        }
      }
    };
    
    res.status(200).json({
      success: true,
      data: analyticsData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analytics route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data',
      error: error.message
    });
  }
});


router.get('/analytics/age', async (req, res) => {
  try {
    const events = await Event.find({});
    const totalAttendees = events.reduce((sum, event) => {
      return sum + (event.seatAmount - event.availableSeats);
    }, 0);
    
    // Simulated age distribution - replace with real data from attendee collection
    const ageDistribution = [
      {
        title: 'ATTENDEE AGE',
        value: '18-24 Years',
        number: Math.floor(totalAttendees * 0.35).toString(),
        change: '30% Increase',
        changeType: 'positive'
      },
      {
        title: 'ATTENDEE AGE',
        value: '25-34 Years', 
        number: Math.floor(totalAttendees * 0.28).toString(),
        change: '15% Increase',
        changeType: 'positive'
      },
      {
        title: 'ATTENDEE AGE',
        value: '35-44 Years',
        number: Math.floor(totalAttendees * 0.20).toString(),
        change: '5% Decrease',
        changeType: 'negative'
      },
      {
        title: 'ATTENDEE AGE',
        value: '45-54 Years',
        number: Math.floor(totalAttendees * 0.12).toString(),
        change: '2% Increase',
        changeType: 'positive'
      },
      {
        title: 'ATTENDEE AGE', 
        value: '55+ Years',
        number: Math.floor(totalAttendees * 0.05).toString(),
        change: '8% Increase',
        changeType: 'positive'
      }
    ];
    
    res.status(200).json({
      success: true,
      data: ageDistribution
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching age analytics',
      error: error.message
    });
  }
});

export default router;