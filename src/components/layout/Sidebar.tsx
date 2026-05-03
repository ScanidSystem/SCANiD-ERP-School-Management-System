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
  School,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { motion, AnimatePresence } from "motion/react";

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
    { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["superadmin", "admin", "teacher", "parent", "student"] },
    { name: "Schools", path: "/schools", icon: School, roles: ["superadmin"] },
    { name: "Students", path: "/students", icon: GraduationCap, roles: ["superadmin", "admin", "teacher"] },
    { name: "Teachers", path: "/teachers", icon: UserCheck, roles: ["superadmin", "admin"] },
    { name: "Academic Reports", path: "/marks", icon: Users, roles: ["superadmin", "admin", "teacher", "parent", "student"] },
    { name: "Attendance", path: "/attendance", icon: CalendarCheck, roles: ["superadmin", "admin", "teacher", "parent", "student"] },
    { name: "Fees", path: "/fees", icon: CreditCard, roles: ["superadmin", "admin", "parent"] },
    { name: "Messages", path: "/messages", icon: MessageSquare, roles: ["superadmin", "admin", "teacher", "parent", "student"] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      width: 0,
      marginLeft: 0,
      transition: { duration: 0.2 } 
    },
    visible: { 
      opacity: 1, 
      width: "auto",
      marginLeft: 16,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-slate-950 text-white h-full flex flex-col relative z-40 border-r border-slate-800/50 shadow-2xl"
    >
      <div className={cn(
        "p-6 flex flex-col items-center relative min-h-[140px] justify-center transition-all duration-300",
        isCollapsed ? "px-2" : "p-6"
      )}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-blue-600 text-white rounded-full p-1.5 shadow-xl hover:bg-blue-500 transition-all z-50 border-2 border-slate-950 scale-100 hover:scale-110 active:scale-95"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
        </button>

        <div className="flex items-center justify-center mb-4 h-12 w-full px-2">
          <motion.div layout className="flex items-center justify-center">
            {isCollapsed ? (
              <motion.div 
                layoutId="logo-box"
                className="bg-gradient-to-br from-blue-500 to-blue-700 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-blue-500/20"
              >
                S
              </motion.div>
            ) : (
              <motion.img 
                layoutId="logo-img"
                src="https://ais-dev-qbyadn55tzqynrpuxuan4r-416405542511.asia-southeast1.run.app/artifact/logo_scanid_logo.png" 
                alt="SCANID Logo" 
                className="h-auto w-full max-w-[140px] object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
        </div>
        
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex flex-col items-center"
            >
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] text-center">
                {user.role}
              </p>
              <div className="h-0.5 w-8 bg-blue-600/30 rounded-full mt-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-visible custom-scrollbar scrollbar-hide">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-xl transition-all relative group h-11",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50",
                isCollapsed && "justify-center"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                />
              )}

              <div className={cn(
                "flex items-center justify-center shrink-0 transition-transform duration-200",
                isActive ? "text-blue-400" : "group-hover:scale-110"
              )}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span 
                    key="label"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn(
                      "ml-3 font-semibold whitespace-nowrap overflow-hidden text-sm tracking-tight",
                      isActive ? "text-slate-100" : "text-slate-400"
                    )}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {isCollapsed && (
                <div className="fixed left-[88px] bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 z-[100] shadow-2xl border border-slate-700/50 backdrop-blur-md">
                  {item.name}
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700/50" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn(
        "p-3 border-t border-slate-800/50 space-y-1.5",
        isCollapsed && "px-3"
      )}>
        <button 
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-xl transition-all group relative h-11",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
            <Settings size={20} />
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-sm tracking-tight">Settings</span>
          )}
          {isCollapsed && (
            <div className="fixed left-[88px] bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 z-[100] shadow-2xl border border-slate-700/50 backdrop-blur-md">
              Settings
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700/50" />
            </div>
          )}
        </button>
        <button 
          onClick={onLogout}
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group relative h-11",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            <LogOut size={20} />
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-sm tracking-tight text-red-400/80">Logout</span>
          )}
          {isCollapsed && (
            <div className="fixed left-[88px] bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 z-[100] shadow-2xl border border-red-500/50 backdrop-blur-md">
              Logout
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45 border-l border-b border-red-500/50" />
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
}
