import * as React from "react";
import { Bell, Search, User, Settings as SettingsIcon, LogOut, School, Calendar, Menu, Info, AlertTriangle, CheckCircle, X, Building2, UserRound, GraduationCap, CornerDownLeft, Sparkles, ArrowRight, Command, BadgeCheck, ArrowUpRight, ArrowDown, ArrowUp, Globe2, School2, Star, CalendarDays } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

import { useNavigate } from "react-router-dom";
import { searchItems, SearchItem } from "@/lib/search-data";
import { useRef, useEffect } from "react";
import { apiService } from "@/lib/api";
import { SimpleTooltip } from "@/components/shared/SimpleTooltip";

import { Role, User as UserType } from "@/types";

interface NavbarProps {
  user: UserType;
  onLogout: () => void;
  onUserUpdate: (user: UserType) => void;
  toggleSidebar?: () => void;
}

export default function Navbar({ user, onLogout, onUserUpdate, toggleSidebar }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const [schools, setSchools] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchLookups = useCallback(async () => {
    try {
      const [schoolsRes, yearsRes, notifsRes] = await Promise.all([
        apiService.getSchools(),
        apiService.getAcademicYears(),
        apiService.getNotifications()
      ]);
      
      const schoolData = schoolsRes.data && Array.isArray(schoolsRes.data) ? schoolsRes.data : (schoolsRes.data && Array.isArray(schoolsRes.data.data) ? schoolsRes.data.data : []);
      const yearData = yearsRes.data && Array.isArray(yearsRes.data) ? yearsRes.data : (yearsRes.data && Array.isArray(yearsRes.data.data) ? yearsRes.data.data : []);
      const notifData = notifsRes.data && Array.isArray(notifsRes.data) ? notifsRes.data : (notifsRes.data && Array.isArray(notifsRes.data.data) ? notifsRes.data.data : []);
      
      setSchools(schoolData);
      setAcademicYears(yearData);
      setNotifications(notifData);
      setUnreadCount(Array.isArray(notifData) ? notifData.filter((n: any) => !n.isRead).length : 0);

      // Auto-initialize school if not set
      if (!user.schoolId && schoolData.length > 0) {
        onUserUpdate({
          ...user,
          schoolId: schoolData[0].id.toString(),
          schoolName: schoolData[0].name
        });
      }

      // Auto-initialize academic year if not set
      if (!user.academicYearId && yearData.length > 0) {
        const currentYear = yearData.find((y: any) => y.isCurrent) || yearData[0];
        onUserUpdate({
          ...user,
          academicYearId: currentYear.id.toString(),
          academicYearName: currentYear.name
        });
      }
    } catch (error) {
      console.error("Navbar lookups error:", error);
    }
  }, []);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  const handleSchoolChange = (schoolId: string) => {
    const school = schools.find(s => s.id.toString() === schoolId);
    if (schoolId === "all") {
      onUserUpdate({
        ...user,
        schoolId: "all",
        schoolName: "All Schools"
      });
    } else if (school) {
      onUserUpdate({
        ...user,
        schoolId: schoolId,
        schoolName: school.name
      });
    } else if (schoolId === "") {
      onUserUpdate({
        ...user,
        schoolId: undefined,
        schoolName: undefined
      });
    }
  };

  const handleYearChange = (yearId: string) => {
    const year = academicYears.find(y => y.id.toString() === yearId);
    if (year) {
      onUserUpdate({
        ...user,
        academicYearId: yearId,
        academicYearName: year.name
      });
    } else if (yearId === "") {
      onUserUpdate({
        ...user,
        academicYearId: undefined,
        academicYearName: undefined
      });
    }
  };

  useEffect(() => {
    if (search.trim()) {
      const results = searchItems.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5);
      setFilteredResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredResults.length > 0) {
      handleSelect(filteredResults[0]);
    }
  };

  const handleSelect = (item: SearchItem) => {
    navigate(item.link);
    setSearch("");
    setShowResults(false);
    toast.success(`Navigating to ${item.title}`, {
      description: `Viewing ${item.type}: ${item.subtitle}`,
    });
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await apiService.deleteNotification(id);
      const wasUnread = notifications.find(n => n.id === id)?.isRead === false;
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'success': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'error': return <X size={14} className="text-red-500" />;
      default: return <Info size={14} className="text-blue-500" />;
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 gap-3 z-20 shrink-0 sticky top-0 transition-all duration-300 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile Sidebar Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-slate-600"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {user.role === "superadmin" && (
            <div className="flex items-center gap-2 px-2.5 sm:px-3 h-9 sm:h-10 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200 transition-all border border-slate-800 shrink-0">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap hidden sm:inline-block">Super Admin</span>
            </div>
          )}
          
          {user.role === "superadmin" ? (
            <div className="hidden sm:block shrink-0">
   <Select 
  value={user.schoolId?.toString() || ""} 
  onValueChange={handleSchoolChange}
>
  <SelectTrigger
    className={cn(
      "relative w-[150px] md:w-[210px] h-10 min-h-[40px]",
      "rounded-xl border border-slate-200/80",
      "bg-white/50 backdrop-blur-sm",
      "pl-10 pr-3",
      "shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)]",
      "hover:shadow-[0_12px_30px_-6px_rgba(59,130,246,0.12)]",
      "hover:border-blue-300/50 hover:bg-white",
      "transition-all duration-500",
      "focus:ring-8 focus:ring-blue-500/5",
      "focus:border-blue-400",
      "data-[state=open]:border-blue-400",
      "data-[state=open]:shadow-[0_15px_40px_-5px_rgba(59,130,246,0.15)]",
      "group"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 border border-blue-100/50 shadow-sm text-blue-600">
      <Building2 className="w-3.5 h-3.5" />
    </div>

    {/* Content */}
    <div className="flex flex-col items-start justify-center leading-tight w-full truncate">

     

      <div className="truncate text-[13px] font-bold text-slate-800 w-full">
        <SelectValue placeholder="Select School Branch">
          {user.schoolId
            ? user.schoolId === "all"
              ? "System-Wide Master"
              : schools.find(
                  s => s.id.toString() === user.schoolId.toString()
                )?.name
            : "Select School Branch"}
        </SelectValue>
      </div>
    </div>



  </SelectTrigger>

  <SelectContent
    className={cn(
      "min-w-[320px]",
      "rounded-[1.8rem]",
      "border border-slate-200",
      "bg-white/95 backdrop-blur-xl",
      "p-2",
      "shadow-[0_25px_70px_rgba(15,23,42,0.18)]"
    )}
  >

    {/* Default */}
    <SelectItem
      value=""
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <School2 className="w-4 h-4 text-slate-500" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-slate-700">
            Select School Branch
          </span>

          <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black mt-1">
            Campus Selection
          </span>
        </div>

      </div>
    </SelectItem>

    {/* Global View */}
    <SelectItem
      value="all"
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-blue-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/50 flex items-center justify-center shadow-sm">
          <Globe2 className="w-4 h-4 text-blue-700" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-blue-700">
            Global Admin View
          </span>

          <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black mt-1">
            All Campuses Access
          </span>
        </div>

      </div>
    </SelectItem>

    {/* Schools */}
    {Array.isArray(schools) &&
      schools.map((s) => (
        <SelectItem
          key={s.id || Math.random()}
          value={s.id ? s.id.toString() : ""}
          className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-blue-50 transition-all duration-200"
        >
          <div className="flex items-center gap-3">

            {/* Icon */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/50 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
              <Building2 className="w-4 h-4 text-blue-700" />
            </div>

            {/* Text */}
            <div className="flex flex-col leading-tight min-w-0">

              <span className="text-sm font-extrabold text-slate-800 truncate">
                {s.name}
              </span>

              <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-black mt-1">
                School Campus
              </span>

            </div>

          </div>
        </SelectItem>
      ))}

  </SelectContent>
</Select>
            </div>
          ) : (
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg hidden sm:flex items-center gap-2 border border-slate-100">
              <School size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider truncate max-w-[140px]">
                {user.schoolName || "Institutional Access"}
              </span>
            </div>
          )}

          <div className="hidden xl:block shrink-0">
   <Select 
  value={user.academicYearId?.toString() || ""} 
  onValueChange={handleYearChange}
>
  <SelectTrigger
    className={cn(
      "relative w-[140px] xl:w-[160px] h-9 min-h-[36px]",
      "rounded-xl border border-blue-100",
      "bg-blue-50/20 backdrop-blur-sm",
      "pl-9 pr-3",
      "shadow-[0_4px_15px_-3px_rgba(59,130,246,0.1)]",
      "hover:shadow-[0_12px_30px_-6px_rgba(59,130,246,0.15)]",
      "hover:bg-blue-50 hover:border-blue-300",
      "transition-all duration-500",
      "focus:ring-8 focus:ring-blue-500/5",
      "focus:border-blue-400",
      "data-[state=open]:border-blue-400",
      "data-[state=open]:shadow-[0_15px_40px_-5px_rgba(59,130,246,0.18)]"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100/50 border border-blue-200/50 shadow-sm text-blue-700">
      <CalendarDays className="w-3 h-3" />
    </div>

    {/* Content */}
    <div className="flex flex-col items-start justify-center leading-tight w-full truncate">

    

      <div className="truncate text-[13px] font-bold text-blue-900 w-full">
        <SelectValue placeholder="Select Academic Year">
          {user.academicYearId
            ? academicYears.find(
                y =>
                  y.id.toString() ===
                  user.academicYearId.toString()
              )?.name
            : "Select Academic Year"}
        </SelectValue>
      </div>
    </div>

   

  </SelectTrigger>

  <SelectContent
    className={cn(
      "min-w-[320px]",
      "rounded-[1.8rem]",
      "border border-slate-200",
      "bg-white/95 backdrop-blur-xl",
      "p-2",
      "shadow-[0_25px_70px_rgba(15,23,42,0.18)]"
    )}
  >

    {/* Default */}
    <SelectItem
      value=""
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-slate-500" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-slate-700">
            Select Academic Year
          </span>

          <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black mt-1">
            Session Timeline
          </span>
        </div>

      </div>
    </SelectItem>

    {/* Years */}
    {Array.isArray(academicYears) &&
      academicYears.map((y) => (
        <SelectItem
          key={y.id || Math.random()}
          value={y.id ? y.id.toString() : ""}
          className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-blue-50 transition-all duration-200"
        >
          <div className="flex items-center gap-3 w-full">

            {/* Icon */}
            <div
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border transition-all duration-200",
                y.isCurrent
                  ? "bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200/60"
                  : "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200/60"
              )}
            >
              {y.isCurrent ? (
                <Star className="w-4 h-4 text-emerald-700" />
              ) : (
                <CalendarDays className="w-4 h-4 text-blue-700" />
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col leading-tight min-w-0 flex-1">

              <span className="text-sm font-extrabold text-slate-800 truncate">
                {y.name}
              </span>

              <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-black mt-1">
                {y.isCurrent ? "Current Active Session" : "Academic Session"}
              </span>

            </div>

            {/* Current Badge */}
            {y.isCurrent && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm shrink-0">
               
              </div>
            )}

          </div>
        </SelectItem>
      ))}

  </SelectContent>
</Select>
          </div>
        </div>
<div
  className="relative flex-1 max-w-[280px] lg:max-w-[400px] mx-1 sm:mx-2"
  ref={searchRef}
>
   <form
    onSubmit={handleSearch}
    className="group flex items-center gap-2 bg-slate-50/30 backdrop-blur-xl rounded-xl px-3 h-10 border border-slate-200/50 shadow-sm hover:shadow-md focus-within:shadow-lg transition-all duration-500 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/5"
  >
    {/* Search Icon */}
    <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-blue-600 text-white shadow-sm shrink-0">
      <Search
        size={12}
        className="transition-transform duration-300 group-focus-within:scale-110"
      />
    </div>

    {/* Input */}
    <Input
      placeholder="Search students, teachers, classes..."
      className="border-none bg-transparent focus-visible:ring-0 focus-visible:outline-none shadow-none text-sm sm:text-[15px] h-9 font-semibold placeholder:text-slate-400 px-0"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onFocus={() => search.trim() && setShowResults(true)}
    />

    {/* Right Actions */}
    <div className="hidden sm:flex items-center gap-2">
    

      <button
        type="submit"
        className="h-7 w-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm transition-all duration-200"
      >
        <ArrowRight size={13} />
      </button>
    </div>
  </form>

  {/* Results Dropdown */}
  {showResults && filteredResults.length > 0 && (
    <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <Sparkles size={14} className="text-blue-600" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-700 tracking-wide">
              Matching Results
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {filteredResults.length} records found
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
          <CornerDownLeft size={11} />
          Enter
        </div>
      </div>

      {/* Results */}
      <div className="max-h-[340px] overflow-y-auto p-2">
        {filteredResults.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            className="w-full text-left px-3 py-3 rounded-2xl hover:bg-slate-50 flex items-center gap-4 transition-all duration-200 group/item border border-transparent hover:border-slate-200 hover:shadow-sm cursor-pointer"
          >
            {/* Icon */}
            <div
              className={cn(
                "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover/item:scale-105",
                item.type === "student"
                  ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600"
                  : item.type === "teacher"
                  ? "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600"
                  : "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600"
              )}
            >
              {item.type === "student" ? (
                <GraduationCap size={18} />
              ) : item.type === "teacher" ? (
                <UserRound size={18} />
              ) : (
                <Building2
                 size={18} />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-slate-900 leading-none mb-1 group-hover/item:text-blue-600 transition-colors truncate">
                {item.title}
              </span>

              <span className="text-xs text-slate-500 truncate capitalize font-medium flex items-center gap-1">
                <BadgeCheck size={12} />
                {item.type} • {item.subtitle}
              </span>
            </div>

            {/* Arrow */}
            <div className="opacity-0 group-hover/item:opacity-100 transition-all duration-200 translate-x-2 group-hover/item:translate-x-0">
              <ArrowUpRight size={16} className="text-slate-400" />
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/70">
        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          <Search size={12} />
          Smart search enabled
        </p>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
          <ArrowUp size={11} />
          <ArrowDown size={11} />
          Navigate
        </div>
      </div>
    </div>
  )}
</div>
    </div>

    <div className="flex items-center gap-3 sm:gap-5 shrink-0 ml-auto">
        <DropdownMenu>
      <SimpleTooltip content="Notifications" side="bottom" nativeButton={true}>
  <DropdownMenuTrigger asChild nativeButton={true}>
    <Button
      variant="ghost"
      size="icon"
      className="
        relative 
        h-10 w-10 
        rounded-xl
        bg-white
        border border-slate-200
        shadow-sm
        hover:bg-slate-50
        transition-all duration-300
        group
        outline-none
      "
    >
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/10 transition-all duration-300" />

      {/* Bell Icon */}
      <div className="relative flex items-center justify-center">
        <Bell
          size={16}
          className="
            text-slate-500 
            group-hover:text-blue-600 
            transition-all duration-300
          "
        />

        {/* Notification Dot */}
        {unreadCount > 0 && (
          <>
            {/* Pulse Ring */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-red-500 to-rose-500 border-2 border-white shadow-sm"></span>
            </span>

            {/* Count Badge */}
            <div className="absolute -top-4 -right-5 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 border border-white shadow-md flex items-center justify-center">
              <span className="text-[10px] font-bold text-white leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Active Indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-5 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" />
    </Button>
  </DropdownMenuTrigger>
</SimpleTooltip>
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-slate-50/50 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                <p className="text-[10px] text-slate-500 font-medium">You have {unreadCount} unread alerts</p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={() => notifications.forEach(n => !n.isRead && handleMarkAsRead(n.id))}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {Array.isArray(notifications) && notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                    <Bell size={18} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">All caught up!</p>
                  <p className="text-[10px] text-slate-400 mt-1">No new notifications at the moment.</p>
                </div>
              ) : (
                Array.isArray(notifications) && notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={cn(
                      "p-4 border-b border-slate-50 transition-colors relative group hover:bg-slate-50/50",
                      !notif.isRead && "bg-blue-50/20"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
                        notif.type === 'warning' ? "bg-amber-100/50" :
                        notif.type === 'success' ? "bg-emerald-100/50" :
                        notif.type === 'error' ? "bg-red-100/50" : "bg-blue-100/50"
                      )}>
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-xs leading-none mb-1", notif.isRead ? "font-semibold text-slate-700" : "font-bold text-slate-900")}>
                            {notif.title}
                          </p>
                          <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                            1h ago
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          {!notif.isRead && (
                            <button 
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="text-[10px] font-bold text-blue-600 hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="text-[10px] font-bold text-slate-400 hover:text-red-500"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t border-slate-50 bg-slate-50/30 text-center">
              <button 
                onClick={() => navigate("/notifications")}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-700 uppercase"
              >
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <SimpleTooltip content="User Menu" side="bottom" nativeButton={false}>
            <DropdownMenuTrigger
              nativeButton={false}
              render={
                <div className={cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer border-none bg-transparent outline-none")}>
                  <div className="hidden md:flex flex-col items-start gap-0">
                    <div className="flex items-center gap-1 leading-none mb-0.5">
                      <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                      <p className="text-[7.5px] font-black text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded-sm uppercase tracking-tighter leading-none border border-indigo-100/30">
                        {user.role}
                      </p>
                    </div>
                    <p className="text-[12px] font-bold text-slate-800 leading-none whitespace-nowrap">{user.name}</p>
                  </div>
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarFallback className="bg-slate-900 text-white text-xs">
                      {user.name ? user.name.split(" ").map(n => n[0]).join("") : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              }
            />
          </SimpleTooltip>
          <DropdownMenuContent align="end" className="w-64 p-0 overflow-hidden">
            <div className="flex items-center gap-3 p-4 bg-slate-50/50 border-b border-slate-100">
              <Avatar className="h-10 w-10 border border-white shadow-sm shrink-0">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.name ? user.name.split(" ").map(n => n[0]).join("") : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate leading-none">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate leading-none">{user.email}</p>
              </div>
            </div>
            <div className="p-1.5">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer gap-3 py-2.5 rounded-md px-3 text-sm font-medium" onClick={() => navigate("/profile")}>
                  <User size={16} className="text-slate-400" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-3 py-2.5 rounded-md px-3 text-sm font-medium" onClick={() => navigate("/settings")}>
                  <SettingsIcon size={16} className="text-slate-400" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1.5 mx-1" />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer gap-3 py-2.5 rounded-md px-3 text-sm font-bold hover:bg-red-50 hover:text-red-700" 
                onClick={onLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
