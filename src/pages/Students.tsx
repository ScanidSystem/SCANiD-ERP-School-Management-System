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

import { User as UserType } from "@/types";

export default function Students({ user }: { user: UserType }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [standardFilter, setStandardFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  const [schools, setSchools] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    try {
      const response = await apiService.getSchools();
      setSchools(response.data);
    } catch (error) {
      console.error("Fetch schools error:", error);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getStudents(user.schoolId ? parseInt(user.schoolId) : undefined);
      // Map API fields back to UI state fields
    const formatted = response.data.map((s: any) => ({
        id: s.id.toString(),
        grno: s.registrationNumber,
        schoolId: s.schoolId?.toString() || "",
        firstName: s.firstName || s.fullName?.split(" ")[0] || "",
        lastName: s.lastName || s.fullName?.split(" ").slice(-1)[0] || "",
        middleName: s.middleName || (s.fullName?.split(" ").length > 2 ? s.fullName?.split(" ").slice(1, -1).join(" ") : ""),
        name: s.fullName,
        standard: s.standard,
        section: s.section,
        roll: s.rollNumber?.toString() || "0",
        address: s.address || "N/A",
        birthDate: s.dateOfBirth ? s.dateOfBirth.split('T')[0] : "",
        gender: s.gender || "male",
        contactNumber: s.contactNumber || "",
        motherName: s.motherName || "",
        aadharCard: s.aadharCard || "",
        photo: s.photo || "", 
        attendance: "100%", 
        performance: "Excellent", 
      }));
      setStudents(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not connect to database API.");
    } finally {
      setLoading(false);
    }
  }, [user.schoolId]);

  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, [fetchStudents, fetchSchools]);
  
  const canManage = user.role === "superadmin" || user.role === "admin";
  
  const [uploadingStudentId, setUploadingStudentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, any>>({});
  
  const initialFormState = {
    grno: "",
    schoolId: user.schoolId?.toString() || "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "male",
    contactNumber: "",
    motherName: "",
    address: "",
    aadharCard: "",
    birthDate: "",
    roll: "",
    standard: "10th",
    section: "A",
    attendance: "100%",
    performance: "Excellent"
  };

  const [newStudentFormData, setNewStudentFormData] = useState(initialFormState);

  const openAddDialog = () => {
    setIsEditMode(false);
    setCurrentStudentId(null);
    setNewStudentFormData(initialFormState);
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (student: any) => {
    setIsEditMode(true);
    setCurrentStudentId(student.id);
    setFormErrors({});
    setNewStudentFormData({
      grno: student.grno,
      schoolId: student.schoolId || user.schoolId || "",
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      gender: student.gender || "male",
      contactNumber: student.contactNumber || "",
      motherName: student.motherName,
      address: student.address,
      aadharCard: student.aadharCard,
      birthDate: student.birthDate,
      roll: student.roll,
      standard: student.standard,
      section: student.section,
      attendance: student.attendance,
      performance: student.performance
    });
    setIsAddDialogOpen(true);
  };

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

    if (!data.schoolId) errors.push("School selection is required");
    if (!data.grno?.toString().trim()) errors.push("Registration Number (GRNO) is required");
    if (!data.firstName?.toString().trim()) errors.push("First name is required");
    if (!data.lastName?.toString().trim()) errors.push("Last name is required");
    if (!data.roll?.toString().trim()) errors.push("Roll number is required");
    if (!data.gender) errors.push("Gender is required");
    
    const contactClean = (data.contactNumber || "").toString().replace(/[\s-]/g, "");
    if (contactClean && !/^\d{10}$/.test(contactClean)) {
      errors.push("Contact number must be 10 digits");
    }
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
    const newErrors: Record<string, boolean> = {};
    let firstErrorField = "";

    const checkField = (field: string, condition: boolean) => {
      if (condition) {
        newErrors[field] = true;
        if (!firstErrorField) firstErrorField = field;
      }
    };

    checkField("schoolId", !newStudentFormData.schoolId);
    checkField("standard", !newStudentFormData.standard);
    checkField("section", !newStudentFormData.section);
    checkField("grno", !newStudentFormData.grno.trim());
    checkField("roll", !newStudentFormData.roll.trim());
    checkField("gender", !newStudentFormData.gender);
    checkField("aadharCard", !newStudentFormData.aadharCard.trim() || !/^\d{12}$/.test(newStudentFormData.aadharCard.replace(/\s/g, "")));
    checkField("firstName", !newStudentFormData.firstName.trim());
    checkField("lastName", !newStudentFormData.lastName.trim());
    checkField("birthDate", !newStudentFormData.birthDate);
    checkField("motherName", !newStudentFormData.motherName.trim());
    checkField("contactNumber", !newStudentFormData.contactNumber.trim() || !/^\d{10}$/.test(newStudentFormData.contactNumber.replace(/\D/g, "")));
    checkField("address", !newStudentFormData.address.trim());

    setFormErrors(newErrors);

    if (firstErrorField) {
      toast.error("Please fill all required fields correctly.");
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
      const payload = {
        registrationNumber: newStudentFormData.grno,
        firstName: newStudentFormData.firstName,
        middleName: newStudentFormData.middleName,
        lastName: newStudentFormData.lastName,
        fullName: `${newStudentFormData.firstName} ${newStudentFormData.middleName} ${newStudentFormData.lastName}`.trim(),
        schoolId: parseInt(newStudentFormData.schoolId),
        standard: newStudentFormData.standard,
        section: newStudentFormData.section,
        dateOfBirth: newStudentFormData.birthDate,
        rollNumber: parseInt(newStudentFormData.roll),
        address: newStudentFormData.address,
        gender: newStudentFormData.gender,
        contactNumber: newStudentFormData.contactNumber,
        motherName: newStudentFormData.motherName,
        aadharCard: newStudentFormData.aadharCard,
      };

      if (isEditMode && currentStudentId) {
        await apiService.updateStudent(parseInt(currentStudentId), payload);
        toast.success("Student updated successfully!");
      } else {
        await apiService.createStudent(payload);
        toast.success("Student registered successfully!");
      }
      
      setIsAddDialogOpen(false);
      fetchStudents();
    } catch (error) {
      toast.error(isEditMode ? "Failed to update record" : "Failed to register student");
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
            <Button 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold shadow-lg shadow-blue-600/20"
              onClick={openAddDialog}
            >
              <Plus size={16} /> Add Student Record
            </Button>
          )}
          
          {canManage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] flex flex-col p-0 border-none shadow-3xl rounded-[2rem] overflow-hidden">
                <div className="bg-slate-900 px-8 py-5 text-white relative shrink-0">
                  <div className="relative z-10 flex items-center justify-between">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-xl shadow-xl shadow-blue-500/20">
                          <UserCircle size={22} className="text-white" />
                        </div>
                        {isEditMode ? "Modify Student Profile" : "Register Student"}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400 text-[12px] mt-1 font-medium max-w-2xl leading-relaxed">
                        {isEditMode 
                          ? "Update critical student records and academic history." 
                          : "Create a new permanent digital record for the enrolled student."}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
                  <div className="max-w-4xl mx-auto space-y-8">
                    {/* Academic Information */}
                    <section>
                      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Academic Placement</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-6 space-y-1.5">
                          <Label htmlFor="school" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned School Branch</Label>
                          <Select 
                            value={newStudentFormData.schoolId.toString()} 
                            onValueChange={(v) => {
                              setNewStudentFormData({...newStudentFormData, schoolId: v});
                              setFormErrors(prev => ({ ...prev, schoolId: false }));
                            }}
                            disabled={user.role !== "superadmin"}
                          >
                            <SelectTrigger 
                              ref={el => inputRefs.current["schoolId"] = el}
                              id="school" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/50 font-bold text-slate-800 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/5 transition-all text-sm",
                                formErrors.schoolId && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            >
                              <SelectValue placeholder="Identify branch" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 rounded-xl shadow-2xl border-slate-200">
                              {schools.length > 0 ? (
                                schools.map(s => (
                                  <SelectItem key={s.id} value={s.id.toString()} className="font-semibold py-2 px-3">
                                    {s.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-3 text-sm text-slate-500 text-center italic">Loading schools...</div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-3 space-y-1.5">
                          <Label htmlFor="standard" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Grade</Label>
                          <Select 
                            value={newStudentFormData.standard} 
                            onValueChange={(v) => {
                              setNewStudentFormData({...newStudentFormData, standard: v});
                              setFormErrors(prev => ({ ...prev, standard: false }));
                            }}
                          >
                            <SelectTrigger 
                              ref={el => inputRefs.current["standard"] = el}
                              id="standard" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                                formErrors.standard && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              {["8th", "9th", "10th", "11th", "12th"].map(std => (
                                <SelectItem key={std} value={std} className="font-semibold py-1.5">{std} Standard</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-3 space-y-1.5">
                          <Label htmlFor="section" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Division/Section</Label>
                          <Select 
                            value={newStudentFormData.section} 
                            onValueChange={(v) => {
                              setNewStudentFormData({...newStudentFormData, section: v});
                              setFormErrors(prev => ({ ...prev, section: false }));
                            }}
                          >
                            <SelectTrigger 
                              ref={el => inputRefs.current["section"] = el}
                              id="section" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                                formErrors.section && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              {["A", "B", "C", "D", "E"].map(sec => (
                                <SelectItem key={sec} value={sec} className="font-semibold py-1.5">Section {sec}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Identity Section */}
                      <section>
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                          <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
                          <h3 className="text-sm font-black text-slate-900 tracking-tight">Identity Details</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="grno" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registration (GRNO)</Label>
                            <Input 
                              ref={el => inputRefs.current["grno"] = el}
                              id="grno" 
                              value={newStudentFormData.grno} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, grno: e.target.value});
                                if (formErrors.grno) setFormErrors(prev => ({ ...prev, grno: false }));
                              }} 
                              placeholder="e.g. REG-001"
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 font-mono font-black text-blue-600 rounded-xl px-4 text-sm",
                                formErrors.grno && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="roll" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Roll Number</Label>
                            <Input 
                              ref={el => inputRefs.current["roll"] = el}
                              id="roll" 
                              type="number" 
                              value={newStudentFormData.roll} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, roll: e.target.value});
                                if (formErrors.roll) setFormErrors(prev => ({ ...prev, roll: false }));
                              }} 
                              placeholder="e.g. 24"
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 font-black text-slate-800 rounded-xl px-4 text-sm",
                                formErrors.roll && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="gender" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</Label>
                            <Select 
                              value={newStudentFormData.gender} 
                              onValueChange={(v) => {
                                setNewStudentFormData({...newStudentFormData, gender: v});
                                setFormErrors(prev => ({ ...prev, gender: false }));
                              }}
                            >
                              <SelectTrigger 
                                ref={el => inputRefs.current["gender"] = el}
                                id="gender" 
                                className={cn(
                                  "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                                  formErrors.gender && "border-red-500 ring-2 ring-red-500/10"
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value="male" className="font-semibold py-1.5 text-xs">Male</SelectItem>
                                <SelectItem value="female" className="font-semibold py-1.5 text-xs">Female</SelectItem>
                                <SelectItem value="other" className="font-semibold py-1.5 text-xs">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="aadharCard" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Aadhar ID</Label>
                            <Input 
                              ref={el => inputRefs.current["aadharCard"] = el}
                              id="aadharCard" 
                              value={newStudentFormData.aadharCard} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, aadharCard: e.target.value});
                                if (formErrors.aadharCard) setFormErrors(prev => ({ ...prev, aadharCard: false }));
                              }} 
                              placeholder="XXXX XXXX XXXX" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 tracking-widest font-mono font-bold rounded-xl px-4 text-sm",
                                formErrors.aadharCard && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                        </div>
                      </section>

                      {/* Personal Records */}
                      <section>
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                          <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                          <h3 className="text-sm font-black text-slate-900 tracking-tight">Legal Profile</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="firstName" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</Label>
                            <Input 
                              ref={el => inputRefs.current["firstName"] = el}
                              id="firstName" 
                              value={newStudentFormData.firstName} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, firstName: e.target.value});
                                if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: false }));
                              }} 
                              placeholder="First name" 
                              className={cn(
                                "h-10 border-slate-200 font-bold rounded-xl px-4 text-sm",
                                formErrors.firstName && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="middleName" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Middle Name</Label>
                            <Input id="middleName" value={newStudentFormData.middleName} onChange={(e) => setNewStudentFormData({...newStudentFormData, middleName: e.target.value})} placeholder="Middle name" className="h-10 border-slate-200 font-bold rounded-xl px-4 text-sm" />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <Label htmlFor="lastName" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</Label>
                            <Input 
                              ref={el => inputRefs.current["lastName"] = el}
                              id="lastName" 
                              value={newStudentFormData.lastName} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, lastName: e.target.value});
                                if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: false }));
                              }} 
                              placeholder="Last name" 
                              className={cn(
                                "h-10 border-slate-200 font-bold rounded-xl px-4 text-sm",
                                formErrors.lastName && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <Label htmlFor="birthDate" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date of Birth</Label>
                            <Input 
                              ref={el => inputRefs.current["birthDate"] = el}
                              id="birthDate" 
                              type="date" 
                              value={newStudentFormData.birthDate} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, birthDate: e.target.value});
                                if (formErrors.birthDate) setFormErrors(prev => ({ ...prev, birthDate: false }));
                              }} 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                                formErrors.birthDate && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Family & Contact Details */}
                    <section>
                      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                        <div className="w-1.5 h-5 bg-red-600 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Family & Contact</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label htmlFor="motherName" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mother's Name</Label>
                          <Input 
                            ref={el => inputRefs.current["motherName"] = el}
                            id="motherName" 
                            value={newStudentFormData.motherName} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, motherName: e.target.value});
                              if (formErrors.motherName) setFormErrors(prev => ({ ...prev, motherName: false }));
                            }} 
                            placeholder="e.g. Mary Wilson" 
                            className={cn(
                              "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                              formErrors.motherName && "border-red-500 ring-2 ring-red-500/10"
                            )}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="contactNumber" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile No.</Label>
                          <Input 
                            ref={el => inputRefs.current["contactNumber"] = el}
                            id="contactNumber" 
                            type="tel" 
                            value={newStudentFormData.contactNumber} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, contactNumber: e.target.value});
                              if (formErrors.contactNumber) setFormErrors(prev => ({ ...prev, contactNumber: false }));
                            }} 
                            placeholder="10-digit number" 
                            className={cn(
                              "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                              formErrors.contactNumber && "border-red-500 ring-2 ring-red-500/10"
                            )}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <Label htmlFor="address" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Residential Address</Label>
                          <Input 
                            ref={el => inputRefs.current["address"] = el}
                            id="address" 
                            value={newStudentFormData.address} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, address: e.target.value});
                              if (formErrors.address) setFormErrors(prev => ({ ...prev, address: false }));
                            }} 
                            placeholder="Enter complete residential address" 
                            className={cn(
                              "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                              formErrors.address && "border-red-500 ring-2 ring-red-500/10"
                            )}
                          />
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
                    onClick={handleAddStudent} 
                    disabled={isProcessing} 
                    className="h-10 px-8 bg-blue-600 hover:bg-blue-700 font-black shadow-lg shadow-blue-600/20 rounded-xl transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
                  >
                    {isProcessing ? "Processing..." : isEditMode ? "Update Record" : "Enroll Student"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="shadow-2xl shadow-slate-200/60 border-none rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100 bg-white px-8 pt-8">
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
              <TableRow className="bg-slate-50/50 h-14">
                <TableHead className="w-[120px] pl-8 text-xs font-black text-slate-500 uppercase tracking-widest">ID / GRNO</TableHead>
                <TableHead className="w-[80px] text-xs font-black text-slate-500 uppercase tracking-widest">Roll</TableHead>
                <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Student Profile</TableHead>
                <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Academic</TableHead>
                <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Verification</TableHead>
                <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Standing</TableHead>
                <TableHead className="text-right pr-8 text-xs font-black text-slate-500 uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                  <TableCell className="pl-8 font-mono text-xs font-black text-blue-600 italic">{(student as any).grno || student.id}</TableCell>
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
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] h-4 py-0 px-1 border-slate-200 text-slate-500 uppercase font-bold">
                            {student.gender}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-medium">Mother: {student.motherName || 'Not recorded'}</span>
                        </div>
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
                      <span className="text-[10px] text-slate-600 flex items-center gap-1 font-bold">
                        Birth: {student.birthDate || 'N/A'}
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                        Mob: {student.contactNumber || 'No Contact'}
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
                  <TableCell className="text-right pr-8">
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
                          {canManage && <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(student)}><Edit2 size={14} /> Edit Profile</DropdownMenuItem>}
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
