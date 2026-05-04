import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useState, useEffect } from "react";

// Layout components
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

// Pages
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Marks from "@/pages/Marks";
import Attendance from "@/pages/Attendance";
import Fees from "@/pages/Fees";
import Messages from "@/pages/Messages";
import Teachers from "@/pages/Teachers";
import Schools from "@/pages/Schools";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";

import { Role, User } from "@/types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication for development
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50">
        <Sidebar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar user={user} onLogout={handleLogout} />
          <Breadcrumbs />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/students" element={<Students user={user} />} />
              <Route path="/marks" element={<Marks user={user} />} />
              <Route path="/attendance" element={<Attendance user={user} />} />
              <Route path="/fees" element={<Fees user={user} />} />
              <Route path="/messages" element={<Messages user={user} />} />
              <Route path="/teachers" element={<Teachers user={user} />} />
              <Route path="/schools" element={<Schools user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/settings" element={<Settings user={user} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}
