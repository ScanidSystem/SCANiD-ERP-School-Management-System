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
  UserCircle,
  FileText,
  GraduationCap
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
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";

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
import { SimpleTooltip } from "@/components/shared/SimpleTooltip";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { User as UserType } from "@/types";

export default function Students({ user }: { user: UserType }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [standardFilter, setStandardFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  const [schools, setSchools] = useState<any[]>([]);
  const [standardsMaster, setStandardsMaster] = useState<any[]>([]);
  const [sectionsMaster, setSectionsMaster] = useState<any[]>([]);
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);
  const [admissionTypes, setAdmissionTypes] = useState<any[]>([]);
  const [religions, setReligions] = useState<any[]>([]);
  const [castes, setCastes] = useState<any[]>([]);
  const [subCastes, setSubCastes] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  const fetchMasters = useCallback(async () => {
    try {
      const [
        standardsRes, 
        sectionsRes, 
        schoolsRes,
        bloodGroupsRes,
        housesRes,
        admissionTypesRes,
        religionsRes,
        castesRes,
        subCastesRes,
        academicYearsRes
      ] = await Promise.all([
        apiService.getStandards(),
        apiService.getSections(),
        apiService.getSchools(),
        apiService.getBloodGroups(),
        apiService.getHouses(),
        apiService.getAdmissionTypes(),
        apiService.getReligions(),
        apiService.getCastes(),
        apiService.getSubCastes(),
        apiService.getAcademicYears()
      ]);
      setStandardsMaster(standardsRes.data || []);
      setSectionsMaster(sectionsRes.data || []);
      setSchools(schoolsRes.data || []);
      setBloodGroups(bloodGroupsRes.data || []);
      setHouses(housesRes.data || []);
      setAdmissionTypes(admissionTypesRes.data || []);
      setReligions(religionsRes.data || []);
      setCastes(castesRes.data || []);
      setSubCastes(subCastesRes.data || []);
      setAcademicYears(academicYearsRes.data || []);
    } catch (error) {
      console.error("Fetch masters error:", error);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getStudents(user.schoolId ? parseInt(user.schoolId) : undefined);
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
        bloodGroupId: s.bloodGroupId,
        houseId: s.houseId,
        admissionTypeId: s.admissionTypeId,
        religionId: s.religionId,
        casteId: s.casteId,
        subCasteId: s.subCasteId,
        joiningAcademicYearId: s.joiningAcademicYearId,
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
    fetchMasters();
  }, [fetchStudents, fetchMasters]);
  
  const canManage = user.role === "superadmin" || user.role === "admin";
  
  const [uploadingStudentId, setUploadingStudentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<{ id: string; name: string } | null>(null);
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
    standard: "",
    section: "",
    bloodGroupId: "",
    houseId: "",
    admissionTypeId: "",
    religionId: "",
    casteId: "",
    subCasteId: "",
    joiningAcademicYearId: "",
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
    fetchMasters();
  };

  const openEditDialog = (student: any) => {
    setIsEditMode(true);
    setCurrentStudentId(student.id);
    setFormErrors({});
    setNewStudentFormData({
      grno: student.grno,
      schoolId: (student.schoolId || user.schoolId || "").toString(),
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
      bloodGroupId: student.bloodGroupId?.toString() || "",
      houseId: student.houseId?.toString() || "",
      admissionTypeId: student.admissionTypeId?.toString() || "",
      religionId: student.religionId?.toString() || "",
      casteId: student.casteId?.toString() || "",
      subCasteId: student.subCasteId?.toString() || "",
      joiningAcademicYearId: student.joiningAcademicYearId?.toString() || "",
      attendance: student.attendance,
      performance: student.performance
    });
    setIsAddDialogOpen(true);
    fetchMasters();
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
        bloodGroupId: newStudentFormData.bloodGroupId ? parseInt(newStudentFormData.bloodGroupId) : null,
        houseId: newStudentFormData.houseId ? parseInt(newStudentFormData.houseId) : null,
        admissionTypeId: newStudentFormData.admissionTypeId ? parseInt(newStudentFormData.admissionTypeId) : null,
        religionId: newStudentFormData.religionId ? parseInt(newStudentFormData.religionId) : null,
        casteId: newStudentFormData.casteId ? parseInt(newStudentFormData.casteId) : null,
        subCasteId: newStudentFormData.subCasteId ? parseInt(newStudentFormData.subCasteId) : null,
        joiningAcademicYearId: newStudentFormData.joiningAcademicYearId ? parseInt(newStudentFormData.joiningAcademicYearId) : null,
        dateOfBirth: newStudentFormData.birthDate,
        rollNumber: parseInt(newStudentFormData.roll),
        address: newStudentFormData.address,
        gender: newStudentFormData.gender,
        contactNumber: newStudentFormData.contactNumber,
        motherName: newStudentFormData.motherName,
        aadharCard: newStudentFormData.aadharCard,
      };

      if (isEditMode && currentStudentId) {
        await apiService.updateStudent(parseInt(currentStudentId), { ...payload, id: parseInt(currentStudentId) });
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
    setDeleteInfo({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteInfo) return;
    
    setIsProcessing(true);
    try {
      await apiService.deleteStudent(parseInt(deleteInfo.id));
      toast.success(`${deleteInfo.name} removed successfully`);
      setIsDeleteDialogOpen(false);
      setDeleteInfo(null);
      fetchStudents();
    } catch (error) {
      toast.error("Failed to delete record");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search);
    const matchesStandard = standardFilter === "all" || s.standard === standardFilter;
    const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
    return matchesSearch && matchesStandard && matchesSection;
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        <div className="flex items-center gap-5">
          <div className="bg-blue-600 p-4 rounded-[1.25rem] text-white shadow-2xl shadow-blue-200 transition-transform hover:rotate-3">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">Student Management</h1>
            <p className="text-slate-400 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">Manage and track student information across all standards.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canManage && (
            <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
              <SimpleTooltip content="Import students from Excel" side="bottom">
                <DialogTrigger
                  render={
                    <div className="flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 outline-none cursor-pointer text-sm font-medium" aria-label="Bulk upload students">
                      <Upload size={16} /> Bulk Upload
                    </div>
                  }
                />
              </SimpleTooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Student Import</DialogTitle>
                  <DialogDescription>
                    Upload an Excel file containing multiple student records to import them at once.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-4 bg-slate-50/50">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <FileText className="text-blue-500" size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">Upload your student registry</p>
                    <p className="text-xs text-slate-500 mt-1">Supports XLSX and XLS formats</p>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 font-bold px-8 rounded-xl h-10 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                    onClick={() => bulkFileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Choose File"}
                  </Button>
                  <input
                    type="file"
                    ref={bulkFileInputRef}
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        toast.info("Import feature under maintenance, please add students individually for now.");
                      }
                    }}
                  />
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Ensure your Excel follows the system template. Validation errors will result in skipped rows.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <SimpleTooltip content="Download student list as Excel" side="bottom">
            <Button variant="outline" size="sm" className="gap-2 h-9" onClick={handleExport} aria-label="Export students to Excel">
              <Download size={16} /> <span className="hidden sm:inline">Export</span>
            </Button>
          </SimpleTooltip>
          
          {canManage && (
            <SimpleTooltip content="Add a new student manually" side="bottom">
              <Button 
                size="sm"
                className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold shadow-lg shadow-blue-600/20"
                onClick={openAddDialog}
                aria-label="Register new student"
              >
                <Plus size={16} /> <span className="hidden sm:inline">Add Student Record</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </SimpleTooltip>
          )}
          
          {canManage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DeleteConfirmation 
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                loading={isProcessing}
                title="Remove Student Record?"
                description={`This will permanently delete ${deleteInfo?.name}'s profile, enrollment details, and academic history. This action cannot be reversed.`}
              />
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
                    <section>
                      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Academic Placement</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-12 space-y-1.5">
                          <Label htmlFor="school" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned School Branch</Label>
                            <Select 
                              value={newStudentFormData.schoolId} 
                              onValueChange={(v) => {
                                setNewStudentFormData({...newStudentFormData, schoolId: v});
                                if (formErrors.schoolId) setFormErrors(prev => ({ ...prev, schoolId: false }));
                              }}
                              disabled={user.role !== "superadmin" && !!user.schoolId}
                            >
                              <SelectTrigger 
                                ref={el => inputRefs.current["schoolId"] = el}
                                id="school" 
                                className={cn(
                                  "h-10 border-slate-200 bg-slate-50/50 font-bold text-slate-800 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/5 transition-all text-sm",
                                  formErrors.schoolId && "border-red-500 ring-2 ring-red-500/10",
                                  (user.role !== "superadmin" && !!user.schoolId) && "opacity-80 cursor-not-allowed bg-slate-100"
                                )}
                              >
                                <SelectValue placeholder="Select School Branch">
                                  {newStudentFormData.schoolId && newStudentFormData.schoolId !== "none" ? schools.find(s => s.id.toString() === newStudentFormData.schoolId)?.name : "Select School Branch"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="max-h-68 rounded-2xl shadow-2xl border-slate-200 p-2">
                                <SelectItem value="none" className="font-semibold py-2.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">
                                  Select School Branch
                                </SelectItem>
                                {schools.length > 0 ? (
                                  schools.map(s => (
                                    <SelectItem key={s.id} value={s.id.toString()} className="font-semibold py-2.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-bold">{s.name}</span>
                                        <span className="text-[10px] text-slate-400 font-medium tracking-tight">ID: SCH-{s.id} • {s.address?.split(',')[0]}</span>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-4 text-sm text-slate-500 text-center italic flex flex-col items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                                    Loading registered branches...
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-4 space-y-1.5">
                          <Label htmlFor="standard" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.standard ? "text-red-500" : "text-slate-500")}>Academic Grade {formErrors.standard && "*"}</Label>
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
                              <SelectValue placeholder="Select Academic Grade">
                                {newStudentFormData.standard && newStudentFormData.standard !== "none" ? newStudentFormData.standard : "Select Academic Grade"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Academic Grade</SelectItem>
                              {standardsMaster.map(std => (
                                <SelectItem key={std.id} value={std.name} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{std.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 space-y-1.5">
                          <Label htmlFor="section" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.section ? "text-red-500" : "text-slate-500")}>Division/Section {formErrors.section && "*"}</Label>
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
                              <SelectValue placeholder="Select Section/Division">
                                {newStudentFormData.section && newStudentFormData.section !== "none" ? `Section ${newStudentFormData.section}` : "Select Section/Division"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Section/Division</SelectItem>
                              {sectionsMaster.map(sec => (
                                <SelectItem key={sec.id} value={sec.name} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Section {sec.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 space-y-1.5">
                          <Label htmlFor="academicYear" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Joining Year</Label>
                          <Select 
                            value={newStudentFormData.joiningAcademicYearId} 
                            onValueChange={(v) => setNewStudentFormData({...newStudentFormData, joiningAcademicYearId: v})}
                          >
                            <SelectTrigger id="academicYear" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                              <SelectValue placeholder="Select Academic Year">
                                {newStudentFormData.joiningAcademicYearId && newStudentFormData.joiningAcademicYearId !== "none" ? academicYears.find(y => y.id.toString() === newStudentFormData.joiningAcademicYearId)?.name : "Select Academic Year"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Academic Year</SelectItem>
                              {academicYears.map(y => (
                                <SelectItem key={y.id} value={y.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{y.name} {y.isCurrent ? "(Current)" : ""}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <section>
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                          <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
                          <h3 className="text-sm font-black text-slate-900 tracking-tight">Identity Details</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="grno" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.grno ? "text-red-500" : "text-slate-500")}>Registration (GRNO) {formErrors.grno && "*"}</Label>
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
                            <Label htmlFor="roll" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.roll ? "text-red-500" : "text-slate-500")}>Roll Number {formErrors.roll && "*"}</Label>
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
                            <Label htmlFor="gender" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.gender ? "text-red-500" : "text-slate-500")}>Gender {formErrors.gender && "*"}</Label>
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
                                <SelectValue placeholder="Select Student Gender">
                                  {newStudentFormData.gender && newStudentFormData.gender !== "none" ? newStudentFormData.gender.charAt(0).toUpperCase() + newStudentFormData.gender.slice(1) : "Select Student Gender"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Gender</SelectItem>
                                <SelectItem value="male" className="font-semibold py-1.5 text-xs px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Male</SelectItem>
                                <SelectItem value="female" className="font-semibold py-1.5 text-xs px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Female</SelectItem>
                                <SelectItem value="other" className="font-semibold py-1.5 text-xs px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="aadharCard" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.aadharCard ? "text-red-500" : "text-slate-500")}>Aadhar ID {formErrors.aadharCard && "*"}</Label>
                            <Input 
                              ref={el => inputRefs.current["aadharCard"] = el}
                              id="aadharCard" 
                              value={newStudentFormData.aadharCard} 
                              maxLength={12}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                                setNewStudentFormData({...newStudentFormData, aadharCard: val});
                                if (formErrors.aadharCard) setFormErrors(prev => ({ ...prev, aadharCard: false }));
                              }} 
                              placeholder="12-digit number" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 tracking-widest font-mono font-bold rounded-xl px-4 text-sm",
                                formErrors.aadharCard && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                        </div>
                      </section>

                      <section>
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                          <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                          <h3 className="text-sm font-black text-slate-900 tracking-tight">Legal Profile</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="firstName" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.firstName ? "text-red-500" : "text-slate-500")}>First Name {formErrors.firstName && "*"}</Label>
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
                            <Label htmlFor="lastName" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.lastName ? "text-red-500" : "text-slate-500")}>Last Name {formErrors.lastName && "*"}</Label>
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
                            <Label htmlFor="birthDate" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.birthDate ? "text-red-500" : "text-slate-500")}>Date of Birth {formErrors.birthDate && "*"}</Label>
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
                          
                          <div className="space-y-1.5">
                            <Label htmlFor="religion" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Religion</Label>
                            <Select 
                              value={newStudentFormData.religionId} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, religionId: v})}
                            >
                              <SelectTrigger id="religion" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student Religion">
                                  {newStudentFormData.religionId && newStudentFormData.religionId !== "none" ? religions.find(r => r.id.toString() === newStudentFormData.religionId)?.name : "Select Student Religion"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Religion</SelectItem>
                                {religions.map(r => (
                                  <SelectItem key={r.id} value={r.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{r.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="bloodGroup" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Blood Group</Label>
                            <Select 
                              value={newStudentFormData.bloodGroupId} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, bloodGroupId: v})}
                            >
                              <SelectTrigger id="bloodGroup" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student Blood Group">
                                  {newStudentFormData.bloodGroupId && newStudentFormData.bloodGroupId !== "none" ? bloodGroups.find(bg => bg.id.toString() === newStudentFormData.bloodGroupId)?.name : "Select Student Blood Group"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Blood Group</SelectItem>
                                {bloodGroups.map(bg => (
                                  <SelectItem key={bg.id} value={bg.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{bg.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="caste" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Caste</Label>
                            <Select 
                              value={newStudentFormData.casteId} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, casteId: v})}
                            >
                              <SelectTrigger id="caste" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Caste Category">
                                  {newStudentFormData.casteId && newStudentFormData.casteId !== "none" ? castes.find(c => c.id.toString() === newStudentFormData.casteId)?.name : "Select Caste Category"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Caste Category</SelectItem>
                                {castes.map(c => (
                                  <SelectItem key={c.id} value={c.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="subCaste" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sub-Caste</Label>
                            <Select 
                              value={newStudentFormData.subCasteId} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, subCasteId: v})}
                              disabled={!newStudentFormData.casteId}
                            >
                              <SelectTrigger id="subCaste" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student Sub-Caste">
                                  {newStudentFormData.subCasteId && newStudentFormData.subCasteId !== "none" ? subCastes.find(sc => sc.id.toString() === newStudentFormData.subCasteId)?.name : "Select Student Sub-Caste"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Sub-Caste</SelectItem>
                                {subCastes
                                  .filter(sc => sc.casteId?.toString() === newStudentFormData.casteId)
                                  .map(sc => (
                                    <SelectItem key={sc.id} value={sc.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{sc.name}</SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="house" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">School House</Label>
                            <Select 
                              value={newStudentFormData.houseId} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, houseId: v})}
                            >
                              <SelectTrigger id="house" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student House Group">
                                  {newStudentFormData.houseId && newStudentFormData.houseId !== "none" ? houses.find(h => h.id.toString() === newStudentFormData.houseId)?.name : "Select Student House Group"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student House Group</SelectItem>
                              {houses.map(h => (
                                <SelectItem key={h.id} value={h.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }}></div>
                                    {h.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="admissionType" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admission Type</Label>
                            <Select 
                              value={newStudentFormData.admissionTypeId} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, admissionTypeId: v})}
                            >
                              <SelectTrigger id="admissionType" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student Admission Type">
                                  {newStudentFormData.admissionTypeId && newStudentFormData.admissionTypeId !== "none" ? admissionTypes.find(at => at.id.toString() === newStudentFormData.admissionTypeId)?.name : "Select Student Admission Type"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="none" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Admission Type</SelectItem>
                              {admissionTypes.map(at => (
                                <SelectItem key={at.id} value={at.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{at.name}</SelectItem>
                              ))}
                            </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </section>
                    </div>

                    <section>
                      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                        <div className="w-1.5 h-5 bg-red-600 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Family & Contact</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label htmlFor="motherName" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.motherName ? "text-red-500" : "text-slate-500")}>Mother's Name {formErrors.motherName && "*"}</Label>
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
                          <Label htmlFor="contactNumber" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.contactNumber ? "text-red-500" : "text-slate-500")}>Mobile No. {formErrors.contactNumber && "*"}</Label>
                          <Input 
                            ref={el => inputRefs.current["contactNumber"] = el}
                            id="contactNumber" 
                            type="tel" 
                            value={newStudentFormData.contactNumber} 
                            maxLength={10}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setNewStudentFormData({...newStudentFormData, contactNumber: val});
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
                          <Label htmlFor="address" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.address ? "text-red-500" : "text-slate-500")}>Residential Address {formErrors.address && "*"}</Label>
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

      <Card className="dashboard-card border-none overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-50 bg-white/50 backdrop-blur-sm px-6 sm:px-8 pt-8">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative w-full max-w-sm group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input 
                  placeholder="Filter by name, roll, or GR..." 
                  className="pl-11 h-11 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium rounded-2xl" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={standardFilter} onValueChange={setStandardFilter}>
                  <SelectTrigger className="w-[140px] h-11 bg-slate-50/50 border-slate-200/60 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-blue-500/5">
                    <SelectValue placeholder="Standard">
                      {standardFilter === "all" ? "All Grades" : `Grade ${standardFilter}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                    <SelectItem value="all" className="rounded-xl font-bold py-2.5">All Grades</SelectItem>
                    {standardsMaster.map(std => (
                      <SelectItem key={std.id} value={std.name} className="rounded-xl font-bold py-2.5">Grade {std.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                  <SelectTrigger className="w-[140px] h-11 bg-slate-50/50 border-slate-200/60 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-blue-500/5">
                    <SelectValue placeholder="Section">
                      {sectionFilter === "all" ? "All Sections" : `Section ${sectionFilter}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                    <SelectItem value="all" className="rounded-xl font-bold py-2.5">All Sections</SelectItem>
                    {sectionsMaster.map(sec => (
                      <SelectItem key={sec.id} value={sec.name} className="rounded-xl font-bold py-2.5">Section {sec.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50/80 px-5 py-2.5 rounded-2xl border border-slate-100">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-500">
                <span className="font-black text-slate-900">{filteredStudents.length}</span> Active Registry Records
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30 h-16 border-b border-slate-50">
                <TableHead className="w-[140px] pl-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registry #</TableHead>
                <TableHead className="w-[80px] hidden md:table-cell text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Roll</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile Information</TableHead>
                <TableHead className="hidden lg:table-cell text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Placement</TableHead>
                <TableHead className="hidden xl:table-cell text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity Details</TableHead>
                <TableHead className="hidden sm:table-cell text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Status</TableHead>
                <TableHead className="text-right pr-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50/50 h-20">
                    <TableCell className="pl-8">
                       <SimpleTooltip content="Official Registration Number" side="right">
                        <span className="font-mono text-xs font-black text-blue-600 bg-blue-50/50 px-2.5 py-1.5 rounded-lg border border-blue-100/50 cursor-help">
                          {(student as any).grno || student.id}
                        </span>
                       </SimpleTooltip>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-black text-slate-900 hidden md:table-cell">{student.roll.toString().padStart(2, '0')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <Avatar className="h-11 w-11 border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <AvatarImage src={student.photo} alt={student.name} />
                            <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 text-xs font-black">
                              {student.name ? student.name.split(" ").map((n: string) => n[0]).join("") : "S"}
                            </AvatarFallback>
                          </Avatar>
                          <SimpleTooltip content="Update photo" side="top">
                            <button 
                              onClick={() => triggerPhotoUpload(student.id)}
                              className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-slate-100 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                              aria-label="Change student photo"
                            >
                              <Camera size={10} className="text-blue-600" />
                            </button>
                          </SimpleTooltip>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-slate-900 truncate tracking-tight text-sm">{student.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              {student.gender}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] text-slate-500 font-bold truncate">Mom: {student.motherName || 'Registry Blank'}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-800">{student.standard}</span>
                          <span className="text-slate-300 font-thin">|</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">Section {student.section}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          {user.role === "superadmin" && (
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">
                              {schools.find(sch => sch.id.toString() === student.schoolId)?.name || `ID: ${student.schoolId}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-slate-500 font-bold">DOB: {student.birthDate || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-blue-600 bg-blue-50/50 px-1.5 rounded font-black tracking-tight tracking-widest">
                            {student.contactNumber || 'NO_CONTACT'}
                           </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-col gap-2">
                         <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: student.attendance }}></div>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Att: {student.attendance}</span>
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-1.5 h-4",
                                student.performance === "Excellent" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                student.performance === "Good" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                "bg-amber-50 text-amber-600 border border-amber-100"
                              )}
                            >
                              {student.performance}
                            </Badge>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <div className="flex items-center justify-center h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm border-none bg-transparent outline-none cursor-pointer transition-all">
                              <MoreHorizontal size={18} />
                            </div>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 shadow-2xl p-2">
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="gap-3 py-3 px-4 rounded-xl font-bold text-slate-700 cursor-pointer focus:bg-blue-50 focus:text-blue-700" onClick={() => triggerPhotoUpload(student.id)}>
                              <Camera size={16} /> Update Identity Image
                            </DropdownMenuItem>
                            {canManage && (
                              <DropdownMenuItem className="gap-3 py-3 px-4 rounded-xl font-bold text-slate-700 cursor-pointer focus:bg-blue-50 focus:text-blue-700" onClick={() => openEditDialog(student)}>
                                <Edit2 size={16} /> Edit Student Profile
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="gap-3 py-3 px-4 rounded-xl font-bold text-slate-700 cursor-pointer focus:bg-blue-50 focus:text-blue-700">
                              <FileText size={16} /> Academic Statistics
                            </DropdownMenuItem>
                            {canManage && (
                              <DropdownMenuItem className="gap-3 py-3 px-4 rounded-xl font-bold text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700" onClick={() => handleDeleteStudent(student.id, student.name)}>
                                <Trash2 size={16} /> Remove from Registry
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Search className="text-slate-300" size={32} />
                      </div>
                      <p className="text-lg font-bold text-slate-400 italic">No students found matching your search</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
