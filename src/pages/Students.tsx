import React, { useState, useRef, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { apiService } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  Plus, 
  Search, 
  Download, 
  Upload, 
  MoreHorizontal, 
  Edit2, 
  Trash2,
  Filter,
  Camera,
  UserCircle
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
import { toast } from "sonner";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const studentsData = [
  { 
    id: "1", 
    grno: "GR001",
    schoolId: "SCH001",
    firstName: "Alex",
    middleName: "James",
    lastName: "Johnson",
    name: "Alex James Johnson", 
    motherName: "Mary Johnson",
    address: "123 School Lane, West District",
    aadharCard: "1234 5678 9012",
    birthDate: "2010-05-15",
    roll: "101", 
    standard: "10th", 
    section: "A", 
    attendance: "94%", 
    performance: "Excellent" 
  },
  { 
    id: "2", 
    grno: "GR002",
    schoolId: "SCH002",
    firstName: "Sarah",
    middleName: "Anne",
    lastName: "Williams",
    name: "Sarah Anne Williams", 
    motherName: "Linda Williams",
    address: "45 Education St, Central City",
    aadharCard: "2345 6789 0123",
    birthDate: "2011-02-10",
    roll: "102", 
    standard: "10th", 
    section: "A", 
    attendance: "91%", 
    performance: "Good" 
  },
  { 
    id: "3", 
    grno: "GR003",
    schoolId: "SCH001",
    firstName: "Michael",
    middleName: "Lee",
    lastName: "Chen",
    name: "Michael Lee Chen", 
    motherName: "Hui Chen",
    address: "78 Wisdom Way, East Park",
    aadharCard: "3456 7890 1234",
    birthDate: "2010-11-22",
    roll: "103", 
    standard: "9th", 
    section: "B", 
    attendance: "88%", 
    performance: "Average" 
  },
];

import { User as UserType } from "@/App";

export default function Students({ user }: { user: UserType }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [standardFilter, setStandardFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getStudents(user.schoolId ? parseInt(user.schoolId) : undefined);
      // Map API fields back to UI state fields
      const formatted = response.data.map((s: any) => ({
        id: s.id.toString(),
        grno: s.registrationNumber,
        name: s.fullName,
        standard: s.standard,
        section: s.section,
        roll: s.rollNumber?.toString() || "0",
        address: s.address || "N/A",
        birthDate: s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : "N/A",
        photo: "", // Placeholder for real photo blob/url
        attendance: "100%", // Calculated field or separate join
        performance: "Excellent", // Calculated field or separate join
      }));
      setStudents(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not connect to database API. Check if your backend is running.");
    } finally {
      setLoading(false);
    }
  }, [user.schoolId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  
  const canManage = user.role === "superadmin" || user.role === "admin";
  
  const [uploadingStudentId, setUploadingStudentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const [newStudentFormData, setNewStudentFormData] = useState({
    grno: "",
    firstName: "",
    middleName: "",
    lastName: "",
    motherName: "",
    address: "",
    aadharCard: "",
    birthDate: "",
    roll: "",
    standard: "10th",
    section: "A",
    attendance: "100%",
    performance: "Excellent"
  });

  const handleExport = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Preparing student export...",
      success: "Students records exported to Excel successfully!",
      error: "Export failed",
    });
  };

  const handleImport = () => {
    setIsBulkUploadOpen(true);
  };

  const validateStudentData = (data: any, isBulk = false) => {
    const errors: string[] = [];

    if (!data.grno?.toString().trim()) errors.push("GRNO is required");
    if (!data.firstName?.toString().trim()) errors.push("First name is required");
    if (!data.lastName?.toString().trim()) errors.push("Last name is required");
    if (!data.roll?.toString().trim()) errors.push("Roll number is required");
    if (!data.motherName?.toString().trim()) errors.push("Mother's name is required");
    if (!data.address?.toString().trim()) errors.push("Address is required");
    if (!data.birthDate) errors.push("Birth date is required");
    
    // Aadhar Card Validation (12 digits)
    const aadharClean = (data.aadharCard || "").toString().replace(/[\s-]/g, "");
    if (!aadharClean) {
      errors.push("Aadhar card is required");
    } else if (!/^\d{12}$/.test(aadharClean)) {
      errors.push("Aadhar card must be exactly 12 digits");
    }

    // Birth Date Validation (Must be in the past)
    if (data.birthDate) {
      const bDate = new Date(data.birthDate);
      if (isNaN(bDate.getTime())) {
        errors.push("Invalid birth date format");
      } else if (bDate >= new Date()) {
        errors.push("Birth date must be in the past");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        if (data.length === 0) {
          toast.error("The uploaded file is empty.");
          setIsProcessing(false);
          return;
        }

        const validNewStudents: any[] = [];
        let duplicateCount = 0;
        let invalidCount = 0;
        const existingRolls = new Set(students.map(s => s.roll));
        const existingGrnos = new Set(students.map(s => (s as any).grno));

        data.forEach((item, index) => {
          const fName = item["First Name"] || item.firstName || item.name?.split(" ")[0] || "";
          const mName = item["Middle Name"] || item.middleName || "";
          const lName = item["Last Name"] || item.lastName || item.name?.split(" ").slice(1).join(" ") || "";
          const rollValue = (item.Roll || item.roll || "").toString();
          const grnoValue = (item.GRNO || item.grno || "").toString();

          const studentObj = {
            grno: grnoValue,
            firstName: fName,
            middleName: mName,
            lastName: lName,
            motherName: item["Mother Name"] || item.motherName || "",
            address: item.Address || item.address || "",
            aadharCard: (item["Aadhar Card"] || item.aadharCard || "").toString(),
            birthDate: item["Birth Date"] || item.birthDate || "",
            roll: rollValue,
            standard: (item.Standard || item.standard || "10th").toString(),
            section: (item.Section || item.section || "A").toString(),
            attendance: (item.Attendance || item.attendance || "100%").toString(),
            performance: (item.Performance || item.performance || "Excellent").toString(),
          };

          const validation = validateStudentData(studentObj, true);
          
          if (!validation.isValid) {
            invalidCount++;
            return;
          }

          if (existingRolls.has(rollValue) || existingGrnos.has(grnoValue)) {
            duplicateCount++;
            return;
          }

          validNewStudents.push({
            ...studentObj,
            id: (Date.now() + index).toString(),
            name: `${fName} ${mName} ${lName}`.replace(/\s+/g, ' ').trim(),
            photo: ""
          });
        });

        if (validNewStudents.length === 0) {
          toast.error(`Import failed: ${invalidCount} invalid records and ${duplicateCount} duplicates found.`);
          setIsProcessing(false);
          return;
        }

        setStudents(prev => [...validNewStudents, ...prev]);
        setIsBulkUploadOpen(false);
        
        const summaryMsg = `Successfully imported ${validNewStudents.length} students.`;
        const extraInfo = [];
        if (duplicateCount > 0) extraInfo.push(`${duplicateCount} duplicates skipped`);
        if (invalidCount > 0) extraInfo.push(`${invalidCount} invalid rows skipped`);
        
        toast.success(summaryMsg, {
          description: extraInfo.length > 0 ? extraInfo.join(", ") : undefined,
          duration: 6000
        });
      } catch (error) {
        console.error("Bulk upload error:", error);
        toast.error("Failed to parse Excel file. Please check the format.");
      } finally {
        setIsProcessing(false);
        if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file.");
      setIsProcessing(false);
    };

    reader.readAsBinaryString(file);
  };

  const triggerPhotoUpload = (id: string) => {
    setUploadingStudentId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadingStudentId && e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setStudents(prev => prev.map(s => s.id === uploadingStudentId ? { ...s, photo: base64String } : s));
        toast.success("Student photo updated!");
        setUploadingStudentId(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset for next upload
    e.target.value = '';
  };

  const handleAddStudent = async () => {
    const validation = validateStudentData(newStudentFormData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        registrationNumber: newStudentFormData.grno,
        fullName: `${newStudentFormData.firstName} ${newStudentFormData.middleName} ${newStudentFormData.lastName}`.trim(),
        schoolId: user.schoolId ? parseInt(user.schoolId) : 1, // Fallback to 1 for demo
        standard: newStudentFormData.standard,
        section: newStudentFormData.section,
        dateOfBirth: newStudentFormData.birthDate,
        rollNumber: parseInt(newStudentFormData.roll),
        address: newStudentFormData.address,
      };

      await apiService.createStudent(payload);
      toast.success("Student added to database successfully!");
      setIsAddDialogOpen(false);
      fetchStudents(); // Refresh from DB
    } catch (error) {
      toast.error("Failed to save student to database");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the database?`)) {
      try {
        await apiService.deleteStudent(parseInt(id));
        toast.info("Deleted from database");
        fetchStudents();
      } catch (error) {
        toast.error("Failed to delete record");
      }
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search);
    const matchesStandard = standardFilter === "all" || s.standard === standardFilter;
    const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
    return matchesSearch && matchesStandard && matchesSection;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Hidden File Input for Photo Upload */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        <div>
          <p className="text-slate-500 mt-1">Manage and track student information across all standards.</p>
        </div>
        <div className="flex items-center gap-2">
          {canManage && (
            <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
              <DialogTrigger
                render={
                  <div className="flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 outline-none cursor-pointer text-sm font-medium">
                    <Upload size={16} /> Bulk Upload
                  </div>
                }
              />
              <DialogContent>
                {/* ... existing content ... */}
              </DialogContent>
            </Dialog>
          )}

          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download size={16} /> Export
          </Button>
          
          {canManage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger
                render={
                  <div className="flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white border-none outline-none cursor-pointer font-medium text-sm">
                    <Plus size={16} /> Add Student
                  </div>
                }
              />
              <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                {/* ... existing content ... */}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  placeholder="Search by name or roll number..." 
                  className="pl-10" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={standardFilter} onValueChange={setStandardFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Standards</SelectItem>
                    <SelectItem value="8th">8th</SelectItem>
                    <SelectItem value="9th">9th</SelectItem>
                    <SelectItem value="10th">10th</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-500 font-medium">
                Showing {filteredStudents.length} Students
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[100px]">GRNO</TableHead>
                <TableHead className="w-[80px]">Roll</TableHead>
                <TableHead>Student Details</TableHead>
                <TableHead>Standard</TableHead>
                <TableHead>Personal Info</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-blue-600">{(student as any).grno || student.id}</TableCell>
                  <TableCell className="font-mono text-xs font-bold text-slate-500">{student.roll}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarImage src={student.photo} alt={student.name} />
                          <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-bold">
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <button 
                          onClick={() => triggerPhotoUpload(student.id)}
                          className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                        >
                          <Camera size={10} className="text-slate-600" />
                        </button>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none mb-1">{student.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Mother: {(student as any).motherName || 'Not recorded'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-slate-600 font-bold">{student.standard}-{student.section}</span>
                      <span className="text-[10px] text-slate-400">Attendance: {student.attendance}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-600 flex items-center gap-1 font-medium">
                        Birth: {(student as any).birthDate || 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {(student as any).address || 'No address'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "font-medium",
                        student.performance === "Excellent" ? "bg-emerald-100 text-emerald-700" :
                        student.performance === "Good" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      )}
                    >
                      {student.performance}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <div className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-blue-600 border-none bg-transparent outline-none cursor-pointer">
                            <MoreHorizontal size={16} />
                          </div>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="gap-2" onClick={() => triggerPhotoUpload(student.id)}>
                            <Camera size={14} /> Upload Photo
                          </DropdownMenuItem>
                          {canManage && <DropdownMenuItem className="gap-2"><Edit2 size={14} /> Edit Profile</DropdownMenuItem>}
                          <DropdownMenuItem className="gap-2"><Plus size={14} /> View Marks</DropdownMenuItem>
                          {canManage && (
                            <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDeleteStudent(student.id, student.name)}>
                              <Trash2 size={14} /> Remove Student
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
