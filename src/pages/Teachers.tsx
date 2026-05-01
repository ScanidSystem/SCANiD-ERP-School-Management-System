import React, { useState } from "react";
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
  Download
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
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  subject: string;
  standard: string;
  section: string;
  joiningDate: string;
  status: "Active" | "On Leave" | "Resigned";
  rating: number;
}

const initialTeachers: Teacher[] = [
  { 
    id: "T-001", 
    firstName: "Robert", 
    middleName: "James", 
    lastName: "Wilson", 
    name: "Robert James Wilson",
    email: "robert.w@school.edu",
    phone: "+1 234 567 8901",
    qualification: "M.Sc Physics, B.Ed",
    experience: "12 Years",
    subject: "Physics",
    standard: "10th, 12th",
    section: "A, B",
    joiningDate: "2018-06-15",
    status: "Active",
    rating: 4.8
  },
  { 
    id: "T-002", 
    firstName: "Sarah", 
    middleName: "Marie", 
    lastName: "Taylor", 
    name: "Sarah Marie Taylor",
    email: "sarah.t@school.edu",
    phone: "+1 234 567 8902",
    qualification: "M.A English Literature",
    experience: "8 Years",
    subject: "English",
    standard: "9th, 10th",
    section: "A, C",
    joiningDate: "2020-01-10",
    status: "Active",
    rating: 4.5
  },
  { 
    id: "T-003", 
    firstName: "Emily", 
    middleName: "Grace", 
    lastName: "Brown", 
    name: "Emily Grace Brown",
    email: "emily.b@school.edu",
    phone: "+1 234 567 8903",
    qualification: "M.Sc Mathematics",
    experience: "15 Years",
    subject: "Mathematics",
    standard: "11th, 12th",
    section: "B",
    joiningDate: "2015-08-20",
    status: "On Leave",
    rating: 4.9
  }
];

export default function Teachers({ user }: { user: any }) {
  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";
  const canManage = isAdmin || isTeacher;
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Teacher; direction: "asc" | "desc" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");

  // Form State
  const [formData, setFormData] = useState<Partial<Teacher>>({
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
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || t.status === filterStatus;
      const matchesSubject = filterSubject === "all" || t.subject === filterSubject;
      return matchesSearch && matchesStatus && matchesSubject;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Subject", "Standard", "Experience", "Status"];
    const rows = filteredTeachers.map(t => [
      t.id,
      t.name,
      t.email,
      t.phone,
      t.subject,
      t.standard,
      t.experience,
      t.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `teachers_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const handleCreateOrUpdate = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject) {
      toast.error("Please fill all required fields");
      return;
    }

    const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.replace(/\s+/g, ' ').trim();

    if (isEditing && selectedTeacher) {
      setTeachers(prev => prev.map(t => t.id === selectedTeacher.id ? { 
        ...t, 
        ...formData, 
        name: fullName 
      } as Teacher : t));
      toast.success("Teacher profile updated successfully");
    } else {
      const newTeacher: Teacher = {
        ...(formData as Teacher),
        id: `T-00${teachers.length + 1}`,
        name: fullName,
        joiningDate: new Date().toISOString().split('T')[0],
        rating: 0
      };
      setTeachers(prev => [newTeacher, ...prev]);
      toast.success("New teacher registered successfully");
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    toast.success("Teacher record deleted");
  };

  const startEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ ...teacher });
    setIsEditing(true);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Directory</h1>
          <p className="text-slate-500 mt-1">Manage teaching staff qualifications and classroom assignments.</p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if(!open) resetForm(); }}>
            <DialogTrigger
              render={
                <button className="flex items-center justify-center gap-2 h-10 px-6 rounded-md bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-white border-none outline-none cursor-pointer font-bold text-sm">
                  <UserPlus size={18} /> Register Teacher
                </button>
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
                {/* Basic Info */}
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

                {/* Contact Info */}
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

                {/* Professional Details */}
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

                {/* Academic Assignment */}
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
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className={cn(
                      "flex items-center justify-center gap-2 h-9 px-3 rounded-md transition-colors border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 outline-none cursor-pointer text-sm font-medium",
                      (filterStatus !== "all" || filterSubject !== "all") ? "bg-blue-50 text-blue-600 border-blue-200" : ""
                    )}>
                      <Filter size={14} /> 
                      {filterStatus !== "all" || filterSubject !== "all" ? "Filters Active" : "Filter"}
                    </button>
                  }
                />
                <DropdownMenuContent align="end" className="w-56 p-4">
                  <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-400">Status</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                            <SelectItem value="Resigned">Resigned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-400">Subject</Label>
                        <Select value={filterSubject} onValueChange={setFilterSubject}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All Subjects" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjects.map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs text-blue-600 hover:text-blue-700 h-8"
                        onClick={() => { setFilterStatus("all"); setFilterSubject("all"); }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="gap-2 border-slate-200" onClick={exportToCSV}>
                <Download size={14} /> Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead 
                  className="w-[100px] pl-6 font-bold text-slate-800 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-1">
                    ID {sortConfig?.key === "id" && (sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-bold text-slate-800 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Teacher Profile {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </TableHead>
                <TableHead 
                   className="font-bold text-slate-800 cursor-pointer hover:text-blue-600"
                   onClick={() => handleSort("subject")}
                >
                  <div className="flex items-center gap-1">
                    Subject Expertise {sortConfig?.key === "subject" && (sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </TableHead>
                <TableHead className="font-bold text-slate-800">Assignement</TableHead>
                <TableHead 
                  className="font-bold text-slate-800 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("experience")}
                >
                  <div className="flex items-center gap-1">
                    Experience {sortConfig?.key === "experience" && (sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-bold text-slate-800 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status {sortConfig?.key === "status" && (sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </TableHead>
                {canManage && <TableHead className="text-right pr-6 font-bold text-slate-800">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id} className="hover:bg-slate-50/80 transition-colors group">
                  <TableCell className="pl-6 font-mono text-xs font-bold text-blue-600 italic">
                    {teacher.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                        <AvatarFallback className="bg-slate-100 text-slate-700 font-bold uppercase">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none">{teacher.name}</span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail size={10} /> {teacher.email}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone size={10} /> {teacher.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 w-fit font-bold">
                        {teacher.subject}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-medium italic">{teacher.qualification}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{teacher.standard} Std.</span>
                      <span className="text-[10px] text-slate-400 font-bold">Sections {teacher.section}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-semibold text-slate-600">{teacher.experience}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold",
                      teacher.status === "Active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200" : 
                      teacher.status === "On Leave" ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200" : 
                      "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                    )} variant="outline">
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  {canManage && (
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-blue-600 border-none bg-transparent outline-none cursor-pointer">
                              <MoreHorizontal size={16} />
                            </button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            {isAdmin && (
                              <DropdownMenuItem onClick={() => startEdit(teacher)} className="gap-2 cursor-pointer">
                                <Edit size={14} /> Edit Profile
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Calendar size={14} /> Mark Attendance
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <GraduationCap size={14} /> Performance Review
                            </DropdownMenuItem>
                            {isAdmin && (
                              <DropdownMenuItem 
                                onClick={() => handleDelete(teacher.id)} 
                                className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={14} /> Delete Record
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Quick Summary Cards (Advanced Feature) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
        <Card className="bg-slate-900 border-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Faculty</p>
              <h3 className="text-3xl font-black text-white mt-1">{teachers.length}</h3>
            </div>
            <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-slate-100 shadow-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">On Leave Today</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{teachers.filter(t => t.status === "On Leave").length}</h3>
            </div>
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <XCircle className="text-amber-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-slate-100 shadow-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Assignments</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{teachers.filter(t => t.status === "Active").length}</h3>
            </div>
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-emerald-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
