import { useState, useEffect, useRef } from "react";
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
  Milestone
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
import { User } from "@/types";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ConfigurationProps {
  user: User;
  defaultTab?: string;
}

const MASTER_TYPES: Record<string, { label: string, icon: any, description: string, apiPrefix: string }> = {
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
};

export default function Configuration({ user, defaultTab = "standards" }: ConfigurationProps) {
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
    color: "",
    casteId: "",
    stateId: ""
  });

  const fetchData = async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      const typeConfig = MASTER_TYPES[activeTab];
      const getMethodName = `get${typeConfig.apiPrefix}s`;
      // @ts-ignore
      const response = await apiService[getMethodName]();
      setMasterData(response.data || []);

      // Fetch dependencies if needed
      if (activeTab === "sub-castes") {
        const castesRes = await apiService.getCastes();
        setDependencies(prev => ({ ...prev, castes: castesRes.data || [] }));
      }
      if (activeTab === "cities") {
        const statesRes = await apiService.getStates();
        setDependencies(prev => ({ ...prev, states: statesRes.data || [] }));
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
      name: item?.name || "",
      description: item?.description || "",
      isCurrent: item?.isCurrent || false,
      color: item?.color || "#3b82f6",
      casteId: item?.casteId?.toString() || "",
      stateId: item?.stateId?.toString() || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.name.trim()) newErrors.name = true;
    
    if (activeTab === "sub-castes" && !formData.casteId) newErrors.casteId = true;
    if (activeTab === "cities" && !formData.stateId) newErrors.stateId = true;
    
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

      if (editingItem) {
        // @ts-ignore
        await apiService[updateMethod](editingItem.id, formData);
        toast.success(`${typeConfig.label} updated successfully`);
      } else {
        // @ts-ignore
        await apiService[createMethod](formData);
        toast.success(`${typeConfig.label} created successfully`);
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
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
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConfig = MASTER_TYPES[activeTab];
  const Icon = activeConfig.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Icon size={24} />
            </div>
            {activeConfig.label}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {activeConfig.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            disabled={isRefreshing}
            className="rounded-full font-bold border-slate-200 h-10 hover:bg-slate-50"
          >
            <RefreshCw size={16} className={cn("mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden rounded-3xl bg-white">
        <div className="w-full">
          <div className="px-8 pt-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {activeConfig.label} Master
              </h3>
              <p className="text-sm text-slate-500 font-bold">
                Configure and manage lookup values for {activeConfig.label.toLowerCase()}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  placeholder="Search records..." 
                  className="pl-10 h-11 w-full md:w-64 rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-11 px-6 shadow-lg shadow-blue-200 font-bold">
                <Plus size={18} className="mr-2" /> Add {activeConfig.label.replace('Manage ', '').slice(0, -1)}
              </Button>
            </div>
          </div>

          <div className="p-0">
            <div className="border-0 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="w-20 pl-8 font-black uppercase text-[10px] tracking-wider text-slate-400">ID</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-wider text-slate-400">Name</TableHead>
                    {activeTab === "academic-years" && <TableHead className="font-black uppercase text-[10px] tracking-wider text-slate-400">Current</TableHead>}
                    {activeTab === "houses" && <TableHead className="font-black uppercase text-[10px] tracking-wider text-slate-400">Color</TableHead>}
                    {activeTab === "sub-castes" && <TableHead className="font-black uppercase text-[10px] tracking-wider text-slate-400">Parent Caste</TableHead>}
                    {activeTab === "cities" && <TableHead className="font-black uppercase text-[10px] tracking-wider text-slate-400">State</TableHead>}
                    <TableHead className="font-black uppercase text-[10px] tracking-wider text-slate-400">Description/Info</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-wider text-slate-400">Status</TableHead>
                    <TableHead className="w-20 pr-8 text-right font-black uppercase text-[10px] tracking-wider text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i} className="animate-pulse border-slate-50">
                        <TableCell colSpan={8} className="h-16 bg-slate-50/20"></TableCell>
                      </TableRow>
                    ))
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-40 text-center text-slate-400 font-bold uppercase text-xs tracking-widest bg-slate-50/10">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                        <TableCell className="pl-8 font-mono text-xs font-bold text-slate-400">#{item.id}</TableCell>
                        <TableCell className="font-black text-slate-800 text-sm tracking-tight">{item.name}</TableCell>
                        
                        {activeTab === "academic-years" && (
                          <TableCell>
                            {item.isCurrent ? (
                              <Badge className="bg-blue-100 text-blue-700 rounded-full font-black text-[10px] uppercase">Current</Badge>
                            ) : "-"}
                          </TableCell>
                        )}

                        {activeTab === "houses" && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: item.color }}></div>
                              <span className="text-xs font-bold font-mono uppercase">{item.color}</span>
                            </div>
                          </TableCell>
                        )}

                        {activeTab === "sub-castes" && (
                          <TableCell className="text-xs font-bold text-slate-600">
                            {dependencies.castes?.find(c => c.id === item.casteId)?.name || "N/A"}
                          </TableCell>
                        )}

                        {activeTab === "cities" && (
                          <TableCell className="text-xs font-bold text-slate-600">
                            {dependencies.states?.find(s => s.id === item.stateId)?.name || "N/A"}
                          </TableCell>
                        )}

                        <TableCell className="text-sm font-bold text-slate-500 max-w-[200px] truncate">
                          {item.description || item.color || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider",
                            item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          )}>
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <div className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer text-slate-500 transition-colors">
                                <MoreHorizontal size={16} />
                              </div>
                            } />
                            <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl p-1">
                              <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="rounded-lg font-bold text-slate-600 focus:bg-blue-50 focus:text-blue-600 cursor-pointer">
                                <Edit3 size={14} className="mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="rounded-lg font-bold text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                                <Trash2 size={14} className="mr-2" /> Delete
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
        <DialogContent className="rounded-3xl border-none shadow-2xl max-w-md p-0 overflow-hidden">
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
              <Label htmlFor="name" className={cn("text-xs font-black uppercase tracking-wider", formErrors.name ? "text-red-500" : "text-slate-400")}>Name / Label {formErrors.name && "*"}</Label>
              <Input 
                ref={el => inputRefs.current["name"] = el}
                id="name" 
                placeholder={`Enter name for ${activeConfig.label.toLowerCase()}...`}
                className={cn(
                  "h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold",
                  formErrors.name && "border-red-500 ring-2 ring-red-500/10"
                )}
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value});
                  if (formErrors.name) setFormErrors(prev => ({ ...prev, name: false }));
                }}
              />
            </div>

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
                    ref={el => inputRefs.current["casteId"] = el}
                    className={cn(
                      "h-12 rounded-xl border-slate-200 bg-white font-bold px-4",
                      formErrors.casteId && "border-red-500 ring-2 ring-red-500/10"
                    )}
                  >
                    <SelectValue placeholder="Select Parent Caste">
                      {formData.casteId && formData.casteId !== "none" ? dependencies.castes?.find(c => c.id.toString() === formData.casteId)?.name : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="none" className="font-semibold py-2 text-slate-400 italic">Select Parent Caste</SelectItem>
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
                    ref={el => inputRefs.current["stateId"] = el}
                    className={cn(
                      "h-12 rounded-xl border-slate-200 bg-white font-bold px-4",
                      formErrors.stateId && "border-red-500 ring-2 ring-red-500/10"
                    )}
                  >
                    <SelectValue placeholder="Select State Name">
                      {formData.stateId && formData.stateId !== "none" ? dependencies.states?.find(s => s.id.toString() === formData.stateId)?.name : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="none" className="font-semibold py-2 text-slate-400 italic">Select State Name</SelectItem>
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
