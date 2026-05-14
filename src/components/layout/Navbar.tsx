import * as React from "react";
import { Bell, Search, User, Settings as SettingsIcon, LogOut, School, Calendar, Menu } from "lucide-react";
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

  const fetchLookups = useCallback(async () => {
    try {
      const [schoolsRes, yearsRes] = await Promise.all([
        apiService.getSchools(),
        apiService.getAcademicYears()
      ]);
      setSchools(schoolsRes.data || []);
      setAcademicYears(yearsRes.data || []);
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

  const showNotification = () => {
    toast.success("New Announcement", {
      description: "Teacher training scheduled for next Friday at 3:00 PM.",
      action: {
        label: "View",
        onClick: () => console.log("View announcement"),
      },
    });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20 shrink-0 shadow-sm">
      <div className="flex items-center flex-1 gap-2 sm:gap-4">
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
          {user.role === "superadmin" ? (
            <div className="hidden md:block">
      <Select value={user.schoolId?.toString() || ""} onValueChange={handleSchoolChange}>
        <SelectTrigger className="w-[180px] h-9 bg-slate-50 border-slate-200 text-xs font-bold rounded-lg focus:ring-2 focus:ring-blue-500/10">
          <div className="flex items-center gap-2 truncate">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></div>
            {/* Explicitly mapping school name to avoid ID display in trigger */}
            <SelectValue placeholder="Select School Branch">
              {user.schoolId ? (user.schoolId === "all" ? "Global Admin View" : schools.find(s => s.id.toString() === user.schoolId.toString())?.name) : undefined}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
          <SelectItem value="" className="text-xs italic text-slate-400">Select School Branch</SelectItem>
                  <SelectItem value="all" className="text-xs font-black text-blue-600">Global Admin View</SelectItem>
                  {schools.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()} className="text-xs font-medium">{s.name}</SelectItem>
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

          <div className="hidden lg:block">
      <Select value={user.academicYearId?.toString() || ""} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[140px] h-9 bg-blue-50 border-blue-100 text-xs font-black text-blue-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar size={13} strokeWidth={3} />
            {/* Explicitly mapping year name to ensure correct display */}
            <SelectValue placeholder="Select Academic Year">
              {user.academicYearId ? academicYears.find(y => y.id.toString() === user.academicYearId.toString())?.name : undefined}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
          <SelectItem value="" className="text-xs italic text-slate-400">Select Academic Year</SelectItem>
                {academicYears.map(y => (
                  <SelectItem key={y.id} value={y.id.toString()} className="text-xs font-bold">
                    {y.name} {y.isCurrent ? "★" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative flex-1 max-w-sm sm:max-w-md ml-auto" ref={searchRef}>
          <form onSubmit={handleSearch} className="flex items-center bg-slate-100/80 rounded-xl px-2 sm:px-4 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all duration-300 border border-transparent focus-within:border-blue-500/20 group">
          <Search size={16} className="text-slate-400 shrink-0 transition-colors group-focus-within:text-blue-500" />
          <Input 
            placeholder="Search students, classes..." 
            className="border-none bg-transparent focus-visible:ring-0 shadow-none text-xs sm:text-sm h-8 font-medium placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search.trim() && setShowResults(true)}
          />
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-400 shadow-sm">
              ⌘
            </kbd>
            <kbd className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-400 shadow-sm">
              K
            </kbd>
          </div>
          </form>

        {showResults && filteredResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-slate-50 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Matching Records</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors group cursor-pointer"
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                    item.type === "student" ? "bg-blue-100 text-blue-600" :
                    item.type === "teacher" ? "bg-emerald-100 text-emerald-600" :
                    "bg-slate-100 text-slate-600"
                  )}>
                    <Search size={14} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-500 truncate capitalize font-medium">{item.type} • {item.subtitle}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-slate-50 bg-slate-50/30 text-center">
              <p className="text-[10px] text-slate-400 font-medium">Press Enter to select first result</p>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="flex items-center gap-4">
        <SimpleTooltip content="Notifications" side="bottom">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-slate-600 hover:bg-slate-50"
            onClick={showNotification}
            aria-label="View notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
        </SimpleTooltip>

        <DropdownMenu>
          <SimpleTooltip content="User Menu" side="bottom">
            <DropdownMenuTrigger
              render={
                <div className={cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer border-none bg-transparent outline-none")}>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
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
