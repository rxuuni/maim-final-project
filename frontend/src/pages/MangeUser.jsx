import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Search, 
  Filter,
  Mail, 
  Calendar, 
  MapPin,
  User,
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Heart,
  UserCheck,
  Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ManageUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { token } = useAuth();
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users" , {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // التوكن
            },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term, role, and gender
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Gender filter
    if (filterGender !== "all") {
      filtered = filtered.filter(user => user.profile?.gender === filterGender);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, filterGender]);

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'female':
        return <User className="w-4 h-4 text-pink-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getGenderColor = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'female':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleUserClick = (userId) => {
    navigate(`/dashboard/users/${userId}`);
  };

  const handleActionClick = (e, action, user) => {
    e.stopPropagation();
    console.log(`${action} user:`, user);
    // Implement actions here
    switch (action) {
      case 'view':
        navigate(`/admin/users/${user._id}`);
        break;
      case 'edit':
        navigate(`/admin/users/${user._id}/edit`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
          // Add delete API call here
          console.log('Deleting user:', user._id);
        }
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="h-12 bg-gray-300 rounded w-full"></div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
              <p className="text-gray-600">Manage all registered users and their information</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Total: {users.length}</span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white shadow-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white shadow-sm min-w-24"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>

              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white shadow-sm min-w-24"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              
              <button className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border hover:bg-gray-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
            {searchTerm && ` matching "${searchTerm}"`}
            {filterRole !== "all" && ` with role "${filterRole}"`}
            {filterGender !== "all" && ` with gender "${filterGender}"`}
          </p>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || filterRole !== "all" || filterGender !== "all" 
                ? "No users match your filters" 
                : "No users found"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterRole !== "all" || filterGender !== "all"
                ? "Try adjusting your search criteria or filters"
                : "There are no registered users in the database"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
              >
                {/* User Header */}
                <div className="bg-black p-4 text-white relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role || 'User'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-300" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate pr-20">
                        {user.name || 'Unknown User'}
                      </h3>
                      <p className="text-gray-300 text-sm truncate">
                        {user.email || 'No email'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                </div>

                {/* User Body */}
                <div className="p-4">
                  {/* Gender Badge */}
                  <div className="flex justify-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getGenderColor(user.profile?.gender)}`}>
                      {getGenderIcon(user.profile?.gender)}
                      {user.profile?.gender ? user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1) : 'Not specified'}
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3 text-sm">
                    {/* User ID */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <UserCheck className="w-4 h-4 mr-2" />
                        <span>User ID</span>
                      </div>
                      <span className="font-mono text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {user._id.slice(-8)}
                      </span>
                    </div>

                    {/* Interests */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Heart className="w-4 h-4 mr-2" />
                        <span>Interests</span>
                      </div>
                      <span className="text-gray-900 text-xs">
                        {user.profile?.interests?.length || 0} interests
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Created</span>
                      </div>
                      <span className="text-gray-900 text-xs">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>

                    {/* Updated Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Updated</span>
                      </div>
                      <span className="text-gray-900 text-xs">
                        {formatDate(user.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => handleActionClick(e, 'view', user)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleActionClick(e, 'edit', user)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleActionClick(e, 'delete', user)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <MoreVertical className="w-4 h-4" />
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

        {/* Footer Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Admins
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <User className="w-4 h-4" />
              Users
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-2xl font-bold text-pink-600">
              {users.filter(u => u.profile?.gender === 'female').length}
            </div>
            <div className="text-sm text-gray-600">Female</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => u.profile?.gender === 'other').length}
            </div>
            <div className="text-sm text-gray-600">Other</div>
          </div>
        </div>
      </div>
    </div>
  );
}