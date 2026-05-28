import { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import {
  Database,
  Layers,
  Plus,
  Search,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  Edit3,
  Hash,
  Calendar,
  Users,
  UserPlus,
  MapPin,
  Map,
  Droplet,
  Home,
  FileText,
  Milestone,
  School,
  Shield,
  ShieldCheck,
  UserCheck,
  LayoutGrid,
  Clock,
  BookOpen,
  Award,
  Briefcase,
  UserRound,
  Hammer,
  Camera,
  ChevronDown,
  Building2 ,
  MapPinned ,
  Flag ,
  ShieldX,
  // ShieldY,
  Settings2 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { apiService } from "@/lib/api";
import { Navigate } from "react-router-dom";
import { User } from "@/types";
import { motion } from "motion/react";
import { cn, parseSafeInt, resolvePhotoUrl } from "@/lib/utils";
import { SimpleTooltip } from "@/components/shared/SimpleTooltip";

interface ConfigurationProps {
  user: User;
  defaultTab?: string;
}

/**
 * GLOBAL MASTER CONFIGURATION MAP
 * Defines metadata for each master type including its UI label, icon, 
 * description for headers, and the API prefix used for dynamic method calling.
 */
const MASTER_TYPES: Record<string, { label: string, singular: string, icon: any, description: string, apiPrefix: string, getMethod?: string }> = {
  "schools": { label: "Schools", singular: "School", icon: School, description: "Manage institutional branches", apiPrefix: "School" },
  "role-master": { label: "Role Master", singular: "Role Master", icon: Shield, description: "Manage system access roles", apiPrefix: "Role" },
  "role-assignment": { label: "Role Assignment", singular: "Role Assignment", icon: UserPlus, description: "Assign roles to system users", apiPrefix: "User" },
  "standards": { label: "Standards", singular: "Standard", icon: Layers, description: "Manage academic standards/grades", apiPrefix: "Standard" },
  "sections": { label: "Divisions/Sections", singular: "Division/Section", icon: Hash, description: "Manage class subdivisions", apiPrefix: "Section" },
  "academic-years": { label: "Academic Years", singular: "Academic Year", icon: Calendar, description: "Manage educational sessions", apiPrefix: "AcademicYear" },
  "castes": { label: "Castes", singular: "Caste", icon: Users, description: "Manage student caste categories", apiPrefix: "Caste" },
  "sub-castes": { label: "Sub-Castes", singular: "Sub-Caste", icon: Users, description: "Manage specific sub-caste groups", apiPrefix: "SubCaste" },
  "religions": { label: "Religions", singular: "Religion", icon: Milestone, description: "Manage religious affiliations", apiPrefix: "Religion" },
  "states": { label: "States", singular: "State", icon: Map, description: "List of administrative states", apiPrefix: "State" },
  "cities": { label: "Cities", singular: "City", icon: MapPin, description: "List of cities/towns", apiPrefix: "City", getMethod: "getCities" },
  "school-sections": { label: "School Sections", singular: "School Section", icon: Layers, description: "Manage school sections", apiPrefix: "SchoolSection" },
  "blood-groups": { label: "Blood Groups", singular: "Blood Group", icon: Droplet, description: "Manage emergency blood types", apiPrefix: "BloodGroup" },
  "houses": { label: "Houses", singular: "House", icon: Home, description: "Manage school house systems", apiPrefix: "House" },
  "admission-types": { label: "Admission Types", singular: "Admission Type", icon: FileText, description: "Manage enrollment categories", apiPrefix: "AdmissionType" },
  "categories": { label: "Categories", singular: "Category", icon: LayoutGrid, description: "Manage social categories", apiPrefix: "Category", getMethod: "getCategories" },
  "sessions": { label: "Sessions", singular: "Session", icon: Clock, description: "Manage school sessions", apiPrefix: "Session" },
  "batches": { label: "Batches", singular: "Batch", icon: Users, description: "Manage student batches", apiPrefix: "Batch" },
  "shifts": { label: "Shifts", singular: "Shift", icon: Clock, description: "Manage staff/student shifts", apiPrefix: "Shift" },
  "subjects": { label: "Subjects", singular: "Subject", icon: BookOpen, description: "Manage academic subjects", apiPrefix: "Subject" },
  "exam-types": { label: "Exam Types", singular: "Exam Type", icon: Award, description: "Manage examination categories", apiPrefix: "ExamType" },
  "designations": { label: "Designations", singular: "Designation", icon: Briefcase, description: "Manage staff designations", apiPrefix: "Designation" },
  "occupations": { label: "Occupations", singular: "Occupation", icon: Hammer, description: "Manage parent occupations", apiPrefix: "Occupation" },
  "navigation": { label: "Navigation Master", singular: "Navigation Menu", icon: LayoutGrid, description: "Manage hierarchical sidebar menu", apiPrefix: "Navigation" },
};

export default function Configuration({ user, defaultTab = "schools" }: ConfigurationProps) {
  // INTERNAL RBAC CHECK: Secondary layer of protection for superadmin and admin roles
  if (user.role !== "superadmin" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Master dependencies for related lookups (like Sub-Castes needing Castes)
  const [dependencies, setDependencies] = useState<Record<string, any[]>>({});

  // Sync active tab with prop
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, any>>({});

  // Form states
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    isCurrent: false,
    isActive: true,
    color: "",
    casteId: "",
    stateId: "",
    address: "",
    phone: "",
    email: "",
    profilePhotoPath: "",
    // New fields for Global School
    shortName: "",
    pincode: "",
    schoolState: "",
    city: "",
    websiteUrl: "",
    smsLimit: "",
    smsSenderId: "",
    enableCoreSms: false,
    attendanceSms: false,
    birthdayGreetings: false,
    whatsappApi: "",
    scanidHelpline: "",
    scanidEmail: "",
    schoolInChargeContact: "",
    institutionalBusFleetNumbers: "",
    systemStatus: "Active"
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSchoolId, setUploadingSchoolId] = useState<number | null>(null);

  const triggerPhotoUpload = (id: number) => {
    setUploadingSchoolId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadingSchoolId !== null) {
      // Direct list row interaction
      const loadingToast = toast.loading("Uploading institutional logo...");
      try {
        const response = await apiService.uploadSchoolPhoto(uploadingSchoolId, file);
        const _newPath = response.data.data?.path || response.data.path;
        toast.dismiss(loadingToast);
        toast.success("Institutional identity updated physically.");
        fetchData(); // Refresh to see the new logo
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to update logo physically. Check server permissions.");
        console.error(error);
      } finally {
        setUploadingSchoolId(null);
      }
    } else {
      // Dialog interaction
      if (!editingItem) {
        // Adding a new school: keep in local state preview
        setSelectedPhotoFile(file);
        setLocalPhotoPreview(URL.createObjectURL(file));
        toast.success("School branding photo selected. Click Create Master to save.");
      } else {
        // Editing an existing school in the dialog: upload immediately
        const loadingToast = toast.loading("Uploading institutional logo...");
        try {
          const response = await apiService.uploadSchoolPhoto(editingItem.id, file);
          const newPath = response.data.data?.path || response.data.path;
          setFormData(prev => ({ ...prev, profilePhotoPath: newPath }));
          toast.dismiss(loadingToast);
          toast.success("Institutional photo updated successfully");
          fetchData(); // Refresh to reflect in the grid
        } catch (error) {
          toast.dismiss(loadingToast);
          toast.error("Failed to upload photo. Please try again.");
          console.error(error);
        }
      }
    }

    if (e.target) e.target.value = "";
  };

  /**
   * FETCH MASTER DATA
   * Dynamically fetches data from the API based on the currently active tab.
   * Also handles dependency loading for related master types (e.g. Sub-Caste needs Caste list).
   */
  const fetchData = async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      const typeConfig = MASTER_TYPES[activeTab];

      if (activeTab === "role-assignment") {
        const usersRes = await apiService.getUsers();
        const rolesRes = await apiService.getRoles();
        const usersData = usersRes.data?.data || usersRes.data || [];
        const rolesData = rolesRes.data?.data || rolesRes.data || [];
        setMasterData(Array.isArray(usersData) ? usersData : []);
        setDependencies(prev => ({ ...prev, roles: Array.isArray(rolesData) ? rolesData : [] }));
      } else {
        const getMethodName = typeConfig.getMethod || `get${typeConfig.apiPrefix}s`;
        // @ts-ignore
        const response = await apiService[getMethodName]();
        // Handle potential { data: [...] } wrapper from interceptor or raw array
        const extractedData = response.data?.data || response.data || [];
        setMasterData(Array.isArray(extractedData) ? extractedData : []);

        // Fetch dependencies if needed
        if (activeTab === "sub-castes") {
          const castesRes = await apiService.getCastes();
          const castesData = castesRes.data?.data || castesRes.data || [];
          setDependencies(prev => ({ ...prev, castes: Array.isArray(castesData) ? castesData : [] }));
        }
        if (activeTab === "cities" || activeTab === "schools") {
          const statesRes = await apiService.getStates();
          const statesData = statesRes.data?.data || statesRes.data || [];
          setDependencies(prev => ({ ...prev, states: Array.isArray(statesData) ? statesData : [] }));
        }
        if (activeTab === "schools") {
          const citiesRes = await apiService.getCities();
          const citiesData = citiesRes.data?.data || citiesRes.data || [];
          setDependencies(prev => ({ ...prev, cities: Array.isArray(citiesData) ? citiesData : [] }));
        }
        if (activeTab === "navigation") {
          const rolesRes = await apiService.getRoles();
          const navsRes = await apiService.getNavigations();
          const rolesData = rolesRes.data?.data || rolesRes.data || [];
          const navsData = navsRes.data?.data || navsRes.data || [];
          setDependencies(prev => ({
            ...prev,
            roles: Array.isArray(rolesData) ? rolesData : [],
            parentNavs: (Array.isArray(navsData) ? navsData : []).filter((n: any) => !n.parentId)
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching master data:", error);
      toast.error(`Failed to load ${MASTER_TYPES[activeTab].label}`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (!isDialogOpen) {
      setSelectedPhotoFile(null);
      if (localPhotoPreview) {
        URL.revokeObjectURL(localPhotoPreview);
        setLocalPhotoPreview(null);
      }
    }
  }, [isDialogOpen]);

  const handleOpenDialog = (item: any = null) => {
    setEditingItem(item);
    setFormErrors({});
    setSelectedPhotoFile(null);
    if (localPhotoPreview) {
      URL.revokeObjectURL(localPhotoPreview);
      setLocalPhotoPreview(null);
    }
    setFormData({
      name: item?.name || item?.fullName || "",
      description: item?.description || "",
      isCurrent: item?.isCurrent || false,
      isActive: item?.isActive !== false, // Default to true if undefined
      color: item?.color || "#3b82f6",
      casteId: item?.casteId?.toString() || "",
      stateId: item?.stateId?.toString() || "",
      address: item?.address || "",
      phone: item?.phone || "",
      email: item?.email || "",
      title: item?.title || "",
      path: item?.path || "",
      icon: item?.icon || "",
      parentId: item?.parentId?.toString() || "",
      sortOrder: item?.sortOrder || 0,
      roles: item?.roles || ["superadmin"],
      profilePhotoPath: item?.profilePhotoPath || item?.ProfilePhotoPath || "",
      // New fields
      shortName: item?.shortName || "",
      pincode: item?.pincode || "",
      schoolState: item?.schoolState || "",
      city: item?.city || "",
      websiteUrl: item?.websiteUrl || "",
      smsLimit: item?.smsLimit || "",
      smsSenderId: item?.smsSenderId || "",
      enableCoreSms: item?.enableCoreSms || false,
      attendanceSms: item?.attendanceSms || false,
      birthdayGreetings: item?.birthdayGreetings || false,
      whatsappApi: item?.whatsappApi || "",
      scanidHelpline: item?.scanidHelpline || "",
      scanidEmail: item?.scanidEmail || "",
      schoolInChargeContact: item?.schoolInChargeContact || "",
      institutionalBusFleetNumbers: item?.institutionalBusFleetNumbers || "",
      systemStatus: item?.systemStatus || "Active"
    });

    setIsDialogOpen(true);
  };

  /**
   * PERSIST MASTER RECORD
   * Handles both creation of new records and updates to existing ones.
   * Dynamically constructs the payload based on the active master type.
   */
  const handleKeyDown = (e: React.KeyboardEvent, nextField?: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField && inputRefs.current[nextField]) {
        inputRefs.current[nextField]?.focus();
      } else {
        handleSave();
      }
    }
  };

  const handleSave = async () => {
    const newErrors: Record<string, boolean> = {};
    if (activeTab === "navigation") {
      if (!formData.title?.trim()) newErrors.title = true;
      // Path is only required for leaf nodes (items without children in common use,
      // but here we allow empty path for parent items which act as containers)
    } else {
      if (!formData.name?.trim()) newErrors.name = true;
    }

    if (activeTab === "sub-castes" && !formData.casteId)
      newErrors.casteId = true;
    if (activeTab === "cities" && !formData.stateId) newErrors.stateId = true;
    if (activeTab === "schools") {
      if (!formData.address) newErrors.address = true;
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = true;
      }
      if (
        formData.scanIDEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.scanIDEmail)
      ) {
        newErrors.scanIDEmail = true;
      }
      checkField("phone", !formData.phone?.trim(), "Contact Phone required");
      checkField("address", !formData.address?.trim(), "School Address required");
      checkField("shortName", !formData.shortName?.trim(), "Short Name / Code required");
      checkField("city", !formData.city?.trim(), "City name required");
      checkField("schoolState", !formData.schoolState?.trim(), "State name required");
      checkField("pincode", !formData.pincode?.trim() || formData.pincode.length < 6, "Valid Pincode required");
      checkField("smsLimit", !formData.smsLimit?.trim(), "SMS Limit required");
      checkField("smsSenderId", !formData.smsSenderId?.trim(), "SMS Sender ID required");
    }
    if (activeTab === "role-assignment") {
      if (!formData.username?.trim()) newErrors.username = true;
      if (!formData.email?.trim()) {
        newErrors.email = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = true;
      }
      if (!editingItem && !formData.password?.trim()) newErrors.password = true;
      if (formData.password && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = true;
      }
    }

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Form incomplete. Please review the highlighted fields to continue.", {
        description: "Some required details are missing or have incorrect formats.",
      });
      const firstError = Object.keys(newErrors)[0];
      
      const focusMap: Record<string, string> = {
        'emailFormat': 'email',
        'casteId': 'casteId',
        'stateId': 'stateId'
      };

      const focusKey = focusMap[firstError] || firstError;
      const element = inputRefs.current[focusKey];

      if (element) {
        const focusTarget = element.focus ? element : element.querySelector?.('button, input');
        (focusTarget || element).focus?.();
        element.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      const typeConfig = MASTER_TYPES[activeTab];
      const prefix = typeConfig.apiPrefix;
      const createMethod = `create${prefix}`;
      const updateMethod = `update${prefix}`;

      // Prepare payload based on the active master type to avoid sending irrelevant data
      let payload: any = {
        isActive: formData.isActive
      };

      if (activeTab === "navigation") {
        payload = {
          ...payload,
          title: formData.title,
          path: formData.path,
          icon: formData.icon,
          parentId: formData.parentId ? parseSafeInt(formData.parentId) : null,
          sortOrder: parseSafeInt(formData.sortOrder) || 0,
          roles: formData.roles
        };
      } else {
        payload.name = formData.name;
        payload.description = formData.description;
      }

      // Add type-specific fields with proper type conversion
      if (activeTab === "academic-years") {
        payload.isCurrent = formData.isCurrent;
      } else if (activeTab === "houses") {
        payload.color = formData.color;
      } else if (activeTab === "sub-castes") {
        payload.casteId = parseSafeInt(formData.casteId);
      } else if (activeTab === "cities") {
        payload.stateId = parseSafeInt(formData.stateId);
      } else if (activeTab === "schools") {
        payload.address = formData.address;
        payload.phone = formData.phone;
        payload.email = formData.email;
        // Keep school branding path aligned to avoid clearing it during name/address updates
        payload.profilePhotoPath = formData.profilePhotoPath;
        
        // New Global School fields
        payload.shortName = formData.shortName;
        payload.pincode = formData.pincode;
        payload.schoolState = formData.schoolState;
        payload.city = formData.city;
        payload.websiteUrl = formData.websiteUrl;
        payload.smsLimit = formData.smsLimit;
        payload.smsSenderId = formData.smsSenderId;
        payload.enableCoreSms = formData.enableCoreSms;
        payload.attendanceSms = formData.attendanceSms;
        payload.birthdayGreetings = formData.birthdayGreetings;
        payload.whatsappApi = formData.whatsappApi;
        payload.scanidHelpline = formData.scanidHelpline;
        payload.scanidEmail = formData.scanidEmail;
        payload.schoolInChargeContact = formData.schoolInChargeContact;
        payload.institutionalBusFleetNumbers = formData.institutionalBusFleetNumbers;
        payload.systemStatus = formData.systemStatus;
      } else if (activeTab === "role-assignment") {
        // Map common 'name' field back to 'fullName' for User API
        payload.fullName = formData.name;
        delete payload.name;
        payload.email = formData.email;
        // For new users, we could allow setting a default role if needed, 
        // but table select handles it afterwards
      }

      if (editingItem) {
        payload.id = parseSafeInt(editingItem.id);
        // @ts-ignore
        await apiService[updateMethod](editingItem.id, payload);
        toast.success(`${typeConfig.label} updated successfully`);
      } else {
        // @ts-ignore
        const response = await apiService[createMethod](payload);
        toast.success(`${typeConfig.label} created successfully`);

        // Handle delayed photo upload for schools if selectedPhotoFile is present
        const createdItem = response.data.data || response.data;
        if (activeTab === "schools" && selectedPhotoFile && createdItem?.id) {
          try {
            await apiService.uploadSchoolPhoto(createdItem.id, selectedPhotoFile);
          } catch (uploadErr) {
            console.error("Delayed school photo upload failed:", uploadErr);
          }
        }
      }

      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const typeConfig = MASTER_TYPES[activeTab];
      const deleteMethod = `delete${typeConfig.apiPrefix}`;
      // @ts-ignore
      await apiService[deleteMethod](id);
      toast.success("Item deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const filteredData = masterData.filter(item =>
    (item.name || item.title || item.fullName)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description || item.path)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConfig = MASTER_TYPES[activeTab];
  const Icon = activeConfig.icon;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-indigo-600 p-4 rounded-xl text-white shadow-2xl shadow-indigo-200 transition-transform hover:rotate-3">
            <Icon size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {activeConfig.label}
            </h1>
            <p className="text-slate-400 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">
              {activeConfig.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SimpleTooltip content="Reload data from server" side="bottom">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isRefreshing}
              className="rounded-xl font-bold border-slate-200 h-10 px-5 text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
            >
              <RefreshCw size={16} className={cn("mr-2", isRefreshing && "animate-spin")} />
              Sync Data
            </Button>
          </SimpleTooltip>
        </div>
      </div>

      <Card className="dashboard-card border-none overflow-hidden">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="w-full">
          <div className="px-6 sm:px-8 py-8 border-b border-slate-50 bg-white/50 backdrop-blur-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                System Master Registry
              </h3>
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">
                Foundational data management for {activeConfig.label}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative group w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <Input
                  placeholder={activeTab === "role-master" ? "Search roles..." : "Filter masters..."}
                  className="pl-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-[14px] font-medium rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => handleOpenDialog()}
                className={cn(
                  "border-none rounded-xl h-12 px-8 shadow-xl font-bold text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto",
                  activeTab === "role-master" ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                )}
              >
                <Plus size={18} className="mr-2 stroke-[3]" /> {activeTab === "role-master" ? "Add New Role" : "Add New"}
              </Button>
            </div>
          </div>

          <div className="p-0">
            <div className="border-0 overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="hover:bg-transparent border-slate-50 h-16">
                    <TableHead className={cn("w-24 pl-8 text-[11px] font-black uppercase tracking-widest", activeTab === "role-master" || activeTab === "role-assignment" ? "text-slate-500" : "text-slate-400")}>
                      {activeTab === "role-master" || activeTab === "role-assignment" ? "INDEX" : "Index"}
                    </TableHead>
                    <TableHead className={cn("text-[11px] font-black uppercase tracking-widest", activeTab === "role-master" || activeTab === "role-assignment" ? "text-slate-500" : "text-slate-400")}>
                      {activeTab === "role-assignment" ? "USER PROFILE" : activeTab === "role-master" ? "ROLE NAME" : "Primary Label"}
                    </TableHead>
                    {activeTab === "role-master" && <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-500">DESCRIPTION</TableHead>}
                    {activeTab === "role-assignment" && <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-500">USERNAME</TableHead>}
                    {activeTab === "role-assignment" && <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-500">SYSTEM ROLE</TableHead>}
                    {activeTab === "academic-years" && <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Current Session</TableHead>}
                    {activeTab === "houses" && <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Hex Code</TableHead>}
                    {activeTab === "sub-castes" && <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Parent Category</TableHead>}
                    {activeTab === "cities" && <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Administrative State</TableHead>}
                    {activeTab === "schools" && (
                      <>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Location</TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Contact</TableHead>
                      </>
                    )}
                    {activeTab === "navigation" && (
                      <>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Path</TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Parent</TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Roles</TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Order</TableHead>
                      </>
                    )}
                    {activeTab !== "role-assignment" && activeTab !== "navigation" && activeTab !== "role-master" && <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Description</TableHead>}
                    <TableHead className={cn("text-[11px] font-black uppercase tracking-widest", activeTab === "role-master" || activeTab === "role-assignment" ? "text-slate-500" : "text-slate-400")}>
                      {activeTab === "role-master" || activeTab === "role-assignment" ? "STATUS" : "Status"}
                    </TableHead>
                    {(activeTab === "role-master" || activeTab === "role-assignment") && <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-500">LAST UPDATED</TableHead>}
                    <TableHead className={cn("w-20 pr-8 text-right text-[11px] font-black uppercase tracking-widest", activeTab === "role-master" || activeTab === "role-assignment" ? "text-slate-500" : "text-slate-400")}>
                      {activeTab === "role-master" || activeTab === "role-assignment" ? "MANAGE" : "Manage"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i} className="animate-pulse border-slate-50 h-20">
                        <TableCell colSpan={10} className="px-8">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-100 rounded-xl" />
                            <div className="h-4 w-32 bg-slate-100 rounded-lg" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (Array.isArray(filteredData) && filteredData.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-4 bg-slate-50 rounded-full">
                            <Database className="text-slate-300" size={32} />
                          </div>
                          <p className="text-lg font-black text-slate-300 italic tracking-tight">Empty Database Records</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.isArray(filteredData) && filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-slate-50/50 h-20 group">
                        <TableCell className="pl-8">
                          <span className={cn(
                            "font-mono text-[12px] font-bold px-3 py-1.5 rounded-lg border",
                            activeTab === "role-master" || activeTab === "role-assignment" ? "bg-slate-50 text-slate-600 border-slate-100" : "bg-slate-50 text-slate-400 border-slate-100"
                          )}>
                            {item.id.toString().padStart(2, '0')}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 text-sm tracking-tight truncate">
                          <div className="flex items-center gap-4">
                            {activeTab === "role-master" ? (
                              <>
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm",
                                  (item.name || "").toLowerCase().includes("admin") ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                    (item.name || "").toLowerCase().includes("teacher") ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                      (item.name || "").toLowerCase().includes("student") ? "bg-orange-50 text-orange-600 border-orange-100" :
                                        "bg-indigo-50 text-indigo-600 border-indigo-100"
                                )}>
                                  {(item.name || "").toLowerCase().includes("admin") ? <Shield size={18} /> :
                                    (item.name || "").toLowerCase().includes("teacher") ? <LucideIcons.GraduationCap size={18} /> :
                                      (item.name || "").toLowerCase().includes("student") ? <LucideIcons.User size={18} /> :
                                        <LucideIcons.User size={18} />}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[15px] font-bold text-slate-900 leading-tight tracking-tight">{item.name}</span>
                                  <span className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-md inline-block w-fit",
                                    (item.name || "").toLowerCase().includes("admin") ? "bg-indigo-100 text-indigo-700" :
                                      (item.name || "").toLowerCase().includes("teacher") ? "bg-emerald-100 text-emerald-700" :
                                        "bg-indigo-100 text-indigo-700"
                                  )}>
                                    {(item.name || "").toLowerCase().includes("admin") ? "System" : (item.name || "").toLowerCase().includes("teacher") ? "Academic" : "General"}
                                  </span>
                                </div>
                              </>
                            ) : activeTab === "role-assignment" ? (
                              <div className="flex items-center gap-4">
                                <div className="h-11 w-11 shrink-0">
                                  <Avatar className="h-11 w-11 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                    <AvatarImage src={resolvePhotoUrl(item.profilePhotoPath || item.ProfilePhotoPath)} alt={item.fullName || item.name} className="object-cover" />
                                    <AvatarFallback className={cn(
                                      "text-white font-bold text-xs",
                                      item.role === "superadmin" ? "bg-indigo-600" :
                                        item.role === "teacher" ? "bg-indigo-600" :
                                          item.role === "student" ? "bg-emerald-600" :
                                            item.role === "parent" ? "bg-orange-600" : "bg-violet-600"
                                    )}>
                                      {(item.fullName || item.name || "U").split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[15px] font-bold text-slate-900 leading-tight truncate max-w-[140px] block">{item.fullName || item.name}</span>
                                  <span className="text-[11px] font-black text-slate-500 mt-1 capitalize tracking-wide">{item.role || "User"}</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                {activeTab === "schools" && (
                                  <div className="relative group shrink-0">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-indigo-400 group-hover:scale-105 transition-all">
                                      <AvatarImage src={resolvePhotoUrl(item.profilePhotoPath || item.ProfilePhotoPath)} alt={item.name} className="object-cover" />
                                      <AvatarFallback className="bg-slate-100 text-slate-400 text-[10px] font-black uppercase">
                                        {(item.name || "S").split(' ').map((n: any) => n[0]).join('').substring(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <button
                                      onClick={() => triggerPhotoUpload(item.id)}
                                      className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white"
                                    >
                                      <Camera size={8} />
                                    </button>
                                  </div>
                                )}
                                {activeTab === "navigation" && item.icon && (
                                  <span className="mr-2 inline-flex items-center">
                                    {(() => {
                                      const IconComp = (LucideIcons as any)[item.icon];
                                      return IconComp ? <IconComp size={16} className="text-blue-500" /> : null;
                                    })()}
                                  </span>
                                )}
                                <span className="truncate">{item.name || item.title || item.fullName}</span>
                              </>
                            )}
                          </div>
                        </TableCell>

                        {activeTab === "role-assignment" && (
                          <>
                            <TableCell className="text-xs font-bold text-slate-600 font-mono italic">
                              <span className="opacity-90">{item.username}</span>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.role ? item.role.toLowerCase().replace(/\s+/g, "") : ""}
                                onValueChange={async (newRole) => {
                                  try {
                                    await apiService.updateUserRole(item.id, newRole);
                                    toast.success("Role updated successfully");
                                    fetchData();
                                  } catch (error) {
                                    toast.error("Failed to update role");
                                  }
                                }}
                              >
                                <SelectTrigger className="h-10 w-40 rounded-xl bg-blue-50/30 border-blue-100 text-[11px] font-black uppercase tracking-widest text-blue-700 hover:bg-blue-100/30 transition-colors shadow-sm">
                                  <SelectValue placeholder="Role">
                                    {item.role ? (
                                      dependencies.roles?.find((r: any) => r.name.toLowerCase().replace(' ', '') === item.role)?.name ||
                                      (item.role === 'superadmin' ? 'SUPERADMIN' :
                                        item.role === 'admin' ? 'ADMIN' :
                                          item.role === 'teacher' ? 'TEACHER' : item.role.toUpperCase())
                                    ) : undefined}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-2">
                                  {Array.isArray(dependencies.roles) && dependencies.roles.map((role: any) => (
                                    <SelectItem key={role.id} value={role.name.toLowerCase().replace(' ', '')} className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                  {(!dependencies.roles || dependencies.roles.length === 0) && (
                                    <>
                                      <SelectItem value="superadmin" className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">Super Admin</SelectItem>
                                      <SelectItem value="admin" className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">Admin</SelectItem>
                                      <SelectItem value="teacher" className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">Teacher</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </>
                        )}

                        {activeTab === "academic-years" && (
                          <TableCell>
                            {item.isCurrent ? (
                              <Badge className="bg-blue-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest px-2.5 py-1">Current</Badge>
                            ) : <span className="text-slate-300 text-[10px] font-bold">—</span>}
                          </TableCell>
                        )}

                        {activeTab === "houses" && (
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-100" style={{ backgroundColor: item.color }}></div>
                              <span className="text-[10px] font-black font-mono uppercase text-slate-500 tracking-widest px-2 py-1 bg-slate-50 rounded-md">{item.color}</span>
                            </div>
                          </TableCell>
                        )}

                        {activeTab === "sub-castes" && (
                          <TableCell className="text-xs font-bold text-slate-600">
                            <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                              {dependencies.castes?.find(c => c.id === item.casteId)?.name || "SYSTEM_ORPHAN"}
                            </span>
                          </TableCell>
                        )}

                        {activeTab === "cities" && (
                          <TableCell className="text-xs font-bold text-slate-600">
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                              {dependencies.states?.find(s => s.id === item.stateId)?.name || "LOC_UNSET"}
                            </span>
                          </TableCell>
                        )}

                        {activeTab === "schools" && (
                          <>
                            <TableCell className="text-xs font-bold text-slate-500 max-w-[150px] truncate leading-relaxed">
                              {item.address || "-"}
                            </TableCell>
                            <TableCell className="text-xs font-bold text-slate-500 italic">
                              {item.email || "-"}
                            </TableCell>
                          </>
                        )}

                        {activeTab === "navigation" && (
                          <>
                            <TableCell className="text-xs font-mono font-bold text-slate-500">{item.path}</TableCell>
                            <TableCell className="text-xs font-bold text-slate-600">
                              {item.parentId ? (
                                <Badge variant="outline" className="text-[10px] font-black uppercase text-slate-400">
                                  {masterData.find(m => m.id === parseSafeInt(item.parentId))?.title || "Parent Hidden"}
                                </Badge>
                              ) : <span className="text-slate-300">—</span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[150px]">
                                {Array.isArray(item.roles) && item.roles.map((r: string) => (
                                  <Badge key={r} className="bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase px-1.5 py-0.5">
                                    {r}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-black text-slate-400">{item.sortOrder}</TableCell>
                          </>
                        )}

                        {activeTab === "role-master" && (
                          <TableCell className="text-[13px] font-bold text-slate-700 max-w-[300px] truncate leading-relaxed">
                            {item.description || "Full system access with relevant permissions."}
                          </TableCell>
                        )}

                        {activeTab !== "role-assignment" && activeTab !== "navigation" && activeTab !== "role-master" && (
                          <TableCell className="text-xs font-bold text-slate-400 max-w-[200px] truncate leading-relaxed italic">
                            {item.description || "No metadata found"}
                          </TableCell>
                        )}

                        <TableCell>
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full w-fit",
                            item.isActive !== false ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", item.isActive !== false ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-400")} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Active</span>
                          </div>
                        </TableCell>

                        {(activeTab === "role-master" || activeTab === "role-assignment") && (
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-700">May 20, 2024</span>
                              <span className="text-[11px] font-bold text-slate-600 mt-0.5">10:30 AM</span>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="pr-8 text-right">
                          <DropdownMenu>
                            <SimpleTooltip content="Administrative Actions" side="left">
                              <DropdownMenuTrigger render={
                                <div className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm cursor-pointer text-slate-400 hover:text-blue-600 transition-all active:scale-95 border-none outline-none focus:ring-0" aria-label="Open actions menu">
                                  <MoreHorizontal size={18} />
                                </div>
                              } />
                            </SimpleTooltip>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 shadow-2xl p-2 animate-in slide-in-from-top-2 duration-300">
                              <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="rounded-xl py-3 px-4 font-black transition-all text-xs uppercase tracking-widest text-slate-600 focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                                <Edit3 size={14} className="mr-3" /> Update Record
                              </DropdownMenuItem>
                              {activeTab === "schools" && (
                                <DropdownMenuItem onClick={() => triggerPhotoUpload(item.id)} className="rounded-xl py-3 px-4 font-black transition-all text-xs uppercase tracking-widest text-slate-600 focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                                  <Camera size={14} className="mr-3" /> Update Logo
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="rounded-xl py-3 px-4 font-black transition-all text-xs uppercase tracking-widest text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                <Trash2 size={14} className="mr-3" /> {activeTab === "role-assignment" ? "Deactivate User" : "Purge Entry"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Premium Pagination Bar */}
            {(activeTab === "role-master" || activeTab === "role-assignment") && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-[14px] font-bold text-slate-600">
                  Showing <span className="text-slate-900 font-black">1</span> to <span className="text-slate-900 font-black">5</span> of <span className="text-slate-900 font-black">25</span> {activeTab === "role-master" ? "roles" : "entries"}
                </p>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400 hover:bg-slate-50 transition-all">
                    <LucideIcons.ChevronLeft size={16} />
                  </Button>
                  <Button className="h-9 w-9 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20">1</Button>
                  <Button variant="ghost" className="h-9 w-9 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all">2</Button>
                  <Button variant="ghost" className="h-9 w-9 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all">3</Button>
                  <span className="px-1 text-slate-400">...</span>
                  <Button variant="ghost" className="h-9 w-9 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all">5</Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400 hover:bg-slate-50 transition-all">
                    <LucideIcons.ChevronRight size={16} />
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Select defaultValue="10">
                    <SelectTrigger className="h-10 w-28 rounded-xl border-slate-100 bg-white text-[13px] font-bold text-slate-700 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                      <SelectItem value="10" className="text-[13px] font-bold">10 / page</SelectItem>
                      <SelectItem value="25" className="text-[13px] font-bold">25 / page</SelectItem>
                      <SelectItem value="50" className="text-[13px] font-bold">50 / page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Add/Edit Dialog - Premium UI for supported tabs */}
      {["navigation", "schools", "academic-years", "houses", "sub-castes", "cities"].includes(activeTab) ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

          <DialogContent className={cn(
            "rounded-xl border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-0 overflow-hidden transition-all duration-300 bg-white w-[95vw] max-w-[95vw] max-h-[95vh] sm:max-h-[85vh]",
            "fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2",
            activeTab === "role-assignment" ? "sm:max-w-2xl" :
              (activeTab === "schools" || activeTab === "navigation") ? "sm:max-w-[700px]" : "sm:max-w-[400px]"
          )}>








            {/* redesigned Header - Clean and Elegant */}
            <div className="px-4 sm:px-6 py-3 sm:py-5 relative overflow-hidden shrink-0 border-b border-slate-50 bg-slate-900">
              <DialogHeader className="relative z-10 p-0 bg-transparent flex-row items-center gap-3 sm:gap-4 pr-10 sm:pr-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105 bg-[#5a67f2] text-white backdrop-blur-md">
                  {(activeTab === "schools" && (localPhotoPreview || formData.profilePhotoPath)) ? (
                    <img src={localPhotoPreview || resolvePhotoUrl(formData.profilePhotoPath)} className="w-full h-full object-cover rounded-xl" alt="Logo" />
                  ) : (
                    <activeConfig.icon className="size-5 sm:size-6 stroke-[2.5]" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <DialogTitle className="text-base sm:text-lg font-heading font-extrabold tracking-tight leading-tight text-white truncate">
                    {editingItem ? "Update" : "Add New"} {activeConfig.singular}
                  </DialogTitle>
                  <DialogDescription className="text-[10px] sm:text-[11px] font-bold leading-none mt-0.5 normal-case tracking-normal opacity-80 text-white/60 truncate">
                    Institutional configuration registry
                  </DialogDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-50 border border-white/5"
                >
                  <LucideIcons.X size={18} sm:size={20} strokeWidth={3} />
                </button>
              </DialogHeader>
            </div>

            <div className={cn(
              "px-4 sm:px-8 pt-4 sm:pt-6 pb-6 space-y-6 overflow-y-auto custom-scrollbar flex-1",
              activeTab === "schools" ? "max-h-[55vh] sm:max-h-[50vh]" : "max-h-[40vh] sm:max-h-[45vh]"
            )}>


              {/* Primary Name Field with genuine floating label */}
              {activeTab === "navigation" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  {/* Left Side: Core Menu Logic */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Menu Details</h3>
                    </div>

                    {/* Navigation Title */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold pl-0.5">
                        Navigation Title
                      </Label>
                      <div className="relative group">
                        <div className={cn(
                          "absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10",
                          formErrors.title ? "text-red-500" : "text-indigo-500 group-focus-within:text-indigo-600"
                        )}>
                          <LucideIcons.LayoutGrid size={20} className="stroke-[2]" />
                        </div>
                        <input
                          ref={(el) => { if (el) inputRefs.current["title"] = el; }}
                          onKeyDown={(e) => handleKeyDown(e, "path")}
                          type="text"
                          placeholder="Enter navigation title"
                          className={cn(
                            "w-full h-14 pl-12 pr-5 bg-white border-2 rounded-xl text-[15px] text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-normal transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                            formErrors.title ? "border-red-400 bg-red-50/20" : "border-slate-200"
                          )}
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value });
                            if (formErrors.title) setFormErrors(prev => ({ ...prev, title: "" }));
                          }}
                        />
                      </div>
                      {formErrors.title && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1">NAVIGATION TITLE REQUIRED</p>
                      )}
                    </div>

                    {/* Navigation Path */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold pl-0.5">
                        Navigation Path
                      </Label>
                      <div className="relative group">
                        <div className={cn(
                          "absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10",
                          formErrors.path ? "text-red-500" : "text-indigo-500 group-focus-within:text-indigo-600"
                        )}>
                          <LucideIcons.Link size={18} className="stroke-[2]" />
                        </div>
                        <input
                          ref={(el) => { if (el) inputRefs.current["path"] = el; }}
                          onKeyDown={(e) => handleKeyDown(e, "parentId")}
                          type="text"
                          placeholder="e.g. /dashboard/registry"
                          className={cn(
                            "w-full h-14 pl-12 pr-5 bg-white border-2 rounded-xl text-[15px] text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-normal transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                            formErrors.path ? "border-red-400 bg-red-50/20" : "border-slate-200"
                          )}
                          value={formData.path}
                          onChange={(e) => {
                            setFormData({ ...formData, path: e.target.value });
                            if (formErrors.path) setFormErrors(prev => ({ ...prev, path: "" }));
                          }}
                        />
                      </div>
                      {formErrors.path ? (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1">NAVIGATION PATH REQUIRED</p>
                      ) : (
                        <p className="text-[12px] text-slate-400 font-normal pl-0.5">Enter the URL path for this navigation menu.</p>
                      )}
                    </div>

                    {/* Parent Menu + Sort Order */}
                    <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-3">
  <Label className="text-slate-800 text-[15px] font-bold pl-1 tracking-tight">
    Parent Menu
  </Label>

  <Select
    value={formData.parentId}
    onValueChange={(v) => {
      setFormData({ ...formData, parentId: v });
      inputRefs.current["sortOrder"]?.focus();
    }}
  >
    <SelectTrigger
      ref={(el) => {
        if (el) inputRefs.current["parentId"] = el;
      }}
      className="
        w-full min-h-[64px]
        rounded-xl
        border border-slate-200/80
        bg-gradient-to-b from-white to-slate-50/80
        px-5
        shadow-sm
        hover:shadow-md
        hover:border-slate-300
        focus:border-indigo-500
        focus:ring-4
        focus:ring-indigo-500/10
        transition-all duration-300
        data-[state=open]:border-indigo-500
        data-[state=open]:shadow-lg
      "
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 shrink-0">
          <LucideIcons.LayoutGrid
            size={18}
            className="text-indigo-500"
          />
        </div>

        <div className="flex flex-col items-start text-left flex-1 overflow-hidden">
          <span className="text-[11px] font-medium text-slate-400 leading-none mb-1">
            Menu Hierarchy
          </span>

          <SelectValue
            placeholder="Root Level"
            className="text-[15px] font-semibold text-slate-800 truncate"
          />
        </div>
      </div>
    </SelectTrigger>

    <SelectContent
      className="
        rounded-xl
        shadow-2xl
        p-3
        bg-white/95
        backdrop-blur-xl
        border border-slate-100
      "
    >
      <SelectItem
        value=""
        className="
          rounded-xl
          font-semibold
          py-4 px-3
          hover:bg-slate-50
          cursor-pointer
          italic
          text-slate-400
          transition-all
        "
      >
        Root Level
      </SelectItem>

      {dependencies.parentNavs?.map((n: any) => (
        <SelectItem
          key={n.id}
          value={n.id.toString()}
          className="
            rounded-xl
            font-semibold
            py-4 px-3
            hover:bg-indigo-50
            focus:bg-indigo-50
            cursor-pointer
            text-slate-700
            transition-all
          "
        >
          {n.title}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  <p className="text-[12px] text-slate-400 font-medium pl-1 leading-relaxed">
    Select the parent menu level.
  </p>
</div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 text-sm font-semibold pl-0.5">Sort Order</Label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none z-10">
                            <LucideIcons.ArrowUpDown size={17} className="stroke-[2]" />
                          </div>
                          <input
                            ref={(el) => { if (el) inputRefs.current["sortOrder"] = el; }}
                            onKeyDown={(e) => handleKeyDown(e, "icon")}
                            type="number"
                            placeholder="0"
                            className="w-full h-14 pl-12 pr-5 bg-white border-2 border-slate-200 rounded-xl text-[15px] text-slate-900 font-semibold placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            value={formData.sortOrder}
                            onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                          />
                        </div>
                        <p className="text-[12px] text-slate-400 font-normal pl-0.5">Display order of this menu.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Visuals & Access */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Technical &amp; Access</h3>
                    </div>

                    {/* Display Icon */}
                  <div className="space-y-3">
  <Label className="text-slate-800 text-[15px] font-bold pl-1 tracking-tight">
    Display Icon
  </Label>

  <Select
    value={formData.icon}
    onValueChange={(v) => setFormData({ ...formData, icon: v })}
  >
    <SelectTrigger
      className="
        w-full min-h-[64px]
        rounded-xl
        border border-slate-200/80
        bg-gradient-to-b from-white to-slate-50/80
        px-5
        shadow-sm
        hover:shadow-md
        hover:border-slate-300
        focus:border-indigo-500
        focus:ring-4
        focus:ring-indigo-500/10
        transition-all duration-300
        data-[state=open]:border-indigo-500
        data-[state=open]:shadow-lg
      "
    >
      <div className="flex items-center gap-3 w-full">
        <div
          className="
            flex items-center justify-center
            w-10 h-10
            rounded-xl
            bg-indigo-50
            border border-indigo-100
            shrink-0
          "
        >
          <div className="text-indigo-500">
            {formData.icon ? (
              (() => {
                const IconComp = (LucideIcons as any)[formData.icon];
                return IconComp ? (
                  <IconComp size={18} />
                ) : (
                  <LucideIcons.LayoutGrid size={18} />
                );
              })()
            ) : (
              <LucideIcons.LayoutGrid size={18} />
            )}
          </div>
        </div>

        <div className="flex flex-col items-start text-left flex-1 overflow-hidden">
          <span className="text-[11px] font-medium text-slate-400 leading-none mb-1">
            Menu Icon
          </span>

          <SelectValue
            placeholder="No Icon"
            className="text-[15px] font-semibold text-slate-800 truncate"
          />
        </div>
      </div>
    </SelectTrigger>

    <SelectContent
      className="
        rounded-xl
        shadow-2xl
        p-3
        bg-white/95
        backdrop-blur-xl
        border border-slate-100
        max-h-72
      "
    >
      <SelectItem
        value=""
        className="
          rounded-xl
          font-semibold
          py-4 px-3
          hover:bg-slate-50
          cursor-pointer
          transition-all
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100">
            <LucideIcons.LayoutGrid size={17} className="text-slate-500" />
          </div>

          <span className="text-slate-500">None</span>
        </div>
      </SelectItem>

      {[
        "LayoutDashboard",
        "Users",
        "GraduationCap",
        "CalendarCheck",
        "CreditCard",
        "MessageSquare",
        "Settings",
        "School",
        "Database",
        "Map",
        "Layers",
        "Home",
        "BookOpen",
        "Shield",
      ].map((icon) => (
        <SelectItem
          key={icon}
          value={icon}
          className="
            rounded-xl
            font-semibold
            py-4 px-3
            hover:bg-indigo-50
            focus:bg-indigo-50
            cursor-pointer
            transition-all
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex items-center justify-center
                w-9 h-9
                rounded-xl
                bg-indigo-50
                border border-indigo-100
              "
            >
              {(() => {
                const IconComp = (LucideIcons as any)[icon];
                return IconComp ? (
                  <IconComp
                    size={17}
                    className="text-indigo-600"
                  />
                ) : null;
              })()}
            </div>

            <span className="text-slate-700 text-[14px]">
              {icon}
            </span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  <p className="text-[12px] text-slate-400 font-medium pl-1 leading-relaxed">
    Choose an icon to represent this menu.
  </p>
</div>

                    {/* Roles Access Control */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold pl-0.5">Roles Access Control</Label>
                      <div className="flex flex-col gap-2">
                        {[
                          { id: "superadmin", label: "Super Admin", desc: "Full system access and control.", icon: LucideIcons.Shield },
                          { id: "admin", label: "Admin", desc: "Administrative access to manage data.", icon: LucideIcons.User },
                          { id: "teacher", label: "Teacher", desc: "Access for teachers and staff.", icon: LucideIcons.GraduationCap },
                          { id: "parent", label: "Parent", desc: "Access for parents and guardians.", icon: LucideIcons.Users }
                        ].map(role => {
                          const isChecked = formData.roles?.includes(role.id);
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => {
                                const newRoles = isChecked
                                  ? (formData.roles || []).filter((r: string) => r !== role.id)
                                  : [...(formData.roles || []), role.id];
                                setFormData({ ...formData, roles: newRoles });
                              }}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all select-none cursor-pointer w-full text-left",
                                isChecked
                                  ? "bg-indigo-50/40 border-indigo-300 shadow-sm"
                                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                              )}
                            >
                              <div className={cn(
                                "w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0",
                                isChecked
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "bg-white border-slate-300"
                              )}>
                                {isChecked && <LucideIcons.Check size={11} strokeWidth={3.5} />}
                              </div>
                              <div className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                isChecked ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"
                              )}>
                                <role.icon size={16} />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className={cn("text-[15px] font-semibold leading-tight", isChecked ? "text-slate-900" : "text-slate-700")}>
                                  {role.label}
                                </span>
                                <span className="text-[12px] font-normal text-slate-400">{role.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}



              {activeTab === "schools" && (
                <div className="space-y-8 overflow-y-auto max-h-[70vh] pr-3 custom-scrollbar">
                  {/* Institutional Identity (Top Header) - School Name, Short Name, Email, Phone */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_250px] gap-6">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                            SCHOOL NAME
                          </Label>
                          <div className="relative group">
                            <div className={cn("absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10", formErrors.name ? "text-red-500" : "text-slate-400 group-focus-within:text-indigo-600")}>
                              <LucideIcons.School size={20} sm:size={24} className="stroke-[2]" />
                            </div>
                            <input
                              ref={(el) => { if (el) inputRefs.current["name"] = el; }}
                              onKeyDown={(e) => handleKeyDown(e, "shortName")}
                              type="text"
                              placeholder="Enter School Name.."
                              className={cn(
                                "w-full h-14 pl-12 sm:pl-14 pr-6 bg-slate-50/30 border-2 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none",
                                formErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-100 focus:border-indigo-600 focus:bg-white"
                              )}
                              value={formData.name}
                              onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                              }}
                            />
                          </div>
                          {formErrors.name && (
                            <p className="text-red-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest pl-1 mt-1">SCHOOL NAME REQUIRED</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                          <div className="space-y-3">
                            <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                              Short Name/Code
                            </Label>
                            <input
                              ref={(el) => { if (el) inputRefs.current["shortName"] = el; }}
                              onKeyDown={(e) => handleKeyDown(e, "email")}
                              type="text"
                              placeholder="SIS / 001"
                              className={cn(
                                "w-full h-14 px-5 sm:px-6 bg-slate-50/30 border-2 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] font-bold outline-none uppercase",
                                formErrors.shortName ? "border-red-500" : "border-slate-100 focus:border-indigo-600 focus:bg-white"
                              )}
                              value={formData.shortName}
                              onChange={(e) => {
                                setFormData({ ...formData, shortName: e.target.value.toUpperCase() });
                                if (formErrors.shortName) setFormErrors(prev => ({ ...prev, shortName: "" }));
                              }}
                            />
                            {formErrors.shortName && (
                              <p className="text-red-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest pl-1 mt-1">SHORT NAME REQUIRED</p>
                            )}
                          </div>
                          <div className="space-y-3">
                            <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                              Website URL
                            </Label>
                            <input
                              type="text"
                              placeholder="www.school.com"
                              className="w-full h-14 px-5 sm:px-6 bg-slate-50/30 border-2 border-slate-100 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] font-bold outline-none focus:border-indigo-600 focus:bg-white"
                              value={formData.websiteUrl}
                              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                            />
                          </div>
                        </div>

             <div className="grid grid-cols-1 gap-4">
  
  {/* EMAIL */}
  <div className="space-y-3">
    <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
      Email Address
    </Label>

    <div className="relative group">
      {/* Left Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 shadow-sm border border-indigo-200/50 z-10">
        <LucideIcons.Mail className="w-4 h-4 text-indigo-600" />
      </div>

      <input
        ref={(el) => { if (el) inputRefs.current["email"] = el; }}
        onKeyDown={(e) => handleKeyDown(e, "phone")}
        type="email"
        placeholder="school@email.com"
        className={cn(
          "w-full h-16 pl-16 pr-5 bg-gradient-to-b from-white to-slate-50/80",
          "border-2 rounded-2xl text-[14px] sm:text-[15px] font-bold text-slate-800",
          "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
          "hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)]",
          "transition-all duration-300 outline-none",
          "placeholder:text-slate-400",
          (formErrors.email || formErrors.emailFormat)
            ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500"
            : "border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
        )}
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });

          if (formErrors.email || formErrors.emailFormat) {
            setFormErrors(prev => ({
              ...prev,
              email: "",
              emailFormat: ""
            }));
          }
        }}
      />
    </div>

    {formErrors.email && (
      <p className="text-red-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest pl-1 mt-1">
        EMAIL ADDRESS REQUIRED
      </p>
    )}

    {formErrors.emailFormat && !formErrors.email && (
      <p className="text-red-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest pl-1 mt-1">
        VALID EMAIL REQUIRED
      </p>
    )}
  </div>

  {/* PHONE */}
  <div className="space-y-3">
    <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
      Phone Number
    </Label>

    <div className="relative group">
      {/* Left Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 shadow-sm border border-indigo-200/50 z-10">
        <LucideIcons.Phone className="w-4 h-4 text-indigo-600" />
      </div>

      <input
        ref={(el) => { if (el) inputRefs.current["phone"] = el; }}
        onKeyDown={(e) => handleKeyDown(e, "city")}
        type="text"
        placeholder="10 Digits"
        className={cn(
          "w-full h-16 pl-16 pr-5 bg-gradient-to-b from-white to-slate-50/80",
          "border-2 rounded-2xl text-[14px] sm:text-[15px] font-bold text-slate-800",
          "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
          "hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)]",
          "transition-all duration-300 outline-none",
          "placeholder:text-slate-400",
          formErrors.phone
            ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500"
            : "border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
        )}
        value={formData.phone}
        onChange={(e) => {
          setFormData({
            ...formData,
            phone: e.target.value.replace(/\D/g, '').slice(0, 10)
          });

          if (formErrors.phone) {
            setFormErrors(prev => ({
              ...prev,
              phone: ""
            }));
          }
        }}
      />
    </div>

    {formErrors.phone && (
      <p className="text-red-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest pl-1 mt-1">
        PHONE NUMBER REQUIRED
      </p>
    )}
  </div>

</div>
                      </div>

                      {/* Branding Photo */}
                      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center p-3 sm:p-4 bg-slate-50/30 border-2 border-slate-100 rounded-xl sm:rounded-[2rem] gap-3">
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-xl bg-white border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center gap-1 sm:gap-2 cursor-pointer group hover:bg-indigo-50/50 hover:border-indigo-300 transition-all overflow-hidden relative shadow-sm"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSelectedPhotoFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => setLocalPhotoPreview(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          {(localPhotoPreview || formData.profilePhotoPath) ? (
                            <img src={localPhotoPreview || resolvePhotoUrl(formData.profilePhotoPath)} alt="Logo" className="w-full h-full object-contain p-2" />
                          ) : (
                            <>
                              <LucideIcons.Image className="text-slate-300 group-hover:text-indigo-400" size={24} sm:size={32} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500">Logo</span>
                            </>
                          )}
                        </div>
                        
                        <Label className="text-slate-900 text-[11px] sm:text-sm font-bold pl-0.5 uppercase tracking-wide text-right sm:text-center">
                        School logo / Branding
                        </Label>
                      </div>
                    </div>

                    {/* Location & Address Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                          {/* State Select */}
                      <div className="relative group">
                       
      


                    <Label className="text-slate-900 text-[11px] sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                      State
                    </Label>
                    <Select
                      value={formData.schoolState}
                      onValueChange={(v) => {
                        setFormData({ ...formData, schoolState: v });
                        if (formErrors.schoolState) setFormErrors(prev => ({ ...prev, schoolState: "" }));
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "relative h-12 sm:h-16 min-h-[48px] sm:min-h-[64px] border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50/80",
                          "font-bold rounded-xl sm:rounded-xl pl-12 sm:pl-14 pr-4 sm:pr-5 text-sm sm:text-[14px] text-slate-800",
                          "shadow-sm hover:shadow-md transition-all duration-300",
                          "focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400",
                          "data-[state=open]:border-indigo-400 data-[state=open]:shadow-lg",
                          formErrors.schoolState && "border-red-500 focus:ring-red-500/10"
                        )}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="absolute left-2.5 sm:left-3 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-100 shadow-sm border border-indigo-200/50">
                            <MapPinned className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                          </div>
                          <div className="flex flex-col items-start text-left leading-tight truncate flex-1">
                            <SelectValue placeholder="Select State" />
                          </div>
                        </div>
                      </SelectTrigger>

  <SelectContent
    className="min-w-[260px] rounded-xl border border-slate-100 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
  >
    <SelectItem value="" className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-slate-50 transition-all opacity-50 italic">
      Select State
    </SelectItem>
    {dependencies.states?.map((s) => (
      <SelectItem
        key={s.id}
        value={s.name}
        className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-indigo-50 transition-all"
      >
        <div className="flex items-center gap-3">

          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
            <Flag className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-slate-700">
              {s.name}
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              State
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                        {formErrors.schoolState && (
                          <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">STATE REQUIRED</p>
                        )}
                      </div>

                      {/* City Select */}
                      <div className="relative group">

                         <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10", formErrors.city ? "text-red-500" : "text-slate-400 group-focus-within:text-indigo-600")}>
                          {/* <LucideIcons.MapPin size={20} className="stroke-[2]" /> */}
                        </div>
      

                    <Label className="text-slate-900 text-[11px] sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                      City
                    </Label>
                    <Select
                      value={formData.city}
                      onValueChange={(v) => {
                        setFormData({ ...formData, city: v });
                        if (formErrors.city) setFormErrors(prev => ({ ...prev, city: "" }));
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "relative w-full h-12 sm:h-16 min-h-[48px] sm:min-h-[64px] border-2 bg-gradient-to-b from-white to-slate-50/80",
                          "rounded-xl sm:rounded-xl pl-12 sm:pl-14 pr-4 sm:pr-5 font-bold text-sm sm:text-[14px] text-slate-800",
                          "shadow-sm hover:shadow-md transition-all duration-300",
                          "focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400",
                          "data-[state=open]:border-indigo-400 data-[state=open]:shadow-lg",
                          formErrors.city ? "border-red-500 focus:ring-red-500/10" : "border-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="absolute left-2.5 sm:left-3 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-100 shadow-sm border border-indigo-200/50">
                            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                          </div>
                          <div className="flex flex-col items-start text-left leading-tight truncate flex-1">
                            <SelectValue placeholder="Select City" />
                          </div>
                        </div>
                      </SelectTrigger>

  <SelectContent className="min-w-[280px] rounded-xl border border-slate-100 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
    <SelectItem value="" className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-slate-50 transition-all opacity-50 italic">
      Select City
    </SelectItem>
    {dependencies.cities?.map((c) => (
      <SelectItem
        key={c.id}
        value={c.name}
        className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-indigo-50 transition-all"
      >
        <div className="flex items-center gap-3">

          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
            <MapPinned className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-slate-700">
              {c.name}
            </span>


          </div>
        </div>
      </SelectItem>
    ))}

  </SelectContent>
</Select>
                        {formErrors.city && (
                          <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">CITY REQUIRED</p>
                        )}
                      </div>

                   

                      {/* Pincode Input */}
                      <div className="relative group">
                          <Label className="text-slate-900 text-[11px] sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                            Pin Code 
                          </Label>
                          <input
                            ref={(el) => { if (el) inputRefs.current["pincode"] = el; }}
                            onKeyDown={(e) => handleKeyDown(e, "city")}
                            type="text"
                            placeholder="6 Digits"
                            className={cn(
                              "w-full h-12 sm:h-14 px-4 sm:px-6 bg-slate-50/30 border-2 rounded-xl sm:rounded-xl text-sm sm:text-[15px] font-bold outline-none",
                              formErrors.pincode ? "border-red-500" : "border-slate-100 focus:border-indigo-600 focus:bg-white"
                            )}
                            value={formData.pincode}
                            onChange={(e) => {
                              setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) });
                              if (formErrors.pincode) setFormErrors(prev => ({ ...prev, pincode: "" }));
                            }}
                          />
                          {formErrors.pincode && (
                            <p className="text-red-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest pl-1 mt-1">PINCODE REQUIRED</p>
                          )}
                      </div>
                    </div>

                    <div className="space-y-2">
                     
                         <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
INSTITUTIONAL ADDRESS
                </Label>
                      <div className="relative group">
                         <div className={cn("absolute left-5 top-6 transition-colors pointer-events-none z-10", formErrors.address ? "text-red-500" : "text-slate-400 group-focus-within:text-indigo-600")}>
                          <LucideIcons.Map size={22} className="stroke-[2]" />
                        </div>
                        <textarea
                          ref={(el) => { if (el) inputRefs.current["address"] = el; }}
                          placeholder="Enter full institutional address with landmarks..."
                          className={cn(
                            "w-full min-h-[120px] pl-14 pr-6 py-6 bg-white border-2 rounded-xl text-[15px] font-semibold placeholder:text-slate-400 transition-all outline-none resize-none",
                            formErrors.address ? "border-red-500 bg-red-50/10" : "border-slate-100 focus:border-indigo-600"
                          )}
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({ ...formData, address: e.target.value });
                            if (formErrors.address) setFormErrors(prev => ({ ...prev, address: "" }));
                          }}
                        />
                      </div>
                      {formErrors.address && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">INSTITUTIONAL ADDRESS REQUIRED</p>
                      )}
                    </div>
                  </div>

                  {/* Section: SMS & WhatsApp Gateway */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          
                   
                     <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
SMS & WhatsApp Gateway Configuration
                </Label>
                    </div>                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-4">
                        <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                          SMS LIMIT
                        </Label>
                        <input
                          ref={(el) => { if (el) inputRefs.current["smsLimit"] = el; }}
                          onKeyDown={(e) => handleKeyDown(e, "smsSenderId")}
                          type="text"
                          placeholder="e.g. 5000"
                          className={cn(
                            "w-full h-14 px-5 sm:px-6 bg-slate-50/30 border-2 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] font-bold outline-none",
                            formErrors.smsLimit ? "border-red-500" : "border-slate-100 focus:border-indigo-600 focus:bg-white"
                          )}
                          value={formData.smsLimit}
                          onChange={(e) => {
                            setFormData({ ...formData, smsLimit: e.target.value });
                            if (formErrors.smsLimit) setFormErrors(prev => ({ ...prev, smsLimit: "" }));
                          }}
                        />
                        {formErrors.smsLimit && (
                          <p className="text-red-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest pl-1 mt-1">SMS LIMIT REQUIRED</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                          SMS Sender ID
                        </Label>
                        <input
                          ref={(el) => { if (el) inputRefs.current["smsSenderId"] = el; }}
                          onKeyDown={(e) => handleKeyDown(e, "whatsappApi")}
                          type="text"
                          placeholder="e.g. SCNID"
                          className={cn(
                            "w-full h-14 px-5 sm:px-6 bg-slate-50/30 border-2 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] font-bold outline-none",
                            formErrors.smsSenderId ? "border-red-500" : "border-slate-100 focus:border-indigo-600 focus:bg-white"
                          )}
                          value={formData.smsSenderId}
                          onChange={(e) => {
                            setFormData({ ...formData, smsSenderId: e.target.value.toUpperCase() });
                            if (formErrors.smsSenderId) setFormErrors(prev => ({ ...prev, smsSenderId: "" }));
                          }}
                        />
                        {formErrors.smsSenderId && (
                          <p className="text-red-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest pl-1 mt-1">SMS SENDER ID REQUIRED</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">

  {/* WhatsApp API Input */}
  <div className="space-y-3">
 


  </div>

  {/* Toggle Options */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    {[
      {
        key: "enableCoreSms",
        label: "Enable Core SMS"
      },
      {
        key: "attendanceSms",
        label: "Attendance SMS"
      },
      {
        key: "birthdayGreetings",
        label: "Birthday Greetings"
      },
      {
        key: "whatsappApiEnabled",
        label: "WhatsApp API"
      }
    ].map((item) => {
      const isActive = formData[item.key as keyof typeof formData];

      return (
        <button
          key={item.key}
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              [item.key]: !isActive
            })
          }
          className={cn(
            "group relative flex items-center gap-3",
            "h-14 px-4 rounded-xl border-2 bg-white",
            "transition-all duration-300 shadow-sm",
            isActive
              ? "border-indigo-300 bg-indigo-50/70"
              : "border-slate-200 hover:border-indigo-200"
          )}
        >
          
          {/* Checkbox */}
          <div
            className={cn(
              "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
              isActive
                ? "bg-indigo-600 border-indigo-600"
                : "border-slate-400 bg-white"
            )}
          >
            {isActive && (
              <LucideIcons.Check className="w-3 h-3 text-white stroke-[3]" />
            )}
          </div>

          {/* Label */}
          <span
            className={cn(
              "text-[12px] font-black tracking-wide text-left",
              isActive ? "text-indigo-700" : "text-slate-600"
            )}
          >
            {item.label}
          </span>
        </button>
      );
    })}
  </div>
</div>
                  </div>

                  {/* Section: Transit & Support Helpdesks */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                        <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
           Transit & Support Helpdesks
                </Label>
                        
                      {/* <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-900 italic">Transit & Support Helpdesks</h3> */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                          SCANID HELPLINE
                        </Label>
                        <input
                          type="text"
                          placeholder="Support number"
                          className="w-full h-14 px-5 sm:px-6 bg-slate-50/20 border-2 border-slate-100 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                          value={formData.scanidHelpline}
                          onChange={(e) => setFormData({ ...formData, scanidHelpline: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                          SCANID EMAIL
                        </Label>
                        <input
                          type="email"
                          placeholder="Support email"
                          className="w-full h-14 px-5 sm:px-6 bg-slate-50/20 border-2 border-slate-100 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                          value={formData.scanidEmail}
                          onChange={(e) => setFormData({ ...formData, scanidEmail: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                          SCHOOL IN-CHARGE CONTACT
                        </Label>
                        <input
                          type="text"
                          placeholder="Admin number"
                          className="w-full h-14 px-5 sm:px-6 bg-slate-50/20 border-2 border-slate-100 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                          value={formData.schoolInChargeContact}
                          onChange={(e) => setFormData({ ...formData, schoolInChargeContact: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                          INSTITUTIONAL BUS FLEET NUMBERS
                        </Label>
                        <input
                          type="text"
                          placeholder="e.g. DL-11, HR-26"
                          className="w-full h-14 px-5 sm:px-6 bg-slate-50/20 border-2 border-slate-100 rounded-xl sm:rounded-xl text-[14px] sm:text-[15px] font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all"
                          value={formData.institutionalBusFleetNumbers}
                          onChange={(e) => setFormData({ ...formData, institutionalBusFleetNumbers: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">

                     <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
                 SYSTEM STATUS
                </Label>
                     <Select
  value={formData.systemStatus}
  onValueChange={(v) =>
    setFormData({
      ...formData,
      systemStatus: v
    })
  }
>
  <SelectTrigger
    className={cn(
      "relative w-full h-16 min-h-[64px] border-2 border-slate-200",
      "bg-gradient-to-b from-white to-slate-50/80",
      "rounded-xl pl-14 pr-5",
      "font-bold text-[14px] text-slate-800",
      "shadow-sm hover:shadow-md",
      "transition-all duration-300",
      "focus:ring-4 focus:ring-indigo-500/10",
      "focus:border-indigo-400",
      "data-[state=open]:border-indigo-400",
      "data-[state=open]:shadow-lg"
    )}
  >
    <div className="flex items-center gap-3 w-full">

      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-100 shadow-sm border border-indigo-200/50">
        {formData.systemStatus === "Active" ? (
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        ) : formData.systemStatus === "Maintenance" ? (
          <Settings2 className="w-4 h-4 text-amber-600" />
        ) : formData.systemStatus === "Disabled" ? (
          <ShieldX className="w-4 h-4 text-red-600" />
        ) : (
          <LucideIcons.Activity className="w-4 h-4 text-indigo-600" />
        )}
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate flex-1">
       

        <SelectValue placeholder="Select Status" />
      </div>


    </div>
  </SelectTrigger>

  <SelectContent
    className="min-w-[280px] rounded-xl border border-slate-100 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200"
  >
    <SelectItem value="" className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-slate-50 transition-all opacity-50 italic">
      Select Access Status
    </SelectItem>

    {/* Active */}
    <SelectItem
      value="Active"
      className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-emerald-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-slate-700">
            Institutional Operational
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
            Active
          </span>
        </div>
      </div>
    </SelectItem>

    {/* Maintenance */}
    <SelectItem
      value="Maintenance"
      className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-amber-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm">
          <Settings2 className="w-4 h-4 text-amber-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-slate-700">
            Maintenance Mode
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500">
            Maintenance
          </span>
        </div>
      </div>
    </SelectItem>

    {/* Disabled */}
    <SelectItem
      value="Disabled"
      className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-red-50 transition-all"
    >
      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shadow-sm">
          <ShieldX className="w-4 h-4 text-red-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-slate-700">
            System Disabled
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">
            Disabled
          </span>
        </div>
      </div>
    </SelectItem>

  </SelectContent>
</Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-900 text-[11px] sm:text-sm font-bold pl-0.5 uppercase tracking-wide">
                        ADDITIONAL DESCRIPTION
                      </Label>
                      <textarea
                        placeholder="Any additional details..."
                        className="w-full min-h-[70px] sm:min-h-[80px] px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/20 border-2 border-slate-100 rounded-xl sm:rounded-xl text-sm sm:text-[14px] font-semibold outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "academic-years" && (
                <>
                  <div className="space-y-2 mb-4">
                    <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
                      NAME / LABEL
                    </Label>
                    <div className="relative group">
                      <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10", formErrors.name ? "text-red-500" : "text-slate-400 group-focus-within:text-indigo-600")}>
                        <LucideIcons.Shield className="size-5 sm:size-[20px] stroke-[2]" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter name..."
                        className={cn(
                          "w-full h-12 pl-14 pr-6 bg-white border-2 rounded-xl text-base text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none focus:border-indigo-600",
                          formErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-100"
                        )}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                        }}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">NAME / LABEL REQUIRED</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isCurrent: !formData.isCurrent })}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-xl border transition-all text-left w-full mb-6 cursor-pointer",
                      formData.isCurrent
                        ? "bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50/60"
                        : "bg-slate-50/20 border-slate-200/80 hover:bg-slate-50/40"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2.5 rounded-xl transition-colors", formData.isCurrent ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-400")}>
                        <LucideIcons.CalendarCheck size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-none">Set as Current Academic Year</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Set as current school session</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-12 h-7 rounded-full transition-all duration-300 relative",
                      formData.isCurrent
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_4px_10px_rgba(99,102,241,0.25)]"
                        : "bg-slate-200"
                    )}>
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 bg-white w-6 h-6 rounded-full transition-all duration-300 shadow-md flex items-center justify-center",
                          formData.isCurrent ? "translate-x-5" : "translate-x-0"
                        )}
                      >
                        {formData.isCurrent && <LucideIcons.Check size={10} className="text-indigo-600 stroke-[3]" />}
                      </span>
                    </div>
                  </button>
                </>
              )}

              {activeTab === "houses" && (
                <>
                  <div className="space-y-2 mb-6">
                    <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
                      NAME / LABEL
                    </Label>
                    <div className="relative group">
                      <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10", formErrors.name ? "text-red-500" : "text-indigo-600")}>
                        <LucideIcons.Home size={22} className="stroke-[2]" />
                      </div>
                      <input
                        ref={(el) => { if (el) inputRefs.current["name"] = el; }}
                        onKeyDown={(e) => handleKeyDown(e, "colorHex")}
                        type="text"
                        placeholder="Enter house name..."
                        className={cn(
                          "w-full h-12 pl-14 pr-6 bg-white border-2 rounded-xl text-base text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none focus:border-indigo-600",
                          formErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-100"
                        )}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                        }}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">NAME / LABEL REQUIRED</p>
                    )}
                  </div>

                  <div className="relative mb-6 group w-full">
                    <div className="grid grid-cols-5 gap-4">
                      <div className="col-span-1 border-2 border-slate-200/80 rounded-xl h-12 flex items-center justify-center bg-white shadow-sm relative overflow-hidden transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                        <input
                          id="color"
                          type="color"
                          className="absolute inset-0 w-full h-full cursor-pointer border-none p-0 scale-150 bg-transparent"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                      </div>
                      <div className="col-span-4 relative">
                        <input
                          ref={(el) => { if (el) inputRefs.current["color"] = el; }}
                          onKeyDown={(e) => handleKeyDown(e, "description")}
                          id="colorHex"
                          placeholder=" "
                          className="w-full pl-12 pr-5 border-2 border-slate-200/80 rounded-xl h-12 pt-5 pb-1 text-slate-800 font-mono font-bold uppercase bg-white transition-all duration-300 outline-none peer"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                        <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none z-10">
                          <LucideIcons.Palette size={20} />
                        </div>
                        <label className="absolute left-12 top-5 text-slate-400 font-semibold tracking-wide transition-all pointer-events-none select-none z-10 text-sm peer-focus:text-xs peer-focus:-top-2.5 peer-focus:left-4 peer-focus:bg-white peer-focus:px-2 peer-focus:text-indigo-600 peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest">
                          House Color
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "sub-castes" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label className={cn(
                        "text-[11px] font-black uppercase tracking-widest pl-0.5",
                        formErrors.name ? "text-red-500" : "text-slate-500"
                      )}>
                        Sub-Caste Name
                      </Label>
                      <div className="relative group">
                        <div className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10", formErrors.name ? "text-red-500" : "text-indigo-600")}>
                          <LucideIcons.Users size={20} className="stroke-[2]" />
                        </div>
                        <input
                          ref={(el) => { if (el) inputRefs.current["name"] = el; }}
                          onKeyDown={(e) => handleKeyDown(e, "casteId")}
                          type="text"
                          placeholder="Sub-caste name..."
                          className={cn(
                            "w-full h-12 pl-12 pr-4 bg-white border-2 rounded-xl text-base text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none",
                            formErrors.name ? "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-red-500/10" : "border-slate-100 focus:border-indigo-600"
                          )}
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                          }}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">NAME REQUIRED</p>
                      )}
                    </div>

                    <div className="relative group w-full pt-6">
                      <Select
                        value={formData.casteId}
                        onValueChange={(v) => {
                          setFormData({ ...formData, casteId: v });
                          if (formErrors.casteId) setFormErrors(prev => ({ ...prev, casteId: "" }));
                        }}
                      >
                        <SelectTrigger
                          ref={el => { inputRefs.current["casteId"] = el; }}
                          className={cn(
                            "w-full border-2 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 bg-white font-bold px-4 text-left flex items-center justify-between text-slate-800 outline-none transition-all duration-300",
                            formErrors.casteId ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-100 group-hover:border-slate-200"
                          )}
                        >
                          <SelectValue placeholder="Parent Caste">
                            {formData.casteId ? (
                              <div className="flex items-center gap-3">
                                <LucideIcons.GitBranch size={18} className="text-indigo-600" />
                                <span className="text-slate-900 font-semibold truncate max-w-[120px]">{dependencies.castes?.find(c => c.id.toString() === formData.casteId)?.name}</span>
                              </div>
                            ) : <span className="text-slate-400 font-medium">Select Parent</span>}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-2xl p-2 bg-white max-h-60 overflow-y-auto">
                          <SelectItem value="" className="font-bold py-3 px-4 rounded-xl text-slate-400 italic hover:bg-slate-50 cursor-pointer">Select Parent Caste</SelectItem>
                          {Array.isArray(dependencies.castes) && dependencies.castes.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()} className="font-bold py-3 px-4 rounded-xl text-left hover:bg-slate-50 cursor-pointer">
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className={cn(
                        "absolute top-0 left-4 bg-white px-2 text-[10px] font-black uppercase tracking-widest transition-all select-none z-10",
                        formErrors.casteId ? "text-red-500" : "text-slate-400 group-focus-within:text-indigo-500"
                      )}>
                        Parent Caste
                      </div>
                      {formErrors.casteId && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">CASTE REQUIRED</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "cities" && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className={cn(
                        "text-[11px] font-black uppercase tracking-widest pl-0.5",
                        formErrors.name ? "text-red-500" : "text-slate-500"
                      )}>
                        City Name
                      </Label>
                      <div className="relative group">
                        <div className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10", formErrors.name ? "text-red-500" : "text-indigo-600")}>
                          <LucideIcons.MapPin size={20} className="stroke-[2]" />
                        </div>
                        <input
                          onKeyDown={(e) => handleKeyDown(e, "stateId")}
                          ref={(el) => { if (el) inputRefs.current["name"] = el; }}
                          type="text"
                          placeholder="Enter location name"
                          className={cn(
                            "w-full h-12 pl-12 pr-4 bg-white border-2 rounded-xl text-base text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none",
                            formErrors.name ? "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-red-500/10" : "border-slate-100 focus:border-indigo-600"
                          )}
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                          }}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">CITY NAME REQUIRED</p>
                      )}
                    </div>

                    <div className="relative group w-full pt-6 sm:pt-7">
                      <Select
                        value={formData.stateId}
                        onValueChange={(v) => {
                          setFormData({ ...formData, stateId: v });
                          if (formErrors.stateId) setFormErrors(prev => ({ ...prev, stateId: "" }));
                        }}
                      >
                        <SelectTrigger
                          ref={el => { inputRefs.current["stateId"] = el; }}
                          className={cn(
                            "w-full border-2 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl h-12 bg-white font-bold px-4 text-left flex items-center justify-between text-slate-800 outline-none transition-all duration-300",
                            formErrors.stateId ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-100 group-hover:border-slate-200"
                          )}
                        >
                          <SelectValue placeholder="Select State">
                            {formData.stateId ? (
                              <div className="flex items-center gap-3">
                                <LucideIcons.Globe size={18} className="text-indigo-600" />
                                <span className="text-slate-900 font-semibold truncate max-w-[120px]">{dependencies.states?.find(s => s.id.toString() === formData.stateId)?.name}</span>
                              </div>
                            ) : <span className="text-slate-400 font-medium">Select State</span>}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-2 bg-white max-h-60 overflow-y-auto">
                          <SelectItem value="" className="font-bold py-3 px-4 rounded-xl text-slate-400 italic hover:bg-slate-50 cursor-pointer">Global / Unassigned</SelectItem>
                          {Array.isArray(dependencies.states) && dependencies.states.map(s => (
                            <SelectItem key={s.id} value={s.id.toString()} className="font-bold py-3 px-4 rounded-xl text-left hover:bg-slate-50 cursor-pointer">
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className={cn(
                        "absolute top-0 left-4 bg-white px-2 text-[10px] font-black uppercase tracking-widest transition-all select-none z-10",
                        formErrors.stateId ? "text-red-500" : "text-slate-400 group-focus-within:text-indigo-500"
                      )}>
                        State
                      </div>
                      {formErrors.stateId && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">STATE REQUIRED</p>
                      )}
                    </div>
                  </div>
                </div>
              )}


              <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-xl p-3 sm:p-4 space-y-2 mt-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                      <LucideIcons.ShieldCheck size={20} className="stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 font-bold text-[13px] sm:text-sm">Activation</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase">Active</span>
                      </div>
                      <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium leading-tight">Visible Master</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={cn(
                      "w-11 h-6.5 rounded-full relative transition-all duration-300 cursor-pointer p-0.5 shrink-0",
                      formData.isActive ? "bg-emerald-500 shadow-md shadow-emerald-200" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-5.5 h-5.5 bg-white rounded-full transition-all duration-300 shadow-sm flex items-center justify-center",
                      formData.isActive ? "translate-x-4.5" : "translate-x-0"
                    )}>
                      {formData.isActive && <LucideIcons.Check size={10} className="text-emerald-500 stroke-[5]" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className={cn(
               "px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-6 !flex !flex-col sm:!flex-row items-stretch sm:items-center gap-3 sm:gap-4 shrink-0 border-t border-slate-50 bg-slate-50/10 sm:justify-end"
            )}> 
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="h-14 rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all active:scale-95 text-[13px] uppercase tracking-widest order-2 sm:order-1 w-full sm:w-auto sm:min-w-[140px]"
              >
                <LucideIcons.X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() => handleSave()}
                className="h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-200/50 transition-all hover:-translate-y-0.5 active:scale-95 text-[13px] uppercase tracking-widest order-1 sm:order-2 w-full sm:w-auto sm:min-w-[180px]"
              >
                {editingItem ? <LucideIcons.Check size={18} className="mr-2" /> : <LucideIcons.Plus size={18} className="mr-2" />}
                {editingItem ? "Update Master" : "Create Master"}
              </Button>
            </DialogFooter>





          </DialogContent>
        </Dialog>
      ) : (
        /* Universal Dynamic Dialog */
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

          <DialogContent
            showCloseButton={true}
            className={cn(
              "rounded-xl sm:rounded-2xl p-0 overflow-hidden bg-white border-none transition-all shadow-2xl w-[95vw] max-w-[420px]",
              activeTab === "role-assignment" ? "sm:max-w-2xl" : "sm:max-w-[450px]"
            )}
          >








            {activeTab === "role-master" ? (
              <>
                <div className="px-5 pt-5 pb-5 relative overflow-hidden bg-slate-900 shrink-0">
                  <DialogHeader className="relative z-10 p-0 bg-transparent flex-row items-center gap-3 pr-8">

                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105 bg-[#5a67f2] text-white backdrop-blur-md">
                      <LucideIcons.Shield className="size-5 sm:size-6 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col gap-0 text-left">
                      <DialogTitle className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                        {editingItem ? "Update" : "Add New"} Role Master
                      </DialogTitle>
                      <DialogDescription className="text-[10px] sm:text-[11px] font-medium text-white/60 normal-case tracking-normal opacity-70">
                        Foundational record management
                      </DialogDescription>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-50 border border-white/5"
                    >
                      <LucideIcons.X size={20} strokeWidth={3} />
                    </button>
                  </DialogHeader>
                </div>

                <div className="px-5 pt-5 pb-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 max-h-[55vh]">




                  <div className="space-y-2">
                    <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
                      NAME / LABEL
                    </Label>
                    <div className="relative group">
                      <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors", formErrors.name ? "text-red-500" : "text-indigo-600")}>
                        <LucideIcons.Shield className="size-5 sm:size-[20px] stroke-[2]" />
                      </div>
                      <input
                        ref={(el) => { if (el) inputRefs.current["name"] = el; }}
                        onKeyDown={(e) => handleKeyDown(e, "description")}
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
                        }}
                        placeholder="Enter role name or label"
                        className={cn(
                          "w-full h-11 sm:h-12 pl-12 sm:pl-14 pr-6 bg-white border-2 rounded-xl sm:rounded-xl text-sm sm:text-[15px] text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none",
                          formErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-100 focus:border-indigo-600"
                        )}
                      />


                    </div>
                    {formErrors.name && (
                      <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 animate-in fade-in slide-in-from-left-1 mt-1">
                        NAME / LABEL REQUIRED
                      </p>
                    )}

                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
                      Description
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <LucideIcons.FileText size={22} className="stroke-[2]" />
                      </div>
                      <textarea
                        ref={(el) => { if (el) inputRefs.current["description"] = el; }}
                        onKeyDown={(e) => handleKeyDown(e)}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Add description..."
                        className="w-full min-h-[100px] pl-14 pr-6 py-3 bg-white border-2 border-slate-100 rounded-[1.5rem] text-sm sm:text-base text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none focus:border-indigo-600 resize-none"
                      />

                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-xl p-3 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                          <LucideIcons.ShieldCheck size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-900 font-bold text-[13px] sm:text-sm">Activation</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase">Active</span>
                          </div>
                          <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium leading-tight">Visible Master</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        className={cn(
                          "w-11 h-6.5 rounded-full relative transition-all duration-300 cursor-pointer p-0.5 shrink-0",
                          formData.isActive ? "bg-emerald-500 shadow-md shadow-emerald-200" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-5.5 h-5.5 bg-white rounded-full transition-all duration-300 shadow-sm flex items-center justify-center",
                          formData.isActive ? "translate-x-4.5" : "translate-x-0"
                        )}>
                          {formData.isActive && <LucideIcons.Check size={10} className="text-emerald-500 stroke-[5]" />}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <DialogFooter className="px-5 pb-6 pt-4 sm:justify-end !flex !flex-col sm:!flex-row items-stretch sm:items-center gap-3 shrink-0 border-t border-slate-50/50 bg-slate-50/10">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-11 w-full sm:w-auto sm:min-w-[120px] rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm order-2 sm:order-1"
                  >
                    <LucideIcons.X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSave()}
                    className="h-11 w-full sm:w-auto sm:min-w-[160px] rounded-xl border-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-200/50 transition-all active:scale-95 text-sm order-2 sm:order-1"
                  >
                    {editingItem ? <LucideIcons.Check size={16} className="mr-2" /> : <LucideIcons.Plus size={16} className="mr-2" />}
                    {editingItem ? "Update Master" : "Create Master"}
                  </Button>
                </DialogFooter>




              </>
            ) : activeTab === "role-assignment" ? (
              <>
                <div className="px-6 sm:px-10 pt-5 sm:pt-7 pb-5 sm:pb-6 relative overflow-hidden bg-slate-900">
                  <DialogHeader className="relative z-10 p-0 bg-transparent flex-row items-center gap-3 sm:gap-6 pr-12 sm:pr-16">
                    <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105 bg-[#5a67f2] text-white backdrop-blur-md">
                      <LucideIcons.UserPlus className="size-6 sm:size-8 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col gap-0.5 sm:gap-1 text-left">
                      <DialogTitle className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                        {editingItem ? "Update" : "Add New"} Role Assignment
                      </DialogTitle>
                      <DialogDescription className="text-[10px] sm:text-xs font-medium text-white/60 normal-case tracking-normal font-sans uppercase-none">
                        Create a new foundational record registry
                      </DialogDescription>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-50 border border-white/5"
                    >
                      <LucideIcons.X size={20} strokeWidth={3} />
                    </button>
                  </DialogHeader>
                </div>

                <div className="px-6 sm:px-10 pt-6 sm:pt-8 pb-4 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar flex-1 max-h-[60vh]">



                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-900 text-sm font-bold pl-0.5">
                        Full Name
                      </Label>
                      <div className="relative group">
                        <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors", formErrors.name ? "text-red-500" : "text-indigo-600")}>
                          <LucideIcons.UserPlus size={22} className="stroke-[2.5]" />
                        </div>
                        <input
                          ref={(el) => { if (el) inputRefs.current["name"] = el; }}
                          onKeyDown={(e) => handleKeyDown(e, "email")}
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                          }}
                          placeholder="Enter full name"
                          className={cn(
                            "w-full h-16 pl-14 pr-6 bg-white border-2 rounded-xl text-base text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none",
                            formErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-100 focus:border-indigo-600"
                          )}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1"> Full Name Required</p>
                      )}
                    </div>

                    <div className="space-y-2">
                     
                              <Label className="text-slate-900 text-sm font-bold pl-0.5 uppercase tracking-wide">
  Email Address
                </Label>
                      <div className="relative group">
                        <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors", (formErrors.email || formErrors.emailFormat) ? "text-red-500" : "text-indigo-600")}>
                          <LucideIcons.Mail size={22} className="stroke-[2.5]" />
                        </div>
                        <input
                          ref={(el) => { if (el) inputRefs.current["email"] = el; }}
                          onKeyDown={(e) => handleKeyDown(e, "description")}
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            setFormErrors(prev => ({ ...prev, email: "", emailFormat: "" }));
                          }}
                          placeholder="Enter email address"
                          className={cn(
                            "w-full h-16 pl-14 pr-6 bg-white border-2 rounded-xl text-base text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none",
                            (formErrors.email || formErrors.emailFormat) ? "border-red-500 bg-red-50/10" : "border-slate-100 focus:border-indigo-600"
                          )}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">Email Address Required</p>
                      )}
                      {formErrors.emailFormat && (
                        <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">Invalid Format</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-900 text-sm font-bold pl-0.5">
                      ADDITIONAL DESCRIPTION
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <LucideIcons.FileText size={22} className="stroke-[2]" />
                      </div>
                      <textarea
                        ref={(el) => { if (el) inputRefs.current["description"] = el; }}
                        onKeyDown={(e) => handleKeyDown(e)}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional details"
                        className="w-full min-h-[100px] pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-xl text-base text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none focus:border-indigo-600 resize-none"
                      />
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium pl-1 mt-1">

                    </p>
                  </div>



                  <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-xl p-3 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                          <LucideIcons.ShieldCheck size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-900 font-bold text-[13px] sm:text-sm">Activation</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase">Active</span>
                          </div>
                          <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium leading-tight">Visible Master</p>
                        </div>
                      </div>


                      <div
                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        className={cn(
                          "w-11 h-6.5 rounded-full relative transition-all duration-300 cursor-pointer p-0.5 shrink-0",
                          formData.isActive ? "bg-emerald-500 shadow-md shadow-emerald-200" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-5.5 h-5.5 bg-white rounded-full transition-all duration-300 shadow-sm flex items-center justify-center",
                          formData.isActive ? "translate-x-4.5" : "translate-x-0"
                        )}>
                          {formData.isActive && <LucideIcons.Check size={10} className="text-emerald-500 stroke-[5]" />}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-1 pt-1 opacity-60">
                      <LucideIcons.Info size={14} className="text-slate-500" />
                      <span className="text-[12px] font-medium text-slate-500">Globally visible to all authorized users and modules.</span>
                    </div>
                  </div>
                </div>

                <DialogFooter className="px-5 pb-6 pt-4 sm:justify-end !flex !flex-col sm:!flex-row items-stretch sm:items-center gap-3 shrink-0 border-t border-slate-50/50 bg-slate-50/10">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-11 w-full sm:w-auto sm:min-w-[120px] rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm order-2 sm:order-1"
                  >
                    <LucideIcons.X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSave()}
                    className="h-11 w-full sm:w-auto sm:min-w-[160px] rounded-xl border-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-200/50 transition-all active:scale-95 text-sm order-2 sm:order-1"
                  >
                    {editingItem ? <LucideIcons.Check size={16} className="mr-2" /> : <LucideIcons.Plus size={16} className="mr-2" />}
                    {editingItem ? "Update Master" : "Create Master"}
                  </Button>
                </DialogFooter>

              </>
            ) : (
              <>
                <div className="px-5 pt-5 pb-5 relative overflow-hidden bg-slate-900 shrink-0">
                  <DialogHeader className="relative z-10 p-0 bg-transparent flex-row items-center gap-3 pr-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105 bg-indigo-600 text-white backdrop-blur-md overflow-hidden">
                      {((activeTab === "schools" || activeTab === "role-assignment") && (localPhotoPreview || formData.profilePhotoPath)) ? (
                        <img src={localPhotoPreview || resolvePhotoUrl(formData.profilePhotoPath)} className="w-full h-full object-cover" alt="Logo" />
                      ) : (
                        <activeConfig.icon className="size-5 sm:size-6 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="flex flex-col gap-0 text-left">
                      <DialogTitle className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
                        {editingItem ? "Update" : "Add New"} {activeConfig.singular}
                      </DialogTitle>
                      <DialogDescription className="text-[10px] sm:text-[11px] font-medium text-white/60 normal-case tracking-normal opacity-70">
                        {editingItem ? `Modify the record` : `Create a new entry`}
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                </div>

                <div className="px-5 pt-5 pb-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 max-h-[55vh]">


                  <div className="space-y-2">
                    <Label className="text-slate-900 text-sm font-bold pl-0.5">
                      NAME / LABEL <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                      <div className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors", formErrors.name ? "text-red-500" : "text-indigo-600")}>
                        <LucideIcons.Tag size={22} className="stroke-[2.5]" />
                      </div>
                      <input
                        ref={(el) => { if (el) inputRefs.current["name"] = el; }}
                        onKeyDown={(e) => handleKeyDown(e, "description")}
                        type="text"
                        placeholder="Enter name or label"
                        className={cn(
                          "w-full h-11 pl-12 pr-6 bg-white border-2 rounded-xl text-sm sm:text-[14px] text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none",
                          formErrors.name ? "border-red-500 bg-red-50/10" : "border-slate-100 focus:border-indigo-600"
                        )}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                        }}
                      />
                    </div>
                    {formErrors.name ? (
                      <p className="text-red-500 text-[11px] font-black uppercase tracking-widest pl-1 mt-1">NAME / LABEL Required</p>
                    ) : (
                      <p className="text-[12px] text-slate-400 font-medium pl-1">
                        Enter a unique and descriptive name for this {activeConfig.singular}.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-900 text-sm font-bold pl-0.5">
                      ADDITIONAL DESCRIPTION
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <LucideIcons.FileText size={20} className="stroke-[2]" />
                      </div>
                      <textarea
                        ref={(el) => { if (el) inputRefs.current["description"] = el; }}
                        onKeyDown={(e) => handleKeyDown(e)}
                        placeholder="Optional details"
                        className="w-full min-h-[100px] pl-14 pr-6 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm sm:text-[14px] text-slate-900 font-semibold placeholder:text-slate-400 transition-all outline-none focus:border-indigo-600 resize-none hover:border-slate-300"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium pl-1">
                      Provide details and information about this {activeConfig.singular}.
                    </p>
                  </div>

                  <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-xl p-3 sm:p-4 space-y-2 mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                          <LucideIcons.ShieldCheck size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-900 font-bold text-[13px] sm:text-sm">Activation</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase">Active</span>
                          </div>
                          <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium leading-tight">Visible Master</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        className={cn(
                          "w-11 h-6.5 rounded-full relative transition-all duration-300 cursor-pointer p-0.5 shrink-0",
                          formData.isActive ? "bg-emerald-500 shadow-md shadow-emerald-200" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-5.5 h-5.5 bg-white rounded-full transition-all duration-300 shadow-sm flex items-center justify-center",
                          formData.isActive ? "translate-x-4.5" : "translate-x-0"
                        )}>
                          {formData.isActive && <LucideIcons.Check size={10} className="text-emerald-500 stroke-[5]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="px-5 pb-6 pt-4 sm:justify-end !flex !flex-col sm:!flex-row items-stretch sm:items-center gap-3 shrink-0 border-t border-slate-50/50 bg-slate-50/10">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-11 w-full sm:w-auto sm:min-w-[120px] rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm order-2 sm:order-1"
                  >
                    <LucideIcons.X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSave()}
                    className="h-11 w-full sm:w-auto sm:min-w-[160px] rounded-xl border-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-200/50 transition-all active:scale-95 text-sm order-2 sm:order-1"
                  >
                    {editingItem ? <LucideIcons.Check size={16} className="mr-2" /> : <LucideIcons.Plus size={16} className="mr-2" />}
                    {editingItem ? "Update Master" : "Create Master"}
                  </Button>
                </DialogFooter>

              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
