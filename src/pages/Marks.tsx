import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Printer, Download, Eye, FileText, ChevronRight, BarChart3,
  Settings2, Edit3, Loader2, Search, Filter, MoreVertical,
  CalendarDays, CloudDownload, X,
  Building2,
  Globe2,
  ChevronDown,
  Users,
  ChartColumn
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn, parseSafeInt } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ReportBuilder from "@/components/reports/ReportBuilder";
import MarksEntry from "@/components/reports/MarksEntry";
import { User as UserType } from "@/types";

export default function Marks({ user }: { user: UserType }) {
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(user.schoolId?.toString() || "");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Today's date display
  const today = new Date();
  const dateDisplay = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  useEffect(() => {
    const fetchSchools = async () => {
      if (user.role === "superadmin") {
        try {
          const res = await apiService.getSchools();
          const schoolData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          setSchools(schoolData);
        } catch (error) {
          console.error("Failed to fetch schools", error);
        }
      }
    };
    fetchSchools();
  }, [user.role]);

  useEffect(() => {
    const fetchMarks = async () => {
      setLoading(true);
      try {
        const schoolIdToUse = user.role === "superadmin" ? parseSafeInt(selectedSchoolId) : parseSafeInt(user.schoolId);
        const academicYearIdToUse = parseSafeInt(user.academicYearId);
        const res = await apiService.getMarks(schoolIdToUse, academicYearIdToUse);
        const marksData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setMarks(marksData);
      } catch (error) {
        console.error("Marks error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [user.schoolId, user.academicYearId, user.role, selectedSchoolId]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredMarks = marks.filter(m => {
    const s = m.student || {};
    const studentName = s.name || s.fullName || s.FullName ||
      (s.firstName ? `${s.firstName || ''} ${s.lastName || ''}`.trim() : "") ||
      `${s.FNAME || ''} ${s.LNAME || ''}`.trim() || "";
    const regNo = s.registrationNumber || s.RegistrationNumber || s.GRNO || "";
    const rollNo = s.rollNumber?.toString() || s.RollNumber?.toString() || s.ROLLNO?.toString() || "";

    return studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rollNo.includes(searchQuery) ||
      m.examName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedMarks = [...filteredMarks].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue, bValue;

    if (key === 'studentName') {
      aValue = a.student?.name || `${a.student?.FNAME || ''} ${a.student?.LNAME || ''}`.trim() || "";
      bValue = b.student?.name || `${b.student?.FNAME || ''} ${b.student?.LNAME || ''}`.trim() || "";
    } else if (key === 'performance') {
      aValue = a.obtMarks / a.totalMarks;
      bValue = b.obtMarks / b.totalMarks;
    } else {
      aValue = a[key] || "";
      bValue = b[key] || "";
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedMarks.length / pageSize));
  const pagedMarks = sortedMarks.slice((page - 1) * pageSize, page * pageSize);

  // Helper: student display name
  const getStudentName = (result: any) => {
    const s = result.student || {};
    return s.name || s.fullName || s.FullName ||
      (s.firstName ? `${s.firstName} ${s.lastName || ''}`.trim() : "") ||
      (s.FNAME ? `${s.FNAME} ${s.LNAME || ''}`.trim() : "Student");
  };

  // Helper: student initials
  const getInitials = (name: string) =>
    name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();

  // Helper: avatar color
  const avatarColors = [
    "from-indigo-500 to-violet-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-500",
    "from-purple-500 to-fuchsia-600",
  ];
  const getAvatarColor = (idx: number) => avatarColors[idx % avatarColors.length];

  // Helper: pass/fail badge
  const getPerfBadge = (obtMarks: number, totalMarks: number) => {
    const pct = totalMarks > 0 ? obtMarks / totalMarks : 0;
    if (pct >= 0.4) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-black uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Passed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[11px] font-black uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
        Failed
      </span>
    );
  };

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500 space-y-0 min-w-0">
      <Tabs defaultValue="recent" className="w-full flex flex-col">

         <div className="flex items-center gap-5">
           <div className="bg-[#5a67f2] p-4 rounded-[1.25rem] text-white shadow-2xl shadow-[#5a67f2]/20 transition-transform hover:-rotate-3">
            <ChartColumn size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight truncate">Academic Analytics</h1>
            <p className="text-slate-600 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">Global performance indexing & examination registry
</p>
          </div>
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="shrink-0 overflow-x-auto scrollbar-hide border-b border-slate-100 px-1 mb-0">
          <TabsList className="bg-transparent w-full justify-start rounded-none h-14 p-0 gap-8 sm:gap-10 min-w-max" variant="line">
            <TabsTrigger
              value="recent"
              className="px-0text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide h-14 rounded-none border-b-[3px] border-transparent data-[active]:border-indigo-600 data-[active]:bg-transparent data-[active]:text-indigo-600 gap-2.5 font-black text-[11px] uppercase hover:text-slate-600 transition-all flex-none shadow-none border-t-0 border-x-0 outline-none focus:outline-none"
            >
              <BarChart3 size={15} className="stroke-[3]" /> Recent Results
            </TabsTrigger>
            <TabsTrigger
              value="entry"
              className="px-0 h-14text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide rounded-none border-b-[3px] border-transparent data-[active]:border-indigo-600 data-[active]:bg-transparent data-[active]:text-indigo-600 gap-2.5 font-black text-[11px] uppercase  text-slate-600 hover:text-slate-600 transition-all flex-none shadow-none border-t-0 border-x-0 outline-none focus:outline-none"
            >
              <Edit3 size={15} className="stroke-[3]" /> Mark Entry
            </TabsTrigger>
            {(user.role === "superadmin" || user.role === "admin") && (
              <TabsTrigger
                value="builder"
                className="px-0 h-14 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide rounded-none border-b-[3px] border-transparent data-[active]:border-indigo-600 data-[active]:bg-transparent data-[active]:text-indigo-600 gap-2.5 font-black text-[11px] uppercase text-slate-600 hover:text-slate-600 transition-all flex-none shadow-none border-t-0 border-x-0 outline-none focus:outline-none"
              >
                <Settings2 size={15} className="stroke-[3]" /> Report Builder
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* ─── Recent Results Tab ─── */}
        <TabsContent value="recent" className="focus-visible:outline-none mt-0">
          <div className="flex flex-col xl:flex-row gap-0 min-h-0">

            {/* ════════════════ LEFT MAIN PANEL ════════════════ */}
            <div className="flex-1 min-w-0 flex flex-col">

              {/* Page Header */}
              <div className="px-6 sm:px-8 pt-8 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight truncate">Recent Results</h1>
                  <p className="text-slate-600 text-[13px] font-medium mt-1 leading-none">View and manage the latest examination results and registry data.</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[13px] font-semibold shrink-0 mt-1">
                  <CalendarDays size={15} className="shrink-0" />
                  <span>{dateDisplay}</span>
                </div>
              </div>

              {/* Campus Branch Intelligence Card (superadmin only) */}
              {user.role === "superadmin" && (
                <div className="px-6 sm:px-8 py-5 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                        <Settings2 size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 text-slate-900  font-bold pl-0.5 uppercase tracking-wide uppercase leading-none mb-1">Global Session Control</p>
                        <h3 className="text-[15px] font-black text-slate-900 leading-tight tracking-tight">Campus Branch Intelligence</h3>
                        <p className="text-[12px] text-slate-400 font-medium mt-0.5">Monitor and analyze campus performance in real-time</p>
                      </div>
                    </div>
                    <div className="sm:min-w-[220px]">
                    <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
  
  <SelectTrigger
    className={cn(
      "relative h-[62px] min-h-[62px]",
      "border-2 border-slate-200",
      "bg-gradient-to-b from-white to-slate-50/90",
      "rounded-2xl pl-14 pr-4",
      "text-sm font-bold text-slate-800",
      "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30px_rgba(99,102,241,0.10)]",
      "transition-all duration-300",
      "focus:ring-4 focus:ring-indigo-500/10",
      "focus:border-indigo-400",
      "data-[state=open]:border-indigo-400",
      "data-[state=open]:shadow-[0_18px_45px_rgba(99,102,241,0.14)]",
      "min-w-[240px]"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200/50 shadow-sm">
      <Building2 className="w-4 h-4 text-indigo-600" />
    </div>

    {/* Content */}
    <div className="flex items-center justify-between w-full gap-3">

      <div className="flex flex-col items-start text-left leading-tight truncate flex-1">

      

        <div className="truncate text-[14px] font-extrabold text-slate-800">
          <SelectValue placeholder="All Campuses">
            {selectedSchoolId
              ? schools.find(
                  s => s.id.toString() === selectedSchoolId
                )?.name
              : "All Campuses"}
          </SelectValue>
        </div>
      </div>

    
    </div>

  </SelectTrigger>

  <SelectContent
    className="min-w-[320px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl max-h-72"
  >

    {/* All Campuses */}
    <SelectItem
      value="All Campuses"
      className="group rounded-2xl py-3 px-3 cursor-pointer transition-all duration-200 focus:bg-slate-50"
    >
      <div className="flex items-center gap-3 w-full">

        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
          <Globe2 className="w-4 h-4 text-slate-500" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold text-slate-700">
            All Campuses
          </span>

          <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
            Entire Organization
          </span>
        </div>
      </div>
    </SelectItem>

    {/* Schools */}
    {Array.isArray(schools) && schools.map(s => (
      <SelectItem
        key={s.id}
        value={s.id.toString()}
        className="group rounded-2xl py-3 px-3 cursor-pointer transition-all duration-200 focus:bg-indigo-50 focus:text-indigo-700"
      >
        <div className="flex items-center gap-3 w-full">

          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200/40 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-slate-800">
              {s.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Campus Branch
            </span>
          </div>
        </div>
      </SelectItem>
    ))}

  </SelectContent>
</Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Ledger Card */}
              <div className="px-6 sm:px-8 py-6 flex-1 flex flex-col">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">

                  {/* Card Top: Title + Search + Filter */}
                  <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-[18px] font-black text-slate-900 tracking-tight leading-tight">Academic Ledger</h2>
                      <p className="text-[12px] text-slate-400 font-medium mt-0.5">Registry for current examination terms</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={15} />
                        <Input
                          placeholder="Search by index or name..."
                          value={searchQuery}
                          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                          className="pl-9 h-9 w-full sm:w-[220px] border-slate-200 bg-slate-50 rounded-xl text-[13px] font-medium focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                        <Filter size={15} />
                      </Button>
                    </div>
                  </div>

                  {/* Table */}
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Loader2 className="animate-spin text-indigo-500" size={28} />
                      </div>
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Compiling analytics...</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table className="min-w-[750px]">
                          <TableHeader>
                            <TableRow className="bg-slate-50/60 border-slate-100 hover:bg-slate-50/60 h-12">
                              <TableHead className="pl-6 pr-4 py-3 text-[12px] font-black text-slate-600  font-bold uppercase whitespace-nowrap">
                                Entity / Student
                              </TableHead>
                              <TableHead className="pl-6 pr-4 py-3 text-[12px] font-black text-slate-600  font-bold uppercase whitespace-nowrap">
                                Vector / Program
                              </TableHead>
                              <TableHead className="pl-6 pr-4 py-3 text-[12px] font-black text-slate-600  font-bold uppercase whitespace-nowrap">
                                Session / Year
                              </TableHead>
                              <TableHead className="pl-6 pr-4 py-3 text-[12px] font-black text-slate-600  font-bold uppercase whitespace-nowrap">
                                Module / Subject
                              </TableHead>
                              <TableHead className="pl-6 pr-4 py-3 text-[12px] font-black text-slate-600  font-bold uppercase whitespace-nowrap">
                                Data / Status
                              </TableHead>
                              <TableHead className="pl-6 pr-4 py-3 text-[12px] font-black text-slate-600  font-bold uppercase whitespace-nowrap">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pagedMarks.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="py-20 text-center">
                                  <div className="flex flex-col items-center gap-3">
                                    <div className="p-4 bg-slate-50 rounded-full">
                                      <Search className="text-slate-300" size={28} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400">No results found</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              pagedMarks.map((result, idx) => {
                                const name = getStudentName(result);
                                const initials = getInitials(name);
                                const regNo = result.student?.registrationNumber || result.student?.RegistrationNumber ||
                                  result.student?.GRNO || `IDX-${new Date().getFullYear()}-${String(result.student?.rollNumber || result.id || idx).padStart(5, "0")}`;
                                const pct = result.totalMarks > 0 ? Math.round((result.obtMarks / result.totalMarks) * 100) : 0;

                                return (
                                  <TableRow key={result.id || idx} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                    {/* ENTITY / STUDENT */}
                                    <TableCell className="pl-6 pr-4 py-5">
                                      <div className="flex items-center gap-3">
                                        <div className={cn(
                                          "w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0 bg-gradient-to-br",
                                          getAvatarColor(idx)
                                        )}>
                                          {initials}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-[13px] font-black text-slate-900 leading-tight tracking-tight truncate">{name}</div>
                                          <div className="text-[11px] text-slate-400 font-semibold mt-0.5 truncate">{regNo}</div>
                                        </div>
                                      </div>
                                    </TableCell>

                                    {/* VECTOR / PROGRAM */}
                                    <TableCell className="px-4 py-5">
                                      <div className="text-[13px] font-bold text-slate-800 leading-tight truncate max-w-[160px]">
                                        {result.student?.program || result.student?.standard
                                          ? `Class ${result.student?.standard || ""}`
                                          : (result.examName || "General")}
                                      </div>
                                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                        {result.student?.section ? `Section ${result.student.section}` : "Full Time"}
                                      </div>
                                    </TableCell>

                                    {/* SESSION / YEAR */}
                                    <TableCell className="px-4 py-5">
                                      <div className="text-[13px] font-bold text-slate-800 leading-tight">
                                        {result.academicYear || user.academicYearId || "2024-2025"}
                                      </div>
                                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                        {result.term || "Spring"}
                                      </div>
                                    </TableCell>

                                    {/* MODULE / SUBJECT */}
                                    <TableCell className="px-4 py-5">
                                      <div className="text-[13px] font-bold text-slate-800 leading-tight truncate max-w-[140px]">
                                        {result.examName || result.subjectName || "General Exam"}
                                      </div>
                                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                        {result.subjectCode || result.examCode || `EX-${String(result.id || idx).padStart(3, "0")}`}
                                      </div>
                                    </TableCell>

                                    {/* DATA / STATUS */}
                                    <TableCell className="px-4 py-5">
                                      <div className="space-y-1.5">
                                        {getPerfBadge(result.obtMarks, result.totalMarks)}
                                        <div className="text-[12px] font-black text-slate-600 leading-none">{pct}%</div>
                                      </div>
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell className="pr-6 pl-4 py-5 text-right">
                                      <Dialog>
                                        <DialogTrigger
                                          render={
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                                              onClick={() => setSelectedStudent(result)}
                                            >
                                              <MoreVertical size={16} />
                                            </Button>
                                          }
                                        />
                                        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
                                          <div className="max-h-[90vh] overflow-y-auto">
                                            <MarksheetView student={selectedStudent} />
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination Footer */}
                      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-[12px] font-semibold text-slate-400">
                          Showing <span className="text-slate-700 font-black">{sortedMarks.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{" "}
                          <span className="text-slate-700 font-black">{Math.min(page * pageSize, sortedMarks.length)}</span> of{" "}
                          <span className="text-slate-700 font-black">{sortedMarks.length}</span> results
                        </p>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                          >
                            <ChevronRight size={14} className="rotate-180" />
                          </Button>
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                            <Button
                              key={p}
                              variant={page === p ? "default" : "ghost"}
                              size="icon"
                              className={cn(
                                "h-8 w-8 rounded-lg text-[13px] font-black transition-all",
                                page === p ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 border-0" : "border border-slate-200 text-slate-500 hover:bg-slate-100"
                              )}
                              onClick={() => setPage(p)}
                            >
                              {p}
                            </Button>
                          ))}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                          >
                            <ChevronRight size={14} />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ════════════════ RIGHT SIDEBAR ════════════════ */}
            <div className="xl:w-[300px] shrink-0 border-l border-slate-100 flex flex-col">
              <div className="px-6 pt-8 pb-5 border-b border-slate-100">
                <h2 className="text-[18px] font-black text-indigo-600 tracking-tight">Export Interface</h2>
                <p className="text-[12px] text-slate-400 font-medium mt-1">Choose an export format to download registry data.</p>
              </div>

              <div className="px-5 py-5 space-y-3 flex-1">
                {/* Standard Ledger */}
                <button className="group w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all shrink-0">
                      <FileText size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div>
                      <div className="text-[13px] font-black text-slate-900 leading-tight">Standard Ledger</div>
                      <div className="text-[11px] text-slate-400 font-semibold mt-0.5">PDF • Print Ready Format</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* Data Analytics */}
                <button className="group w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all shrink-0">
                      <Download size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div>
                      <div className="text-[13px] font-black text-slate-900 leading-tight">Data Analytics</div>
                      <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Excel • CSV • SQL</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* Bulk Registry Download */}
                <div className="mt-4 rounded-2xl bg-indigo-600 overflow-hidden">
                  <div className="px-5 py-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                        <CloudDownload size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-[13px] font-black text-white leading-tight">Bulk Registry Download</div>
                        <div className="text-[11px] text-indigo-200 font-medium mt-0.5">Download complete registry data in bulk format.</div>
                      </div>
                    </div>
                    <Button className="w-full h-9 bg-white hover:bg-slate-50 text-indigo-700 font-black text-[12px] rounded-xl shadow-sm transition-all gap-2 border-0">
                      <Download size={14} className="stroke-[2.5]" />
                      Download Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* Info note */}
              <div className="px-5 pb-6">
                <div className="flex gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-indigo-600 text-[10px] font-black leading-none">i</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Exports are generated in real-time and include the latest data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─── Builder Tab ─── */}
        <TabsContent value="builder" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ReportBuilder />
        </TabsContent>

        {/* ─── Marks Entry Tab ─── */}
        <TabsContent value="entry" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MarksEntry user={user} forcedSchoolId={user.role === "superadmin" ? parseSafeInt(selectedSchoolId) : undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ──────────── Marksheet Certificate View (unchanged logic) ──────────── */
function MarksheetView({ student }: { student: any }) {
  if (!student) return null;

  const subjects = [
    { name: "Mathematics", marks: student.obtMarks, total: student.totalMarks, grade: "A+" },
    { name: "Science", marks: Math.floor(student.obtMarks * 0.9), total: student.totalMarks, grade: "A" },
    { name: "English", marks: Math.floor(student.obtMarks * 0.85), total: student.totalMarks, grade: "A" },
    { name: "Social Science", marks: Math.floor(student.obtMarks * 0.92), total: student.totalMarks, grade: "A+" }
  ];

  const totalObt = subjects.reduce((sum, s) => sum + s.marks, 0);
  const totalMax = subjects.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="p-10 bg-white space-y-8 border-8 border-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-slate-200 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-slate-200 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-slate-200 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-slate-200 pointer-events-none" />

      <div className="flex flex-col items-center text-center space-y-4 border-b-2 border-slate-900 pb-8">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-2xl tracking-tighter">
          SID
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">ScanID International School</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Certified Academic Achievement Record</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-slate-300 font-bold px-4">EST. 1998</Badge>
            <Badge className="bg-slate-900 text-white px-4">OFFICIAL DOCUMENT</Badge>
            <Badge variant="outline" className="border-slate-300 font-bold px-4">CBSE AFFILIATED</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm pt-4">
        <div className="space-y-1 col-span-2">
          <p className="text-[10px] uppercase font-bold text-slate-400">Student Name</p>
          <p className="font-extrabold text-xl text-slate-900">
            {student.student?.name || student.student?.fullName ||
              (student.student?.FNAME ? `${student.student.FNAME} ${student.student.LNAME || ''}`.trim() : "")}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400">Roll Number</p>
          <p className="font-bold text-slate-900">{student.student?.rollNumber || student.student?.ROLLNO || "0"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400">Session</p>
          <p className="font-bold text-slate-900">2023-2024</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-100/50">
            <TableRow>
              <TableHead className="font-bold text-slate-900 pl-6 h-12">SUBJECT DESCRIPTION</TableHead>
              <TableHead className="font-bold text-slate-900">MAX</TableHead>
              <TableHead className="font-bold text-slate-900">OBTAINED</TableHead>
              <TableHead className="font-bold text-slate-900 text-right pr-6">GRADE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((sub) => (
              <TableRow key={sub.name} className="hover:bg-transparent border-slate-100">
                <TableCell className="font-bold text-slate-700 pl-6 py-4">{sub.name}</TableCell>
                <TableCell className="font-medium text-slate-500">{sub.total}</TableCell>
                <TableCell className="font-black text-slate-900">{sub.marks}</TableCell>
                <TableCell className="text-right pr-6">
                  <span className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-xs",
                    sub.grade === "A+" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}>{sub.grade}</span>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-slate-900 text-white hover:bg-slate-900">
              <TableCell className="font-bold pl-6 text-lg">TOTAL AGGREGATE</TableCell>
              <TableCell className="font-bold opacity-70">{totalMax}</TableCell>
              <TableCell className="font-black text-2xl">{totalObt}</TableCell>
              <TableCell className="text-right pr-6 font-black text-2xl">{(totalObt / totalMax * 100).toFixed(1)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="pt-8 grid grid-cols-3 gap-12">
        <div className="space-y-4 text-center">
          <div className="h-12 border-b border-slate-300" />
          <p className="text-[10px] uppercase font-bold text-slate-400">Class Teacher</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-4 border-slate-100 rounded-full flex items-center justify-center italic text-[8px] text-slate-300 font-bold uppercase text-center rotate-12">
            ScanID<br />Official Seal
          </div>
        </div>
        <div className="space-y-4 text-center">
          <div className="h-12 border-b border-slate-300" />
          <p className="text-[10px] uppercase font-bold text-slate-400">Principal Signature</p>
        </div>
      </div>

      <div className="flex gap-3 pt-10 justify-end no-print">
        <Button variant="outline" className="gap-2 h-11 px-6 font-bold border-slate-300"><Printer size={18} /> Print Certificate</Button>
        <Button className="bg-slate-900 hover:bg-slate-800 gap-2 h-11 px-6 font-bold shadow-xl shadow-slate-900/20"><Download size={18} /> Download PDF</Button>
      </div>
    </div>
  );
}
