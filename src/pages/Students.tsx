import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
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
  CardHeader
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
  Camera,
  UserCircle,
  ChevronUp,
  ChevronDown
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
import { cn } from "@/lib/utils";

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

interface Student {
  id: string;
  grno: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  motherName: string;
  address: string;
  aadharCard: string;
  birthDate: string;
  roll: string;
  standard: string;
  section: string;
  attendance: string;
  performance: string;
  photo: string;
}

type StudentFormData = Omit<Student, "id" | "name" | "photo">;
type SpreadsheetRow = Record<string, unknown>;
type SortDirection = "asc" | "desc";
type StudentSortKey = "grno" | "roll" | "name" | "standard" | "birthDate" | "performance";

interface StudentSortConfig {
  key: StudentSortKey;
  direction: SortDirection;
}

const DEFAULT_STUDENT_FORM: StudentFormData = {
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
};

const studentsData: Student[] = [
  { 
    id: "1", 
    grno: "GR001",
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
    performance: "Excellent",
    photo: ""
  },
  { 
    id: "2", 
    grno: "GR002",
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
    performance: "Good",
    photo: ""
  },
];

export default function Students({ user }: { user?: unknown }) {
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [search, setSearch] = useState("");
  const [standardFilter, setStandardFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<StudentSortConfig>({
    key: "roll",
    direction: "asc"
  });
  
  const [uploadingStudentId, setUploadingStudentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const [newStudentFormData, setNewStudentFormData] = useState<StudentFormData>(DEFAULT_STUDENT_FORM);

  const buildFullName = ({ firstName, middleName, lastName }: Pick<StudentFormData, "firstName" | "middleName" | "lastName">) =>
    `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, " ").trim();

  const getCellValue = (row: SpreadsheetRow, ...keys: string[]) => {
    for (const key of keys) {
      const value = row[key];
      if (value !== undefined && value !== null) return String(value).trim();
    }
    return "";
  };

  const handleExport = () => {
    const exportRows = students.map(({ photo, ...student }) => student);
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `students_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Student records exported to Excel successfully.");
  };

  const handleImport = () => {
    setIsBulkUploadOpen(true);
  };

  const validateStudentData = (data: StudentFormData) => {
    const errors: string[] = [];

    if (!data.grno?.toString().trim()) errors.push("GRNO is required");
    if (!data.firstName?.toString().trim()) errors.push("First name is required");
    if (!data.lastName?.toString().trim()) errors.push("Last name is required");
    if (!data.roll?.toString().trim()) errors.push("Roll number is required");
    if (!data.motherName?.toString().trim()) errors.push("Mother's name is required");
    if (!data.address?.toString().trim()) errors.push("Address is required");
    if (!data.birthDate) errors.push("Birth date is required");
    
    // Government ID rule: store with spaces if entered, but validate the 12 digits only.
    const aadharClean = (data.aadharCard || "").toString().replace(/[\s-]/g, "");
    if (!aadharClean) {
      errors.push("Aadhar card is required");
    } else if (!/^\d{12}$/.test(aadharClean)) {
      errors.push("Aadhar card must be exactly 12 digits");
    }

    // Birth dates must be real dates and cannot be today or in the future.
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
        const data = XLSX.utils.sheet_to_json(ws) as SpreadsheetRow[];

        if (data.length === 0) {
          toast.error("The uploaded file is empty.");
          setIsProcessing(false);
          return;
        }

        const validNewStudents: Student[] = [];
        let duplicateCount = 0;
        let invalidCount = 0;
        const existingRolls = new Set(students.map(s => s.roll));
        const existingGrnos = new Set(students.map(s => s.grno));

        data.forEach((item, index) => {
          const importedName = getCellValue(item, "Name", "name");
          const nameParts = importedName.split(" ").filter(Boolean);
          const fName = getCellValue(item, "First Name", "firstName") || nameParts[0] || "";
          const mName = getCellValue(item, "Middle Name", "middleName");
          const lName = getCellValue(item, "Last Name", "lastName") || nameParts.slice(1).join(" ");
          const rollValue = getCellValue(item, "Roll", "roll");
          const grnoValue = getCellValue(item, "GRNO", "grno");

          const studentObj: StudentFormData = {
            grno: grnoValue,
            firstName: fName,
            middleName: mName,
            lastName: lName,
            motherName: getCellValue(item, "Mother Name", "motherName"),
            address: getCellValue(item, "Address", "address"),
            aadharCard: getCellValue(item, "Aadhar Card", "aadharCard"),
            birthDate: getCellValue(item, "Birth Date", "birthDate"),
            roll: rollValue,
            standard: getCellValue(item, "Standard", "standard") || "10th",
            section: getCellValue(item, "Section", "section") || "A",
            attendance: getCellValue(item, "Attendance", "attendance") || "100%",
            performance: getCellValue(item, "Performance", "performance") || "Excellent",
          };

          const validation = validateStudentData(studentObj);
          
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
            name: buildFullName(studentObj),
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

  const handleAddStudent = () => {
    const validation = validateStudentData(newStudentFormData);
    if (!validation.isValid) {
      toast.error(validation.errors[0], {
        description: validation.errors.length > 1 ? `And ${validation.errors.length - 1} other errors` : undefined
      });
      return;
    }

    const rollExists = students.some(s => s.roll === newStudentFormData.roll.trim());
    if (rollExists) {
      toast.error("A student with this roll number already exists");
      return;
    }

    const grnoExists = students.some(s => s.grno === newStudentFormData.grno.trim());
    if (grnoExists) {
      toast.error("A student with this GRNO already exists");
      return;
    }

    const fullName = buildFullName(newStudentFormData);

    const newStudent = {
      ...newStudentFormData,
      name: fullName,
      id: Date.now().toString(),
      photo: ""
    };

    setStudents(prev => [newStudent, ...prev]);
    setIsAddDialogOpen(false);
    setNewStudentFormData(DEFAULT_STUDENT_FORM);
    toast.success(`Student ${newStudent.name} added successfully`);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.info(`${name} removed from directory`);
    }
  };

  const requestSort = (key: StudentSortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortValue = (student: Student, key: StudentSortKey) => {
    if (key === "roll") return Number(student.roll) || 0;
    if (key === "standard") return Number(student.standard.replace(/\D/g, "")) || 0;
    if (key === "birthDate") return new Date(student.birthDate).getTime() || 0;
    return student[key].toLowerCase();
  };

  const filteredStudents = students
    .filter(s => {
      const normalizedSearch = search.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(normalizedSearch) ||
        s.roll.includes(search) ||
        s.grno.toLowerCase().includes(normalizedSearch);
      const matchesStandard = standardFilter === "all" || s.standard === standardFilter;
      const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
      return matchesSearch && matchesStandard && matchesSection;
    })
    .sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key);
      const bValue = getSortValue(b, sortConfig.key);

      // String and numeric fields share the same comparator after normalization.
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const renderSortIcon = (key: StudentSortKey) => {
    if (sortConfig.key !== key) return <ChevronUp size={12} className="opacity-20" />;
    return sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const sortableHeaderClass = "cursor-pointer select-none hover:text-blue-600 transition-colors";

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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Directory</h1>
          <p className="text-slate-500 mt-1">Manage and track student information across all standards.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger
              render={
                <button className="flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 outline-none cursor-pointer text-sm font-medium">
                  <Upload size={16} /> Bulk Upload
                </button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Student Import</DialogTitle>
                <DialogDescription>
                  Upload an Excel file (.xlsx, .xls) or CSV to import multiple students at once.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-6">
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => bulkFileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">Excel or CSV files (max. 5MB)</p>
                  <input 
                    type="file" 
                    ref={bulkFileInputRef} 
                    className="hidden" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={handleBulkUpload}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Required Columns:</p>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">GRNO</Badge>
                    <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">First Name</Badge>
                    <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">Last Name</Badge>
                    <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">Roll</Badge>
                    <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">Standard</Badge>
                    <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">Section</Badge>
                    <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">Mother Name</Badge>
                    <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">Aadhar Card</Badge>
                  </div>
                  <p className="text-[10px] text-blue-600 mt-2 italic">Note: Standard and Section are optional (default to 10th A).</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBulkUploadOpen(false)} disabled={isProcessing}>Cancel</Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700" 
                  disabled={isProcessing}
                  onClick={() => bulkFileInputRef.current?.click()}
                >
                  {isProcessing ? "Processing..." : "Select File"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download size={16} /> Export
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger
              render={
                <button className="flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white border-none outline-none cursor-pointer font-medium text-sm">
                  <Plus size={16} /> Add Student
                </button>
              }
            />
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Register New Student</DialogTitle>
                <DialogDescription>
                  Enter complete student information to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Basic Identification */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <UserCircle size={14} /> Basic Identification
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="grno">GR Number (GRNO) <span className="text-red-500">*</span></Label>
                      <Input 
                        id="grno" 
                        placeholder="e.g. GR-2024-001" 
                        value={newStudentFormData.grno}
                        onChange={(e) => setNewStudentFormData(prev => ({ ...prev, grno: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="roll">Roll Number <span className="text-red-500">*</span></Label>
                      <Input 
                        id="roll" 
                        placeholder="e.g. 101" 
                        value={newStudentFormData.roll}
                        onChange={(e) => setNewStudentFormData(prev => ({ ...prev, roll: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Name Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Candidate Names</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fName">First Name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="fName" 
                        placeholder="First" 
                        value={newStudentFormData.firstName}
                        onChange={(e) => setNewStudentFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mName">Middle Name</Label>
                      <Input 
                        id="mName" 
                        placeholder="Middle" 
                        value={newStudentFormData.middleName}
                        onChange={(e) => setNewStudentFormData(prev => ({ ...prev, middleName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lName">Last Name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="lName" 
                        placeholder="Last" 
                        value={newStudentFormData.lastName}
                        onChange={(e) => setNewStudentFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="motherName">Mother Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="motherName" 
                      placeholder="e.g. Linda Smith" 
                      value={newStudentFormData.motherName}
                      onChange={(e) => setNewStudentFormData(prev => ({ ...prev, motherName: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate">Birth Date <span className="text-red-500">*</span></Label>
                      <Input 
                        id="birthDate" 
                        type="date"
                        value={newStudentFormData.birthDate}
                        onChange={(e) => setNewStudentFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="aadhar">Aadhar Card Number <span className="text-red-500">*</span></Label>
                      <Input 
                        id="aadhar" 
                        placeholder="0000 0000 0000" 
                        value={newStudentFormData.aadharCard}
                        onChange={(e) => setNewStudentFormData(prev => ({ ...prev, aadharCard: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                    <Input 
                      id="address" 
                      placeholder="Complete residential address" 
                      value={newStudentFormData.address}
                      onChange={(e) => setNewStudentFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Academic Placement */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Academic Placement</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Standard</Label>
                      <Select 
                        value={newStudentFormData.standard} 
                        onValueChange={(v) => setNewStudentFormData(prev => ({ ...prev, standard: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8th">8th Standard</SelectItem>
                          <SelectItem value="9th">9th Standard</SelectItem>
                          <SelectItem value="10th">10th Standard</SelectItem>
                          <SelectItem value="11th">11th Standard</SelectItem>
                          <SelectItem value="12th">12th Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Section</Label>
                      <Select 
                        value={newStudentFormData.section} 
                        onValueChange={(v) => setNewStudentFormData(prev => ({ ...prev, section: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Section A</SelectItem>
                          <SelectItem value="B">Section B</SelectItem>
                          <SelectItem value="C">Section C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6 border-t mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700">
                  Add Student to Record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <TableHead className={cn("w-[100px]", sortableHeaderClass)} onClick={() => requestSort("grno")}>
                  <div className="flex items-center gap-1">
                    GRNO {renderSortIcon("grno")}
                  </div>
                </TableHead>
                <TableHead className={cn("w-[80px]", sortableHeaderClass)} onClick={() => requestSort("roll")}>
                  <div className="flex items-center gap-1">
                    Roll {renderSortIcon("roll")}
                  </div>
                </TableHead>
                <TableHead className={sortableHeaderClass} onClick={() => requestSort("name")}>
                  <div className="flex items-center gap-1">
                    Student Details {renderSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead className={sortableHeaderClass} onClick={() => requestSort("standard")}>
                  <div className="flex items-center gap-1">
                    Standard {renderSortIcon("standard")}
                  </div>
                </TableHead>
                <TableHead className={sortableHeaderClass} onClick={() => requestSort("birthDate")}>
                  <div className="flex items-center gap-1">
                    Personal Info {renderSortIcon("birthDate")}
                  </div>
                </TableHead>
                <TableHead className={sortableHeaderClass} onClick={() => requestSort("performance")}>
                  <div className="flex items-center gap-1">
                    Performance {renderSortIcon("performance")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-blue-600">{student.grno || student.id}</TableCell>
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
                        <span className="text-[10px] text-slate-400 font-medium">Mother: {student.motherName || 'Not recorded'}</span>
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
                        Birth: {student.birthDate || 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {student.address || 'No address'}
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
                          <button className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-blue-600 border-none bg-transparent outline-none cursor-pointer">
                            <MoreHorizontal size={16} />
                          </button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="gap-2" onClick={() => triggerPhotoUpload(student.id)}>
                            <Camera size={14} /> Upload Photo
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Edit2 size={14} /> Edit Profile</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Plus size={14} /> View Marks</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDeleteStudent(student.id, student.name)}>
                            <Trash2 size={14} /> Remove Student
                          </DropdownMenuItem>
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
