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
import { Role, User } from "@/types";
import { apiService } from "@/lib/api";
import { motion, AnimatePresence } from "motion/react";
import { SimpleTooltip } from "@/components/shared/SimpleTooltip";
import { Logo } from "@/components/shared/Logo";

interface NavItem {
  id: number;
  title: string;
  icon: string | null;
  path: string;
  parentId: number | null;
  sortOrder: number;
  roleIds: number[];
  subItems?: NavItem[];
}

interface SidebarProps {
  user: User;
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
        // Preference for numeric RoleId for more robust RBAC filtering
        const currentRoleId = user.roleId || 0;
        
        // Fetch navigation filtered by roleId from backend
        const response = await apiService.getNavigations(currentRoleId);
        let rawData = response.data?.data || response.data || [];
        
        // Ensure rawData is an array
        if (!rawData || !Array.isArray(rawData)) {
          console.warn("API did not return an array for navigation, using hardcoded fallback");
          rawData = [];
        }

        // Fallback to hardcoded defaults if API returns nothing
        if (rawData.length === 0) {
          console.warn("API returned empty navigation data, using hardcoded fallback");
          // IDs: SuperAdmin=1, Admin=2, Teacher=3, Student=4, Parent=5, All=0
          const allRoles = [1, 2, 3, 4, 5];
          const adminRoles = [1, 2];

          rawData = [
            { id: 1, title: "Dashboard", icon: "LayoutDashboard", path: "/", parentId: null, sortOrder: 1, roleIds: allRoles },
            
            // Academic Operations Group
            { id: 2, title: "Academic Operations", icon: "BookOpen", path: null, parentId: null, sortOrder: 2, roleIds: allRoles },
            { id: 3, title: "Student Registry", icon: "GraduationCap", path: "/students", parentId: 2, sortOrder: 1, roleIds: [1, 2, 3, 5] },
            { id: 4, title: "Attendance Tracking", icon: "CalendarCheck", path: "/attendance", parentId: 2, sortOrder: 2, roleIds: allRoles },
            { id: 5, title: "Examination & Marks", icon: "BarChart3", path: "/marks", parentId: 2, sortOrder: 3, roleIds: allRoles },
            
            // Staff & HR Group
            { id: 6, title: "Staff & HR", icon: "Users", path: null, parentId: null, sortOrder: 3, roleIds: adminRoles },
            { id: 7, title: "Teacher Catalog", icon: "UserCheck", path: "/teachers", parentId: 6, sortOrder: 1, roleIds: adminRoles },
            
            // Administrative Group
            { id: 8, title: "Administrative", icon: "ShieldCheck", path: null, parentId: null, sortOrder: 4, roleIds: allRoles },
            { id: 9, title: "Fee Management", icon: "CreditCard", path: "/fees", parentId: 8, sortOrder: 1, roleIds: [1, 2, 5] },
            { id: 10, title: "Communication Hub", icon: "MessageSquare", path: "/messages", parentId: 8, sortOrder: 2, roleIds: allRoles },
            
            // Masters & Config Group
            { id: 11, title: "Masters & Config", icon: "Database", path: "/configuration", parentId: null, sortOrder: 5, roleIds: adminRoles },
            { id: 12, title: "Global Schools", icon: "School", path: "/configuration/schools", parentId: 11, sortOrder: 1, roleIds: adminRoles },
            
            // RBAC Sub-group
            { id: 13, title: "Access Control (RBAC)", icon: "Key", path: null, parentId: 11, sortOrder: 2, roleIds: adminRoles },
            { id: 14, title: "Role Master", icon: "Shield", path: "/configuration/role-master", parentId: 13, sortOrder: 1, roleIds: adminRoles },
            { id: 15, title: "User Accounts", icon: "UserCheck", path: "/configuration/role-assignment", parentId: 13, sortOrder: 2, roleIds: adminRoles },
            
            // Menu Designer Sub-group
            { id: 16, title: "Menu Designer", icon: "Layout", path: null, parentId: 11, sortOrder: 3, roleIds: adminRoles },
            { id: 17, title: "Navigation Builder", icon: "LayoutGrid", path: "/configuration/navigation", parentId: 16, sortOrder: 1, roleIds: adminRoles },
            
            // Academic Masters Sub-group
            { id: 18, title: "Academic Masters", icon: "BookOpen", path: null, parentId: 11, sortOrder: 4, roleIds: adminRoles },
            { id: 19, title: "Standards & Grades", icon: "Layers", path: "/configuration/standards", parentId: 18, sortOrder: 1, roleIds: adminRoles },
            { id: 20, title: "Divisions/Sections", icon: "Hash", path: "/configuration/sections", parentId: 18, sortOrder: 2, roleIds: adminRoles },
            { id: 21, title: "Academic Years", icon: "Calendar", path: "/configuration/academic-years", parentId: 18, sortOrder: 3, roleIds: adminRoles },
            { id: 22, title: "Subject Registry", icon: "BookOpen", path: "/configuration/subjects", parentId: 18, sortOrder: 4, roleIds: adminRoles },
            
            // General Masters Sub-group
            { id: 45, title: "General Masters", icon: "Database", path: null, parentId: 11, sortOrder: 5, roleIds: adminRoles },
            { id: 451, title: "Religions", icon: "Heart", path: "/configuration/religions", parentId: 45, sortOrder: 1, roleIds: adminRoles },
            { id: 452, title: "Blood Group", icon: "Droplets", path: "/configuration/blood-groups", parentId: 45, sortOrder: 2, roleIds: adminRoles },
            { id: 453, title: "Caste Category", icon: "Users", path: "/configuration/castes", parentId: 45, sortOrder: 3, roleIds: adminRoles },
            { id: 454, title: "Sub-Caste", icon: "UserCircle", path: "/configuration/sub-castes", parentId: 45, sortOrder: 4, roleIds: adminRoles },
            { id: 455, title: "School House", icon: "Home", path: "/configuration/houses", parentId: 45, sortOrder: 5, roleIds: adminRoles },
            { id: 456, title: "Admission Types", icon: "UserCheck", path: "/configuration/admission-types", parentId: 45, sortOrder: 6, roleIds: adminRoles },
            { id: 457, title: "States Master", icon: "Map", path: "/configuration/states", parentId: 45, sortOrder: 7, roleIds: adminRoles },
            { id: 458, title: "Cities Master", icon: "MapPin", path: "/configuration/cities", parentId: 45, sortOrder: 8, roleIds: adminRoles },
            { id: 459, title: "School Sections", icon: "Layers", path: "/configuration/school-sections", parentId: 45, sortOrder: 9, roleIds: adminRoles },

            { id: 23, title: "System Audit", icon: "Terminal", path: "/system-logs", parentId: null, sortOrder: 6, roleIds: [1] }
          ];
        }

        // Dynamically ensure General Masters has States Master, Cities Master, and School Sections
        const generalMastersItem = rawData.find((item: any) => item.title === "General Masters");
        if (generalMastersItem) {
          const generalMastersId = Number(generalMastersItem.id);
          const adminRoles = [1, 2];

          // 1. Ensure States Master (ID 457) is present under General Masters
          const hasStates = rawData.some((item: any) => 
            item.title === "States Master" || 
            (item.path && item.path.includes("/states"))
          );
          if (!hasStates) {
            rawData.push({
              id: 457,
              title: "States Master",
              icon: "Map",
              path: "/configuration/states",
              parentId: generalMastersId,
              sortOrder: 7,
              roleIds: adminRoles
            });
          } else {
            // If States exists but has wrong parentId (e.g. from static fallback mismatches), correct it
            const statesItem = rawData.find((item: any) => 
              item.title === "States Master" || 
              (item.path && item.path.includes("/states"))
            );
            if (statesItem && Number(statesItem.parentId) !== generalMastersId) {
              statesItem.parentId = generalMastersId;
            }
          }

          // 2. Ensure Cities Master (ID 458) is present under General Masters
          const hasCities = rawData.some((item: any) => 
            item.title === "Cities Master" || 
            (item.path && item.path.includes("/cities"))
          );
          if (!hasCities) {
            rawData.push({
              id: 458,
              title: "Cities Master",
              icon: "MapPin",
              path: "/configuration/cities",
              parentId: generalMastersId,
              sortOrder: 8,
              roleIds: adminRoles
            });
          } else {
            // Correct parentId if mismatch
            const citiesItem = rawData.find((item: any) => 
              item.title === "Cities Master" || 
              (item.path && item.path.includes("/cities"))
            );
            if (citiesItem && Number(citiesItem.parentId) !== generalMastersId) {
              citiesItem.parentId = generalMastersId;
            }
          }

          // 3. Ensure School Sections (ID 459) is present under General Masters
          const hasSchoolSections = rawData.some((item: any) => 
            item.title === "School Sections" || 
            (item.path && item.path.includes("/school-sections"))
          );
          if (!hasSchoolSections) {
            rawData.push({
              id: 459,
              title: "School Sections",
              icon: "Layers",
              path: "/configuration/school-sections",
              parentId: generalMastersId,
              sortOrder: 9,
              roleIds: adminRoles
            });
          } else {
            // Correct parentId if mismatch (e.g. from table seeding with parentId 45 instead of 17)
            const schoolSecItem = rawData.find((item: any) => 
              item.title === "School Sections" || 
              (item.path && item.path.includes("/school-sections"))
            );
            if (schoolSecItem && Number(schoolSecItem.parentId) !== generalMastersId) {
              schoolSecItem.parentId = generalMastersId;
            }
          }
        }

        // 1. Map to consistent NavItem format and normalize values
        const flatItems: NavItem[] = rawData.map((item: any) => {
          let roleIds: number[] = [];
          if (Array.isArray(item.roleIds)) {
            roleIds = item.roleIds.map(Number);
          } else if (item.navigationRoles && Array.isArray(item.navigationRoles)) {
            roleIds = item.navigationRoles.map((nr: any) => Number(nr.roleId)).filter(Boolean);
          } else {
            // Default: All roles can see if no specific roles defined
            roleIds = [0];
          }

          return {
            id: Number(item.id),
            title: item.title,
            icon: item.icon,
            path: item.path || "#",
            parentId: item.parentId ? Number(item.parentId) : null,
            sortOrder: Number(item.sortOrder || 0),
            roleIds
          };
        });

        // 2. Filter by roleId
        // SuperAdmin (ID: 1) bypasses filtering to see everything
        const roleFiltered = currentRoleId === 1 
          ? flatItems 
          : flatItems.filter(item => 
              item.roleIds.includes(currentRoleId) || 
              item.roleIds.includes(0)
            );

        // 3. Recursive hierarchy builder
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
        // On error, show minimal safety fallback
        setMenuItems([
          { id: 1, title: "Dashboard", icon: "LayoutDashboard", path: "/", parentId: null, sortOrder: 1, roleIds: [1, 2, 3, 4, 5] },
          { id: 11, title: "Masters & Config", icon: "Database", path: "/configuration", parentId: null, sortOrder: 2, roleIds: [1, 2] }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavigation();
  }, [user.roleId]);

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
    if (item.path !== "#" && item.path !== "/" && location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(sub => isItemActive(sub));
    }
    return false;
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = location.pathname === item.path;
    const isParentExpanded = expandedItems.includes(item.id);
    const Icon = getIcon(item.icon);

    return (
      <div key={item.id} className="space-y-1.5">
        <SimpleTooltip content={isCollapsed && level === 0 ? item.title : ""} side="right" nativeButton={false}>
          <div className="w-full">
            {hasSubItems ? (
              <button
                onClick={() => toggleExpand(item.id, item.parentId)}
                className={cn(
                  "w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 relative group h-[52px] text-left",
                  isParentExpanded || isItemActive(item)
                    ? "bg-indigo-500/10 text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                  isCollapsed && level === 0 && "justify-center px-0",
                  level > 0 && "px-3 h-11"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center shrink-0 transition-all duration-300",
                  isItemActive(item) ? "text-indigo-400 scale-110" : "group-hover:scale-110",
                  isCollapsed && level === 0 && "w-full"
                )}>
                  {Icon ? (
                    <Icon size={level === 0 ? 22 : 18} strokeWidth={isItemActive(item) ? 2.5 : 2} />
                  ) : (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      isItemActive(item) ? "bg-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-slate-700"
                    )} />
                  )}
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className={cn(
                      "ml-4 font-bold whitespace-nowrap overflow-hidden tracking-tight flex-1 transition-colors duration-300",
                      level === 0 ? "text-[15px]" : "text-sm",
                      isItemActive(item) ? "text-white" : "text-slate-200 group-hover:text-white"
                    )}>
                      {item.title}
                    </span>
                    <motion.div
                      animate={{ rotate: isParentExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn("transition-colors", isItemActive(item) ? "text-indigo-400" : "text-slate-500")}
                    >
                      <LucideIcons.ChevronDown size={16} strokeWidth={3} />
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
                  "flex items-center px-4 py-3 rounded-2xl transition-all duration-300 relative group h-[52px]",
                  isActive 
                    ? "bg-indigo-600 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                  isCollapsed && level === 0 && "justify-center px-0",
                  level > 0 && "px-3 h-11"
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
                      isActive ? "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-slate-700"
                    )} />
                  )}
                </div>
                
                {!isCollapsed && (
                  <span className={cn(
                    "ml-4 font-bold whitespace-nowrap overflow-hidden tracking-tight",
                    level === 0 ? "text-[15px]" : "text-sm",
                    isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                  )}>
                    {item.title}
                  </span>
                )}
              </Link>
            )}
          </div>
        </SimpleTooltip>

        <AnimatePresence initial={false}>
          {hasSubItems && isParentExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "overflow-hidden space-y-1 relative ml-6",
                "pl-4 border-l-2 border-slate-800 mt-1"
              )}
            >
              {Array.isArray(item.subItems) && item.subItems.map((subItem) => renderNavItem(subItem, level + 1))}
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
        "bg-slate-950 text-white h-full flex flex-col relative z-50 border-r border-slate-900 shadow-2xl transition-all duration-300",
        // Mobile styles
        "fixed lg:relative inset-y-0 left-0 transform",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className={cn(
        "p-6 flex flex-col items-center relative transition-all duration-300 overflow-visible",
        isCollapsed ? "px-2" : "px-6 pt-10 pb-8"
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

        <SimpleTooltip content={isCollapsed ? "Expand Sidebar" : ""} side="right" nativeButton={true}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-5 top-14 bg-indigo-600 text-white rounded-full p-2.5 shadow-2xl hover:bg-indigo-500 transition-all z-[60] border-4 border-slate-950 scale-100 hover:scale-110 active:scale-95 hidden lg:flex items-center justify-center group"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform" />
            )}
          </button>
        </SimpleTooltip>

        <div className="flex flex-col items-center justify-center w-full">
          <Logo isCollapsed={isCollapsed} size="lg" />
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-3 overflow-y-auto overflow-x-visible custom-scrollbar scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-20 space-y-2">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          Array.isArray(menuItems) && menuItems.map((item) => renderNavItem(item))
        )}
      </nav>

      <div className={cn(
        "p-4 border-t border-slate-900/50 space-y-2",
        isCollapsed && "px-3"
      )}>
        <SimpleTooltip content={isCollapsed ? "Settings" : ""} side="right" nativeButton={false}>
          <Link 
            to="/settings"
            className={cn(
              "w-full flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group relative h-12",
              location.pathname === "/settings" && "bg-indigo-600/10 text-indigo-400",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
              <Settings size={22} strokeWidth={2} />
            </div>
            {!isCollapsed && (
              <span className={cn(
                "ml-4 font-bold text-[15px] tracking-tight",
                location.pathname === "/settings" ? "text-white" : "text-slate-300"
              )}>Settings</span>
            )}
            <ChevronRight size={14} className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
          </Link>
        </SimpleTooltip>
        
        <SimpleTooltip content={isCollapsed ? "Logout" : ""} side="right" nativeButton={true}>
          <button 
            onClick={onLogout}
            className={cn(
              "w-full flex items-center px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group relative h-12",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform duration-200">
              <LogOut size={22} strokeWidth={2} />
            </div>
            {!isCollapsed && (
              <span className="ml-4 font-bold text-[15px] tracking-tight">Logout</span>
            )}
          </button>
        </SimpleTooltip>
      </div>
    </motion.div>
  );
}
