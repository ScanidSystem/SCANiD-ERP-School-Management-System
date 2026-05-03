import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "@/lib/api";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  CheckCircle2,
  XCircle,
  Filter,
  UserPlus,
  Users,
  ChevronUp,
  ChevronDown,
  Download,
  Loader2
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  subject: string;
  standard: string;
  section: string;
  status: "Active" | "On Leave" | "Resigned";
  joiningDate?: string;
  employeeId?: string;
}

export default function Teachers({ user }: { user: any }) {
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const canManage = isAdmin;
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Teacher; direction: "asc" | "desc" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");

  const [formData, setFormData] = useState<any>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    subject: "",
    standard: "10th",
    section: "A",
    status: "Active"
  });

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getTeachers(user?.schoolId ? parseInt(user.schoolId) : undefined);
      setTeachers(res.data.map((t: any) => ({
        id: t.id.toString(),
        fullName: t.user?.fullName || "Unnamed",
        email: t.user?.email || "N/A",
        phone: t.phone || "N/A",
        qualification: t.qualification || "N/A",
        experience: "5+ Years",
        subject: t.department || "General",
        standard: "Mixed",
        section: "Mixed",
        status: t.status || "Active",
        employeeId: t.employeeId
      })));
    } catch (error) {
      toast.error("Cloud not connect to database");
    } finally {
      setLoading(false);
    }
  }, [user?.schoolId]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const subjects = Array.from(new Set(teachers.map(t => t.subject)));

  const handleSort = (key: keyof Teacher) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredTeachers = teachers
    .filter(t => {
      const matchesSearch = t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || t.status === filterStatus;
      const matchesSubject = filterSubject === "all" || t.subject === filterSubject;
      return matchesSearch && matchesStatus && matchesSubject;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      const valA = (a as any)[key] || "";
      const valB = (b as any)[key] || "";
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      qualification: "",
      experience: "",
      subject: "",
      standard: "10th",
      section: "A",
      status: "Active"
    });
    setSelectedTeacher(null);
    setIsEditing(false);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        schoolId: user.schoolId ? parseInt(user.schoolId) : 1,
        employeeId: `EMP-${Date.now()}`,
        designation: "Faculty",
        department: formData.subject,
        qualification: formData.qualification,
        status: formData.status,
        user: {
           username: formData.email.split('@')[0] + Date.now(),
           fullName: `${formData.firstName} ${formData.lastName}`.trim(),
           passwordHash: "temp123",
           email: formData.email,
           role: "teacher",
           schoolId: user.schoolId ? parseInt(user.schoolId) : 1
        }
      };

      await apiService.createTeacher(payload as any); // Assuming endpoint exists or mapping to correct payload
      toast.success("Teacher profile saved to database");
      setIsAddDialogOpen(false);
      resetForm();
      fetchTeachers();
    } catch (error) {
      toast.error("Failed to save to database");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 mt-1">Manage teaching staff qualifications and classroom assignments.</p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if(!open) resetForm(); }}>
            <DialogTrigger
              render={
                <div className="flex items-center justify-center gap-2 h-10 px-6 rounded-md bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-white border-none outline-none cursor-pointer font-bold text-sm">
                  <UserPlus size={18} /> Register Teacher
                </div>
              }
            />
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Update Teacher Profile" : "Add New Faculty Member"}</DialogTitle>
                <DialogDescription>
                  Fill in the professional details for the teaching staff. Fields marked with <span className="text-red-500">*</span> are required.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>First Name <span className="text-red-500">*</span></Label>
                    <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="First" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Middle Name</Label>
                    <Input value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} placeholder="Middle" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Last Name <span className="text-red-500">*</span></Label>
                    <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Last" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Professional Email <span className="text-red-500">*</span></Label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@school.edu" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone Number</Label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Educational Qualification</Label>
                    <Input value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} placeholder="e.g. M.Sc Physics, B.Ed" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Years of Experience</Label>
                    <Input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="e.g. 10 Years" />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={14} /> Subject & Class Assignment
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label>Primary Subject <span className="text-red-500">*</span></Label>
                      <Input value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Mathematics" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Target Standard</Label>
                      <Input value={formData.standard} onChange={e => setFormData({...formData, standard: e.target.value})} placeholder="e.g. 10th, 12th" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Sections</Label>
                      <Input value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} placeholder="e.g. A, B" />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6 border-t mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateOrUpdate} className="bg-blue-600 hover:bg-blue-700">
                  {isEditing ? "Update Profile" : "Register Teacher"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardHeader className="border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search name, ID or subject..." 
                className="pl-10 border-slate-200 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
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
                <TableRow className="bg-slate-50/50">
                  <TableHead 
                    className="w-[100px] pl-6 font-bold text-slate-800 cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort("id")}
                  >
                    ID
                  </TableHead>
                  <TableHead 
                    className="font-bold text-slate-800 cursor-pointer hover:text-blue-600"
                  >
                    Teacher Profile
                  </TableHead>
                  <TableHead className="font-bold text-slate-800">Subject Expertise</TableHead>
                  <TableHead className="font-bold text-slate-800">Qual.</TableHead>
                  <TableHead className="font-bold text-slate-800">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id} className="hover:bg-slate-50/80 transition-colors group">
                    <TableCell className="pl-6 font-mono text-xs font-bold text-blue-600 italic">
                      {teacher.employeeId || teacher.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                          <AvatarFallback className="bg-slate-100 text-slate-700 font-bold uppercase">
                            {teacher.fullName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 leading-none">{teacher.fullName}</span>
                          <span className="text-[10px] text-slate-400 mt-1">{teacher.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold">
                        {teacher.subject}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 italic">{teacher.qualification}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-bold",
                        teacher.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )} variant="outline">
                        {teacher.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
