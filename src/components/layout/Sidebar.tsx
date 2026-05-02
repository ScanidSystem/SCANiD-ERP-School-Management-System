import { useState } from "react";
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
  UserCheck,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/App";
import { motion } from "motion/react";
import logo from "@/assets/SCANiD_Logo.png";

interface SidebarProps {
  user: {
    name: string;
    role: Role;
  };
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
            src={logo}
            alt="SCANID Logo" 
            className="h-auto w-full max-w-[140px]"
            referrerPolicy="no-referrer"
          />
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="bg-slate-900 text-white h-full flex flex-col relative transition-all duration-300 ease-in-out"
    >
      <div className={cn(
        "p-6 border-b border-slate-800 flex flex-col items-center relative",
        isCollapsed ? "px-2" : "p-6"
      )}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-blue-600 text-white rounded-full p-1 shadow-lg hover:bg-blue-700 transition-colors z-50 border-2 border-slate-900"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex items-center justify-center mb-2 overflow-hidden h-10 w-full px-2">
          {isCollapsed ? (
            <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
              S
            </div>
          ) : (
            <img 
              src="https://ais-dev-qbyadn55tzqynrpuxuan4r-416405542511.asia-southeast1.run.app/artifact/logo_scanid_logo.png" 
              alt="SCANID Logo" 
              className="h-auto w-full max-w-[140px]"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        {!isCollapsed && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center"
          >
            {user.role}
          </motion.p>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.name : ""}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative group",
              location.pathname === item.path 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-medium whitespace-nowrap"
              >
                {item.name}
              </motion.span>
            )}
            
            {isCollapsed && (
              <div className="absolute left-14 bg-slate-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] shadow-xl border border-slate-700">
                {item.name}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className={cn(
        "p-4 border-t border-slate-800 space-y-2",
        isCollapsed && "px-2"
      )}>
        <button 
          title={isCollapsed ? "Settings" : ""}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all group relative",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Settings size={20} className="shrink-0" />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-medium"
            >
              Settings
            </motion.span>
          )}
          {isCollapsed && (
              <div className="absolute left-14 bg-slate-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] shadow-xl border border-slate-700">
                Settings
              </div>
          )}
        </button>
        <button 
          onClick={onLogout}
          title={isCollapsed ? "Logout" : ""}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all group relative",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-medium"
            >
              Logout
            </motion.span>
          )}
          {isCollapsed && (
              <div className="absolute left-14 bg-red-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] shadow-xl border border-red-800">
                Logout
              </div>
          )}
        </button>
      </div>
    </motion.div>
  );
}
