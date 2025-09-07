import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Events, { EventCard } from "./pages/Events.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import EventForm from "./components/EventForm.jsx";
import ManageEvent from "./pages/ManageEvent.jsx";
import AttendeeInsight from "./pages/AttendeeInsight.jsx";
import AnalyticReport from "./pages/AnalyticReport.jsx";
import CheckOut from "./pages/CheckOut.jsx";
import Nav from "./components/Nav.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import ManageUser from "./pages/MangeUser.jsx";
import Insight from "./pages/Insights.jsx";
import UserDetail from "./pages/UserDetail.jsx";






const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (

    
    
    <AuthProvider>
      <Nav/>
      <div className="container py-6">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/mytickets"
            element={
              <PrivateRoute>
                <MyTickets />
              </PrivateRoute>
            }



          />

          <Route path="/tickets/:id" element={<PrivateRoute> <TicketDetail /> </PrivateRoute>} /> 


          <Route path="/checkout/:id" element={<PrivateRoute> <CheckOut /> </PrivateRoute>} /> 
          <Route
            path="dashboard"
            element={
              <PrivateRoute role="admin">
                <Dashboard />
              </PrivateRoute>
            }
          >
            
              <Route path="insights" element={
                
                <Insight/>
              }/>
              <Route path="addevent" element={
                <EventForm/>
              }/>
              <Route path="manage-event" element={
                <ManageEvent/>
              }/>
              <Route path="attendee-insight" element={
                <AttendeeInsight/>
              }/>
              <Route path="analytic-report" element={
                <AnalyticReport/>
                
              }/>
              <Route path="mange-user" element={<ManageUser/>} />  
              <Route path="users/:id" element={
            <UserDetail/>
              }/> 

          </Route>
          <Route path="/event/:id" element={<EventDetails />} />

        </Routes>

             

      </div>
    </AuthProvider>
  );
}
