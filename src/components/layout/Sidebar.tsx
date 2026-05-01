import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  CreditCard, 
  LogOut,
  Settings,
  Bell,
  MessageSquare,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/App";

interface SidebarProps {
  user: {
    name: string;
    role: Role;
  };
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["admin", "teacher", "parent", "student"] },
    { name: "Students", path: "/students", icon: GraduationCap, roles: ["admin", "teacher"] },
    { name: "Teachers", path: "/teachers", icon: UserCheck, roles: ["admin", "teacher"] },
    { name: "Marks & Reports", path: "/marks", icon: Users, roles: ["admin", "teacher", "parent", "student"] },
    { name: "Attendance", path: "/attendance", icon: CalendarCheck, roles: ["admin", "teacher", "parent", "student"] },
    { name: "Fees", path: "/fees", icon: CreditCard, roles: ["admin", "parent"] },
    { name: "Messages", path: "/messages", icon: MessageSquare, roles: ["admin", "teacher", "parent", "student"] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="w-64 bg-slate-900 text-white h-full flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-center mb-2">
          <img 
            src="https://ais-dev-qbyadn55tzqynrpuxuan4r-416405542511.asia-southeast1.run.app/artifact/logo_scanid_logo.png" 
            alt="SCANID Logo" 
            className="h-auto w-full max-w-[140px]"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">{user.role}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
              location.pathname === item.path 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
