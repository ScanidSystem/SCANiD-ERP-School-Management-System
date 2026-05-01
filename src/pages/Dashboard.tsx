import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  TrendingUp, 
  ArrowUpRight, 
  BookOpen,
  DollarSign
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
import { Role } from "@/App";
import { cn } from "@/lib/utils";

interface DashboardProps {
  user: {
    name: string;
    role: Role;
  };
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
  const isAdmin = user.role === "admin";
  const isTeacher = user.role === "teacher";
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {user.name}</h1>
        <p className="text-slate-500 mt-1">Here's what's happening at your school today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={isAdmin || isTeacher ? "Total Students" : "My Attendance"}
          value={isAdmin || isTeacher ? "1,248" : "94%"}
          trend="+2.5%"
          icon={GraduationCap}
          color="bg-blue-100 text-blue-600"
          onClick={() => navigate(isAdmin || isTeacher ? "/students" : "/attendance")}
        />
        <StatCard 
          title={isAdmin || isTeacher ? "Active Teachers" : "Class Rank"}
          value={isAdmin || isTeacher ? "84" : "#4 / 42"}
          trend="+4"
          icon={Users}
          color="bg-purple-100 text-purple-600"
          onClick={() => navigate(isAdmin ? "/teachers" : "/students")}
        />
        <StatCard 
          title={isAdmin ? "Fee Collection" : "Upcoming Exams"}
          value={isAdmin ? "$42.5k" : "3"}
          trend={isAdmin ? "85% Paid" : "Next: Math"}
          icon={isAdmin ? DollarSign : BookOpen}
          color="bg-emerald-100 text-emerald-600"
          onClick={() => navigate(isAdmin ? "/fees" : "/marks")}
        />
        <StatCard 
          title="Daily Attendance"
          value="92%"
          trend="-1%"
          icon={CalendarCheck}
          color="bg-amber-100 text-amber-600"
          onClick={() => navigate("/attendance")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm cursor-pointer hover:shadow-md transition-all hover:ring-2 hover:ring-blue-500/20" onClick={() => navigate("/marks")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Average vs Top scores across all standards</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div> Top
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div> Avg
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1e293b", 
                    border: "none", 
                    borderRadius: "8px",
                    color: "#fff"
                  }} 
                  itemStyle={{ color: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="top" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="#cbd5e1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#cbd5e1", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm cursor-pointer hover:shadow-md transition-all hover:ring-2 hover:ring-blue-500/20" onClick={() => navigate("/attendance")}>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>Daily student presence</CardDescription>
          </CardHeader>
          <CardContent className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar 
                  dataKey="attendance" 
                  fill="#1e293b" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnnouncementItem 
                title="Annual Sports Day 2024" 
                date="May 15, 2024" 
                desc="Registration open for all tracks and field events."
              />
              <AnnouncementItem 
                title="Parent-Teacher Meeting" 
                date="May 20, 2024" 
                desc="Final term progress discussion for Standard 5-10."
              />
              <AnnouncementItem 
                title="Summer Break Notice" 
                date="June 1, 2024" 
                desc="School will remain closed from June 1st to July 5th."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all hover:ring-2 hover:ring-blue-500/20" onClick={() => navigate("/marks")}>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <EventItem time="09:00 AM" label="Math Finals - Standard 8" type="Exam" />
              <EventItem time="11:30 AM" label="Choir Practice - Auditorium" type="Activity" />
              <EventItem time="02:00 PM" label="Staff Briefing - Room 402" type="Meeting" />
              <EventItem time="04:15 PM" label="Football Match - Away" type="Sports" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color, onClick }: any) {
  return (
    <Card className="shadow-sm cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 hover:ring-2 hover:ring-blue-500/20 overflow-hidden group" onClick={onClick}>
      <CardContent className="pt-6 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className={cn("p-2 rounded-lg", color)}>
            <Icon size={20} />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            trend.startsWith("+") ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
          )}>
            {trend}
            <ArrowUpRight size={12} />
          </div>
        </div>
        <div className="mt-4 relative z-10">
          <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AnnouncementItem({ title, date, desc }: any) {
  return (
    <div className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span className="text-xs text-slate-400 font-medium">{date}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{desc}</p>
      </div>
    </div>
  );
}

function EventItem({ time, label, type }: any) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="text-xs font-bold text-slate-400 w-16">{time}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{type}</p>
      </div>
    </div>
  );
}
