import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  UserCheck,
  Terminal,
  Database,
  School,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { apiService } from "@/lib/api";
import { motion, AnimatePresence } from "motion/react";
import { SimpleTooltip } from "@/components/shared/SimpleTooltip";

interface NavItem {
  id: number;
  title: string;
  icon: string | null;
  path: string;
  parentId: number | null;
  sortOrder: number;
  roles: string[];
  subItems?: NavItem[];
}

interface SidebarProps {
  user: {
    name: string;
    role: Role;
  };
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

// Icon mapping helper
const getIcon = (iconName: string | null) => {
  if (!iconName) return null;
  // @ts-ignore
  const Icon = LucideIcons[iconName];
  return Icon || null;
};

export default function Sidebar({ user, onLogout, isMobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<NavItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setIsLoading(true);
        // Normalize role to lowercase for consistency
        const currentRole = user.role.toLowerCase().replace(/\s+/g, "");
        
        // Pass user role to backend for efficient filtering
        const response = await apiService.getNavigations(currentRole);
        let rawData = response.data?.data || response.data || [];
        
        // Ensure rawData is an array
        if (!Array.isArray(rawData)) {
          console.warn("API did not return an array for navigation, using hardcoded fallback");
          rawData = [];
        }

        // Fallback to hardcoded defaults if API returns nothing
        if (rawData.length === 0) {
          console.warn("API returned empty navigation data, using hardcoded fallback");
          rawData = [
            { id: 1, title: "Dashboard", icon: "LayoutDashboard", path: "/", parentId: null, sortOrder: 1, roles: ["superadmin", "admin", "teacher", "parent"] },
            { id: 2, title: "Academic Operations", icon: "BookOpen", path: null, parentId: null, sortOrder: 2, roles: ["superadmin", "admin", "teacher"] },
            { id: 7, title: "Student Registry", icon: "GraduationCap", path: "/students", parentId: 2, sortOrder: 1, roles: ["superadmin", "admin", "teacher"] },
            { id: 8, title: "Attendance Tracking", icon: "CalendarCheck", path: "/attendance", parentId: 2, sortOrder: 2, roles: ["superadmin", "admin", "teacher"] },
            { id: 9, title: "Examination & Marks", icon: "BarChart3", path: "/marks", parentId: 2, sortOrder: 3, roles: ["superadmin", "admin", "teacher"] },
            { id: 3, title: "Staff & HR", icon: "Users", path: null, parentId: null, sortOrder: 3, roles: ["superadmin", "admin"] },
            { id: 10, title: "Teacher Catalog", icon: "UserCheck", path: "/teachers", parentId: 3, sortOrder: 1, roles: ["superadmin", "admin"] },
            { id: 4, title: "Administrative", icon: "ShieldCheck", path: null, parentId: null, sortOrder: 4, roles: ["superadmin", "admin", "teacher", "parent"] },
            { id: 11, title: "Fee Management", icon: "CreditCard", path: "/fees", parentId: 4, sortOrder: 1, roles: ["superadmin", "admin"] },
            { id: 12, title: "Communication Hub", icon: "MessageSquare", path: "/messages", parentId: 4, sortOrder: 2, roles: ["superadmin", "admin", "teacher", "parent"] },
            
            { id: 5, title: "Masters & Config", icon: "Database", path: "/configuration", parentId: null, sortOrder: 5, roles: ["superadmin", "admin"] },
            { id: 13, title: "Global Schools", icon: "School", path: "/configuration/schools", parentId: 5, sortOrder: 1, roles: ["superadmin", "admin"] },
            
            { id: 14, title: "Access Control (RBAC)", icon: "ShieldCheck", path: null, parentId: 5, sortOrder: 2, roles: ["superadmin", "admin"] },
            { id: 17, title: "Role Master", icon: "Shield", path: "/configuration/role-master", parentId: 14, sortOrder: 1, roles: ["superadmin", "admin"] },
            { id: 18, title: "Role Assignment", icon: "UserCheck", path: "/configuration/role-assignment", parentId: 14, sortOrder: 2, roles: ["superadmin", "admin"] },
            
            { id: 15, title: "Menu Designer", icon: "Layout", path: null, parentId: 5, sortOrder: 3, roles: ["superadmin", "admin"] },
            { id: 19, title: "Navigation Builder", icon: "LayoutGrid", path: "/configuration/navigation", parentId: 15, sortOrder: 1, roles: ["superadmin", "admin"] },
            
            { id: 16, title: "Academic Masters", icon: "BookOpen", path: null, parentId: 5, sortOrder: 4, roles: ["superadmin", "admin"] },
            { id: 20, title: "Standards & Grades", icon: "Layers", path: "/configuration/standards", parentId: 16, sortOrder: 1, roles: ["superadmin", "admin"] },
            { id: 21, title: "Divisions/Sections", icon: "Hash", path: "/configuration/sections", parentId: 16, sortOrder: 2, roles: ["superadmin", "admin"] },
            { id: 22, title: "Academic Years", icon: "Calendar", path: "/configuration/academic-years", parentId: 16, sortOrder: 3, roles: ["superadmin", "admin"] },
            { id: 23, title: "Subject Registry", icon: "BookOpen", path: "/configuration/subjects", parentId: 16, sortOrder: 4, roles: ["superadmin", "admin"] },
            
            { id: 6, title: "System Audit", icon: "Terminal", path: "/system-logs", parentId: null, sortOrder: 6, roles: ["superadmin", "admin"] }
          ];
        }

        // 1. Map to consistent NavItem format and normalize values
        const flatItems: NavItem[] = rawData.map((item: any) => {
          // Normalize roles: handle both 'roles' string array and 'navigationRoles' objects
          let roles: string[] = [];
          if (Array.isArray(item.roles)) {
            roles = item.roles.map((r: any) => String(r).toLowerCase().replace(/\s+/g, ""));
          } else if (item.navigationRoles && Array.isArray(item.navigationRoles)) {
            roles = item.navigationRoles
              .map((nr: any) => nr.role?.name?.toLowerCase()?.replace(/\s+/g, ""))
              .filter(Boolean);
          } else {
            // Default roles if none specified - ensuring all standard roles are included
            roles = ["superadmin", "admin", "teacher", "parent", "student"];
          }

          return {
            id: Number(item.id),
            title: item.title,
            icon: item.icon,
            path: item.path || "#",
            parentId: item.parentId ? Number(item.parentId) : null,
            sortOrder: Number(item.sortOrder || 0),
            roles
          };
        });

        // 2. Filter by role
        // Superadmin bypasses filtering to see everything
        const roleFiltered = currentRole === "superadmin" 
          ? flatItems 
          : flatItems.filter(item => 
              item.roles.includes(currentRole) || 
              item.roles.includes("all")
            );

        // 3. Recursive hierarchy builder with safety for circular refs or null parents
        const buildMenu = (pId: number | null): NavItem[] => {
          return roleFiltered
            .filter(item => item.parentId === pId)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(item => ({
              ...item,
              subItems: buildMenu(item.id)
            }));
        };

        const hierarchicalMenu = buildMenu(null);
        setMenuItems(hierarchicalMenu);

      } catch (error) {
        console.error("Failed to fetch navigation:", error);
        // On error, show at least the dashboard and configuration as safety fallback
        setMenuItems([
          { id: 1, title: "Dashboard", icon: "LayoutDashboard", path: "/", parentId: null, sortOrder: 1, roles: ["superadmin"] },
          { id: 4000, title: "Masters & Config", icon: "Database", path: "/configuration", parentId: null, sortOrder: 2, roles: ["superadmin"] }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavigation();
  }, [user.role]);

  // Sync expanded items when path changes - Accordion behavior for navigation
  useEffect(() => {
    if (menuItems.length > 0) {
      const getActiveParents = (items: NavItem[], path: string): number[] => {
        for (const item of items) {
          // Check if this item is a parent of the active path
          if (item.subItems && item.subItems.length > 0) {
            const hasChildMatch = (sub: NavItem): boolean => {
              if (sub.path !== "#" && sub.path !== "/" && path.startsWith(sub.path)) return true;
              if (sub.subItems) return sub.subItems.some(hasChildMatch);
              return false;
            };

            if (hasChildMatch(item)) {
              return [item.id, ...getActiveParents(item.subItems, path)];
            }
          }
        }
        return [];
      };

      const activeParents = getActiveParents(menuItems, location.pathname);
      
      // If we found active parents, we update the expanded state.
      // To enforce accordion, we can replace the expanded state with the active branch.
      // But we only want to do this if the path has actually changed to a new branch.
      if (activeParents.length > 0) {
        setExpandedItems(activeParents);
      }
    }
  }, [location.pathname, menuItems]);

  const toggleExpand = (id: number, pId: number | null) => {
    // If sidebar is collapsed, expand it first so the sub-items are visible
    if (isCollapsed) {
      setIsCollapsed(false);
    }

    setExpandedItems(prev => {
      // If already expanded, just collapse it
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }

      // Accordion logic: Find all items at the same level (sharing the same parent)
      // and remove them from the expanded state before adding the new ID.
      const findSiblings = (items: NavItem[]): number[] => {
        // Try to find if the pId parent exists in this list
        const itemsAtLevel = items.filter(item => item.parentId === pId);
        if (itemsAtLevel.length > 0) {
          return itemsAtLevel.map(i => i.id);
        }
        
        // If not found, search in subItems
        for (const item of items) {
          if (item.subItems && item.subItems.length > 0) {
            const result = findSiblings(item.subItems);
            if (result.length > 0) return result;
          }
        }
        return [];
      };

      const siblingIds = findSiblings(menuItems);
      const filtered = prev.filter(itemId => !siblingIds.includes(itemId));
      return [...filtered, id];
    });
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.path !== "#" && item.path !== "/" && location.pathname.startsWith(item.path)) return true;
    if (item.subItems) {
      return item.subItems.some(sub => isItemActive(sub));
    }
    return false;
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = location.pathname === item.path;
    const isParentActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.id);
    const Icon = getIcon(item.icon);

    return (
      <div key={item.id} className="space-y-1">
        <SimpleTooltip content={isCollapsed && level === 0 ? item.title : ""} side="right" nativeButton={false}>
          <div className="w-full">
            {hasSubItems ? (
              <button
                onClick={() => toggleExpand(item.id, item.parentId)}
                className={cn(
                  "w-full flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 relative group h-12 text-left",
                  isParentActive 
                    ? "bg-white/10 text-white shadow-sm shadow-black/20" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                  isCollapsed && level === 0 && "justify-center px-0",
                  level > 0 && "px-3 h-10"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center shrink-0 transition-all duration-300",
                  isParentActive ? "text-blue-400 scale-110" : "group-hover:scale-110",
                  isCollapsed && level === 0 && "w-full"
                )}>
                  {Icon ? (
                    <Icon size={level === 0 ? 22 : 18} strokeWidth={isParentActive ? 2.5 : 2} />
                  ) : (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      isParentActive ? "bg-blue-400 scale-125 shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "bg-slate-700"
                    )} />
                  )}
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className={cn(
                      "ml-4 font-bold whitespace-nowrap overflow-hidden tracking-tight flex-1 transition-colors duration-300",
                      level === 0 ? "text-sm" : "text-xs",
                      isParentActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    )}>
                      {item.title}
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
                onClick={() => {
                  if (isCollapsed) setIsCollapsed(false);
                }}
                className={cn(
                  "flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 relative group h-12",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                  isCollapsed && level === 0 && "justify-center px-0",
                  level > 0 && "px-3 h-10"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center shrink-0 transition-all duration-300",
                  isActive ? "text-white scale-110" : "group-hover:scale-110",
                  isCollapsed && level === 0 && "w-full"
                )}>
                  {Icon ? (
                    <Icon size={level === 0 ? 22 : 18} strokeWidth={isActive ? 2.5 : 2} />
                  ) : (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      isActive ? "bg-blue-400 scale-125 shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "bg-slate-700"
                    )} />
                  )}
                </div>
                
                {!isCollapsed && (
                  <span className={cn(
                    "ml-4 font-bold whitespace-nowrap overflow-hidden tracking-tight",
                    level === 0 ? "text-sm" : "text-xs",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}>
                    {item.title}
                  </span>
                )}
              </Link>
            )}
          </div>
        </SimpleTooltip>

        <AnimatePresence initial={false}>
          {hasSubItems && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "overflow-hidden space-y-1 relative",
                level === 0 ? "ml-9 pl-4 border-l border-white/5 mt-1" : "ml-4 pl-3 border-l border-white/5 mt-1"
              )}
            >
              {item.subItems?.map((subItem) => renderNavItem(subItem, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const sidebarVariants = {
    expanded: { width: 288 }, // Width increased to 72 (288px)
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

        <SimpleTooltip content={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} side="right" nativeButton={true}>
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-20 space-y-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          menuItems.map((item) => renderNavItem(item))
        )}
      </nav>

      <div className={cn(
        "p-3 border-t border-slate-800/50 space-y-1.5",
        isCollapsed && "px-3"
      )}>
        <SimpleTooltip content={isCollapsed ? "Settings" : ""} side="right" nativeButton={false}>
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
        
        <SimpleTooltip content={isCollapsed ? "Logout" : ""} side="right" nativeButton={true}>
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
