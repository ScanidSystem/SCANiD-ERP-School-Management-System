import { useState, useEffect, useRef } from "react";
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
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select as UISelect, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { User as UserType } from "@/types";
import { cn } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";

export default function Schools({ user }: { user: UserType }) {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "Active"
  });

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await apiService.getSchools();
      setSchools(res.data);
    } catch (error) {
      console.error("Schools error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (school: any) => {
    setCurrentSchool(school);
    setFormData({
      name: school.name || "",
      address: school.address || "",
      phone: school.phone || "",
      email: school.email || "",
      status: school.status || "Active"
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
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
    checkField("phone", formData.phone && !/^\d{10,12}$/.test(formData.phone.replace(/\D/g, "")));
    checkField("email", formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));

    setFormErrors(newErrors);

    if (firstErrorField) {
      toast.error("Please provide valid information.");
      inputRefs.current[firstErrorField]?.focus();
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.updateSchool(currentSchool.id, { ...formData, id: currentSchool.id });
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

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
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
    checkField("phone", formData.phone && !/^\d{10,12}$/.test(formData.phone.replace(/\D/g, "")));
    checkField("email", formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));

    setFormErrors(newErrors);

    if (firstErrorField) {
      toast.error("Institution name and address are mandatory.");
      const element = inputRefs.current[firstErrorField];
      if (element) {
        element.focus();
        if (element.scrollIntoView) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.createSchool(formData);
      toast.success("School registered successfully!");
      setIsAddDialogOpen(false);
      setFormData({ name: "", address: "", phone: "", email: "", status: "Active" });
      fetchSchools();
    } catch (error) {
      toast.error("Failed to register school");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (user.role === "superadmin") {
      fetchSchools();
    }
  }, [user.role]);

  if (user.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toString().includes(searchQuery)
  );

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    const aValue = a[key] || "";
    const bValue = b[key] || "";

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 mt-1">Configure and monitor all registered educational institutions.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger 
            nativeButton={true}
            render={
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-lg shadow-blue-200">
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
                    Onboard a new educational branch or partner institution to the centralized management system.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
              <div className="max-w-xl mx-auto space-y-6">
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">Institution Details</h3>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Name</Label>
                    <Input 
                      ref={el => inputRefs.current["name"] = el}
                      value={formData.name} 
                      onChange={e => {
                        setFormData({...formData, name: e.target.value});
                        if (formErrors.name) setFormErrors(prev => ({ ...prev, name: false }));
                      }} 
                      placeholder="e.g. St. Xavier's International" 
                      className={cn(
                        "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                        formErrors.name && "border-red-500 ring-2 ring-red-500/10"
                      )} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Address</Label>
                    <Input 
                      ref={el => inputRefs.current["address"] = el}
                      value={formData.address} 
                      onChange={e => {
                        setFormData({...formData, address: e.target.value});
                        if (formErrors.address) setFormErrors(prev => ({ ...prev, address: false }));
                      }} 
                      placeholder="Enter full institutional address" 
                      className={cn(
                        "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                        formErrors.address && "border-red-500 ring-2 ring-red-500/10"
                      )} 
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">Administrative Contact</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Office Phone</Label>
                      <Input 
                        ref={el => inputRefs.current["phone"] = el}
                        value={formData.phone} 
                        maxLength={12}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                          setFormData({...formData, phone: val});
                          if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: false }));
                        }} 
                        placeholder="10 or 12 digit number" 
                        className={cn(
                          "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                          formErrors.phone && "border-red-500 ring-2 ring-red-500/10"
                        )} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Direct Email</Label>
                      <Input 
                        ref={el => inputRefs.current["email"] = el}
                        value={formData.email} 
                        onChange={e => {
                          setFormData({...formData, email: e.target.value});
                          if (formErrors.email) setFormErrors(prev => ({ ...prev, email: false }));
                        }} 
                        placeholder="office@school.com" 
                        className={cn(
                          "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                          formErrors.email && "border-red-500 ring-2 ring-red-500/10"
                        )} 
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Status</Label>
                    <UISelect value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                      <SelectTrigger className="h-10 border-slate-200 bg-white font-bold rounded-xl px-4 text-sm">
                        <SelectValue placeholder="Select System Status">
                          {formData.status && formData.status !== "none" ? formData.status : "Select System Status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="none" className="font-semibold py-1.5 text-xs text-slate-400 italic">Select System Status</SelectItem>
                        <SelectItem value="Active" className="font-semibold py-1.5 text-xs">Active</SelectItem>
                        <SelectItem value="Suspended" className="font-semibold py-1.5 text-xs">Suspended</SelectItem>
                      </SelectContent>
                    </UISelect>
                  </div>
                </section>
              </div>
            </div>

            <DialogFooter className="bg-slate-50 px-10 py-5 shrink-0 border-t border-slate-100 flex flex-row items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="h-9 px-5 font-bold text-slate-500 hover:text-slate-900 rounded-xl text-xs uppercase tracking-wider">
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
                    Update the official records and contact information for this educational branch.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
              <div className="max-w-xl mx-auto space-y-6">
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">Institution Details</h3>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Name</Label>
                    <Input 
                      ref={el => inputRefs.current["name"] = el}
                      value={formData.name} 
                      onChange={e => {
                        setFormData({...formData, name: e.target.value});
                        if (formErrors.name) setFormErrors(prev => ({ ...prev, name: false }));
                      }} 
                      placeholder="e.g. St. Xavier's International" 
                      className={cn(
                        "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                        formErrors.name && "border-red-500 ring-2 ring-red-500/10"
                      )} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Address</Label>
                    <Input 
                      ref={el => inputRefs.current["address"] = el}
                      value={formData.address} 
                      onChange={e => {
                        setFormData({...formData, address: e.target.value});
                        if (formErrors.address) setFormErrors(prev => ({ ...prev, address: false }));
                      }} 
                      placeholder="Enter full institutional address" 
                      className={cn(
                        "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                        formErrors.address && "border-red-500 ring-2 ring-red-500/10"
                      )} 
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">Administrative Contact</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Office Phone</Label>
                      <Input 
                        ref={el => inputRefs.current["phone"] = el}
                        value={formData.phone} 
                        maxLength={12}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                          setFormData({...formData, phone: val});
                          if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: false }));
                        }} 
                        placeholder="10 or 12 digit number" 
                        className={cn(
                          "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                          formErrors.phone && "border-red-500 ring-2 ring-red-500/10"
                        )} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Direct Email</Label>
                      <Input 
                        ref={el => inputRefs.current["email"] = el}
                        value={formData.email} 
                        onChange={e => {
                          setFormData({...formData, email: e.target.value});
                          if (formErrors.email) setFormErrors(prev => ({ ...prev, email: false }));
                        }} 
                        placeholder="office@school.com" 
                        className={cn(
                          "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                          formErrors.email && "border-red-500 ring-2 ring-red-500/10"
                        )} 
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Status</Label>
                    <UISelect value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                      <SelectTrigger className="h-10 border-slate-200 bg-white font-bold rounded-xl px-4 text-sm">
                        <SelectValue placeholder="Select System Status">
                          {formData.status && formData.status !== "none" ? formData.status : "Select System Status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="none" className="font-semibold py-1.5 text-xs text-slate-400 italic">Select System Status</SelectItem>
                        <SelectItem value="Active" className="font-semibold py-1.5 text-xs">Active</SelectItem>
                        <SelectItem value="Suspended" className="font-semibold py-1.5 text-xs">Suspended</SelectItem>
                      </SelectContent>
                    </UISelect>
                  </div>
                </section>
              </div>
            </div>

            <DialogFooter className="bg-slate-50 px-10 py-5 shrink-0 border-t border-slate-100 flex flex-row items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="h-9 px-5 font-bold text-slate-500 hover:text-slate-900 rounded-xl text-xs uppercase tracking-wider">
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
        <StatItem title="Total Schools" value={schools.length.toString()} icon={School} color="text-blue-600 bg-blue-50" />
        <StatItem title="Active License" value={schools.filter(s => s.status === 'Active').length.toString()} icon={Globe} color="text-emerald-600 bg-emerald-50" />
        <StatItem title="System Health" value="99.9%" icon={ShieldCheck} color="text-purple-600 bg-purple-50" />
      </div>

      <Card className="shadow-2xl shadow-slate-200/60 border-none rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100 bg-white px-8 pt-8">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search by name, school ID, or location..." 
                className="pl-10 h-11 border-slate-200 bg-slate-50/50 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      School ID <ArrowUpDown size={12} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Institution Profile <ArrowUpDown size={12} />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Digital Registry</TableHead>
                  <TableHead 
                    className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status <ArrowUpDown size={12} />
                    </div>
                  </TableHead>
                  <TableHead className="text-right pr-8 text-xs font-black text-slate-500 uppercase tracking-widest">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSchools.map((school) => (
                  <TableRow key={school.id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                    <TableCell className="pl-8 font-mono text-xs font-black text-blue-600 italic">SCH-{school.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{school.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin size={10} /> {school.address || "Main Branch"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">{school.id}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "font-bold",
                          school.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
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
                            <DropdownMenuItem className="gap-2" onClick={() => handleEditClick(school)}>
                              <Edit size={14} /> Edit School
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600" onClick={() => handleDeleteSchool(school.id)}>
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
          <div className={cn("p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110", color)}>
            <Icon size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
