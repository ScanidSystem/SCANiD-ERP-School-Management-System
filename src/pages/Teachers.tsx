import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "@/lib/api";
import { SimpleTooltip } from "@/components/shared/SimpleTooltip";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Edit2, 
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
  UserCircle,
  Camera,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { cn, parseSafeInt, resolvePhotoUrl } from "@/lib/utils";
import { toast } from "sonner";

interface Teacher {
  id: string;
  userId?: string;
  name: string;
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
  photo?: string;
  schoolId?: string;
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
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [uploadingTeacherId, setUploadingTeacherId] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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
    standard: "",
    section: "",
    status: "Active",
    schoolId: user.schoolId || ""
  });

  const fetchSchools = async () => {
    try {
      const res = await apiService.getSchools();
      const schoolData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setSchools(schoolData);
    } catch (error) {
      console.error("Failed to fetch schools", error);
    }
  };

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getTeachers(
        parseSafeInt(user?.schoolId),
        parseSafeInt(user?.academicYearId),
        {
          search: searchQuery,
          sortBy,
          sortOrder,
          page,
          pageSize,
          // @ts-ignore
          status: filterStatus === "all" ? undefined : filterStatus,
          subject: filterSubject === "all" ? undefined : filterSubject
        }
      );
      
      const resData = res.data;
      const rawTeachersList = Array.isArray(resData) 
        ? resData 
        : (resData && Array.isArray(resData.data) ? resData.data : []);
      
      const formatted = rawTeachersList.map((t: any) => {
        const getVal = (prop: string, fallback?: any) => {
          if (!t) return fallback;
          const userObj = t.user || {};
          // Search in both teacher object and nested user object
          const tKeys = Object.keys(t);
          const uKeys = Object.keys(userObj);
          
          const tMatch = tKeys.find(k => k.toLowerCase() === prop.toLowerCase());
          if (tMatch) return t[tMatch];
          
          const uMatch = uKeys.find(k => k.toLowerCase() === prop.toLowerCase());
          if (uMatch) return userObj[uMatch];
          
          return fallback;
        };

        return {
          id: t.id?.toString() || "",
          userId: t.userId?.toString() || t.user?.id?.toString() || "",
          name: getVal("name") || getVal("fullName") || "Unnamed Teacher",
          email: getVal("email") || "N/A",
          phone: getVal("contactNumber") || getVal("phone") || "N/A",
          qualification: getVal("qualification") || "N/A",
          experience: getVal("experience") || "N/A",
          subject: getVal("subject") || getVal("department") || "N/A",
          standard: getVal("standard") || getVal("standardId")?.toString() || "N/A",
          section: getVal("section") || getVal("sectionId")?.toString() || "N/A",
          status: getVal("status") || "Active",
          employeeId: getVal("employeeId") || "N/A",
          photo: getVal("photo") || getVal("profilePhotoPath") || getVal("ProfilePhotoPath") || "",
          schoolId: getVal("schoolId") || t.schoolId?.toString() || ""
        };
      });

      const isServerPaged = resData && !!resData.pagination;
      
      if (!isServerPaged) {
        // Robust client-side search, status and subject filters, sorting, and pagination
        let filtered = [...formatted];
        
        // Search Filter
        const searchLower = searchQuery.trim().toLowerCase();
        if (searchLower) {
          filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchLower) ||
            item.email.toLowerCase().includes(searchLower) ||
            item.phone.toLowerCase().includes(searchLower) ||
            item.employeeId.toLowerCase().includes(searchLower) ||
            item.qualification.toLowerCase().includes(searchLower) ||
            item.subject.toLowerCase().includes(searchLower)
          );
        }
        
        // Status Filter
        if (filterStatus !== "all") {
          filtered = filtered.filter(item => item.status === filterStatus);
        }
        
        // Subject Filter
        if (filterSubject !== "all") {
          filtered = filtered.filter(item => item.subject === filterSubject);
        }
        
        // Sorting
        if (sortBy) {
          filtered.sort((a: any, b: any) => {
            const valA = a[sortBy] || "";
            const valB = b[sortBy] || "";
            
            if (valA === valB) return 0;
            let comparison = 0;
            if (typeof valA === "string" && typeof valB === "string") {
              comparison = valA.localeCompare(valB);
            } else {
              comparison = valA < valB ? -1 : 1;
            }
            return sortOrder === "desc" ? comparison * -1 : comparison;
          });
        }
        
        // Pagination
        const total = filtered.length;
        setTotalCount(total);
        setTotalPages(Math.ceil(total / pageSize));
        
        const startIndex = (page - 1) * pageSize;
        setTeachers(filtered.slice(startIndex, startIndex + pageSize));
      } else {
        // Server paved the way
        setTotalCount(resData.pagination.totalCount);
        setTotalPages(resData.pagination.totalPages);
        setTeachers(formatted);
      }
    } catch (error) {
      toast.error("Could not connect to database");
    } finally {
      setLoading(false);
    }
  }, [user?.schoolId, user?.academicYearId, searchQuery, sortBy, sortOrder, page, pageSize, filterStatus, filterSubject]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    if (isAddDialogOpen) {
      fetchSchools();
    } else {
      setSelectedPhotoFile(null);
      if (localPhotoPreview) {
        URL.revokeObjectURL(localPhotoPreview);
        setLocalPhotoPreview(null);
      }
    }
  }, [isAddDialogOpen]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const filteredTeachers = teachers;

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
      schoolId: user.schoolId || "",
      photo: ""
    });
    setSelectedTeacher(null);
    setIsEditing(false);
    setFormErrors({});
  };
  const handleCreateOrUpdate = async () => {
    const newErrors: Record<string, boolean> = {};
    let firstErrorField = "";

    const checkField = (key: string, condition: boolean, message: string) => {
      if (condition) {
        newErrors[key] = message;
        if (!firstErrorField) firstErrorField = key;
      }
    };

    checkField("schoolId", !formData.schoolId || formData.schoolId === "none", "Assigned School Branch required");
    checkField("firstName", !formData.firstName?.trim(), "First Name required");
    checkField("lastName", !formData.lastName?.trim(), "Last Name required");
    checkField("email", !formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email), "Valid Email Protocol required");
    checkField("phone", !formData.phone?.trim() || formData.phone.length !== 10, "10-digit Direct Line required");
    checkField("qualification", !formData.qualification?.trim(), "Education Deck required");
    checkField("subject", !formData.subject?.trim(), "Primary Domain required");
    checkField("status", !formData.status || formData.status === "none", "Access Status required");
    checkField("employeeId", !formData.employeeId?.trim(), "Staff Payroll ID required");
    checkField("employeeType", !formData.employeeType || formData.employeeType === "none", "Employee Category required");
    checkField("gender", !formData.gender || formData.gender === "none", "Gender Identity required");
    checkField("dob", !formData.dob, "Date of Birth required");
    checkField("joiningDate", !formData.joiningDate, "Onboarding Date required");
    checkField("experience", !formData.experience?.trim(), "Professional Tenure required");
    checkField("standard", !formData.standard?.trim(), "Grade Level required");
    checkField("address", !formData.address?.trim(), "Residential Address required");
    checkField("RFID", !formData.RFID?.trim(), "Biometric RFID required");
    checkField("RFID2", !formData.RFID2?.trim(), "Payroll Card Number required");
    checkField("bloodGroup", !formData.bloodGroup || formData.bloodGroup === "none", "Blood Group required");
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
      const payload: any = {
        schoolId: parseSafeInt(formData.schoolId) || 1,
        employeeId: isEditing ? selectedTeacher?.employeeId : `EMP-${Date.now()}`,
        designation: "Faculty",
        department: formData.subject,
        qualification: formData.qualification,
        status: formData.status,
        contactNumber: formData.phone,
        profilePhotoPath: formData.photo || "",
        ProfilePhotoPath: formData.photo || "",
        user: {
           username: formData.email.split('@')[0] + Date.now(),
           name: `${formData.firstName} ${formData.lastName}`.trim(),
           passwordHash: "temp123",
           email: formData.email,
           role: "teacher",
           schoolId: parseSafeInt(formData.schoolId) || 1
        },
        // Audit fields: Ensure CreatedBy and ModifiedBy are captured for backend audit logging
        // CreatedBy is only set for new records, ModifiedBy is updated for every modification
        CreatedBy: isEditing ? undefined : (user.name || user.email),
        ModifiedBy: user.name || user.email
      };

      if (isEditing && selectedTeacher) {
        payload.id = parseSafeInt(selectedTeacher.id) || 0;
        if (payload.user && selectedTeacher.userId) {
          payload.user.id = parseSafeInt(selectedTeacher.userId) || 0;
        }
      }

      if (isEditing && selectedTeacher) {
        await apiService.updateTeacher(parseSafeInt(selectedTeacher.id) || 0, payload as any);
        toast.success("Teacher profile updated successfully");
      } else {
        const response = await apiService.createTeacher(payload as any);
        const newTeacher = response.data.data || response.data;
        if (selectedPhotoFile && newTeacher?.id) {
          try {
            await apiService.uploadTeacherPhoto(Number(newTeacher.id), selectedPhotoFile);
          } catch (uploadErr) {
            console.error("Delayed teacher photo upload failed:", uploadErr);
          }
        }
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
      await apiService.deleteTeacher(parseSafeInt(deleteInfo.id) || 0);
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

  const triggerPhotoUpload = (id: string | "new") => {
    setUploadingTeacherId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadingTeacherId && e.target.files?.[0]) {
      const file = e.target.files[0];
      
      if (uploadingTeacherId === "new") {
        setSelectedPhotoFile(file);
        setLocalPhotoPreview(URL.createObjectURL(file));
        toast.success("Profile photo selected. It will be uploaded on registration.");
        setUploadingTeacherId(null);
        e.target.value = '';
        return;
      }

      const teacherId = uploadingTeacherId;
      const loadingToast = toast.loading("Uploading identity image...");
      try {
        const response = await apiService.uploadTeacherPhoto(Number(teacherId), file);
        const newPath = response.data.data?.path || response.data.path;
        
        // Update list and the selected teacher's image binding with all key variants
        setTeachers(prev => prev.map(t => 
          t.id.toString() === teacherId.toString() ? { ...t, photo: newPath, profilePhotoPath: newPath, ProfilePhotoPath: newPath } : t
        ));
        setFormData(prev => ({ ...prev, photo: newPath }));
        if (selectedTeacher && selectedTeacher.id.toString() === teacherId.toString()) {
          setSelectedTeacher(prev => prev ? { ...prev, photo: newPath } : null);
        }
        
        toast.dismiss(loadingToast);
        toast.success("Profile photo updated successfully");
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Upload failed:", error);
        toast.error("Failed to upload photo. Please try again.");
      } finally {
        setUploadingTeacherId(null);
      }
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="bg-blue-600 p-4 rounded-[1.25rem] text-white shadow-2xl shadow-blue-200 transition-transform hover:-rotate-3">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">Faculty Management</h1>
            <p className="text-slate-400 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">Administrative control for teaching staff & assignments</p>
          </div>
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
                <div className="flex items-center justify-center gap-2 h-11 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 text-white border-none outline-none cursor-pointer font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95">
                  <UserPlus size={18} className="stroke-[3]" /> Register Faculty
                </div>
              }
            />
            <DialogContent className="sm:max-w-[850px] w-[95vw] max-h-[90vh] flex flex-col p-0 border-none shadow-3xl rounded-[2.5rem] overflow-hidden">
                <div className="bg-slate-900 px-10 py-8 text-white relative shrink-0">
                  <div className="relative z-10 flex items-center justify-between">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-blue-500 rounded-2xl shadow-2xl shadow-blue-500/20">
                          <UserPlus size={24} className="text-white" />
                        </div>
                        {isEditing ? "Modify Profile" : "Onboard Faculty"}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400 text-sm mt-2 font-bold max-w-2xl leading-relaxed uppercase tracking-wider">
                        {isEditing 
                          ? "Update professional qualifications and work assignments." 
                          : "Enter credentials and department assignments for new staff."}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="absolute right-[-5%] top-[-5%] w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                </div>
              
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 bg-white custom-scrollbar">
                  <div className="max-w-4xl mx-auto space-y-10">
                    <section>
                      <div className="flex items-center gap-4 mb-6 pb-2 border-b border-slate-50">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Institutional Context</h3>
                      </div>
                      
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-12 space-y-2">
                            <Label className={cn("text-[10px] font-black uppercase tracking-[0.2em] ml-1", formErrors.schoolId ? "text-red-500" : "text-slate-400")}>Campus Branch {formErrors.schoolId && "*"}</Label>
                            <Select 
                              value={formData.schoolId.toString()} 
                              onValueChange={(v) => {
                                setFormData({...formData, schoolId: v});
                                if (formErrors.schoolId) setFormErrors(prev => ({ ...prev, schoolId: false }));
                              }}
                              disabled={user.role !== "superadmin" && !!user.schoolId}
                            >
                              <SelectTrigger 
                                ref={el => { inputRefs.current["schoolId"] = el; }}
                                className={cn(
                                  "h-12 border-slate-100 bg-slate-50/50 font-black text-slate-800 rounded-2xl px-5 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm",
                                  formErrors.schoolId && "border-red-500 ring-2 ring-red-500/10",
                                  (user.role !== "superadmin" && !!user.schoolId) && "opacity-80 cursor-not-allowed bg-slate-100"
                                )}
                              >
                                {/* Custom label display to show only the name when a campus is selected, avoiding full ID/Address view in trigger */}
                                <SelectValue placeholder="Select Campus">
                                  {formData.schoolId ? schools.find(s => s.id.toString() === formData.schoolId.toString())?.name : undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="max-h-80 rounded-[2rem] shadow-2xl border-slate-100 p-3">
                                <SelectItem value="" className="font-bold py-3 px-4 rounded-xl focus:bg-slate-50 text-slate-400 italic">
                                  Select Campus
                                </SelectItem>
                                {Array.isArray(schools) && schools.length > 0 ? (
                                  schools.map(s => (
                                    <SelectItem key={s.id} value={s.id.toString()} className="font-black py-4 px-4 rounded-2xl focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-sm uppercase tracking-tight">{s.name}</span>
                                        <span className="text-[10px] text-slate-400 font-bold tracking-[0.1em]">ID: SCH-{s.id} • {s.address?.split(',')[0]}</span>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-6 text-xs font-black text-slate-400 text-center uppercase tracking-widest flex flex-col items-center gap-3 italic">
                                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                                    Syncing branches...
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>                        <div className="flex flex-col md:flex-row gap-8 mt-8">
                          {/* Left: Identity Image */}
                          <div className="flex flex-col items-center gap-4">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Identity Photo</Label>
                            <div 
                              className="relative group cursor-pointer"
                              onClick={() => triggerPhotoUpload(isEditing ? selectedTeacher?.id!.toString() : "new")}
                            >
                              <div className="w-44 h-44 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-100 bg-slate-50 flex items-center justify-center transition-all group-hover:shadow-blue-200/50 group-hover:scale-[1.02]">
                                 {(localPhotoPreview || formData.photo) ? (
                                   <img 
                                     src={localPhotoPreview || resolvePhotoUrl(formData.photo)} 
                                     alt="Faculty" 
                                     className="w-full h-full object-cover"
                                     onError={(e) => {
                                       e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`;
                                     }}
                                   />
                                 ) : (
                                   <div className="flex flex-col items-center gap-3 text-slate-300">
                                     <div className="p-4 bg-slate-100 rounded-2xl">
                                        <UserCircle size={36} className="opacity-20" />
                                     </div>
                                     <span className="text-[10px] font-black tracking-widest">NO IMAGE</span>
                                   </div>
                                 )}

                                 <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[2px]">
                                    <div className="p-2 bg-white/20 rounded-full">
                                      <Camera size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                                 </div>
                              </div>
                              
                              {(localPhotoPreview || formData.photo) && (
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                   <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold max-w-[150px] text-center leading-relaxed">
                              Click frame to select or update professional photograph.
                            </p>
                          </div>

                          {/* Right: Primary Bio */}
                          <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className={cn("text-[10px] font-black uppercase tracking-[0.2em] ml-1", formErrors.firstName ? "text-red-500" : "text-slate-400")}>First Name {formErrors.firstName && "*"}</Label>
                                <Input 
                                  ref={el => { inputRefs.current["firstName"] = el; }}
                                  value={formData.firstName} 
                                  onChange={e => {
                                    setFormData({...formData, firstName: e.target.value});
                                    if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: false }));
                                  }} 
                                  placeholder="Robert" 
                                  className={cn(
                                    "h-12 border-slate-100 bg-slate-50/50 font-black rounded-2xl px-5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300",
                                    formErrors.firstName && "border-red-500 ring-2 ring-red-500/10"
                                  )}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Middle Name</Label>
                                <Input value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} placeholder="Optional" className="h-12 border-slate-100 bg-slate-50/50 font-black rounded-2xl px-5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300" />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label className={cn("text-[10px] font-black uppercase tracking-[0.2em] ml-1", formErrors.lastName ? "text-red-500" : "text-slate-400")}>Last Name {formErrors.lastName && "*"}</Label>
                                <Input 
                                  ref={el => { inputRefs.current["lastName"] = el; }}
                                  value={formData.lastName} 
                                  onChange={e => {
                                    setFormData({...formData, lastName: e.target.value});
                                    if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: false }));
                                  }} 
                                  placeholder="Smith" 
                                  className={cn(
                                    "h-12 border-slate-100 bg-slate-50/50 font-black rounded-2xl px-5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300",
                                    formErrors.lastName && "border-red-500 ring-2 ring-red-500/10"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium text-center leading-relaxed px-2">
                          Click frame to select or update professional photograph.
                        </p>
                      </div>

                      {/* Right: Primary Bio */}
                      <div className="md:col-span-8 space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">First Name required</Label>
                            <div className="relative">
                              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                              <Input 
                                ref={el => { inputRefs.current["firstName"] = el; }}
                                value={formData.firstName} 
                                onChange={e => {
                                  setFormData({...formData, firstName: e.target.value});
                                  if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: "" }));
                                }} 
                                placeholder="Robert" 
                                className={cn(
                                  "h-14 pl-12 border-2 bg-white font-bold rounded-2xl text-sm transition-all placeholder:text-slate-500 shadow-sm text-slate-950 focus:outline-none focus:ring-offset-0",
                                  formErrors.firstName ? "border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                                )}
                              />
                            </div>
                            {formErrors.firstName && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.firstName}</p>}
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Middle Name</Label>
                            <div className="relative">
                              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                              <Input 
                                ref={el => { inputRefs.current["middleName"] = el; }}
                                value={formData.middleName} 
                                onChange={e => setFormData({...formData, middleName: e.target.value})} 
                                placeholder="Optional" 
                                className="h-14 pl-12 border-2 border-slate-200 bg-white font-bold rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-500 shadow-sm text-slate-950" 
                              />
                            </div>
                          </div>
                        </div>
                          <div className="space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Last Name required</Label>
                            <div className="relative">
                              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                              <Input 
                                ref={el => { inputRefs.current["lastName"] = el; }}
                                value={formData.lastName} 
                                onChange={e => {
                                  setFormData({...formData, lastName: e.target.value});
                                  if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: "" }));
                                }} 
                                placeholder="Smith" 
                                className={cn(
                                  "h-14 pl-12 border-2 bg-white font-bold rounded-2xl text-sm transition-all placeholder:text-slate-500 shadow-sm text-slate-950 focus:outline-none focus:ring-offset-0",
                                  formErrors.lastName ? "border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                                )}
                              />
                            </div>
                            {formErrors.lastName && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.lastName}</p>}
                          </div>
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <section>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 h-6 bg-[#4f46e5] rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Connectability</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Email Protocol required</Label>
                          <Input 
                            ref={el => { inputRefs.current["email"] = el; }}
                            type="email" 
                            value={formData.email} 
                            onChange={e => {
                              setFormData({...formData, email: e.target.value});
                              if (formErrors.email) setFormErrors(prev => ({ ...prev, email: "" }));
                            }} 
                            placeholder="faculty@college.edu" 
                            className={cn(
                              "h-14 border-2 bg-white font-bold rounded-2xl text-sm transition-all shadow-sm placeholder:text-slate-500 text-slate-950 focus:outline-none focus:ring-offset-0",
                              formErrors.email ? "border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                            )}
                          />
                          {formErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.email}</p>}
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Direct Line required</Label>
                          <Input 
                            ref={el => { inputRefs.current["phone"] = el; }}
                            value={formData.phone} 
                            maxLength={10}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setFormData({...formData, phone: val});
                              if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: "" }));
                            }} 
                            placeholder="10-digit mobile" 
                            className={cn(
                              "h-14 border-2 bg-white font-bold rounded-2xl text-sm transition-all shadow-sm placeholder:text-slate-500 text-slate-950 focus:outline-none focus:ring-offset-0",
                              formErrors.phone ? "border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                            )}
                          />
                          {formErrors.phone && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.phone}</p>}
                        </div>
                      </div>
                          <Input 
                            ref={el => { inputRefs.current["subject"] = el; }}
                            value={formData.subject} 
                            onChange={e => {
                              setFormData({...formData, subject: e.target.value});
                              if (formErrors.subject) setFormErrors(prev => ({ ...prev, subject: false }));
                            }} 
                            placeholder="Mathematics" 
                            className={cn(
                              "h-12 border-slate-100 bg-white font-black rounded-[1.25rem] px-5 text-sm focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:italic",
                              formErrors.subject && "border-red-500 ring-2 ring-red-500/10"
                            )}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Tenure (Years)</Label>
                          <Input 
                            ref={el => { inputRefs.current["experience"] = el; }}
                            value={formData.experience} 
                            onChange={e => {
                               setFormData({...formData, experience: e.target.value});
                               if (formErrors.experience) setFormErrors(prev => ({ ...prev, experience: "" }));
                            }} 
                            placeholder="5 Years" 
                            className={cn(
                              "h-14 border-2 bg-white font-bold rounded-2xl text-sm transition-all shadow-sm placeholder:text-slate-500 text-slate-950 focus:outline-none focus:ring-offset-0",
                              formErrors.experience ? "border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                            )}
                          />
                        </div>
                      </div>
                    </section>
                  </div>

                  <section className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/80 shadow-inner">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-1 h-6 bg-[#4f46e5] rounded-full"></div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Departmental Payload</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Primary Domain required</Label>
                        <Input 
                          ref={el => { inputRefs.current["subject"] = el; }}
                          value={formData.subject} 
                          onChange={e => {
                            setFormData({...formData, subject: e.target.value});
                            if (formErrors.subject) setFormErrors(prev => ({ ...prev, subject: "" }));
                          }} 
                          placeholder="Mathematics" 
                          className={cn(
                            "h-14 border-2 bg-white font-bold rounded-2xl text-sm transition-all shadow-sm placeholder:text-slate-500 text-slate-950 focus:outline-none focus:ring-offset-0",
                            formErrors.subject ? "border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                          )}
                        />
                        {formErrors.subject && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.subject}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Assigned Grade</Label>
                        <Input 
                          ref={el => { inputRefs.current["standard"] = el; }}
                          value={formData.standard} 
                          onChange={e => {
                            setFormData({...formData, standard: e.target.value});
                            if (formErrors.standard) setFormErrors(prev => ({ ...prev, standard: "" }));
                          }} 
                          placeholder="10th" 
                          className={cn(
                            "h-14 border-2 bg-white font-bold rounded-2xl text-sm transition-all shadow-sm placeholder:text-slate-500 text-slate-950 focus:outline-none focus:ring-offset-0",
                            formErrors.standard ? "border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                          )}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Access Status required</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={v => {
                            setFormData({...formData, status: v});
                            if (formErrors.status) setFormErrors(prev => ({ ...prev, status: "" }));
                          }}
                        >
                          <SelectTrigger 
                            ref={el => { inputRefs.current["status"] = el; }}
                            className={cn(
                              "relative h-[68px] min-h-[68px] border-2 bg-gradient-to-b from-white to-slate-50/90 font-bold rounded-2xl pl-16 pr-5 text-[15px] transition-all duration-300 shadow-sm hover:shadow-lg text-slate-800 focus:outline-none focus:ring-offset-0",
                              formErrors.status ? "border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                            )}
                          >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 shadow-sm transition-transform group-hover:scale-105">
                              {formData.status === "Active" ? <BadgeCheck className="w-5 h-5 text-emerald-600" /> : 
                               formData.status === "On Leave" ? <Clock3 className="w-5 h-5 text-amber-600" /> :
                               formData.status === "Resigned" ? <UserMinus className="w-5 h-5 text-rose-600" /> :
                               <ShieldCheck className="w-5 h-5 text-indigo-600" />}
                            </div>
                            <div className="flex flex-col text-left leading-tight ml-2">
                              <SelectValue placeholder="Select Access Status">
                                {(formData.status && formData.status !== "none") ? (
                                  <div className="flex flex-col">
                                    <span className="text-[13px] font-extrabold">{formData.status}</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                      {formData.status === "Active" ? "Currently Working" : 
                                       formData.status === "On Leave" ? "Temporary Break" : "No Longer Active"}
                                    </span>
                                  </div>
                                ) : <span className="text-slate-400 font-medium">Select Access Status</span>}
                              </SelectValue>
                            </div>
                          </SelectTrigger>
                          <SelectContent className="rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.15)] p-2 bg-white/95 backdrop-blur-xl min-w-[280px]">
                            <div className="px-4 py-4 mb-1">
                              {/* <span className="text-[13px] font-bold italic text-slate-400">Select Access Status</span> */}
                            </div>
                            <SelectItem value="none" className="group rounded-[1.5rem] py-4 px-3 cursor-pointer data-[state=selected]:bg-slate-50 focus:bg-slate-50 transition-all duration-200 mb-1">
                              <div className="flex items-center h-11 pl-[60px]">
                                <span className="text-[14px] font-medium text-slate-400 italic">Select Access Status</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Active" className="group rounded-[1.5rem] py-4 px-3 cursor-pointer data-[state=selected]:bg-emerald-50 focus:bg-emerald-50/80 focus:text-emerald-700 transition-all duration-200 mb-1">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
                                  <BadgeCheck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight">Active</span>
                                  <span className="text-[10px] uppercase tracking-widest text-emerald-600/40 font-black mt-0.5">CURRENTLY WORKING</span>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="On Leave" className="group rounded-[1.5rem] py-4 px-3 cursor-pointer data-[state=selected]:bg-amber-50 focus:bg-amber-50/80 focus:text-amber-700 transition-all duration-200 mb-1">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
                                  <Clock3 className="w-5 h-5 text-amber-600" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight">On Leave</span>
                                  <span className="text-[10px] uppercase tracking-widest text-amber-600/40 font-black mt-0.5">TEMPORARY BREAK</span>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="Resigned" className="group rounded-[1.5rem] py-4 px-3 cursor-pointer data-[state=selected]:bg-rose-50 focus:bg-rose-50/80 focus:text-rose-700 transition-all duration-200">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
                                  <UserMinus className="w-5 h-5 text-rose-600" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight">Resigned</span>
                                  <span className="text-[10px] uppercase tracking-widest text-rose-600/40 font-black mt-0.5">NO LONGER ACTIVE</span>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.status && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.status}</p>}
                      </div>
                    </div>
                  </section>
                </div>

                <DialogFooter className="bg-slate-50 px-10 py-6 shrink-0 border-t border-slate-100 flex flex-row items-center justify-end gap-4">
                  <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="h-11 px-8 font-black text-slate-400 hover:text-slate-900 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all">
                    Dismiss
                  </Button>
                  <Button 
                    onClick={handleCreateOrUpdate} 
                    className="h-12 px-10 bg-slate-900 hover:bg-blue-600 text-white font-black shadow-2xl shadow-slate-200/50 rounded-2xl transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.2em] border-none"
                  >
                    {isEditing ? "Apply Updates" : "Commit Record"}
                  </Button>
                </DialogFooter>
              </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="dashboard-card border-none overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative group flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <Input 
                placeholder="Query faculty index..." 
                className="pl-12 h-12 bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold rounded-2xl"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-slate-100 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest">
                  <Download size={16} className="mr-2" /> Export
                </Button>
                <div className="h-6 w-px bg-slate-100 mx-2" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Total Records: {Array.isArray(filteredTeachers) ? filteredTeachers.length : 0}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="flex flex-col items-center justify-center p-24 gap-4 animate-pulse">
               <div className="p-4 bg-slate-50 rounded-full">
                  <Loader2 size={32} className="animate-spin text-blue-600" />
               </div>
               <p className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Syncing cloud data...</p>
             </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="h-16 border-slate-50">
                  <TableHead className="w-[140px] pl-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer group" onClick={() => handleSort('employeeId')}>
                    <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                      Index ID 
                      {sortBy === 'employeeId' ? (sortOrder === "asc" ? <ChevronUp size={14} className="opacity-100 text-blue-600" /> : <ChevronDown size={14} className="opacity-100 text-blue-600" />) : <ChevronDown size={14} className="transition-all opacity-0 group-hover:opacity-100" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer group" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                      Faculty Entity 
                      {sortBy === 'name' ? (sortOrder === "asc" ? <ChevronUp size={14} className="opacity-100 text-blue-600" /> : <ChevronDown size={14} className="opacity-100 text-blue-600" />) : <ChevronDown size={14} className="transition-all opacity-0 group-hover:opacity-100" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer group" onClick={() => handleSort('subject')}>
                    <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                      Core Expertise 
                      {sortBy === 'subject' ? (sortOrder === "asc" ? <ChevronUp size={14} className="opacity-100 text-blue-600" /> : <ChevronDown size={14} className="opacity-100 text-blue-600" />) : <ChevronDown size={14} className="transition-all opacity-0 group-hover:opacity-100" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer group" onClick={() => handleSort('qualification')}>
                    <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                      Credentials 
                      {sortBy === 'qualification' ? (sortOrder === "asc" ? <ChevronUp size={14} className="opacity-100 text-blue-600" /> : <ChevronDown size={14} className="opacity-100 text-blue-600" />) : <ChevronDown size={14} className="transition-all opacity-0 group-hover:opacity-100" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Status</TableHead>
                  <TableHead className="text-right pr-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!Array.isArray(filteredTeachers) || filteredTeachers.length === 0) ? (
                  <TableRow>
                     <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                           <div className="p-6 bg-slate-50 rounded-full text-slate-200">
                             <Users size={48} />
                           </div>
                           <p className="text-lg font-black text-slate-300 italic tracking-tight uppercase">No Faculty Matches Found</p>
                        </div>
                     </TableCell>
                  </TableRow>
                ) : (
                  Array.isArray(filteredTeachers) && filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50/80 h-20">
                    <TableCell className="pl-8">
                       <span className="font-mono text-[11px] font-black text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100/50 italic tracking-tighter">
                        {teacher.employeeId || teacher.id}
                       </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <Avatar className="h-11 w-11 ring-4 ring-white shadow-lg shadow-slate-200 transition-transform group-hover:scale-105">
                            <AvatarImage src={resolvePhotoUrl(teacher.photo)} />
                            <AvatarFallback className="bg-indigo-600 text-white font-black uppercase text-sm">
                              {(teacher.name || "U")[0]}
                            </AvatarFallback>
                          </Avatar>
                          <SimpleTooltip content="Update photo" side="top">
                            <button 
                              onClick={() => triggerPhotoUpload(teacher.id)}
                              className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-slate-100 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                              aria-label="Change teacher photo"
                            >
                              <Camera size={10} className="text-blue-600" />
                            </button>
                          </SimpleTooltip>
                        </div>
                        <div className="flex flex-col truncate max-w-[180px]">
                          <span className="font-black text-slate-900 leading-none text-sm tracking-tight mb-1">{teacher.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold italic truncate">{teacher.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-slate-100/80 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                        {teacher.subject}
                      </span>
                    </TableCell>
                    <TableCell className="text-[11px] font-black text-slate-400 italic tracking-tight overflow-hidden text-ellipsis max-w-[150px] whitespace-nowrap">
                        {teacher.qualification}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-lg border-transparent",
                        teacher.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                      )} variant="outline">
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <DropdownMenu>
                         <SimpleTooltip content="System Controls" side="left">
                            <DropdownMenuTrigger
                              render={
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer outline-none active:scale-90">
                                  <MoreHorizontal size={18} />
                                </div>
                              }
                            />
                         </SimpleTooltip>
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-2xl p-2 min-w-[220px] animate-in slide-in-from-top-2">
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="gap-4 py-3 px-4 rounded-xl cursor-pointer focus:bg-indigo-50 group/item" onClick={() => {
                              setSelectedTeacher(teacher);
                              setIsEditing(true);
                              const names = (teacher.name || "").split(' ');
                              // Populate all required master properties, including standard/section/experience details and exact school branches
                              setFormData({
                                firstName: names[0],
                                lastName: names.slice(-1)[0],
                                middleName: names.length > 2 ? names.slice(1, -1).join(' ') : "",
                                email: teacher.email,
                                phone: teacher.phone,
                                qualification: teacher.qualification,
                                experience: teacher.experience,
                                subject: teacher.subject,
                                standard: teacher.standard,
                                section: teacher.section,
                                status: teacher.status,
                                schoolId: teacher.schoolId || user.schoolId || "",
                                photo: teacher.photo || ""
                              });
                              setIsAddDialogOpen(true);
                            }}>
                              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                                <Edit size={16} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-black text-slate-800 text-xs uppercase tracking-widest">Modify Master</span>
                                 <span className="text-[9px] text-slate-400 font-bold uppercase italic">Update qualifications</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-4 py-3 px-4 rounded-xl cursor-pointer focus:bg-blue-50 group/photo" onClick={() => triggerPhotoUpload(teacher.id)}>
                              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover/photo:bg-blue-600 group-hover/photo:text-white transition-colors">
                                <Plus size={16} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-black text-slate-800 text-xs uppercase tracking-widest">Update Photo</span>
                                 <span className="text-[9px] text-slate-400 font-bold uppercase italic">Upload official identity portrait</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-4 py-3 px-4 rounded-xl cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 group/del" onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}>
                              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover/del:bg-red-600 group-hover/del:text-white transition-colors">
                                <Trash2 size={16} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-black text-red-600 text-xs uppercase tracking-widest">Purge Profile</span>
                                 <span className="text-[9px] text-red-400 font-bold uppercase italic">Permanent removal</span>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                 ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination Footer */}
          {!loading && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-slate-100 gap-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest text-[10px]">
                Showing <span className="text-slate-900 font-black">{teachers.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to <span className="text-slate-900 font-black">{Math.min(page * pageSize, totalCount)}</span> of <span className="text-slate-900 font-black">{totalCount}</span> entries
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows per page</span>
                  <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setPage(1); }}>
                    <SelectTrigger className="w-[70px] h-8 bg-white border-slate-200 rounded-lg text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      {[10, 25, 50, 100].map(size => (
                        <SelectItem key={size} value={size.toString()} className="text-xs font-bold">{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 disabled:opacity-30"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <ChevronsLeft size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 disabled:opacity-30"
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={14} />
                  </Button>

                  <div className="flex items-center px-3 h-8 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-900 mx-1">
                    Page {page} of {totalPages || 1}
                  </div>

                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 disabled:opacity-30"
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 disabled:opacity-30"
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                  >
                    <ChevronsRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

