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
import { Printer, Download, Eye, FileText, ChevronRight, BarChart3, Settings2, Edit3, Loader2, Search, ArrowUpDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
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

  useEffect(() => {
    const fetchSchools = async () => {
      if (user.role === "superadmin") {
        try {
          const res = await apiService.getSchools();
          setSchools(res.data);
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
        const schoolIdToUse = user.role === "superadmin" ? (selectedSchoolId ? parseInt(selectedSchoolId) : undefined) : (user.schoolId ? parseInt(user.schoolId) : undefined);
        const res = await apiService.getMarks(schoolIdToUse);
        setMarks(res.data);
      } catch (error) {
        console.error("Marks error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [user.schoolId, user.role, selectedSchoolId]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredMarks = marks.filter(m => 
    m.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.student?.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.student?.rollNumber?.toString().includes(searchQuery) ||
    m.examName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMarks = [...filteredMarks].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aValue, bValue;
    
    if (key === 'studentName') {
      aValue = a.student?.fullName || "";
      bValue = b.student?.fullName || "";
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

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-700 min-w-0">
      <Tabs defaultValue="recent" className="w-full flex flex-col">
        <div className="shrink-0 overflow-x-auto scrollbar-hide border-b border-slate-200 mb-8 px-1">
          <TabsList className="bg-transparent w-full justify-start rounded-none h-12 p-0 gap-8 min-w-max" variant="line">
          <TabsTrigger 
            value="recent" 
            className="px-0 h-12 rounded-none border-b-2 border-transparent data-[active]:border-blue-600 data-[active]:bg-transparent data-[active]:text-blue-600 gap-2 font-bold text-slate-500 hover:text-slate-900 transition-all flex-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          >
            <BarChart3 size={16} /> Recent Results
          </TabsTrigger>
          <TabsTrigger 
            value="entry" 
            className="px-0 h-12 rounded-none border-b-2 border-transparent data-[active]:border-blue-600 data-[active]:bg-transparent data-[active]:text-blue-600 gap-2 font-bold text-slate-500 hover:text-slate-900 transition-all flex-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          >
            <Edit3 size={16} /> Marks Entry
          </TabsTrigger>
          {(user.role === "superadmin" || user.role === "admin") && (
            <TabsTrigger 
              value="builder" 
              className="px-0 h-12 rounded-none border-b-2 border-transparent data-[active]:border-blue-600 data-[active]:bg-transparent data-[active]:text-blue-600 gap-2 font-bold text-slate-500 hover:text-slate-900 transition-all flex-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            >
              <Settings2 size={16} /> Custom Report Builder
            </TabsTrigger>
          )}
        </TabsList>
        </div>

        <TabsContent value="recent" className="space-y-6 focus-visible:outline-none">
          {user.role === "superadmin" && (
            <Card className="border-none shadow-xl shadow-slate-200/40 bg-white rounded-3xl overflow-hidden mb-2">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Settings2 size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global Context</p>
                    <h4 className="text-sm font-black text-slate-800">Switch Academic Branch</h4>
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                    <SelectTrigger className="h-10 border-slate-200 bg-slate-50/50 rounded-xl font-bold text-slate-700">
                      <SelectValue placeholder="Select School Branch">
                        {selectedSchoolId && selectedSchoolId !== "none" ? schools.find(s => s.id.toString() === selectedSchoolId)?.name : "Select School Branch"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-2xl p-2">
                      <SelectItem value="none" className="font-semibold py-2.5 px-3 rounded-lg text-slate-400 italic">Select School Branch</SelectItem>
                      {schools.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()} className="font-semibold py-2.5 px-3 rounded-lg">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{s.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">SCH-{s.id}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-2xl shadow-slate-200/60 border-none rounded-[2rem] overflow-hidden min-w-0">
              <CardHeader className="pb-6 border-b border-slate-100 bg-white px-8 pt-8 flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Academic Ledger</CardTitle>
                  <CardDescription className="text-slate-500 font-medium font-medium tracking-tight">Final Registry for 2024 Terms</CardDescription>
                </div>
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <Input 
                    placeholder="Search by student, ID, roll..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 border-slate-200 bg-slate-50/50 rounded-xl text-xs"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                   <div className="p-12 flex justify-center">
                     <Loader2 className="animate-spin text-slate-300" size={32} />
                   </div>
                ) : (
                  <div className="min-w-full overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-14">
                          <TableHead 
                            className="w-[300px] pl-8 text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => requestSort('studentName')}
                          >
                            <div className="flex items-center gap-2">
                              Student Profile <ArrowUpDown size={12} />
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => requestSort('performance')}
                          >
                            <div className="flex items-center gap-2">
                              Performance Score <ArrowUpDown size={12} />
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => requestSort('term')}
                          >
                            <div className="flex items-center gap-2">
                              Academic Term <ArrowUpDown size={12} />
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => requestSort('examName')}
                          >
                            <div className="flex items-center gap-2">
                              Examination <ArrowUpDown size={12} />
                            </div>
                          </TableHead>
                          <TableHead className="text-right pr-8 text-xs font-black text-slate-500 uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedMarks.map((result) => (
                          <TableRow key={result.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50">
                            <TableCell className="pl-8">
                              <div className="font-black text-slate-900 group-hover:text-blue-700 transition-colors">{result.student?.fullName || "Student"}</div>
                              <div className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-1">Roll ID: {result.student?.rollNumber}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <span className={cn(
                                  "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black",
                                  (result.obtMarks / result.totalMarks) >= 0.8 ? "bg-green-100 text-green-700" :
                                  (result.obtMarks / result.totalMarks) >= 0.4 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                )}>
                                  {Math.round((result.obtMarks / result.totalMarks) * 100)}
                                </span>
                                <div className="text-xs">
                                  <span className="font-bold text-slate-900">{result.obtMarks}</span>
                                  <span className="text-slate-400 ml-0.5">/ {result.totalMarks}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-white font-bold text-[10px] uppercase tracking-tighter">
                                {result.term}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-slate-600">{result.examName}</TableCell>
                            <TableCell className="text-right pr-8">
                              <Dialog>
                                <DialogTrigger
                                  nativeButton={true}
                                  render={
                                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => setSelectedStudent(result)}>
                                      <Eye size={14} /> View
                                    </Button>
                                  }
                                />
                                <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
                                  <MarksheetView student={selectedStudent} />
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6 min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                    <p className="text-sm font-semibold mb-2">Quick Export</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" className="justify-between h-auto py-3 px-4">
                        <div className="text-left">
                          <div className="text-sm font-bold">Standard Marksheet</div>
                          <div className="text-[10px] text-slate-400">PDF, Print-ready</div>
                        </div>
                        <ChevronRight size={16} />
                      </Button>
                      <Button variant="outline" className="justify-between h-auto py-3 px-4">
                        <div className="text-left">
                          <div className="text-sm font-bold">Performance Analytics</div>
                          <div className="text-[10px] text-slate-400">Excel, CSV</div>
                        </div>
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Download All Reports</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle className="text-white">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-400 mb-4">Overall school performance has improved by 4.2% compared to last year.</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Pass Percentage</span>
                      <span className="font-bold">98.5%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full">
                      <div className="h-full bg-blue-400 w-[98%] rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>A+ Grades</span>
                      <span className="font-bold">124</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="builder" className="focus-visible:outline-none">
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="entry" className="focus-visible:outline-none">
          <MarksEntry user={user} forcedSchoolId={user.role === "superadmin" ? (selectedSchoolId ? parseInt(selectedSchoolId) : undefined) : undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

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
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-slate-200 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-slate-200 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-slate-200 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-slate-200 pointer-events-none"></div>

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
          <p className="font-extrabold text-xl text-slate-900">{student.student?.fullName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400">Roll Number</p>
          <p className="font-bold text-slate-900">{student.student?.rollNumber}</p>
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
            <div className="h-12 border-b border-slate-300"></div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Class Teacher</p>
        </div>
        <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-full flex items-center justify-center italic text-[8px] text-slate-300 font-bold uppercase text-center rotate-12">
                ScanID<br/>Official Seal
            </div>
        </div>
        <div className="space-y-4 text-center">
            <div className="h-12 border-b border-slate-300"></div>
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
