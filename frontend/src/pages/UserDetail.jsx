import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Crown,
  Shield,
  Heart,
  UserCheck,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1 text-sm">
            <Crown className="w-4 h-4" /> Admin
          </span>
        );
      case "moderator":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1 text-sm">
            <Shield className="w-4 h-4" /> Moderator
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1 text-sm">
            <User className="w-4 h-4" /> User
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header Card */}
        <div className="bg-black text-white rounded-xl shadow-md p-6 mb-8 relative">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-300" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-300">{user.email}</p>
            </div>
            {getRoleBadge(user.role)}
          </div>
          <p className="mt-4 flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            Joined {formatDate(user.createdAt)}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Profile Info</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> User ID
                </span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {user._id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Interests
                </span>
                <span>
                  {user.profile?.interests?.length
                    ? user.profile.interests.join(", ")
                    : "No interests"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Created
                </span>
                <span>{formatDate(user.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Updated
                </span>
                <span>{formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                <Edit className="w-4 h-4" /> Edit User
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition">
                <Trash2 className="w-4 h-4" /> Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
