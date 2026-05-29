import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  TrendingUp, 
  ArrowUpRight, 
  BookOpen,
  IndianRupee,
  Calendar,
  ChevronDown,
  ArrowUp,
  FileText,
  Bell
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from "recharts";
import { Role, User as UserType } from "@/types";
import { cn, parseSafeInt } from "@/lib/utils";
import { SimpleTooltip } from "@/components/shared/SimpleTooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";

interface DashboardProps {
  user: UserType;
}

const performanceData = [
  { name: "Term 1", avg: 72, top: 94 },
  { name: "Term 2", avg: 78, top: 96 },
  { name: "Term 3", avg: 75, top: 93 },
  { name: "Term 4", avg: 82, top: 98 },
];

const attendanceData = [
  { day: "Mon", attendance: 92 },
  { day: "Tue", attendance: 95 },
  { day: "Wed", attendance: 88 },
  { day: "Thu", attendance: 94 },
  { day: "Fri", attendance: 91 },
];

export default function Dashboard({ user }: DashboardProps) {
  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const isTeacher = user.role === "teacher";
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateOpen, setDateOpen] = useState(false);

  // Dynamic role label for greeting — always shows role label
  const getRoleLabel = () => {
    const role = user.role?.toLowerCase() || "";
    if (role === "superadmin" || role === "super_admin" || role === "super admin") return "Super Admin";
    if (role === "admin") return "Admin";
    if (role === "teacher") return "Teacher";
    if (role === "parent") return "Parent";
    if (role === "student") return "Student";
    
    // If not a standard role, try to use name or username
    return user.name || user.username || "User";
  };

  // Format selected date for display
  const getDateDisplay = () => {
    const d = selectedDate;
    const dayOfWeek = d.getDay();
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMon);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (dt: Date) => dt.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return `${fmt(monday)} \u2013 ${fmt(sunday)}, ${d.getFullYear()}`;
  };

  // Helper to safely display a number
  const displayNum = (val: any, fallback = "0") => {
    if (val === null || val === undefined || val === "") return fallback;
    if (typeof val === "number") return val.toLocaleString("en-IN");
    return String(val);
  };

  // Helper to safely display currency
  const displayCurrency = (val: any, fallback = "₹ 0") => {
    if (val === null || val === undefined || val === "") return fallback;
    if (typeof val === "number") return `₹ ${val.toLocaleString("en-IN")}`;
    const str = String(val);
    return str.startsWith("₹") ? str : `₹ ${str}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 500);
    const fetchStats = async () => {
      try {
        const parsedSchoolId = parseSafeInt(user.schoolId);
        const parsedYearId = parseSafeInt(user.academicYearId);

        // We pass the selected date to the API to make it truly dynamic
        const res = await apiService.getStats(parsedSchoolId, parsedYearId, { 
          date: format(selectedDate, "yyyy-MM-dd") 
        } as any);

        if (res && res.data) {
          const statsData = res.data.data || res.data;
          console.log("Dashboard stats loaded for", format(selectedDate, "yyyy-MM-dd"), statsData);
          setStats(statsData);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };
    fetchStats();
    return () => clearTimeout(timer);
  }, [user.schoolId, user.academicYearId, selectedDate]);

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">Welcome back, {getRoleLabel()}! <span className="inline-block hover:animate-wave">👋</span></h1>
            <p className="text-slate-500 font-medium mt-1 text-sm">Here's what's happening in your institution today.</p>
          </div>
        </div>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:bg-slate-50 transition-colors">
              <Calendar size={16} className="text-slate-700" />
              <span className="text-sm font-semibold text-slate-700">{getDateDisplay()}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 shadow-2xl" align="end">
            <CalendarPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setDateOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={isAdmin || isTeacher ? "Total Students" : "My Attendance"}
          value={displayNum(stats?.totalStudents)}
          trend={stats?.performanceTrend || "+0%"}
          icon={GraduationCap}
          color="bg-blue-50 text-[#3b82f6]"
          svgBg="#eff6ff"
          svgStroke="#3b82f6"
          onClick={() => navigate(isAdmin || isTeacher ? "/students" : "/attendance")}
        />
        <StatCard 
          title={isAdmin || isTeacher ? "Active Teachers" : "Class Rank"}
          value={displayNum(stats?.totalTeachers)}
          trend={stats?.performanceTrend || "+0%"}
          icon={Users}
          color="bg-purple-50 text-[#a855f7]"
          svgBg="#faf5ff"
          svgStroke="#a855f7"
          pathStr="M0,25 C30,30 60,10 100,20 L100,35 L0,35 Z"
          pathLine="M0,25 C30,30 60,10 100,20"
          onClick={() => navigate(isAdmin ? "/teachers" : "/students")}
        />
        <StatCard 
          title={isAdmin ? "Fee Collection" : "Upcoming Exams"}
          value={isAdmin ? displayCurrency(stats?.feeCollection) : displayNum(stats?.feeCollection)}
          trend={stats?.performanceTrend || "+0%"}
          icon={isAdmin ? IndianRupee : BookOpen}
          color="bg-green-50 text-[#22c55e]"
          svgBg="#f0fdf4"
          svgStroke="#22c55e"
          pathStr="M0,15 C20,25 50,20 70,10 C90,0 100,10 100,10 L100,35 L0,35 Z"
          pathLine="M0,15 C20,25 50,20 70,10 C90,0 100,10 100,10"
          onClick={() => navigate(isAdmin ? "/fees" : "/marks")}
        />
        <StatCard 
          title="Daily Attendance"
          value={displayNum(stats?.attendanceRate)}
          trend={stats?.performanceTrend || "+0%"}
          icon={CalendarCheck}
          color="bg-sky-50 text-[#0ea5e9]"
          svgBg="#f0f9ff"
          svgStroke="#0ea5e9"
          pathStr="M0,20 C40,5 60,30 100,15 L100,35 L0,35 Z"
          pathLine="M0,20 C40,5 60,30 100,15"
          onClick={() => navigate("/attendance")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 dashboard-card border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl" onClick={() => navigate("/marks")}>
          <CardHeader className="pb-2 pt-6 px-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 leading-tight">Academic Performance</CardTitle>
                <CardDescription className="font-medium text-slate-500 mt-1">Average vs Top scores across all standards</CardDescription>
                <div className="flex items-center gap-6 mt-4 opacity-90">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 rounded-full bg-[#10b981] hidden"></div> 
                    <div className="w-[18px] h-[3px] rounded-full bg-[#3b82f6]"></div>
                    <span className="text-xs font-semibold text-slate-700">Top Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[3px] rounded-full bg-[#93c5fd] border-t border-dashed border-[#93c5fd]"></div>
                    <span className="text-xs font-semibold text-slate-700">Average Score</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                This Month <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] w-full pt-6 pr-6 pb-6">
            {isMounted ? (
              <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <LineChart data={stats?.performanceData || performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#0f172a", 
                        border: "none", 
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        padding: "12px"
                      }} 
                      itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: "600" }}
                      labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="top" 
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      dot={{ r: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avg" 
                      stroke="#93c5fd" 
                      strokeWidth={2.5} 
                      strokeDasharray="6 6"
                      dot={{ r: 4, fill: "#93c5fd", strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#93c5fd" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
                <div className="h-full w-full bg-slate-50 animate-pulse rounded-2xl" />
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl" onClick={() => navigate("/attendance")}>
          <CardHeader className="pb-2 pt-6 px-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 leading-tight">Weekly Attendance</CardTitle>
                <CardDescription className="font-medium text-slate-500 mt-1">Daily student presence status</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                This Week <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] w-full pt-6 px-4 pb-6">
            {isMounted ? (
              <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <BarChart data={stats?.attendanceTrend || attendanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9', radius: 8 }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar 
                      dataKey="attendance" 
                      fill="#0f172a" 
                      radius={[4, 4, 0, 0]} 
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
                <div className="h-full w-full bg-slate-50 animate-pulse rounded-2xl" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
          <BottomCard 
            icon={FileText} 
            iconBg="bg-purple-50" 
            iconColor="text-[#a855f7]" 
            title="Exams Scheduled" 
            value={displayNum(stats?.examsScheduled)} 
            sub="Upcoming this week" 
          />
          <BottomCard 
            icon={IndianRupee} 
            iconBg="bg-emerald-50" 
            iconColor="text-[#22c55e]" 
            title="Pending Fees" 
            value={displayCurrency(stats?.pendingFees || stats?.feeCollection)} 
            sub={`From ${stats?.totalStudents ?? 0} students`} 
          />
          <BottomCard 
            icon={Bell} 
            iconBg="bg-amber-50" 
            iconColor="text-[#f59e0b]" 
            title="Notice Board" 
            value={displayNum(stats?.unreadNotices)} 
            sub="Unread notices" 
          />
          <BottomCard 
            icon={FileText} 
            iconBg="bg-sky-50" 
            iconColor="text-[#0ea5e9]" 
            title="New Admissions" 
            value={displayNum(stats?.newAdmissions)} 
            sub="This month" 
          />
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color, svgBg, svgStroke, onClick, pathStr, pathLine }: any) {
  const defaultPathStr = "M0,20 C30,10 70,30 100,15 L100,35 L0,35 Z";
  const defaultPathLine = "M0,20 C30,10 70,30 100,15";
  return (
    <Card 
        className="border-none cursor-pointer overflow-hidden group rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 relative h-full flex flex-col justify-between" 
        onClick={onClick}
    >
        <CardContent className="p-6 relative z-10 flex-1">
             <div className="flex justify-between items-start mb-6">
                 <div className={cn("p-[14px] rounded-2xl", color)}>
                     <Icon size={22} className="stroke-[2.5]" />
                 </div>
             </div>
             
             <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h2>
                   <p className="text-[13px] font-semibold text-slate-500 mt-1">{title}</p>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                     <ArrowUp size={12} strokeWidth={3} className="pt-[1px]" /> {trend}
                   </div>
                   <p className="text-[10px] text-slate-400 font-semibold mt-1.5 whitespace-nowrap">vs last month</p>
                </div>
             </div>
        </CardContent>
        {/* Subtle Chart */}
        <div className="h-10 w-full mt-auto relative overflow-hidden opacity-90 transition-opacity group-hover:opacity-100">
            <svg viewBox="0 0 100 35" preserveAspectRatio="none" className="w-full h-full absolute bottom-0">
               <path d={pathStr || defaultPathStr} fill={svgBg || "#fdf4ff"} />
               <path d={pathLine || defaultPathLine} fill="none" stroke={svgStroke || "#d8b4fe"} strokeWidth="1.5" />
            </svg>
        </div>
    </Card>
  );
}

function BottomCard({ icon: Icon, iconBg, iconColor, title, value, sub }: any) {
  return (
    <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 rounded-2xl cursor-pointer group">
      <CardContent className="p-5 flex flex-row items-center gap-4">
         <div className={cn("p-3.5 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-105", iconBg, iconColor)}>
            <Icon size={22} className="stroke-[2.5]" />
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-slate-500 mb-0.5 truncate">{title}</p>
            <h3 className="text-xl font-extrabold text-slate-900 leading-none mb-1 truncate">{value}</h3>
            <p className="text-[11px] font-semibold text-slate-400 truncate">{sub}</p>
         </div>
      </CardContent>
    </Card>
  );
}
