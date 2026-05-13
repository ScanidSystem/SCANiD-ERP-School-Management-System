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
  Terminal,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { SimpleTooltip } from "@/components/shared/SimpleTooltip";

interface SidebarProps {
  user: {
    name: string;
    role: Role;
  };
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ user, onLogout, isMobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["superadmin", "admin", "teacher", "parent", "student"] },
    { name: "Students", path: "/students", icon: GraduationCap, roles: ["superadmin", "admin", "teacher"] },
    { name: "Teachers", path: "/teachers", icon: UserCheck, roles: ["superadmin", "admin"] },
    { name: "Academic Reports", path: "/marks", icon: Users, roles: ["superadmin", "admin", "teacher", "parent", "student"] },
    { name: "Attendance", path: "/attendance", icon: CalendarCheck, roles: ["superadmin", "admin", "teacher", "parent", "student"] },
    { name: "Fees", path: "/fees", icon: CreditCard, roles: ["superadmin", "admin", "parent"] },
    { name: "Messages", path: "/messages", icon: MessageSquare, roles: ["superadmin", "admin", "teacher", "parent", "student"] },
    { 
      name: "Masters & Config", 
      path: "/configuration", 
      icon: Database, 
      roles: ["superadmin"],
      subItems: [
        { name: "Schools", path: "/configuration/schools", roles: ["superadmin"] },
        { name: "Role Master", path: "/configuration/role-master", roles: ["superadmin"] },
        { name: "Role Assignment", path: "/configuration/role-assignment", roles: ["superadmin"] },
        { name: "Manage Standards", path: "/configuration/standards", roles: ["superadmin"] },
        { name: "Manage Divisions/Sections", path: "/configuration/sections", roles: ["superadmin"] },
        { name: "Academic Years", path: "/configuration/academic-years", roles: ["superadmin"] },
        { name: "Castes", path: "/configuration/castes", roles: ["superadmin"] },
        { name: "Sub-Castes", path: "/configuration/sub-castes", roles: ["superadmin"] },
        { name: "Religions", path: "/configuration/religions", roles: ["superadmin"] },
        { name: "States", path: "/configuration/states", roles: ["superadmin"] },
        { name: "Cities", path: "/configuration/cities", roles: ["superadmin"] },
        { name: "Blood Groups", path: "/configuration/blood-groups", roles: ["superadmin"] },
        { name: "Houses", path: "/configuration/houses", roles: ["superadmin"] },
        { name: "Admission Types", path: "/configuration/admission-types", roles: ["superadmin"] },
      ]
    },
    { name: "System Logs", path: "/system-logs", icon: Terminal, roles: ["superadmin"] },
  ];

  // RBAC (Role Based Access Control) filtering:
  // We only show navigation items that match the user's current role.
  // Superadmin-only items (Schools, configuration, logs) are restricted via the 'roles' array.
  const filteredItems = menuItems.filter(item => {
    if (!user || !user.role) return false;
    return item.roles.includes(user.role);
  });

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

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
      className={cn(
        "bg-slate-950 text-white h-full flex flex-col relative z-50 border-r border-slate-800/50 shadow-2xl transition-all duration-300",
        // Mobile styles
        "fixed lg:relative inset-y-0 left-0 transform",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className={cn(
        "p-6 flex flex-col items-center relative min-h-[140px] justify-center transition-all duration-300",
        isCollapsed ? "px-2" : "p-6"
      )}>
        {/* Mobile close button */}
        {isMobileOpen && (
          <button 
            onClick={onCloseMobile}
            className="lg:hidden absolute right-4 top-4 text-slate-400 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <SimpleTooltip content={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} side="right">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-10 bg-blue-600 text-white rounded-full p-1.5 shadow-xl hover:bg-blue-500 transition-all z-50 border-2 border-slate-950 scale-100 hover:scale-110 active:scale-95 hidden lg:block"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
          </button>
        </SimpleTooltip>

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
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-visible custom-scrollbar scrollbar-hide">
        {filteredItems.map((item) => {
          const isParentActive = location.pathname.startsWith(item.path);
          const isActive = location.pathname === item.path;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.includes(item.name) || (isParentActive && hasSubItems);

          return (
            <div key={item.path} className="space-y-1">
              <SimpleTooltip content={isCollapsed ? item.name : ""} side="right">
                <div className="w-full">
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={cn(
                        "w-full flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 relative group h-12 text-left",
                        isParentActive 
                          ? "bg-white/10 text-white" 
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                        isCollapsed && "justify-center px-0"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center shrink-0 transition-all duration-300",
                        isParentActive ? "text-blue-400 scale-110" : "group-hover:scale-110"
                      )}>
                        <item.icon size={22} strokeWidth={isParentActive ? 2.5 : 2} />
                      </div>
                      
                      {!isCollapsed && (
                        <>
                          <span className={cn(
                            "ml-4 font-bold whitespace-nowrap overflow-hidden text-sm tracking-tight flex-1 transition-colors duration-300",
                            isParentActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                          )}>
                            {item.name}
                          </span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn("transition-colors", isParentActive ? "text-blue-400" : "text-slate-600")}
                          >
                            <ChevronRight size={14} strokeWidth={3} />
                          </motion.div>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 relative group h-12",
                        isActive 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                        isCollapsed && "justify-center px-0"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center shrink-0 transition-all duration-300",
                        isActive ? "text-white scale-110" : "group-hover:scale-110"
                      )}>
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      
                      {!isCollapsed && (
                        <span className={cn(
                          "ml-4 font-bold whitespace-nowrap overflow-hidden text-sm tracking-tight",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        )}>
                          {item.name}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              </SimpleTooltip>

              <AnimatePresence initial={false}>
                {hasSubItems && isExpanded && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, x: -10 }}
                    animate={{ height: "auto", opacity: 1, x: 0 }}
                    exit={{ height: 0, opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-12 space-y-1 mt-1 border-l border-slate-800/50 ml-7"
                  >
                    {item.subItems?.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <div key={subItem.path}>
                          <SimpleTooltip content={subItem.name} side="right">
                            <Link
                              to={subItem.path}
                              className={cn(
                                "flex items-center py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200",
                                isSubActive 
                                  ? "text-blue-400 bg-blue-400/5" 
                                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                              )}
                            >
                              <div className={cn(
                                "w-1 h-1 rounded-full mr-3 transition-all duration-300",
                                isSubActive ? "bg-blue-400 scale-125" : "bg-slate-700 group-hover:bg-slate-500"
                              )} />
                              {subItem.name}
                            </Link>
                          </SimpleTooltip>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className={cn(
        "p-3 border-t border-slate-800/50 space-y-1.5",
        isCollapsed && "px-3"
      )}>
        <SimpleTooltip content={isCollapsed ? "Settings" : ""} side="right">
          <Link 
            to="/settings"
            className={cn(
              "w-full flex items-center px-3 py-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-xl transition-all group relative h-11",
              location.pathname === "/settings" && "bg-blue-600/10 text-blue-400",
              isCollapsed && "justify-center"
            )}
          >
            {location.pathname === "/settings" && (
              <motion.div 
                layoutId="active-nav-bottom"
                className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
              />
            )}
            <div className="flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
              <Settings size={20} />
            </div>
            {!isCollapsed && (
              <span className={cn(
                "ml-3 font-semibold text-sm tracking-tight",
                location.pathname === "/settings" ? "text-slate-100" : "text-slate-400"
              )}>Settings</span>
            )}
          </Link>
        </SimpleTooltip>
        
        <SimpleTooltip content={isCollapsed ? "Logout" : ""} side="right">
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
          </button>
        </SimpleTooltip>
      </div>
    </motion.div>
  );
}
