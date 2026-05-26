import { useState, useEffect, useRef, useCallback } from "react";
import { apiService } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  School,
  Settings,
  ShieldCheck,
  MoreVertical,
  Globe,
  Mail,
  MapPin,
  Loader2,
  Building2,
  Phone,
  FileText,
  ArrowUpDown,
  Edit,
  Trash2,
  Camera,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Import, Download, Camera as CameraIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Navigate } from "react-router-dom";
import { User as UserType } from "@/types";
import { cn, resolvePhotoUrl } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";

export default function Schools({ user }: { user: UserType }) {
  // INTERNAL RBAC CHECK: Secondary layer of protection for superadmin-only page
  if (user.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSchoolId, setUploadingSchoolId] = useState<
    number | "new" | null
  >(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "Active",
    photo: "",
    shortName: "",
    cityId: "",
    stateId: "",
    pincode: "",
    smsLimit: "",
    totalSMSSent: 0,
    smsBalance: 0,
    enableSMS: false,
    enablePresenteeSMS: false,
    automaticBirthdaySMS: false,
    enableWhatsapp: false,
    websiteUrl: "",
    smsSenderID: "",
    busNumbers: "",
    scanIDContact: "",
    scanIDEmail: "",
    inChargeContact: "",
  });

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getSchools({
        page,
        pageSize,
        sortBy,
        sortOrder,
        search: searchQuery,
      });

      const resData = res.data;
      const rawSchoolsList = Array.isArray(resData)
        ? resData
        : resData && Array.isArray(resData.data)
          ? resData.data
          : [];

      const isServerPaged = resData && !!resData.pagination;

      if (!isServerPaged) {
        // Robust client-side filters, search, sorting and pagination
        let filtered = [...rawSchoolsList];

        // Search Filter
        const searchLower = searchQuery.trim().toLowerCase();
        if (searchLower) {
          filtered = filtered.filter(
            (item) =>
              (item.name || "").toLowerCase().includes(searchLower) ||
              (item.address || "").toLowerCase().includes(searchLower) ||
              (item.email || "").toLowerCase().includes(searchLower) ||
              (item.phone || "").toLowerCase().includes(searchLower) ||
              (item.code || "").toLowerCase().includes(searchLower),
          );
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

        // Calculate true registered active count of institutions
        const active = rawSchoolsList.filter(
          (s: any) => s.status === "Active",
        ).length;
        setActiveCount(active);

        const startIndex = (page - 1) * pageSize;
        setSchools(filtered.slice(startIndex, startIndex + pageSize));
      } else {
        // Server-side loaded correctly
        setTotalCount(resData.pagination.totalCount);
        setTotalPages(resData.pagination.totalPages);
        const active = rawSchoolsList.filter(
          (s: any) => s.status === "Active",
        ).length;
        setActiveCount(active);
        setSchools(rawSchoolsList);
      }
    } catch (error) {
      console.error("Schools error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    if (user.role === "superadmin") {
      fetchSchools();
    }
  }, [user.role, fetchSchools]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [statesRes, citiesRes] = await Promise.all([
          apiService.getStates(),
          apiService.getCities(),
        ]);
        const normalize = (res: any) =>
          Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        setStates(normalize(statesRes));
        setCities(normalize(citiesRes));
      } catch (error) {
        console.error("Failed to load states and cities", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (!isAddDialogOpen) {
      setSelectedPhotoFile(null);
      if (localPhotoPreview) {
        URL.revokeObjectURL(localPhotoPreview);
        setLocalPhotoPreview(null);
      }
    }
  }, [isAddDialogOpen]);

  useEffect(() => {
    if (!isEditDialogOpen) {
      setSelectedPhotoFile(null);
      if (localPhotoPreview) {
        URL.revokeObjectURL(localPhotoPreview);
        setLocalPhotoPreview(null);
      }
    }
  }, [isEditDialogOpen]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleEditClick = (school: any) => {
    setCurrentSchool(school);
    setFormData({
      name: school.name || "",
      address: school.address || "",
      phone: school.phone || "",
      email: school.email || "",
      status: school.status || "Active",
      // Map both camelCase and Capitalized server properties to preserve original branding details on form entry
      photo:
        school.profilePhotoPath ||
        school.ProfilePhotoPath ||
        school.photo ||
        "",
      shortName: school.shortName || school.ShortName || "",
      cityId: school.cityId?.toString() || school.CityId?.toString() || "",
      stateId: school.stateId?.toString() || school.StateId?.toString() || "",
      pincode: school.pincode || school.Pincode || "",
      smsLimit:
        school.smsLimit?.toString() || school.SMSLimit?.toString() || "",
      totalSMSSent: school.totalSMSSent || school.TotalSMSSent || 0,
      smsBalance: school.smsBalance || school.SMSBalance || 0,
      enableSMS: !!(school.enableSMS ?? school.EnableSMS ?? false),
      enablePresenteeSMS: !!(
        school.enablePresenteeSMS ??
        school.EnablePresenteeSMS ??
        false
      ),
      automaticBirthdaySMS: !!(
        school.automaticBirthdaySMS ??
        school.AutomaticBirthdaySMS ??
        false
      ),
      enableWhatsapp: !!(
        school.enableWhatsapp ??
        school.EnableWhatsapp ??
        false
      ),
      websiteUrl: school.websiteUrl || school.WebsiteUrl || "",
      smsSenderID: school.smsSenderID || school.SMSSenderID || "",
      busNumbers: school.busNumbers || school.BusNumbers || "",
      scanIDContact:
        school.scanIDContact ||
        school.scaniDContact ||
        school.SCANiDContact ||
        "",
      scanIDEmail:
        school.scanIDEmail || school.scaniDEmail || school.SCANiDEmail || "",
      inChargeContact: school.inChargeContact || school.InChargeContact || "",
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const triggerPhotoUpload = (id: number | "new") => {
    setUploadingSchoolId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadingSchoolId && e.target.files?.[0]) {
      const file = e.target.files[0];

      if (uploadingSchoolId === "new") {
        setSelectedPhotoFile(file);
        setLocalPhotoPreview(URL.createObjectURL(file));
        toast.success(
          "Branding photo selected. It will be uploaded on registration.",
        );
        setUploadingSchoolId(null);
        e.target.value = "";
        return;
      }

      const schoolId = uploadingSchoolId;
      const loadingToast = toast.loading("Updating institutional branding...");
      try {
        const response = await apiService.uploadSchoolPhoto(schoolId, file);
        const newPath = response.data.data?.path || response.data.path;

        // Update both the list and the current form data to reflect change immediately
        setSchools((prev) =>
          prev.map((s) =>
            s.id === schoolId
              ? {
                  ...s,
                  photo: newPath,
                  profilePhotoPath: newPath,
                  ProfilePhotoPath: newPath,
                }
              : s,
          ),
        );
        setFormData((prev) => ({ ...prev, photo: newPath }));

        toast.dismiss(loadingToast);
        toast.success("Institutional photo updated successfully");
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Upload failed:", error);
        toast.error("Failed to upload photo. Please try again.");
      } finally {
        setUploadingSchoolId(null);
      }
    }
    e.target.value = "";
  };

  const handleUpdateSchool = async () => {
    if (!currentSchool) return;

    const newErrors: Record<string, boolean> = {};
    let firstErrorField = "";

    const checkField = (field: string, condition: boolean) => {
      if (condition) {
        newErrors[field] = true;
        if (!firstErrorField) firstErrorField = field;
      }
    };

    checkField("name", !formData.name?.trim());
    checkField("address", !formData.address?.trim());
    // Safe double negation evaluation cast to ensure string | boolean results compile cleanly as booleans
    checkField(
      "phone",
      !!(
        formData.phone && !/^\d{10,12}$/.test(formData.phone.replace(/\D/g, ""))
      ),
    );
    checkField(
      "email",
      !!(formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)),
    );
    checkField(
      "scanIDEmail",
      !!(
        formData.scanIDEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.scanIDEmail)
      ),
    );

    setFormErrors(newErrors);

    if (firstErrorField) {
      toast.error("Please provide valid information.");
      inputRefs.current[firstErrorField]?.focus();
      return;
    }

    setIsProcessing(true);
    try {
      // Audit fields: Ensure ModifiedBy is captured for backend audit logging
      await apiService.updateSchool(currentSchool.id, {
        ...formData,
        // Pass photo path explicitly as profilePhotoPath to prevent backend wiping it out
        profilePhotoPath: formData.photo,
        id: currentSchool.id,
        shortName: formData.shortName || null,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        stateId: formData.stateId ? parseInt(formData.stateId) : null,
        pincode: formData.pincode || null,
        smsLimit: formData.smsLimit ? parseInt(formData.smsLimit) : null,
        totalSMSSent: formData.totalSMSSent
          ? parseInt(formData.totalSMSSent.toString())
          : 0,
        smsBalance: formData.smsBalance
          ? parseInt(formData.smsBalance.toString())
          : 0,
        enableSMS: !!formData.enableSMS,
        enablePresenteeSMS: !!formData.enablePresenteeSMS,
        automaticBirthdaySMS: !!formData.automaticBirthdaySMS,
        enableWhatsapp: !!formData.enableWhatsapp,
        websiteUrl: formData.websiteUrl || null,
        smsSenderID: formData.smsSenderID || null,
        busNumbers: formData.busNumbers || null,
        scanIDContact: formData.scanIDContact || null,
        scanIDEmail: formData.scanIDEmail || null,
        inChargeContact: formData.inChargeContact || null,
        ModifiedBy: user.name || user.email,
      });
      toast.success("School details updated!");
      setIsEditDialogOpen(false);
      fetchSchools();
    } catch (error) {
      toast.error("Failed to update school");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSchool = async (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setIsProcessing(true);
    try {
      await apiService.deleteSchool(deleteId);
      toast.success("School removed successfully");
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      fetchSchools();
    } catch (error) {
      toast.error("Failed to delete school");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateSchool = async () => {
    const newErrors: Record<string, boolean> = {};
    let firstErrorField = "";

    const checkField = (field: string, condition: boolean) => {
      if (condition) {
        newErrors[field] = true;
        if (!firstErrorField) firstErrorField = field;
      }
    };

    checkField("name", !formData.name?.trim());
    checkField("address", !formData.address?.trim());
    // Safe double negation evaluation cast to ensure string | boolean results compile cleanly as booleans
    checkField(
      "phone",
      !!(
        formData.phone && !/^\d{10,12}$/.test(formData.phone.replace(/\D/g, ""))
      ),
    );
    checkField(
      "email",
      !!(formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)),
    );
    checkField(
      "scanIDEmail",
      !!(
        formData.scanIDEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.scanIDEmail)
      ),
    );

    setFormErrors(newErrors);

    if (firstErrorField) {
      toast.error("Institution name and address are mandatory.");
      const element = inputRefs.current[firstErrorField];
      if (element) {
        element.focus();
        if (element.scrollIntoView) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setIsProcessing(true);
    try {
      // Audit fields: Ensure CreatedBy and ModifiedBy are captured for backend audit logging
      const response = await apiService.createSchool({
        ...formData,
        profilePhotoPath: formData.photo,
        shortName: formData.shortName || null,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        stateId: formData.stateId ? parseInt(formData.stateId) : null,
        pincode: formData.pincode || null,
        smsLimit: formData.smsLimit ? parseInt(formData.smsLimit) : null,
        totalSMSSent: formData.totalSMSSent
          ? parseInt(formData.totalSMSSent.toString())
          : 0,
        smsBalance: formData.smsBalance
          ? parseInt(formData.smsBalance.toString())
          : 0,
        enableSMS: !!formData.enableSMS,
        enablePresenteeSMS: !!formData.enablePresenteeSMS,
        automaticBirthdaySMS: !!formData.automaticBirthdaySMS,
        enableWhatsapp: !!formData.enableWhatsapp,
        websiteUrl: formData.websiteUrl || null,
        smsSenderID: formData.smsSenderID || null,
        busNumbers: formData.busNumbers || null,
        scanIDContact: formData.scanIDContact || null,
        scanIDEmail: formData.scanIDEmail || null,
        inChargeContact: formData.inChargeContact || null,
        CreatedBy: user.name || user.email,
        ModifiedBy: user.name || user.email,
      });
      const newSchool = response.data.data || response.data;
      if (selectedPhotoFile && newSchool?.id) {
        try {
          await apiService.uploadSchoolPhoto(newSchool.id, selectedPhotoFile);
        } catch (uploadErr) {
          console.error("Delayed school photo upload failed:", uploadErr);
        }
      }
      toast.success("School registered successfully!");
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        status: "Active",
        photo: "",
        shortName: "",
        cityId: "",
        stateId: "",
        pincode: "",
        smsLimit: "",
        totalSMSSent: 0,
        smsBalance: 0,
        enableSMS: false,
        enablePresenteeSMS: false,
        automaticBirthdaySMS: false,
        enableWhatsapp: false,
        websiteUrl: "",
        smsSenderID: "",
        busNumbers: "",
        scanIDContact: "",
        scanIDEmail: "",
        inChargeContact: "",
      });
      setSelectedPhotoFile(null);
      setLocalPhotoPreview(null);
      fetchSchools();
    } catch (error) {
      toast.error("Failed to register school");
    } finally {
      setIsProcessing(false);
    }
  };

  const sortedSchools = schools;

  const handleExport = () => {
    try {
      const exportData = sortedSchools.map((s: any) => ({
        "School ID": s.id || "",
        "Name": s.name || "",
        "Short Name": s.shortName || s.ShortName || "",
        "Address": s.address || "",
        "Email": s.email || "",
        "Phone": s.phone || s.contactNumber || s.ContactNumber || "",
        "SMS Limit": s.smsLimit || s.SMSLimit || 0,
        "SMS Balance": s.smsBalance || s.SMSBalance || 0,
        "Total Students": s.totalStudents || 0,
        "Status": s.status || "Active"
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, "Schools Registry");

      const wscols = [
        { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 12 }
      ];
      ws['!cols'] = wscols;

      XLSX.writeFile(wb, `Schools_Registry_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Schools registry exported to Excel successfully!");
    } catch (e) {
      console.error("School export error:", e);
      toast.error("Failed to generate Excel export.");
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-blue-600 p-4 rounded-[1.25rem] text-white shadow-2xl shadow-blue-200 transition-transform hover:rotate-3">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Institution Management
            </h1>
            <p className="text-slate-400 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">
              Configure and monitor all registered educational institutions.
            </p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger
            nativeButton={true}
            render={
              <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-6 font-black rounded-xl gap-2 shadow-lg shadow-blue-200 uppercase text-xs tracking-widest">
                <Plus size={18} /> Register New School
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[90vh] flex flex-col p-0 border-none shadow-3xl rounded-[2rem] overflow-hidden">
            <div className="bg-slate-900 px-8 py-5 text-white relative shrink-0">
              <div className="relative z-10 flex items-center justify-between">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-xl shadow-xl shadow-blue-500/20">
                      <School size={22} className="text-white" />
                    </div>
                    Register Institution
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-[12px] mt-1 font-medium max-w-2xl leading-relaxed">
                    Onboard a new educational branch or partner institution to
                    the centralized management system.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-slate-50">
                  {/* Left: Institution Branding */}
                  <div className="flex flex-col items-center gap-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Institutional Logo
                    </Label>
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => triggerPhotoUpload("new")}
                    >
                      <div className="w-44 h-44 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-100 bg-slate-50 flex items-center justify-center transition-all group-hover:shadow-blue-200/50 group-hover:scale-[1.02]">
                        {localPhotoPreview || formData.photo ? (
                          <img
                            src={
                              localPhotoPreview ||
                              resolvePhotoUrl(formData.photo)
                            }
                            alt="School"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${formData.name}`;
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-slate-300">
                            <div className="p-4 bg-slate-100 rounded-2xl">
                              <Building2 size={36} className="opacity-20" />
                            </div>
                            <span className="text-[10px] font-black tracking-widest">
                              NO LOGO
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[2px]">
                          <div className="p-2 bg-white/20 rounded-full">
                            <CameraIcon size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Update Photo
                          </span>
                        </div>
                      </div>

                      {(localPhotoPreview || formData.photo) && (
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold max-w-[150px] text-center leading-relaxed italic">
                      Logo appears on student ID cards & official documents.
                    </p>
                  </div>

                  {/* Right: Institution Details */}
                  <div className="flex-1 space-y-6">
                    <section className="space-y-4">
                      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">
                          Institution Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Official Name *
                          </Label>
                          <Input
                            ref={(el) => {
                              inputRefs.current["name"] = el;
                            }}
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                name: e.target.value,
                              });
                              if (formErrors.name)
                                setFormErrors((prev) => ({
                                  ...prev,
                                  name: false,
                                }));
                            }}
                            placeholder="e.g. St. Xavier's International"
                            className={cn(
                              "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                              formErrors.name &&
                                "border-red-500 ring-2 ring-red-500/10",
                            )}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Short Name / Code
                          </Label>
                          <Input
                            value={formData.shortName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shortName: e.target.value,
                              })
                            }
                            placeholder="e.g. SXIB-01"
                            className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Primary Address *
                        </Label>
                        <Input
                          ref={(el) => {
                            inputRefs.current["address"] = el;
                          }}
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            });
                            if (formErrors.address)
                              setFormErrors((prev) => ({
                                ...prev,
                                address: false,
                              }));
                          }}
                          placeholder="Enter full institutional address"
                          className={cn(
                            "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                            formErrors.address &&
                              "border-red-500 ring-2 ring-red-500/10",
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            State
                          </Label>
                          <UISelect
                            value={formData.stateId}
                            onValueChange={(v) => {
                              const stateIdNum = parseInt(v);
                              const currentCity = cities.find(
                                (c) =>
                                  (c.id || c.Id) === parseInt(formData.cityId),
                              );
                              const cityBelongsToState =
                                currentCity &&
                                (currentCity.stateId || currentCity.StateId) ===
                                  stateIdNum;
                              setFormData({
                                ...formData,
                                stateId: v,
                                cityId: cityBelongsToState
                                  ? formData.cityId
                                  : "",
                              });
                            }}
                          >
                            <SelectTrigger className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                              <SelectValue placeholder="Choose State" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 max-h-48 overflow-y-auto">
                              <SelectItem
                                value=""
                                className="text-slate-400 italic"
                              >
                                Select State
                              </SelectItem>
                              {states.map((st: any) => (
                                <SelectItem
                                  key={st.id || st.Id}
                                  value={(st.id || st.Id).toString()}
                                  className="font-semibold"
                                >
                                  {st.name || st.Name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </UISelect>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            City
                          </Label>
                          <UISelect
                            value={formData.cityId}
                            onValueChange={(v) =>
                              setFormData({ ...formData, cityId: v })
                            }
                            disabled={!formData.stateId}
                          >
                            <SelectTrigger className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm disabled:opacity-50">
                              <SelectValue placeholder="Choose City" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 max-h-48 overflow-y-auto">
                              <SelectItem
                                value=""
                                className="text-slate-400 italic"
                              >
                                Select City
                              </SelectItem>
                              {cities
                                .filter(
                                  (c: any) =>
                                    (c.stateId || c.StateId) ===
                                    parseInt(formData.stateId),
                                )
                                .map((ct: any) => (
                                  <SelectItem
                                    key={ct.id || ct.Id}
                                    value={(ct.id || ct.Id).toString()}
                                    className="font-semibold"
                                  >
                                    {ct.name || ct.Name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </UISelect>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Pincode
                          </Label>
                          <Input
                            value={formData.pincode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pincode: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6),
                              })
                            }
                            placeholder="6-digit ZIP code"
                            className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Website URL
                        </Label>
                        <Input
                          value={formData.websiteUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              websiteUrl: e.target.value,
                            })
                          }
                          placeholder="https://www.schoolwebsite.com"
                          className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                        />
                      </div>
                    </section>
                  </div>
                </div>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      Administrative Contact
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Office Phone
                      </Label>
                      <Input
                        ref={(el) => {
                          inputRefs.current["phone"] = el;
                        }}
                        value={formData.phone}
                        maxLength={12}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 12);
                          setFormData({ ...formData, phone: val });
                          if (formErrors.phone)
                            setFormErrors((prev) => ({
                              ...prev,
                              phone: false,
                            }));
                        }}
                        placeholder="10 or 12 digit number"
                        className={cn(
                          "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                          formErrors.phone &&
                            "border-red-500 ring-2 ring-red-500/10",
                        )}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Direct Email
                      </Label>
                      <Input
                        ref={(el) => {
                          inputRefs.current["email"] = el;
                        }}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email)
                            setFormErrors((prev) => ({
                              ...prev,
                              email: false,
                            }));
                        }}
                        placeholder="office@school.com"
                        className={cn(
                          "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                          formErrors.email &&
                            "border-red-500 ring-2 ring-red-500/10",
                        )}
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      SMS Gateway & Utility Configuration
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        SMS Limit
                      </Label>
                      <Input
                        type="number"
                        value={formData.smsLimit}
                        onChange={(e) =>
                          setFormData({ ...formData, smsLimit: e.target.value })
                        }
                        placeholder="Max SMS count allowable"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        SMS Sender ID
                      </Label>
                      <Input
                        value={formData.smsSenderID}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smsSenderID: e.target.value,
                          })
                        }
                        placeholder="6-character Sender ID"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-around">
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                          SMS Sent
                        </p>
                        <p className="text-lg font-black text-indigo-600">
                          {formData.totalSMSSent || 0}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                          SMS Balance
                        </p>
                        <p className="text-lg font-black text-emerald-600">
                          {formData.smsBalance || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.enableSMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enableSMS: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-none">
                          Enable SMS
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                          Core alerts
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.enablePresenteeSMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enablePresenteeSMS: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-none">
                          Attendance SMS
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                          Absentee logs
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.automaticBirthdaySMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            automaticBirthdaySMS: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-none">
                          Birthday SMS
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                          Auto-greetings
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.enableWhatsapp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enableWhatsapp: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-none">
                          WhatsApp API
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                          Direct chat
                        </span>
                      </div>
                    </label>
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      Transit & SCANiD Support Settings
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        SCANiD Helpline
                      </Label>
                      <Input
                        value={formData.scanIDContact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scanIDContact: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 12),
                          })
                        }
                        placeholder="SCANiD custom support phone"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        SCANiD Email
                      </Label>
                      <Input
                        value={formData.scanIDEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scanIDEmail: e.target.value,
                          })
                        }
                        placeholder="support@scanid.com"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        In-Charge Contact
                      </Label>
                      <Input
                        value={formData.inChargeContact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inChargeContact: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 12),
                          })
                        }
                        placeholder="Principal/Admin direct line"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Assigned Institutional Bus Numbers
                    </Label>
                    <textarea
                      value={formData.busNumbers}
                      onChange={(e) =>
                        setFormData({ ...formData, busNumbers: e.target.value })
                      }
                      placeholder="e.g. Bus 01: MH-12-DT-2032, Bus 02: MH-14-AP-9302"
                      className="w-full min-h-[80px] text-sm border border-slate-200 bg-slate-50/30 rounded-2xl p-4 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </section>

                <section className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      System Status
                    </Label>
                    <UISelect
                      value={formData.status}
                      onValueChange={(v) =>
                        setFormData({ ...formData, status: v || "Active" })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-200 bg-white font-bold rounded-xl px-4 text-sm">
                        <SelectValue placeholder="Select System Status">
                          {formData.status || undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem
                          value=""
                          className="font-semibold py-1.5 text-xs text-slate-400 italic"
                        >
                          Select System Status
                        </SelectItem>
                        <SelectItem
                          value="Active"
                          className="font-semibold py-1.5 text-xs"
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          value="Suspended"
                          className="font-semibold py-1.5 text-xs"
                        >
                          Suspended
                        </SelectItem>
                      </SelectContent>
                    </UISelect>
                  </div>
                </section>
              </div>
            </div>

            <DialogFooter className="bg-slate-50 px-10 py-5 shrink-0 border-t border-slate-100 flex flex-row items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsAddDialogOpen(false)}
                className="h-9 px-5 font-bold text-slate-500 hover:text-slate-900 rounded-xl text-xs uppercase tracking-wider"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSchool}
                disabled={isProcessing}
                className="h-10 px-8 bg-blue-600 hover:bg-blue-700 font-black shadow-lg shadow-blue-600/20 rounded-xl transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
              >
                {isProcessing ? "Onboarding..." : "Register School"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit School Dialog */}
        <DeleteConfirmation
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          loading={isProcessing}
          title="Delete School Branch?"
          description="This will permanently remove this institution, all its teachers, students and academic data. This action is irreversible."
        />
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[90vh] flex flex-col p-0 border-none shadow-3xl rounded-[2rem] overflow-hidden">
            <div className="bg-slate-900 px-8 py-5 text-white relative shrink-0">
              <div className="relative z-10 flex items-center justify-between">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-xl shadow-xl shadow-blue-500/20">
                      <Edit size={22} className="text-white" />
                    </div>
                    Modify Institution
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-[12px] mt-1 font-medium max-w-2xl leading-relaxed">
                    Update the official records and contact information for this
                    educational branch.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-slate-50">
                  {/* Left: Institution Branding */}
                  <div className="flex flex-col items-center gap-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Institutional Logo
                    </Label>
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => triggerPhotoUpload(currentSchool?.id)}
                    >
                      <div className="w-44 h-44 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-100 bg-slate-50 flex items-center justify-center transition-all group-hover:shadow-blue-200/50 group-hover:scale-[1.02]">
                        {formData.photo ? (
                          <img
                            src={resolvePhotoUrl(formData.photo)}
                            alt="School"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${formData.name}`;
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-slate-300">
                            <div className="p-4 bg-slate-100 rounded-2xl">
                              <Building2 size={36} className="opacity-20" />
                            </div>
                            <span className="text-[10px] font-black tracking-widest">
                              NO LOGO
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[2px]">
                          <div className="p-2 bg-white/20 rounded-full">
                            <CameraIcon size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Update Photo
                          </span>
                        </div>
                      </div>

                      {formData.photo && (
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold max-w-[150px] text-center leading-relaxed italic">
                      Logo appears on student ID cards & official documents.
                    </p>
                  </div>

                  {/* Right: Institution Details */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        Identity Profile
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Official Name *
                          </Label>
                          <Input
                            ref={(el) => {
                              inputRefs.current["name"] = el;
                            }}
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                name: e.target.value,
                              });
                              if (formErrors.name)
                                setFormErrors((prev) => ({
                                  ...prev,
                                  name: false,
                                }));
                            }}
                            placeholder="e.g. St. Xavier's International"
                            className={cn(
                              "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                              formErrors.name &&
                                "border-red-500 ring-2 ring-red-500/10",
                            )}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Short Name / Code
                          </Label>
                          <Input
                            value={formData.shortName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shortName: e.target.value,
                              })
                            }
                            placeholder="e.g. SXIB-01"
                            className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Primary Address *
                        </Label>
                        <Input
                          ref={(el) => {
                            inputRefs.current["address"] = el;
                          }}
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            });
                            if (formErrors.address)
                              setFormErrors((prev) => ({
                                ...prev,
                                address: false,
                              }));
                          }}
                          placeholder="Enter full institutional address"
                          className={cn(
                            "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                            formErrors.address &&
                              "border-red-500 ring-2 ring-red-500/10",
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            State
                          </Label>
                          <UISelect
                            value={formData.stateId}
                            onValueChange={(v) => {
                              const stateIdNum = parseInt(v);
                              const currentCity = cities.find(
                                (c) =>
                                  (c.id || c.Id) === parseInt(formData.cityId),
                              );
                              const cityBelongsToState =
                                currentCity &&
                                (currentCity.stateId || currentCity.StateId) ===
                                  stateIdNum;
                              setFormData({
                                ...formData,
                                stateId: v,
                                cityId: cityBelongsToState
                                  ? formData.cityId
                                  : "",
                              });
                            }}
                          >
                            <SelectTrigger className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                              <SelectValue placeholder="Choose State" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 max-h-48 overflow-y-auto">
                              <SelectItem
                                value=""
                                className="text-slate-400 italic"
                              >
                                Select State
                              </SelectItem>
                              {states.map((st: any) => (
                                <SelectItem
                                  key={st.id || st.Id}
                                  value={(st.id || st.Id).toString()}
                                  className="font-semibold"
                                >
                                  {st.name || st.Name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </UISelect>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            City
                          </Label>
                          <UISelect
                            value={formData.cityId}
                            onValueChange={(v) =>
                              setFormData({ ...formData, cityId: v })
                            }
                            disabled={!formData.stateId}
                          >
                            <SelectTrigger className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm disabled:opacity-50">
                              <SelectValue placeholder="Choose City" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 max-h-48 overflow-y-auto">
                              <SelectItem
                                value=""
                                className="text-slate-400 italic"
                              >
                                Select City
                              </SelectItem>
                              {cities
                                .filter(
                                  (c: any) =>
                                    (c.stateId || c.StateId) ===
                                    parseInt(formData.stateId),
                                )
                                .map((ct: any) => (
                                  <SelectItem
                                    key={ct.id || ct.Id}
                                    value={(ct.id || ct.Id).toString()}
                                    className="font-semibold"
                                  >
                                    {ct.name || ct.Name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </UISelect>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Pincode
                          </Label>
                          <Input
                            value={formData.pincode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pincode: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6),
                              })
                            }
                            placeholder="6-digit ZIP code"
                            className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Website URL
                        </Label>
                        <Input
                          value={formData.websiteUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              websiteUrl: e.target.value,
                            })
                          }
                          placeholder="https://www.schoolwebsite.com"
                          className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      Administrative Contact
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Office Phone
                      </Label>
                      <Input
                        ref={(el) => {
                          inputRefs.current["phone"] = el;
                        }}
                        value={formData.phone}
                        maxLength={12}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 12);
                          setFormData({ ...formData, phone: val });
                          if (formErrors.phone)
                            setFormErrors((prev) => ({
                              ...prev,
                              phone: false,
                            }));
                        }}
                        placeholder="10 or 12 digit number"
                        className={cn(
                          "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                          formErrors.phone &&
                            "border-red-500 ring-2 ring-red-500/10",
                        )}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Direct Email
                      </Label>
                      <Input
                        ref={(el) => {
                          inputRefs.current["email"] = el;
                        }}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email)
                            setFormErrors((prev) => ({
                              ...prev,
                              email: false,
                            }));
                        }}
                        placeholder="office@school.com"
                        className={cn(
                          "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                          formErrors.email &&
                            "border-red-500 ring-2 ring-red-500/10",
                        )}
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      SMS Gateway & Utility Configuration
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        SMS Limit
                      </Label>
                      <Input
                        type="number"
                        value={formData.smsLimit}
                        onChange={(e) =>
                          setFormData({ ...formData, smsLimit: e.target.value })
                        }
                        placeholder="Max SMS count allowable"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        SMS Sender ID
                      </Label>
                      <Input
                        value={formData.smsSenderID}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smsSenderID: e.target.value,
                          })
                        }
                        placeholder="6-character Sender ID"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-around">
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                          SMS Sent
                        </p>
                        <p className="text-lg font-black text-indigo-600">
                          {formData.totalSMSSent || 0}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                          SMS Balance
                        </p>
                        <p className="text-lg font-black text-emerald-600">
                          {formData.smsBalance || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.enableSMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enableSMS: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-none">
                          Enable SMS
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                          Core alerts
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.enablePresenteeSMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enablePresenteeSMS: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-none">
                          Attendance SMS
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                          Absentee logs
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.automaticBirthdaySMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            automaticBirthdaySMS: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-none">
                          Birthday SMS
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                          Auto-greetings
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.enableWhatsapp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enableWhatsapp: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-none">
                          WhatsApp API
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                          Direct chat
                        </span>
                      </div>
                    </label>
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      Transit & SCANiD Support Settings
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        SCANiD Helpline
                      </Label>
                      <Input
                        value={formData.scanIDContact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scanIDContact: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 12),
                          })
                        }
                        placeholder="SCANiD custom support phone"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        SCANiD Email
                      </Label>
                      <Input
                        value={formData.scanIDEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scanIDEmail: e.target.value,
                          })
                        }
                        placeholder="support@scanid.com"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        In-Charge Contact
                      </Label>
                      <Input
                        value={formData.inChargeContact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inChargeContact: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 12),
                          })
                        }
                        placeholder="Principal/Admin direct line"
                        className="h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Assigned Institutional Bus Numbers
                    </Label>
                    <textarea
                      value={formData.busNumbers}
                      onChange={(e) =>
                        setFormData({ ...formData, busNumbers: e.target.value })
                      }
                      placeholder="e.g. Bus 01: MH-12-DT-2032, Bus 02: MH-14-AP-9302"
                      className="w-full min-h-[80px] text-sm border border-slate-200 bg-slate-50/30 rounded-2xl p-4 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </section>

                <section className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      System Status
                    </Label>
                    <UISelect
                      value={formData.status}
                      onValueChange={(v) =>
                        setFormData({ ...formData, status: v || "Active" })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-200 bg-white font-bold rounded-xl px-4 text-sm">
                        <SelectValue placeholder="Select System Status">
                          {formData.status || undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem
                          value=""
                          className="font-semibold py-1.5 text-xs text-slate-400 italic"
                        >
                          Select System Status
                        </SelectItem>
                        <SelectItem
                          value="Active"
                          className="font-semibold py-1.5 text-xs"
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          value="Suspended"
                          className="font-semibold py-1.5 text-xs"
                        >
                          Suspended
                        </SelectItem>
                      </SelectContent>
                    </UISelect>
                  </div>
                </section>
              </div>
            </div>

            <DialogFooter className="bg-slate-50 px-10 py-5 shrink-0 border-t border-slate-100 flex flex-row items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
                className="h-9 px-5 font-bold text-slate-500 hover:text-slate-900 rounded-xl text-xs uppercase tracking-wider"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSchool}
                disabled={isProcessing}
                className="h-10 px-8 bg-blue-600 hover:bg-blue-700 font-black shadow-lg shadow-blue-600/20 rounded-xl transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
              >
                {isProcessing ? "Updating..." : "Update Details"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatItem
          title="Total Schools"
          value={totalCount.toString()}
          icon={School}
          color="text-blue-600 bg-blue-50"
        />
        <StatItem
          title="Active License"
          value={activeCount.toString()}
          icon={Globe}
          color="text-emerald-600 bg-emerald-50"
        />
        <StatItem
          title="System Health"
          value="99.9%"
          icon={ShieldCheck}
          color="text-purple-600 bg-purple-50"
        />
      </div>

      <Card className="shadow-2xl shadow-slate-200/60 border-none rounded-[2rem] overflow-hidden">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <CardHeader className="pb-6 border-b border-slate-100 bg-white px-8 pt-8">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                placeholder="Search by name, school ID, or location..."
                className="pl-10 h-11 border-slate-200 bg-slate-50/50 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-widest gap-2"
              >
                <Download size={14} /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 h-14">
                  <TableHead
                    className="w-[150px] pl-8 text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-2">
                      School ID
                      {sortBy === "id" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ArrowUpDown size={12} className="opacity-30" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Institution Profile
                      {sortBy === "name" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ArrowUpDown size={12} className="opacity-30" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Digital Registry
                  </TableHead>
                  <TableHead
                    className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortBy === "status" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ArrowUpDown size={12} className="opacity-30" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right pr-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                    Management
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(sortedSchools) &&
                  sortedSchools.map((school) => (
                    <TableRow
                      key={school.id}
                      className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50"
                    >
                      <TableCell className="pl-8 font-mono text-xs font-black text-blue-600 italic">
                        SCH-{school.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="relative group">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-1 ring-slate-100 group-hover:ring-blue-400 group-hover:scale-105 transition-all duration-300">
                              <AvatarImage
                                src={resolvePhotoUrl(
                                  school.profilePhotoPath ||
                                    school.ProfilePhotoPath,
                                )}
                                alt={school.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 font-black text-xs">
                                {school.name
                                  .split(" ")
                                  .map((n: any) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <button
                              onClick={() => triggerPhotoUpload(school.id)}
                              className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-600 hover:text-white"
                            >
                              <Camera size={10} />
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-tight">
                              {school.name}{" "}
                              {(school.shortName || school.ShortName) && (
                                <span className="text-xs text-blue-600 font-semibold">
                                  ({school.shortName || school.ShortName})
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <MapPin size={10} className="shrink-0" />
                                {school.address || "Main Branch"}
                                {(school.cityName || school.CityName) &&
                                  `, ${school.cityName || school.CityName}`}
                                {(school.stateName || school.StateName) &&
                                  `, ${school.stateName || school.StateName}`}
                                {(school.pincode || school.Pincode) &&
                                  ` - ${school.pincode || school.Pincode}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {school.phone && (
                            <div className="text-[11px] font-bold text-slate-700">
                              {school.phone}
                            </div>
                          )}
                          {school.email && (
                            <div className="text-[10px] font-bold text-slate-400 lowercase">
                              {school.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "font-bold",
                            school.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700",
                          )}
                          variant="secondary"
                        >
                          {school.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <div className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer outline-none">
                                <MoreVertical size={16} />
                              </div>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => triggerPhotoUpload(school.id)}
                              >
                                <CameraIcon size={14} /> Update Logo
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => handleEditClick(school)}
                              >
                                <Edit size={14} /> Edit School
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteSchool(school.id)}
                              >
                                <Trash2 size={14} /> Delete School
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

          {/* Pagination Footer */}
          {!loading && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-slate-100 gap-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Showing{" "}
                <span className="text-slate-900 font-black">
                  {schools.length > 0 ? (page - 1) * pageSize + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="text-slate-900 font-black">
                  {Math.min(page * pageSize, totalCount)}
                </span>{" "}
                of{" "}
                <span className="text-slate-900 font-black">{totalCount}</span>{" "}
                entries
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Rows per page
                  </span>
                  <UISelect
                    value={pageSize.toString()}
                    onValueChange={(v) => {
                      setPageSize(parseInt(v || "10"));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[70px] h-8 bg-white border-slate-200 rounded-lg text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      {[10, 25, 50, 100].map((size) => (
                        <SelectItem
                          key={size}
                          value={size.toString()}
                          className="text-xs font-bold"
                        >
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UISelect>
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
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
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
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
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

function StatItem({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="shadow-2xl border-none bg-white rounded-[2rem] overflow-hidden group hover:shadow-blue-500/10 transition-all">
      <CardContent className="p-8">
        <div className="flex items-center gap-6">
          <div
            className={cn(
              "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110",
              color,
            )}
          >
            <Icon size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {title}
            </p>
            <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
              {value}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
