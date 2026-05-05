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
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<{ id: string; name: string } | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Teacher; direction: "asc" | "desc" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [schools, setSchools] = useState<any[]>([]);
  const inputRefs = React.useRef<Record<string, any>>({});
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
    status: "Active",
    schoolId: user.schoolId || ""
  });

  const fetchSchools = async () => {
    try {
      const res = await apiService.getSchools();
      setSchools(res.data);
    } catch (error) {
      console.error("Failed to fetch schools", error);
    }
  };

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
      status: "Active",
      schoolId: user.schoolId || ""
    });
    setSelectedTeacher(null);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleCreateOrUpdate = async () => {
    const newErrors: Record<string, boolean> = {};
    let firstErrorField = "";

    const checkField = (field: string, condition: boolean) => {
      if (condition) {
        newErrors[field] = true;
        if (!firstErrorField) firstErrorField = field;
      }
    };

    checkField("firstName", !formData.firstName?.trim());
    checkField("lastName", !formData.lastName?.trim());
    checkField("email", !formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
    checkField("phone", !formData.phone?.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, "")));
    checkField("qualification", !formData.qualification?.trim());
    checkField("subject", !formData.subject?.trim());
    checkField("schoolId", !formData.schoolId);

    setFormErrors(newErrors);

    if (firstErrorField) {
      toast.error("Please ensure all critical details are provided correctly.");
      const element = inputRefs.current[firstErrorField];
      if (element) {
        element.focus();
        if (element.scrollIntoView) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    try {
      const payload = {
        schoolId: parseInt(formData.schoolId),
        employeeId: isEditing ? selectedTeacher?.employeeId : `EMP-${Date.now()}`,
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
           schoolId: parseInt(formData.schoolId)
        }
      };

      if (isEditing && selectedTeacher) {
        await apiService.updateTeacher(parseInt(selectedTeacher.id), payload as any);
        toast.success("Teacher profile updated successfully");
      } else {
        await apiService.createTeacher(payload as any);
        toast.success("Teacher profile saved to database");
      }
      
      setIsAddDialogOpen(false);
      resetForm();
      fetchTeachers();
    } catch (error) {
      toast.error("Failed to save to database");
    }
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    setDeleteInfo({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteInfo) return;
    setLoading(true);
    try {
      await apiService.deleteTeacher(parseInt(deleteInfo.id));
      setTeachers(prev => prev.filter(t => t.id !== deleteInfo.id));
      toast.success(`${deleteInfo.name} removed successfully`);
      setIsDeleteDialogOpen(false);
      setDeleteInfo(null);
    } catch (error) {
      toast.error("Failed to delete record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 mt-1">Manage teaching staff qualifications and classroom assignments.</p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if(!open) resetForm(); else fetchSchools(); }}>
            <DeleteConfirmation 
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              onConfirm={confirmDelete}
              loading={loading && isDeleteDialogOpen}
              title="Remove Faculty Member?"
              description={`This will permanently delete ${deleteInfo?.name}'s profile and employment records. Access to the portal for this user will be revoked.`}
            />
            <DialogTrigger
              render={
                <div className="flex items-center justify-center gap-2 h-10 px-6 rounded-md bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-white border-none outline-none cursor-pointer font-bold text-sm">
                  <UserPlus size={18} /> Register Teacher
                </div>
              }
            />
            <DialogContent className="sm:max-w-[850px] w-[95vw] max-h-[90vh] flex flex-col p-0 border-none shadow-3xl rounded-[2rem] overflow-hidden">
                <div className="bg-slate-900 px-8 py-5 text-white relative shrink-0">
                  <div className="relative z-10 flex items-center justify-between">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-xl shadow-xl shadow-blue-500/20">
                          <UserPlus size={22} className="text-white" />
                        </div>
                        {isEditing ? "Modify Faculty Profile" : "Register Faculty"}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400 text-[12px] mt-1 font-medium max-w-2xl leading-relaxed">
                        {isEditing 
                          ? "Update professional qualifications and work assignments." 
                          : "Enter credentials and department assignments for new staff."}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                </div>
              
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
                  <div className="max-w-4xl mx-auto space-y-8">
                    {/* Basic Info */}
                    <section>
                      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Assignment & Identity</h3>
                      </div>
                      
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          <div className="md:col-span-6 space-y-1.5">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned School Branch</Label>
                            <Select 
                              value={formData.schoolId.toString()} 
                              onValueChange={(v) => {
                                setFormData({...formData, schoolId: v});
                                if (formErrors.schoolId) setFormErrors(prev => ({ ...prev, schoolId: false }));
                              }}
                              disabled={user.role !== "superadmin" && !!user.schoolId}
                            >
                              <SelectTrigger 
                                ref={el => inputRefs.current["schoolId"] = el}
                                className={cn(
                                  "h-10 border-slate-200 bg-slate-50/50 font-bold text-slate-800 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/5 transition-all text-sm",
                                  formErrors.schoolId && "border-red-500 ring-2 ring-red-500/10",
                                  (user.role !== "superadmin" && !!user.schoolId) && "opacity-80 cursor-not-allowed bg-slate-100"
                                )}
                              >
                                <SelectValue placeholder="Identify branch" />
                              </SelectTrigger>
                              <SelectContent className="max-h-68 rounded-2xl shadow-2xl border-slate-200 p-2">
                                {schools.length > 0 ? (
                                  schools.map(s => (
                                    <SelectItem key={s.id} value={s.id.toString()} className="font-semibold py-2.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-bold">{s.name}</span>
                                        <span className="text-[10px] text-slate-400 font-medium tracking-tight">ID: SCH-{s.id} • {s.address?.split(',')[0]}</span>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-4 text-sm text-slate-500 text-center italic flex flex-col items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                                    Loading registered branches...
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</Label>
                            <Input 
                              ref={el => inputRefs.current["firstName"] = el}
                              value={formData.firstName} 
                              onChange={e => {
                                setFormData({...formData, firstName: e.target.value});
                                if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: false }));
                              }} 
                              placeholder="e.g. Robert" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                                formErrors.firstName && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Middle Name</Label>
                            <Input value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} placeholder="Optional" className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</Label>
                            <Input 
                              ref={el => inputRefs.current["lastName"] = el}
                              value={formData.lastName} 
                              onChange={e => {
                                setFormData({...formData, lastName: e.target.value});
                                if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: false }));
                              }} 
                              placeholder="e.g. Smith" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                                formErrors.lastName && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Contact Info */}
                      <section>
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                          <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                          <h3 className="text-base font-black text-slate-900 tracking-tight">Contact Info</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Professional Email</Label>
                            <Input 
                              ref={el => inputRefs.current["email"] = el}
                              type="email" 
                              value={formData.email} 
                              onChange={e => {
                                setFormData({...formData, email: e.target.value});
                                if (formErrors.email) setFormErrors(prev => ({ ...prev, email: false }));
                              }} 
                              placeholder="faculty@school.edu" 
                              className={cn(
                                "h-12 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                                formErrors.email && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mobile Number</Label>
                            <Input 
                              ref={el => inputRefs.current["phone"] = el}
                              value={formData.phone} 
                              maxLength={10}
                              onChange={e => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setFormData({...formData, phone: val});
                                if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: false }));
                              }} 
                              placeholder="10-digit mobile number" 
                              className={cn(
                                "h-12 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                                formErrors.phone && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                        </div>
                      </section>

                      {/* Professional Info */}
                      <section>
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                          <h3 className="text-base font-black text-slate-900 tracking-tight">Credentials</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Highest Qualification</Label>
                            <Input 
                              ref={el => inputRefs.current["qualification"] = el}
                              value={formData.qualification} 
                              onChange={e => {
                                setFormData({...formData, qualification: e.target.value});
                                if (formErrors.qualification) setFormErrors(prev => ({ ...prev, qualification: false }));
                              }} 
                              placeholder="e.g. M.Ed, PhD" 
                              className={cn(
                                "h-12 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                                formErrors.qualification && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Experience (Years)</Label>
                            <Input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="e.g. 5 Years" className="h-12 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm" />
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Department */}
                    <section className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                      <div className="flex items-center gap-3 mb-4 pb-1">
                        <div className="w-1.5 h-5 bg-red-500 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Assignments</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</Label>
                          <Input 
                            ref={el => inputRefs.current["subject"] = el}
                            value={formData.subject} 
                            onChange={e => {
                              setFormData({...formData, subject: e.target.value});
                              if (formErrors.subject) setFormErrors(prev => ({ ...prev, subject: false }));
                            }} 
                            placeholder="Expertise" 
                            className={cn(
                              "h-10 border-slate-200 bg-white font-bold rounded-xl px-4 text-sm",
                              formErrors.subject && "border-red-500 ring-2 ring-red-500/10"
                            )}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Grade</Label>
                          <Input value={formData.standard} onChange={e => setFormData({...formData, standard: e.target.value})} placeholder="e.g. 10th" className="h-10 border-slate-200 bg-white font-bold rounded-xl px-4 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</Label>
                          <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                            <SelectTrigger className="h-10 border-slate-200 bg-white font-bold rounded-xl px-4 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                              <SelectItem value="Active" className="font-semibold py-1.5 text-xs">Active</SelectItem>
                              <SelectItem value="On Leave" className="font-semibold py-1.5 text-xs">On Leave</SelectItem>
                              <SelectItem value="Resigned" className="font-semibold py-1.5 text-xs">Resigned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <DialogFooter className="bg-slate-50 px-10 py-5 shrink-0 border-t border-slate-100 flex flex-row items-center justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="h-9 px-5 font-bold text-slate-500 hover:text-slate-900 rounded-xl text-xs uppercase tracking-wider">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateOrUpdate} 
                    className="h-10 px-8 bg-blue-600 hover:bg-blue-700 font-black shadow-lg shadow-blue-600/20 rounded-xl transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
                  >
                    {isEditing ? "Update Profile" : "Onboard Faculty"}
                  </Button>
                </DialogFooter>
              </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="shadow-2xl shadow-slate-200/60 border-none rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100 bg-white px-8 pt-8">
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
                <TableRow className="bg-slate-50/50 h-14">
                  <TableHead className="w-[120px] pl-8 text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('employeeId')}>
                    <div className="flex items-center gap-1.5">
                      Employee ID <ChevronDown size={14} className={cn("transition-transform", sortConfig?.key === 'employeeId' && sortConfig.direction === 'desc' && "rotate-180")} />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('fullName')}>
                    <div className="flex items-center gap-1.5">
                      Faculty Profile <ChevronDown size={14} className={cn("transition-transform", sortConfig?.key === 'fullName' && sortConfig.direction === 'desc' && "rotate-180")} />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('subject')}>
                    <div className="flex items-center gap-1.5">
                      Expertise <ChevronDown size={14} className={cn("transition-transform", sortConfig?.key === 'subject' && sortConfig.direction === 'desc' && "rotate-180")} />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('qualification')}>
                    <div className="flex items-center gap-1.5">
                      Credentials <ChevronDown size={14} className={cn("transition-transform", sortConfig?.key === 'qualification' && sortConfig.direction === 'desc' && "rotate-180")} />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-right pr-8 text-xs font-black text-slate-500 uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                    <TableCell className="pl-8 font-mono text-xs font-black text-blue-600 italic">
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
                        "font-black text-[10px] uppercase tracking-wider",
                        teacher.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )} variant="outline">
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer outline-none">
                              <MoreHorizontal size={16} />
                            </div>
                          }
                        />
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-2xl p-2 min-w-[200px]">
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="gap-3 py-2.5 rounded-xl cursor-pointer" onClick={() => {
                              setSelectedTeacher(teacher);
                              setIsEditing(true);
                              const names = teacher.fullName.split(' ');
                              setFormData({
                                firstName: names[0],
                                lastName: names.slice(-1)[0],
                                middleName: names.length > 2 ? names.slice(1, -1).join(' ') : "",
                                email: teacher.email,
                                phone: teacher.phone,
                                qualification: teacher.qualification,
                                subject: teacher.subject,
                                status: teacher.status,
                                schoolId: user.schoolId || ""
                              });
                              setIsAddDialogOpen(true);
                            }}>
                              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Edit size={14} />
                              </div>
                              <span className="font-bold text-slate-700">Modify Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 py-2.5 rounded-xl cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDeleteTeacher(teacher.id, teacher.fullName)}>
                              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <Trash2 size={14} />
                              </div>
                              <span className="font-bold text-red-600">Remove Faculty</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
