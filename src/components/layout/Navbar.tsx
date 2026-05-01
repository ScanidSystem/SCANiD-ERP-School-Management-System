import * as React from "react";
import { Bell, Search, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { useNavigate } from "react-router-dom";
import { searchItems, SearchItem } from "@/lib/search-data";
import { useRef, useEffect } from "react";

interface NavbarProps {
  user: {
    name: string;
    role: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
      <div className="relative flex-1 max-w-md ml-4" ref={searchRef}>
        <form onSubmit={handleSearch} className="flex items-center bg-slate-100 rounded-lg px-3 py-1 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <Input 
            placeholder="Search students, classes, reports..." 
            className="border-none bg-transparent focus-visible:ring-0 shadow-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search.trim() && setShowResults(true)}
          />
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

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-slate-600 hover:bg-slate-50"
          onClick={showNotification}
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className={cn("flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer border-none bg-transparent outline-none")}>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarFallback className="bg-slate-900 text-white text-xs">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
