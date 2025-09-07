import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
// import EventForm from "../components/EventForm.jsx";
// import { EventCard } from "./Events.jsx";
// import { Sidebar } from "lucide-react";
import Slidebar from "../components/Slidebar.jsx";
import { Outlet } from "react-router-dom";


  

export default function Dashboard() {
  const { authFetch , user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", date:"", venue:"", price:0, seatsTotal:0 });

  

  useEffect(() => {  const load = async () => {
    const r = await fetch("http://localhost:5000/api/events");
    const data= await r.json()
    console.log(data)
    setEvents(data)
    return data
  };
  load()
   }, []);



  return (

    <div className="space-y-6">
      {/* <h2 className="text-2xl font-bold">Admin Dashboard</h2>

   

     <EventForm/>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(ev => (
        <EventCard key={ev._id} event={ev}/>
        ))}
      </div> */}
      {user && user.role === "admin" && (<Slidebar />)}
      
      <div className=" ml-64 mt-20  ">
        
        <Outlet/>

        </div>
    </div>
  );
}

