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
  X,
  Check,
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
  Loader2,
  User,
  BadgeCheck,
  Clock3,
  UserMinus,
  ShieldCheck,
  Save,
  Building2,
  School2,
  BriefcaseBusiness,
  FileText,
  UserRound,
  Mars,
  Venus,
  Droplets,
  ArrowUpRight
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
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
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
    schoolId: (user.schoolId && user.schoolId !== "all") ? user.schoolId.toString() : "",
    employeeId: "",
    employeeType: "Full Time",
    gender: "Male",
    dob: "",
    joiningDate: new Date().toISOString().split('T')[0],
    address: "",
    RFID: "",
    RFID2: "",
    bloodGroup: "O+",
    photo: ""
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
      schoolId: (user.schoolId && user.schoolId !== "all") ? user.schoolId.toString() : "",
      employeeId: "",
      employeeType: "Full Time",
      gender: "Male",
      dob: "",
      joiningDate: new Date().toISOString().split('T')[0],
      address: "",
      RFID: "",
      RFID2: "",
      bloodGroup: "O+",
      photo: ""
    });
    setSelectedTeacher(null);
    setIsEditing(false);
    setFormErrors({});
  };
  const handleCreateOrUpdate = async () => {
    const newErrors: Record<string, any> = {};
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
    checkField("email", !formData.email?.trim() || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email), "Valid Email Protocol required");
    checkField("phone", !formData.phone?.trim() || !/^\d{10}$/.test(formData.phone), "10-digit Direct Line required");
    checkField("qualification", !formData.qualification?.trim(), "Education Deck required");
    checkField("subject", !formData.subject?.trim(), "Primary Domain required");
    checkField("status", !formData.status || formData.status === "none", "Access Status required");
    checkField("experience", !formData.experience?.trim(), "Professional Texture required");
    checkField("standard", !formData.standard?.trim(), "Assigned Grade required");
    checkField("joiningDate", !formData.joiningDate, "Year required");
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
        employeeId: formData.employeeId || (isEditing ? selectedTeacher?.employeeId : `EMP-${Date.now()}`),
        employeeType: formData.employeeType,
        designation: "Faculty",
        department: formData.subject,
        qualification: formData.qualification,
        status: formData.status,
        contactNumber: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        joiningDate: formData.joiningDate,
        experience: formData.experience,
        address: formData.address,
        RFID: formData.RFID,
        RFID2: formData.RFID2,
        bloodGroup: formData.bloodGroup,
        standardId: formData.standard,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-7">
        <div className="flex items-center gap-5">
           <div className="bg-[#5a67f2] p-4 rounded-[1.25rem] text-white shadow-2xl shadow-[#5a67f2]/20 transition-transform hover:-rotate-3">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight truncate">Faculty Management</h1>
            <p className="text-slate-600 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">Administrative control for teaching staff & assignments</p>
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
            <DialogContent className="sm:max-w-[850px] w-[95vw] max-h-[90vh] flex flex-col p-0 border-none shadow-3xl rounded-[2.5rem] overflow-hidden bg-white">
                <div className="bg-[#0f172a] p-5 sm:p-6 sm:px-10 text-white relative shrink-0">
                  <div className="relative z-10 flex items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="p-3 sm:p-4 bg-[#5a67f2] rounded-xl sm:rounded-2xl shadow-xl shadow-[#5a67f2]/40 transition-transform">
                        <UserPlus className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-none">Onboard Faculty</h2>
                        <p className="text-slate-400 text-[11px] sm:text-[14px] mt-1 sm:mt-2 font-semibold sm:font-black sm:uppercase tracking-wide sm:tracking-[0.1em] opacity-80 leading-tight">
                          Enter credentials and department assignments for new staff.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="w-8 h-8 sm:w-10 sm:h-10 ml-2 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
                    >
                      <X className="w-[18px] h-[18px] sm:w-[24px] sm:h-[24px] stroke-[2.5]" />
                    </button>
                  </div>
                  <div className="absolute right-[-10%] top-[-20%] w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                </div>
              
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-10 py-6 sm:py-8 bg-white custom-scrollbar">
                  <div className="max-w-4xl mx-auto space-y-10">
                    <section>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-1.5 h-7 bg-[#5a67f2] rounded-full"></div>
                        <div className="flex items-center gap-3">
                          <BookOpen size={18} className="text-[#5a67f2] stroke-[3]" />
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">Institutional Context</h3>
                        </div>
                      </div>
                      
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-12 space-y-2">
                          
                                                      <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                        Campus Branch
                                                      </Label>
                           <Select 
  value={formData.schoolId.toString()} 
  onValueChange={(v) => {
    setFormData({...formData, schoolId: v});
    if (formErrors.schoolId) {
      setFormErrors(prev => ({ ...prev, schoolId: false }));
    }
  }}
  disabled={user.role !== "superadmin" && !!user.schoolId}
>
  <SelectTrigger 
    ref={el => { inputRefs.current["schoolId"] = el; }}
    className={cn(
      "relative h-[72px] min-h-[72px] border-2 rounded-[22px] pl-16 pr-5",
      "bg-gradient-to-b from-white to-slate-50/80",
      "font-bold text-slate-800 text-[14px]",
      "shadow-sm hover:shadow-xl transition-all duration-300",
      "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500",
      "data-[state=open]:border-blue-500 data-[state=open]:shadow-xl",
      formErrors.schoolId
        ? "border-red-500/60 ring-4 ring-red-500/10 bg-red-50/30"
        : "border-slate-200",
      (user.role !== "superadmin" && !!user.schoolId) &&
        "opacity-80 cursor-not-allowed bg-slate-100"
    )}
  >
    <div className="flex items-center justify-between w-full">

      {/* Left Section */}
      <div className="flex items-center gap-4 min-w-0">

        {/* Icon */}
        <div
          className={cn(
            "absolute left-4 flex items-center justify-center",
            "w-10 h-10 rounded-2xl shadow-sm border transition-all duration-300",
            formErrors.schoolId
              ? "bg-red-100 border-red-200 text-red-600"
              : "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200 text-blue-700"
          )}
        >
          <School2 size={20} className="stroke-[2.4]" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-start leading-tight truncate">


          <div className="text-[14px] font-extrabold text-slate-800 truncate">
            <SelectValue placeholder="Select Campus Branch">
              {formData.schoolId && formData.schoolId !== "all" ? (schools.find(s => s.id.toString() === formData.schoolId.toString())?.name || formData.schoolId) : "Select Campus Branch"}
            </SelectValue>
          </div>
        </div>
      </div>

   
    </div>
  </SelectTrigger>

  <SelectContent className="min-w-[450px] max-h-80 rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl">

    {/* Default Item */}
    <SelectItem 
      value=""
      className="group rounded-2xl py-4 px-4 cursor-pointer focus:bg-slate-50 transition-all mb-1"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-slate-500" />
        </div>

        <div className="flex flex-col">
          <span className="text-[13px] font-black text-slate-500 italic">
            Select Campus Branch
          </span>

          <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400">
            School Selection
          </span>
        </div>
      </div>
    </SelectItem>

    {/* Schools */}
    {Array.isArray(schools) && schools.length > 0 ? (
      schools.map((s) => (
        <SelectItem
          key={s.id}
          value={s.id.toString()}
          className="group rounded-2xl py-4 px-4 cursor-pointer focus:bg-blue-50 transition-all"
        >
          <div className="flex items-center gap-4">

            {/* Icon */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm border border-blue-200">
              <GraduationCap className="w-5 h-5 text-blue-700" />
            </div>

            {/* Content */}
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[14px] font-extrabold text-slate-800 truncate">
                {s.name}
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 truncate">
                ID: SCH-{s.id} • {s.address?.split(",")[0]}
              </span>
            </div>
          </div>
        </SelectItem>
      ))
    ) : (
      <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-6 h-6 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>

        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">
            Syncing Branches
          </span>

          <span className="text-[11px] font-semibold text-slate-400">
            Please wait while campuses load
          </span>
        </div>
      </div>
    )}
  </SelectContent>
</Select>
                            {formErrors.schoolId && <p className="text-[11px] font-bold text-red-500 ml-1 mt-2 tracking-wide">{formErrors.schoolId}</p>}
                          </div>
                        </div>                        <div className="flex flex-col md:flex-row gap-8 mt-8">
                          {/* Left: Identity Image */}                         <div className="flex flex-col items-start gap-4">
      
                             <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                     Faculty Identity Photo
                                                      </Label>
                            <div 
                              className="relative group cursor-pointer w-full"
                              onClick={() => triggerPhotoUpload(isEditing ? selectedTeacher?.id!.toString() : "new")}
                            >
                              <div className="w-[260px] h-[260px] rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-white flex items-center justify-center transition-all group-hover:border-blue-400 group-hover:bg-blue-50/10">
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
                                    <div className="flex flex-col items-center gap-4 text-slate-300">
                                      <div className="relative">
                                        <div className="p-6 bg-slate-100 rounded-full">
                                           <Camera size={40} className="text-slate-400 opacity-60" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                           <Plus size={16} className="text-white stroke-[3]" />
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Upload Photo</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center px-10">JPG, PNG (Max. 2MB)</span>
                                      </div>
                                    </div>
                                 )}
 
                                 <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[4px]">
                                    <div className="p-3 bg-white/20 rounded-full">
                                      <Camera size={28} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Update Photograph</span>
                                 </div>
                              </div>
                            </div>
                          </div>


                      {/* Right: Primary Bio */}
                      <div className="md:col-span-8 space-y-6">

                         <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-4">
                             {/* <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">First Name</Label> */}
                              <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                        First Name
                                                      </Label>
                             <div className="relative group">
                               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                 <User size={20} className="stroke-[2.5]" />
                               </div>
                               <Input 
                                 ref={el => { inputRefs.current["firstName"] = el; }}
                                 value={formData.firstName} 
                                 onChange={e => {
                                   setFormData({...formData, firstName: e.target.value});
                                   if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: "" }));
                                 }} 
                                 placeholder="Robert" 
                                 className={cn(
                                   "h-16 pl-14 border-2 bg-slate-50/30 font-bold rounded-2xl text-[15px] transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-offset-0",
                                   formErrors.firstName ? "border-red-500 ring-4 ring-red-500/5 bg-red-50/5" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
                                 )}
                               />
                             </div>
                             {formErrors.firstName && <p className="text-[11px] font-bold text-red-500 ml-1 tracking-wide">{formErrors.firstName}</p>}
                           </div>
                           <div className="space-y-4">

                              <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                        Middle Name
                                                      </Label>
                             <div className="relative group">
                               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                 <User size={20} className="stroke-[2.5]" />
                               </div>
                               <Input 
                                 ref={el => { inputRefs.current["middleName"] = el; }}
                                 value={formData.middleName} 
                                 onChange={e => setFormData({...formData, middleName: e.target.value})} 
                                 placeholder="Optional" 
                                 className="h-16 pl-14 border-2 border-slate-200 bg-slate-50/30 font-bold rounded-2xl text-[15px] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-none text-slate-900" 
                               />
                             </div>
                           </div>
                         </div>
                           <div className="space-y-4">

                              <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                        Last Name
                                                      </Label>
                             <div className="relative group">
                               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                 <User size={20} className="stroke-[2.5]" />
                               </div>
                               <Input 
                                 ref={el => { inputRefs.current["lastName"] = el; }}
                                 value={formData.lastName} 
                                 onChange={e => {
                                   setFormData({...formData, lastName: e.target.value});
                                   if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: "" }));
                                 }} 
                                 placeholder="Smith" 
                                 className={cn(
                                   "h-16 pl-14 border-2 bg-slate-50/30 font-bold rounded-2xl text-[15px] transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-offset-0",
                                   formErrors.lastName ? "border-red-500 ring-4 ring-red-500/5 bg-red-50/5" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
                                 )}
                               />
                             </div>
                             {formErrors.lastName && <p className="text-[11px] font-bold text-red-500 ml-1 tracking-wide">{formErrors.lastName}</p>}
                           </div>
                      </div>
                    </div>
                  </section>

                <div className="space-y-10">

  {/* CONNECTABILITY SECTION */}
  <section className="relative overflow-hidden rounded-[2.8rem] border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">

    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-100/40 blur-3xl rounded-full"></div>

    {/* HEADER */}
    <div className="relative flex items-center gap-5 mb-10">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 shadow-sm">
        <Phone size={24} className="text-indigo-700 stroke-[2.5]" />
      </div>

      <div>
     
                  <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                         Connectability
                                                      </Label>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 mt-1">
          Faculty communication credentials
        </p>
      </div>
    </div>

    {/* FIELDS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* EMAIL */}
      <div className="space-y-4">
       
           <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                   Email Protocol
                                                      </Label>

        <div className="relative group">
         
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                  <Mail size={20} className="stroke-[2.5]" />
                               </div>

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
              "h-16 pl-14 border-2 bg-slate-50/30 font-bold rounded-2xl text-[15px] transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-offset-0",
              formErrors.email
                ? "border-red-500 ring-4 ring-red-500/5 bg-red-50/20"
                : "border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-indigo-200"
            )}
          />
        </div>

        {formErrors.email && (
          <p className="text-[11px] font-bold text-red-500 ml-1 tracking-wide">
            {formErrors.email}
          </p>
        )}
      </div>

      {/* PHONE */}
      <div className="space-y-4">
       
         <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                     Direct Line
                                                      </Label>

        <div className="relative group">
         
               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                   <Phone size={19} className=" stroke-[2.5]" />
                               </div>
          

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
              "h-16 pl-14 border-2 bg-slate-50/30 font-bold rounded-2xl text-[15px] transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-offset-0",
              formErrors.phone
                ? "border-red-500 ring-4 ring-red-500/5 bg-red-50/20"
                : "border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-indigo-200"
            )}
          />
        </div>

        {formErrors.phone && (
          <p className="text-[11px] font-bold text-red-500 ml-1 tracking-wide">
            {formErrors.phone}
          </p>
        )}
      </div>
    </div>
  </section>

  {/* DEPARTMENT SECTION */}
  <section className="relative overflow-hidden rounded-[2.8rem] border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">

    {/* Background Glow */}
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/40 blur-3xl rounded-full"></div>

    {/* HEADER */}
    <div className="relative flex items-center gap-5 mb-10">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 shadow-sm">
        <GraduationCap size={24} className="text-indigo-700 stroke-[2.5]" />
      </div>

      <div>
       

        <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                     Departmental Payload
                                                      </Label>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 mt-1">
          Academic & operational configuration
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* SUBJECT */}
      <div className="space-y-4">
      

             <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                    Primary Domain
                                                      </Label>

        <div className="relative group">
       
           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                  <BookOpen size={20} className="stroke-[2.5]" />
                               </div>

          <Input
            ref={el => { inputRefs.current["subject"] = el; }}
            value={formData.subject}
            onChange={e => {
              setFormData({...formData, subject: e.target.value});
              if (formErrors.subject) setFormErrors(prev => ({ ...prev, subject: "" }));
            }}
            placeholder="e.g. Mathematics"
            className={cn(
"h-16 pl-14 border-2 bg-slate-50/30 font-bold rounded-2xl text-[15px] transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-offset-0",
              formErrors.subject
                ? "border-red-500 ring-4 ring-red-500/5 bg-red-50/20"
                : "border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-indigo-200"
            )}
          />
        </div>

        {formErrors.subject && (
          <p className="text-[11px] font-bold text-red-500 ml-1 tracking-wide">
            {formErrors.subject}
          </p>
        )}
      </div>

      {/* STANDARD */}
      <div className="space-y-4">
      
         <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                 Assigned Grade
                                                      </Label>

        <div className="relative group">
        
          
           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                  <GraduationCap size={20} className="stroke-[2.5]" />
                               </div>
          

          <Input
            ref={el => { inputRefs.current["standard"] = el; }}
            value={formData.standard}
            onChange={e => {
              setFormData({...formData, standard: e.target.value});
              if (formErrors.standard) setFormErrors(prev => ({ ...prev, standard: "" }));
            }}
            placeholder="e.g. 10th Standard"
            className={cn(
              "h-16 pl-14 border-2 bg-slate-50/30 font-bold rounded-2xl text-[15px] transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-offset-0",
              formErrors.standard
                ? "border-red-500 ring-4 ring-red-500/5 bg-red-50/20"
                : "border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-indigo-200"
            )}
          />
        </div>
      </div>

      {/* STATUS */}
      <div className="space-y-4 md:col-span-2">
   
            <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                                       Access Status
                                                      </Label>

       <Select
  value={formData.status}
  onValueChange={(v) => {
    setFormData({ ...formData, status: v });
    if (formErrors.status) {
      setFormErrors((prev) => ({ ...prev, status: "" }));
    }
  }}
>
  <SelectTrigger
    className={cn(
      "relative h-16 min-h-[64px] border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5 text-[14px] text-slate-800",
      "shadow-sm hover:shadow-md transition-all duration-300",
      "focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400",
      "data-[state=open]:border-indigo-400 data-[state=open]:shadow-lg",
      formErrors.status && "border-red-500 focus:ring-red-500/10"
    )}
  >
    <div className="flex items-center gap-3 w-full">

      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-100 shadow-sm border border-indigo-200/50">
        {formData.status === "Active" ? (
          <BadgeCheck className="w-4 h-4 text-indigo-600" />
        ) : formData.status === "On Leave" ? (
          <Clock3 className="w-4 h-4 text-indigo-600" />
        ) : formData.status === "Resigned" ? (
          <UserMinus className="w-4 h-4 text-indigo-600" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
        )}
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate flex-1">
     

        <SelectValue placeholder="Select Access Status">
          {formData.status || "Select Access Status"}
        </SelectValue>
      </div>

   
    </div>
  </SelectTrigger>

  <SelectContent className="min-w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">

    {/* Active */}
    <SelectItem
      value="Access status"
      className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-indigo-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
          <BadgeCheck className="w-4 h-4 text-indigo-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-slate-700">
            Access Status
          </span>

        
        </div>
      </div>
    </SelectItem>

    {/* Active */}
    <SelectItem
      value="Active"
      className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-indigo-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
          <BadgeCheck className="w-4 h-4 text-indigo-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-slate-700">
            Active
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Currently Working
          </span>
        </div>
      </div>
    </SelectItem>

    {/* On Leave */}
    <SelectItem
      value="On Leave"
      className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-indigo-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
          <Clock3 className="w-4 h-4 text-indigo-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-slate-700">
            On Leave
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Temporary Break
          </span>
        </div>
      </div>
    </SelectItem>

    {/* Resigned */}
    <SelectItem
      value="Resigned"
      className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-indigo-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
          <UserMinus className="w-4 h-4 text-indigo-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-slate-700">
            Resigned
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            No Longer Active
          </span>
        </div>
      </div>
    </SelectItem>

  </SelectContent>
</Select>
        {formErrors.status && (
          <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">
            {formErrors.status}
          </p>
        )}
      </div>

    </div>
  </section>
  {/* EMPLOYMENT PROTOCOL & BIOMETRICS */}
  <section className="relative overflow-hidden rounded-[2.8rem] border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
    <div className="relative flex items-center gap-5 mb-10">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 shadow-sm">
        <ShieldCheck size={24} className="text-blue-700 stroke-[2.5]" />
      </div>
      <div>

        <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                           Professional Rank
                                                      </Label>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 mt-1">Official credentials & biometric bindings</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

 <div className="space-y-4">

                 <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                            Education Deck
                                                      </Label>
    
        <Input 
          ref={el => { inputRefs.current["qualification"] = el; }}
          value={formData.qualification}
          onChange={e => setFormData({...formData, qualification: e.target.value})}
          placeholder="M.Sc, B.Ed"
          className={cn("h-16 border-2 font-bold rounded-2xl text-[15px]", formErrors.qualification ? "border-red-500 bg-red-50/10" : "border-slate-200")}
        />
        {formErrors.qualification && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.qualification}</p>}
      </div>

      <div className="space-y-4">
    
        
         <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                                          TENURE (YEARS)
                                                      </Label>
        <Input 
          ref={el => { inputRefs.current["employeeId"] = el; }}
          value={formData.employeeId}
          onChange={e => setFormData({...formData, employeeId: e.target.value})}
          placeholder="5 Years"
          className={cn("h-16 border-2 font-bold rounded-2xl text-[15px]", formErrors.employeeId ? "border-red-500 bg-red-50/10" : "border-slate-200")}
        />
        {formErrors.employeeId && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.employeeId}</p>}
      </div>


     

   
     

    </div>
  </section>


</div>
               </div>
             </div>


                <DialogFooter className="bg-white p-6 sm:px-10 sm:py-8 shrink-0 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-6 mt-6 sm:mt-0">
                  <button 
                    onClick={() => setIsAddDialogOpen(false)} 
                    className="w-full sm:w-auto h-12 sm:h-14 px-8 text-slate-500 font-bold hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-xl sm:rounded-[1.25rem] transition-all uppercase tracking-widest text-[11px] sm:text-xs flex justify-center items-center gap-2"
                  >
                    <X size={16} className="stroke-[2.5]" />
                    Dismiss
                  </button>
                  <Button 
                    onClick={handleCreateOrUpdate} 
                    className="w-full sm:w-auto h-12 sm:h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl sm:shadow-2xl sm:shadow-indigo-200 rounded-xl sm:rounded-[1.25rem] transition-all active:scale-[0.98] text-[11px] sm:text-[12px] uppercase tracking-[0.15em] sm:tracking-[0.2em] border-none flex items-center justify-center gap-3"
                  >
                    {isEditing ? <Check size={18} className="stroke-[3]" /> : <Plus size={18} className="stroke-[3]" />}
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

  {/* Left Icon */}
  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200/50 shadow-sm z-10 transition-all duration-300 group-focus-within:scale-105">
    <Search 
      className="text-indigo-600 group-focus-within:text-indigo-700 transition-colors stroke-[2.6]" 
      size={17} 
    />
  </div>

  <Input 
    placeholder="Query faculty index..."
    className={cn(
      "h-[62px] w-full",
      "pl-14 pr-5",
      "bg-gradient-to-b from-white to-slate-50/90",
      "border-2 border-slate-200",
      "rounded-2xl",
      "text-[14px] font-extrabold text-slate-800",
      "placeholder:text-slate-400 placeholder:font-bold",
      "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30px_rgba(99,102,241,0.10)]",
      "focus:bg-white",
      "focus:border-indigo-400",
      "focus:ring-4 focus:ring-indigo-500/10",
      "transition-all duration-300"
    )}
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
  />



</div>
            <div className="flex items-center gap-2">
             <Button
  variant="outline"
  size="sm"
  className={cn(
    "relative h-[58px] px-5",
    "rounded-2xl border-2 border-slate-200",
    "bg-gradient-to-b from-white to-slate-50/90",
    "text-slate-700",
    "font-black text-[11px] uppercase tracking-[0.16em]",
    "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
    "hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)]",
    "hover:border-indigo-300 hover:text-indigo-700",
    "transition-all duration-300",
    "group overflow-hidden"
  )}
>

  {/* Left Icon */}
  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200/50 shadow-sm mr-3 group-hover:scale-105 transition-transform duration-300">
    <Download 
      size={16} 
      className="text-indigo-600 stroke-[2.5]" 
    />
  </div>

  {/* Text */}
  <span className="relative z-10 text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
    Export
  </span>

 

  {/* Hover Glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-50/40 via-transparent to-violet-50/40 pointer-events-none" />

</Button>
                <div className="h-6 w-px bg-slate-100 mx-2" />
                <p className="text-[10px] font-blacktext-slate-600 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">Total Records: {Array.isArray(filteredTeachers) ? filteredTeachers.length : 0}</p>
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
                    <div className="flex text-slate-600 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide items-center gap-2 group-hover:text-blue-600 transition-colors">
                      Index ID 
                      {sortBy === 'employeeId' ? (sortOrder === "asc" ? <ChevronUp size={14} className="opacity-100 text-blue-600" /> : <ChevronDown size={14} className="opacity-100 text-blue-600" />) : <ChevronDown size={14} className="transition-all opacity-0 group-hover:opacity-100" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer group" onClick={() => handleSort('name')}>
                    <div className="flex items-center text-slate-600 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide gap-2 group-hover:text-blue-600 transition-colors">
                      Faculty Entity 
                      {sortBy === 'name' ? (sortOrder === "asc" ? <ChevronUp size={14} className="opacity-100 text-blue-600" /> : <ChevronDown size={14} className="opacity-100 text-blue-600" />) : <ChevronDown size={14} className="transition-all opacity-0 group-hover:opacity-100" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer group" onClick={() => handleSort('subject')}>
                    <div className="flex items-center text-slate-600 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide gap-2 group-hover:text-blue-600 transition-colors">
                      Core Expertise 
                      {sortBy === 'subject' ? (sortOrder === "asc" ? <ChevronUp size={14} className="opacity-100 text-blue-600" /> : <ChevronDown size={14} className="opacity-100 text-blue-600" />) : <ChevronDown size={14} className="transition-all opacity-0 group-hover:opacity-100" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer group" onClick={() => handleSort('qualification')}>
                    <div className="flex items-center text-slate-600 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide gap-2 group-hover:text-blue-600 transition-colors">
                      Credentials 
                      {sortBy === 'qualification' ? (sortOrder === "asc" ? <ChevronUp size={14} className="opacity-100 text-blue-600" /> : <ChevronDown size={14} className="opacity-100 text-blue-600" />) : <ChevronDown size={14} className="transition-all opacity-0 group-hover:opacity-100" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-600 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">Operational Status</TableHead>
                  <TableHead className="text-right pr-8 text-[10px] font-black text-slate-600 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">Manage</TableHead>
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
                           <p className="text-lg font-black text-slate-300  tracking-tight uppercase">No Faculty Matches Found</p>
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
                                employeeId: teacher.employeeId || "",
                                employeeType: (teacher as any).employeeType || "Full Time",
                                gender: (teacher as any).gender || "Male",
                                dob: (teacher as any).dob || "",
                                joiningDate: (teacher as any).joiningDate || new Date().toISOString().split('T')[0],
                                address: (teacher as any).address || "",
                                RFID: (teacher as any).RFID || "",
                                RFID2: (teacher as any).RFID2 || "",
                                bloodGroup: (teacher as any).bloodGroup || "O+",
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

