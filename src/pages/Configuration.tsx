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
  Hammer
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
import { toast } from "sonner";
import { apiService } from "@/lib/api";
import { Navigate } from "react-router-dom";
import { User } from "@/types";
import { motion } from "motion/react";
import { cn, parseSafeInt } from "@/lib/utils";
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
const MASTER_TYPES: Record<string, { label: string, icon: any, description: string, apiPrefix: string }> = {
  "schools": { label: "Schools", icon: School, description: "Manage institutional branches", apiPrefix: "School" },
  "role-master": { label: "Role Master", icon: Shield, description: "Manage system access roles", apiPrefix: "Role" },
  "role-assignment": { label: "Role Assignment", icon: UserCheck, description: "Assign roles to system users", apiPrefix: "User" },
  "standards": { label: "Standards", icon: Layers, description: "Manage academic standards/grades", apiPrefix: "Standard" },
  "sections": { label: "Divisions/Sections", icon: Hash, description: "Manage class subdivisions", apiPrefix: "Section" },
  "academic-years": { label: "Academic Years", icon: Calendar, description: "Manage educational sessions", apiPrefix: "AcademicYear" },
  "castes": { label: "Castes", icon: Users, description: "Manage student caste categories", apiPrefix: "Caste" },
  "sub-castes": { label: "Sub-Castes", icon: Users, description: "Manage specific sub-caste groups", apiPrefix: "SubCaste" },
  "religions": { label: "Religions", icon: Milestone, description: "Manage religious affiliations", apiPrefix: "Religion" },
  "states": { label: "States", icon: Map, description: "List of administrative states", apiPrefix: "State" },
  "cities": { label: "Cities", icon: MapPin, description: "List of cities/towns", apiPrefix: "City" },
  "blood-groups": { label: "Blood Groups", icon: Droplet, description: "Manage emergency blood types", apiPrefix: "BloodGroup" },
  "houses": { label: "Houses", icon: Home, description: "Manage school house systems", apiPrefix: "House" },
  "admission-types": { label: "Admission Types", icon: FileText, description: "Manage enrollment categories", apiPrefix: "AdmissionType" },
  "categories": { label: "Categories", icon: LayoutGrid, description: "Manage social categories", apiPrefix: "Category" },
  "sessions": { label: "Sessions", icon: Clock, description: "Manage school sessions", apiPrefix: "Session" },
  "batches": { label: "Batches", icon: Users, description: "Manage student batches", apiPrefix: "Batch" },
  "shifts": { label: "Shifts", icon: Clock, description: "Manage staff/student shifts", apiPrefix: "Shift" },
  "subjects": { label: "Subjects", icon: BookOpen, description: "Manage academic subjects", apiPrefix: "Subject" },
  "exam-types": { label: "Exam Types", icon: Award, description: "Manage examination categories", apiPrefix: "ExamType" },
  "designations": { label: "Designations", icon: Briefcase, description: "Manage staff designations", apiPrefix: "Designation" },
  "occupations": { label: "Occupations", icon: Hammer, description: "Manage parent occupations", apiPrefix: "Occupation" },
  "navigation": { label: "Navigation Master", icon: LayoutGrid, description: "Manage hierarchical sidebar menu", apiPrefix: "Navigation" },
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
    email: ""
  });

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
        const getMethodName = `get${typeConfig.apiPrefix}s`;
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
        if (activeTab === "cities") {
          const statesRes = await apiService.getStates();
          const statesData = statesRes.data?.data || statesRes.data || [];
          setDependencies(prev => ({ ...prev, states: Array.isArray(statesData) ? statesData : [] }));
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

  const handleOpenDialog = (item: any = null) => {
    setEditingItem(item);
    setFormErrors({});
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
      roles: item?.roles || ["superadmin"]
    });
    setIsDialogOpen(true);
  };

  /**
   * PERSIST MASTER RECORD
   * Handles both creation of new records and updates to existing ones.
   * Dynamically constructs the payload based on the active master type.
   */
  const handleSave = async () => {
    const newErrors: Record<string, boolean> = {};
    if (activeTab === "navigation") {
      if (!formData.title?.trim()) newErrors.title = true;
      // Path is only required for leaf nodes (items without children in common use, 
      // but here we allow empty path for parent items which act as containers)
    } else {
      if (!formData.name?.trim()) newErrors.name = true;
    }
    
    if (activeTab === "sub-castes" && !formData.casteId) newErrors.casteId = true;
    if (activeTab === "cities" && !formData.stateId) newErrors.stateId = true;
    if (activeTab === "schools" && !formData.address) newErrors.address = true;
    
    setFormErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      const firstError = Object.keys(newErrors)[0];
      const element = inputRefs.current[firstError];
      if (element) {
        element.focus?.();
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
      } else if (activeTab === "role-assignment") {
        // Map common 'name' field back to 'fullName' for User API
        payload.fullName = formData.name;
        delete payload.name;
        payload.email = formData.email;
        // For new users, we could allow setting a default role if needed, 
        // but table select handles it afterwards
      }

      if (editingItem) {
        // @ts-ignore
        await apiService[updateMethod](editingItem.id, payload);
        toast.success(`${typeConfig.label} updated successfully`);
      } else {
        // @ts-ignore
        await apiService[createMethod](payload);
        toast.success(`${typeConfig.label} created successfully`);
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
          <div className="bg-indigo-600 p-4 rounded-[1.25rem] text-white shadow-2xl shadow-indigo-200 transition-transform hover:rotate-3">
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
              <div className="relative group w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input 
                  placeholder="Filter masters..." 
                  className="pl-11 h-11 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium rounded-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleOpenDialog()} 
                className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-2xl h-11 px-8 shadow-xl shadow-blue-500/20 font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
              >
                <Plus size={18} className="mr-2 stroke-[3]" /> Add New
              </Button>
            </div>
          </div>

          <div className="p-0">
            <div className="border-0 overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="hover:bg-transparent border-slate-50 h-16">
                    <TableHead className="w-24 pl-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Index</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {activeTab === "role-assignment" ? "User Profile" : "Primary Label"}
                    </TableHead>
                    {activeTab === "role-assignment" && <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Username</TableHead>}
                    {activeTab === "role-assignment" && <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Role</TableHead>}
                    {activeTab === "academic-years" && <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Session</TableHead>}
                    {activeTab === "houses" && <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hex Code</TableHead>}
                    {activeTab === "sub-castes" && <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Parent Category</TableHead>}
                    {activeTab === "cities" && <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Administrative State</TableHead>}
                    {activeTab === "schools" && (
                      <>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</TableHead>
                      </>
                    )}
                    {activeTab === "navigation" && (
                      <>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Path</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Parent</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Roles</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order</TableHead>
                      </>
                    )}
                    {activeTab !== "role-assignment" && activeTab !== "navigation" && <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</TableHead>}
                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</TableHead>
                    <TableHead className="w-20 pr-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manage</TableHead>
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
                  ) : filteredData.length === 0 ? (
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
                    filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-slate-50/50 h-20 group">
                        <TableCell className="pl-8">
                           <span className="font-mono text-[11px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            #{item.id}
                           </span>
                        </TableCell>
                        <TableCell className="font-black text-slate-900 text-sm tracking-tight truncate max-w-[200px]">
                          {activeTab === "navigation" && item.icon && (
                            <span className="mr-2 inline-flex items-center">
                              {(() => {
                                const IconComp = (LucideIcons as any)[item.icon];
                                return IconComp ? <IconComp size={16} className="text-blue-500" /> : null;
                              })()}
                            </span>
                          )}
                          {item.name || item.title || item.fullName}
                        </TableCell>

                        {activeTab === "role-assignment" && (
                          <>
                            <TableCell className="text-xs font-bold text-slate-500 font-mono italic">{item.username}</TableCell>
                            <TableCell>
                              <Select 
                                value={item.role} 
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
                                <SelectTrigger className="h-9 w-36 rounded-xl bg-blue-50/50 border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-700 hover:bg-blue-100/50 transition-colors">
                                  {/* Explicit label mapping to ensure proper display names for roles */}
                                  <SelectValue placeholder="Role">
                                    {item.role ? (
                                      dependencies.roles?.find((r: any) => r.name.toLowerCase().replace(' ', '') === item.role)?.name || 
                                      (item.role === 'superadmin' ? 'Super Admin' : 
                                       item.role === 'admin' ? 'Admin' : 
                                       item.role === 'teacher' ? 'Teacher' : item.role)
                                    ) : undefined}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                                  {dependencies.roles?.map((role: any) => (
                                    <SelectItem key={role.id} value={role.name.toLowerCase().replace(' ', '')} className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                  {(!dependencies.roles || dependencies.roles.length === 0) && (
                                    <>
                                      <SelectItem value="superadmin" className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">Super Admin</SelectItem>
                                      <SelectItem value="admin" className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">Admin</SelectItem>
                                      <SelectItem value="teacher" className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">Teacher</SelectItem>
                                      <SelectItem value="parent" className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">Parent</SelectItem>
                                      <SelectItem value="student" className="text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest">Student</SelectItem>
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
                                {item.roles?.map((r: string) => (
                                  <Badge key={r} className="bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase px-1.5 py-0.5">
                                    {r}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-black text-slate-400">{item.sortOrder}</TableCell>
                          </>
                        )}

                        {activeTab !== "role-assignment" && activeTab !== "navigation" && (
                          <TableCell className="text-xs font-bold text-slate-400 max-w-[200px] truncate leading-relaxed italic">
                            {item.description || "No metadata found"}
                          </TableCell>
                        )}

                        <TableCell>
                          <Badge className={cn(
                            "rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border border-transparent",
                            item.isActive !== false ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500"
                          )}>
                            {item.isActive !== false ? "Verified Active" : "Disabled State"}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <DropdownMenu>
                            <SimpleTooltip content="Administrative Actions" side="left">
                              <DropdownMenuTrigger render={
                                <div className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm cursor-pointer text-slate-400 hover:text-blue-600 transition-all active:scale-95 border-none outline-none focus:ring-0" aria-label="Open actions menu">
                                  <MoreHorizontal size={18} />
                                </div>
                              } />
                            </SimpleTooltip>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 shadow-2xl p-2 animate-in slide-in-from-top-2 duration-300">
                              <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="rounded-xl py-3 px-4 font-black transition-all text-xs uppercase tracking-widest text-slate-600 focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                                <Edit3 size={14} className="mr-3" /> Update Record
                              </DropdownMenuItem>
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
          </div>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={cn(
          "rounded-3xl border-none shadow-2xl p-0 overflow-hidden transition-all duration-300",
          activeTab === "navigation" ? "max-w-2xl" : "max-w-md"
        )}>
          <div className="bg-blue-600 p-8 text-white">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              {editingItem ? <Edit3 size={24} /> : <Plus size={24} />}
              {editingItem ? "Edit" : "Add New"} {activeConfig.label.replace('Manage ', '').slice(0, -1)}
            </DialogTitle>
            <DialogDescription className="text-blue-100 font-medium">
              Update the details for this {activeConfig.label.toLowerCase()} record.
            </DialogDescription>
          </div>
          
          <div className="p-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className={cn("text-xs font-black uppercase tracking-wider", (formErrors.name || formErrors.title) ? "text-red-500" : "text-slate-400")}>
                {activeTab === "schools" ? "School Name" : activeTab === "role-assignment" ? "Full Name" : activeTab === "navigation" ? "Navigation Title" : "Name / Label"} {(formErrors.name || formErrors.title) && "*"}
              </Label>
              <Input 
                ref={el => { inputRefs.current[activeTab === "navigation" ? "title" : "name"] = el; }}
                id="name" 
                placeholder={`Enter ${activeTab === "schools" ? "school name" : activeTab === "role-assignment" ? "user's full name" : activeTab === "navigation" ? "menu title" : "name"}...`}
                className={cn(
                  "h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold",
                  (formErrors.name || formErrors.title) && "border-red-500 ring-2 ring-red-500/10"
                )}
                value={activeTab === "navigation" ? formData.title : formData.name}
                onChange={(e) => {
                  if (activeTab === "navigation") {
                    setFormData({...formData, title: e.target.value});
                    if (formErrors.title) setFormErrors(prev => ({ ...prev, title: false }));
                  } else {
                    setFormData({...formData, name: e.target.value});
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: false }));
                  }
                }}
              />
            </div>

            {activeTab === "navigation" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="path" className={cn("text-xs font-black uppercase tracking-wider", formErrors.path ? "text-red-500" : "text-slate-400")}>Navigation Path {formErrors.path && "*"}</Label>
                  <Input 
                    id="path" 
                    placeholder="e.g. /students or /configuration/schools"
                    className={cn(
                      "h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold",
                      formErrors.path && "border-red-500 ring-2 ring-red-500/10"
                    )}
                    value={formData.path}
                    onChange={(e) => {
                      setFormData({...formData, path: e.target.value});
                      if (formErrors.path) setFormErrors(prev => ({ ...prev, path: false }));
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-wider text-slate-400">Lucide Icon</Label>
                    <Select 
                      value={formData.icon} 
                      onValueChange={(v) => setFormData({...formData, icon: v})}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold px-4">
                        <SelectValue placeholder="No Icon" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl max-h-60">
                        <SelectItem value="" className="font-semibold py-2">None</SelectItem>
                        {["LayoutDashboard", "Users", "GraduationCap", "CalendarCheck", "CreditCard", "MessageSquare", "UserCheck", "Terminal", "Database", "School", "Bell", "Settings", "Award", "Briefcase", "BookOpen", "Hammer"].map(icon => (
                          <SelectItem key={icon} value={icon} className="font-semibold py-2 flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const IconComp = (LucideIcons as any)[icon];
                                return IconComp ? <IconComp size={14} className="text-slate-400" /> : null;
                              })()}
                              {icon}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-wider text-slate-400">Parent Menu</Label>
                    <Select 
                      value={formData.parentId} 
                      onValueChange={(v) => setFormData({...formData, parentId: v})}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold px-4">
                        <SelectValue placeholder="Root" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl max-h-60">
                        <SelectItem value="" className="font-semibold py-2">None (Root)</SelectItem>
                        {dependencies.parentNavs?.filter((n: any) => n.id !== editingItem?.id).map(n => (
                          <SelectItem key={n.id} value={n.id.toString()} className="font-semibold py-2">
                            {n.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className="text-xs font-black uppercase tracking-wider text-slate-400">Sort Order</Label>
                  <Input 
                    id="sortOrder" 
                    type="number"
                    className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-wider text-slate-400">Visible for Roles</Label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {["superadmin", "admin", "teacher", "parent", "student"].map(role => (
                      <div key={role} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`role-${role}`}
                          checked={formData.roles?.includes(role)}
                          onChange={(e) => {
                            const newRoles = e.target.checked 
                              ? [...(formData.roles || []), role]
                              : (formData.roles || []).filter((r: string) => r !== role);
                            setFormData({...formData, roles: newRoles});
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600"
                        />
                        <label htmlFor={`role-${role}`} className="text-xs font-bold text-slate-600 capitalize">{role}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(activeTab === "schools" || activeTab === "role-assignment") && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address</Label>
                <Input 
                  id="email" 
                  placeholder="Enter email address..."
                  className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            )}

            {activeTab === "schools" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address" className={cn("text-xs font-black uppercase tracking-wider", formErrors.address ? "text-red-500" : "text-slate-400")}>Institutional Address {formErrors.address && "*"}</Label>
                  <Input 
                    id="address" 
                    placeholder="Enter full address..."
                    className={cn(
                      "h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold",
                      formErrors.address && "border-red-500 ring-2 ring-red-500/10"
                    )}
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({...formData, address: e.target.value});
                      if (formErrors.address) setFormErrors(prev => ({ ...prev, address: false }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-wider text-slate-400">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Office Phone"
                    className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </>
            )}

            {activeTab === "academic-years" && (
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <input 
                  type="checkbox" 
                  id="isCurrent"
                  className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({...formData, isCurrent: e.target.checked})}
                />
                <Label htmlFor="isCurrent" className="font-bold text-slate-700 cursor-pointer select-none">Set as Current Academic Year</Label>
              </div>
            )}

            {activeTab === "houses" && (
              <div className="space-y-2">
                <Label htmlFor="color" className="text-xs font-black uppercase tracking-wider text-slate-400">House Color</Label>
                <div className="flex gap-3">
                  <Input 
                    id="color" 
                    type="color"
                    className="h-12 w-16 p-1 rounded-xl cursor-pointer"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                  <Input 
                    placeholder="#HEX Code"
                    className="h-12 flex-1 rounded-xl font-mono uppercase font-bold"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
              </div>
            )}

            {activeTab === "sub-castes" && (
              <div className="space-y-2">
                <Label className={cn("text-xs font-black uppercase tracking-wider", formErrors.casteId ? "text-red-500" : "text-slate-400")}>Parent Caste {formErrors.casteId && "*"}</Label>
                <Select 
                  value={formData.casteId} 
                  onValueChange={(v) => {
                    setFormData({...formData, casteId: v});
                    if (formErrors.casteId) setFormErrors(prev => ({ ...prev, casteId: false }));
                  }}
                >
                  <SelectTrigger 
                    ref={el => { inputRefs.current["casteId"] = el; }}
                    className={cn(
                      "h-12 rounded-xl border-slate-200 bg-white font-bold px-4",
                      formErrors.casteId && "border-red-500 ring-2 ring-red-500/10"
                    )}
                  >
                    {/* Explicitly show caste name to avoid ID display in trigger */}
                    <SelectValue placeholder="Select Parent Caste">
                      {formData.casteId ? dependencies.castes?.find(c => c.id.toString() === formData.casteId)?.name : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="" className="font-semibold py-2 text-slate-400 italic">Select Parent Caste</SelectItem>
                    {dependencies.castes?.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()} className="font-semibold py-2">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "cities" && (
              <div className="space-y-2">
                <Label className={cn("text-xs font-black uppercase tracking-wider", formErrors.stateId ? "text-red-500" : "text-slate-400")}>State {formErrors.stateId && "*"}</Label>
                <Select 
                  value={formData.stateId} 
                  onValueChange={(v) => {
                    setFormData({...formData, stateId: v});
                    if (formErrors.stateId) setFormErrors(prev => ({ ...prev, stateId: false }));
                  }}
                >
                  <SelectTrigger 
                    ref={el => { inputRefs.current["stateId"] = el; }}
                    className={cn(
                      "h-12 rounded-xl border-slate-200 bg-white font-bold px-4",
                      formErrors.stateId && "border-red-500 ring-2 ring-red-500/10"
                    )}
                  >
                    {/* Explicitly show state name to avoid ID display in trigger */}
                    <SelectValue placeholder="Select State Name">
                      {formData.stateId ? dependencies.states?.find(s => s.id.toString() === formData.stateId)?.name : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="" className="font-semibold py-2 text-slate-400 italic">Select State Name</SelectItem>
                    {dependencies.states?.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()} className="font-semibold py-2">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-black uppercase tracking-wider text-slate-400">Additional Description</Label>
              <Input 
                id="description" 
                placeholder="Optional details"
                className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <input 
                type="checkbox" 
                id="isActive"
                className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              <Label htmlFor="isActive" className="font-bold text-slate-700 cursor-pointer select-none">Active Status</Label>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 bg-slate-50/50 flex gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-xl h-12 font-bold border-slate-200 hover:bg-white">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 rounded-xl h-12 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
              {editingItem ? "Update Master" : "Create Master"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
