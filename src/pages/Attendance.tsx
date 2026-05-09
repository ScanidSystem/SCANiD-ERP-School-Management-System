import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Check, X, Clock, Save, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Attendance({ user }: { user: any }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState(new Date());
  const [schools, setSchools] = useState<any[]>([]);
  const [standardsMaster, setStandardsMaster] = useState<any[]>([]);
  const [sectionsMaster, setSectionsMaster] = useState<any[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(user.schoolId?.toString() || "");
  const [selectedStandard, setSelectedStandard] = useState<string>("10th");
  const [selectedSection, setSelectedSection] = useState<string>("A");

  const canManage = user.role === "superadmin" || user.role === "admin" || user.role === "teacher";

  useEffect(() => {
    setSelectedSchoolId(user.schoolId?.toString() || "");
  }, [user.schoolId]);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [schoolsRes, standardsRes, sectionsRes] = await Promise.all([
          apiService.getSchools(),
          apiService.getStandards(),
          apiService.getSections()
        ]);
        setSchools(schoolsRes.data || []);
        setStandardsMaster(standardsRes.data || []);
        setSectionsMaster(sectionsRes.data || []);
        
        if (user.role === "superadmin" && !selectedSchoolId && schoolsRes.data.length > 0) {
          setSelectedSchoolId(schoolsRes.data[0].id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch masters", error);
      }
    };
    fetchMasters();
  }, [user.role]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const schoolIdToUse = user.role === "superadmin" ? (selectedSchoolId ? parseInt(selectedSchoolId) : undefined) : (user.schoolId ? parseInt(user.schoolId) : undefined);
        const res = await apiService.getStudents(schoolIdToUse);
        setStudents(res.data.map((s: any) => ({
          id: s.id,
          grno: s.registrationNumber,
          name: s.fullName,
          roll: s.rollNumber || "0",
          status: "present" // Default to present
        })));
      } catch (error) {
        toast.error("Failed to fetch students from API");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user.schoolId, user.role, selectedSchoolId]);

  const updateStatus = (id: string, status: string) => {
    if (!canManage) return;
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s.id,
        date: date.toISOString(),
        status: s.status.charAt(0).toUpperCase() + s.status.slice(1),
        markedByUserId: parseInt(user.id)
      }));
      
      // In a real custom backend you'd have a bulk endpoint
      // for this demo we assume the markAttendance takes either one or is handled by backend bulk
      await apiService.markAttendance(records); 
      toast.success("Attendance marked in database");
    } catch (error) {
      toast.error("Failed to save records to SQL Server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 mt-1">Daily presence marking and reporting for all classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm">
            <CalendarIcon size={16} className="text-slate-400" />
            <span className="text-sm font-semibold">{format(date, "PPP")}</span>
          </div>
          {canManage && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 gap-2" 
              onClick={handleSave}
              disabled={isSaving || loading}
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Attendance Context</CardTitle>
            <CardDescription>Select unit and date registry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.role === "superadmin" && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">School Branch</label>
                <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                  <SelectTrigger className="border-slate-200 bg-blue-50/30 font-bold rounded-xl h-11">
                    <SelectValue placeholder="Select School Branch">
                      {selectedSchoolId && selectedSchoolId !== "none" ? schools.find(s => s.id.toString() === selectedSchoolId)?.name : "Select School Branch"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-68 rounded-2xl shadow-2xl border-slate-200 p-2">
                    <SelectItem value="none" className="font-semibold py-2.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">
                      Select School Branch
                    </SelectItem>
                    {schools.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()} className="font-semibold py-2.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold">{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium tracking-tight">ID: SCH-{s.id}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest ml-1">Academic Grade</label>
              <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                <SelectTrigger className="border-slate-200 bg-slate-50/50 font-bold rounded-xl h-11">
                  <SelectValue placeholder="Select Academic Standard">
                    {selectedStandard && selectedStandard !== "none" ? selectedStandard : "Select Academic Standard"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-2xl border-slate-200 p-2">
                  <SelectItem value="none" className="font-semibold py-2.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Academic Standard</SelectItem>
                  {standardsMaster.map(std => (
                    <SelectItem key={std.id} value={std.name} className="font-semibold py-2.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{std.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest ml-1">Division/Section</label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="border-slate-200 bg-slate-50/50 font-bold rounded-xl h-11">
                  <SelectValue placeholder="Select Class Section">
                    {selectedSection && selectedSection !== "none" ? `Section ${selectedSection}` : "Select Class Section"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-2xl border-slate-200 p-2">
                  <SelectItem value="none" className="font-semibold py-2.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Class Section</SelectItem>
                  {sectionsMaster.map(sec => (
                    <SelectItem key={sec.id} value={sec.name} className="font-semibold py-2.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Section {sec.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400">Summary</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-2xl font-bold text-emerald-700">{students.filter(s => s.status === 'present').length}</p>
                        <p className="text-[10px] uppercase font-bold text-emerald-600">Present</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-2xl font-bold text-red-700">{students.filter(s => s.status === 'absent').length}</p>
                        <p className="text-[10px] uppercase font-bold text-red-600">Absent</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

      <Card className="lg:col-span-3 shadow-2xl shadow-slate-200/60 border-none rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100 bg-white px-8 pt-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900">Attendance Sheet</CardTitle>
            <CardDescription className="text-slate-500 font-medium tracking-tight">Daily Roll Call Registry</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 hover:bg-slate-50" onClick={() => setStudents(s => s.map(x => ({...x, status: 'present'})))}>Mark All Present</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 size={32} className="animate-spin text-slate-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 h-14">
                  <TableHead className="w-[120px] pl-8 text-xs font-black text-slate-500 uppercase tracking-widest">Digital ID</TableHead>
                  <TableHead className="w-16 text-xs font-black text-slate-500 uppercase tracking-widest">Roll</TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Student Identity</TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Presence</TableHead>
                  {canManage && <TableHead className="text-right pr-8 text-xs font-black text-slate-500 uppercase tracking-widest">Actions</TableHead>}
                </TableRow>
              </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                      <TableCell className="pl-8 font-mono text-xs font-black text-blue-600 italic">{(student as any).grno || `GR-${student.id}`}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-slate-400">{student.roll}</TableCell>
                      <TableCell className="font-black text-slate-900">{student.name}</TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            "capitalize font-black text-[10px] uppercase tracking-wider px-3",
                            student.status === 'present' ? "bg-emerald-100 text-emerald-700" :
                            student.status === 'absent' ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          )}
                          variant="secondary"
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      {canManage && (
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-1.5 font-bold">
                            <Button 
                              size="icon" 
                              variant={student.status === 'present' ? "default" : "outline"} 
                              className={cn("h-8 w-8 rounded-full", student.status === 'present' && "bg-emerald-600 hover:bg-emerald-700")}
                              onClick={() => updateStatus(student.id, 'present')}
                            >
                              <Check size={14} />
                            </Button>
                            <Button 
                              size="icon" 
                              variant={student.status === 'absent' ? "default" : "outline"}
                              className={cn("h-8 w-8 rounded-full", student.status === 'absent' && "bg-red-600 hover:bg-red-700")}
                              onClick={() => updateStatus(student.id, 'absent')}
                            >
                              <X size={14} />
                            </Button>
                            <Button 
                              size="icon" 
                              variant={student.status === 'late' ? "default" : "outline"}
                              className={cn("h-8 w-8 rounded-full", student.status === 'late' && "bg-amber-500 hover:bg-amber-600")}
                              onClick={() => updateStatus(student.id, 'late')}
                            >
                              <Clock size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
