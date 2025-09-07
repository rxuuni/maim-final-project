import {   BellRing, ChartNoAxesCombined, FolderCog, HelpCircle, House, icons, LayoutDashboard, LogOut, PanelsTopLeft, Plus, ScrollText, Settings, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


function Sidebar() {
  const {logout} = useAuth();
  const navigate = useNavigate();

  const routes = [
    { path: "addevent", name: "Add Event", id: 1 ,icons:<LayoutDashboard size={20} />},
    { path: "manage-event", name: "Manage Event", id: 2 , icons:<FolderCog  size={20} />},
    { path: "attendee-insight", name: "Attendee Insight", id: 3 ,   icons:<ChartNoAxesCombined  size={20} />},
    { path: "analytic-report", name: "Analytic Report", id: 4 , icons:<ScrollText   size={20} />},
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
      <div className="p-4">
        {/* Logo */}
        

        {/* Quick Add */}
        <div className="mb-6 mt-16">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium transition-colors">
            <House  size={16} 
            onClick={() => navigate(`/events`)}
            />
           Home
            
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Main Navigation</div>
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => navigate(`/dashboard/${route.path}`)}
              className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm w-full text-left"
            >
              <span className="w-5 h-5  rounded"> 
                {route.icons}
              </span>
              {route.name}
            </button>
          ))}
        </nav>

        {/* Support & Management */}
        <nav className="mt-6 space-y-1">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Support & Management</div>
          <button onClick={() => navigate("/dashboard/insights")} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm w-full text-left">
            <div className="w-5 rounded">
              <PanelsTopLeft size={20} />
            </div>
            Dashboard
          </button>
          <button onClick={() => navigate("/notifications")} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm w-full text-left">
            <div className="w-5 h-5 rounded"><BellRing size={20}/></div>
            Notifications
          </button>
          <button onClick={() => navigate("/settings")} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm w-full text-left">
            <div className="w-5 h-5 rounded">
              <Settings size={20}/>
            </div>
            Settings
          </button>
        </nav>

        {/* Additional Features */}
        <nav className="mt-6 space-y-1">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Additional Features</div>
          <button onClick={() => navigate("/marketing")} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm w-full text-left">
            <div className="w-5 h-5 bg-gray-700 rounded"></div>
            Marketing
          </button>
          <button onClick={() => navigate("/categories")} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm w-full text-left">
            <div className="w-5 h-5 bg-gray-700 rounded"></div>
            Event Categories
          </button>
        </nav>

        {/* Account Management */}
        <nav className="mt-6 space-y-1">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Account Management</div>
          <button onClick={() => navigate("/dashboard/mange-user")} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm w-full text-left">
            <div className="w-5 h-5  rounded">
              <Users size={20} />
            </div>
            Manage Users
          </button>
          
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm w-full text-left">
            <div className="w-5 h-5 rounded">
              <LogOut size={20} />
            </div>
            Logout

          </button>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
