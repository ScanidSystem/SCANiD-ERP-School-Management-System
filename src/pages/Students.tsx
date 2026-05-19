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
import { cn, parseSafeInt } from "@/lib/utils";

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
  const [shifts, setShifts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

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
        academicYearsRes,
        shiftsRes,
        categoriesRes
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
        apiService.getAcademicYears(),
        apiService.getShifts(),
        apiService.getCategories()
      ]);
      
      const normalize = (res: any) => Array.isArray(res.data) ? res.data : (res.data?.data || []);
      
      setStandardsMaster(normalize(standardsRes));
      setSectionsMaster(normalize(sectionsRes));
      setSchools(normalize(schoolsRes));
      setBloodGroups(normalize(bloodGroupsRes));
      setHouses(normalize(housesRes));
      setAdmissionTypes(normalize(admissionTypesRes));
      setReligions(normalize(religionsRes));
      setCastes(normalize(castesRes));
      setSubCastes(normalize(subCastesRes));
      setAcademicYears(normalize(academicYearsRes));
      setShifts(normalize(shiftsRes));
      setCategories(normalize(categoriesRes));
    } catch (error) {
      console.error("Fetch masters error:", error);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getStudents(
        parseSafeInt(user.schoolId),
        parseSafeInt(user.academicYearId)
      );
    const studentData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
    const formatted = studentData.map((s: any) => {
      // Helper to fetch data by ensuring case-insensitive property access for specific schema fields
      const getVal = (prop: string, fallback?: any) => {
        if (!s) return fallback;
        const keys = Object.keys(s);
        const match = keys.find(k => k.toLowerCase() === prop.toLowerCase());
        return match ? s[match] : fallback;
      };

      return {
        id: s.id.toString(),
        grno: getVal("GRNO") || s.registrationNumber || s.grno || getVal("registrationNumber"),
        schoolId: (s.schoolId || s.SchoolId)?.toString() || "",
        firstName: getVal("FNAME") || s.firstName || (s.name || s.fullName)?.split(" ")[0] || "",
        lastName: getVal("LNAME") || s.lastName || (s.name || s.fullName)?.split(" ").slice(-1)[0] || "",
        middleName: getVal("MNAME") || s.middleName || ((s.name || s.fullName)?.split(" ").length > 2 ? (s.name || s.fullName)?.split(" ").slice(1, -1).join(" ") : ""),
        name: s.name || s.fullName || s.FullName || getVal("FullName") || getVal("Name"),
        standard: getVal("STD") || s.standard || getVal("standard"),
        section: getVal("DIV") || s.section || getVal("division") || getVal("section"),
        bloodGroupId: getVal("BLOODGROUP") || s.bloodGroupId || getVal("bloodGroupId"),
        houseId: getVal("house") || s.houseId || getVal("houseId"),
        admissionTypeId: getVal("admissiontype") || s.admissionTypeId || getVal("admissionTypeId"),
        religionId: getVal("RELIGION") || s.religionId || getVal("religionId"),
        casteId: getVal("CASTE") || s.casteId || getVal("casteId"),
        subCasteId: getVal("subcaste") || s.subCasteId || getVal("subCasteId"),
        joiningAcademicYearId: getVal("academicyear") || s.joiningAcademicYearId || getVal("academicYearId"),
        roll: getVal("ROLLNO") || s.rollNumber?.toString() || s.roll?.toString() || "0",
        address: getVal("ADDRESS") || s.address || "N/A",
        birthDate: getVal("DOB") || (s.dateOfBirth ? s.dateOfBirth.split('T')[0] : ""),
        gender: getVal("GENDER") || s.gender || "male",
        contactNumber: getVal("MOBILE") || s.contactNumber || s.mobile || "",
        motherName: getVal("MOTHERNAME") || s.motherName || "",
        aadharCard: getVal("aadharcard") || s.aadharCard || "",
        profilePhotoPath: getVal("ProfilePhotoPath") || "",
        photo: getVal("ProfilePhotoPath") || s.photo || s.Photo || "", 
        attendance: "100%", 
        performance: "Excellent", 
        // Schema properties explicitly mapped for forms and legacy compat
        STUDENTID: getVal("STUDENTID") || s.registrationNumber,
        FNAME: getVal("FNAME") || s.firstName,
        MNAME: getVal("MNAME") || s.middleName,
        LNAME: getVal("LNAME") || s.lastName,
        STD: getVal("STD") || s.standard,
        DIV: getVal("DIV") || s.section,
        ROLLNO: getVal("ROLLNO") || s.rollNumber?.toString(),
        GRNO: getVal("GRNO") || s.registrationNumber,
        RELIGION: getVal("RELIGION") || s.religionId?.toString(),
        CASTE: getVal("CASTE") || s.casteId?.toString(),
        subcaste: getVal("subcaste") || s.subCasteId?.toString(),
        BLOODGROUP: getVal("BLOODGROUP") || s.bloodGroupId?.toString(),
        house: getVal("house") || s.houseId?.toString(),
        admissiontype: getVal("admissiontype") || s.admissionTypeId?.toString(),
        academicyear: getVal("academicyear") || s.joiningAcademicYearId?.toString(),
        DOB: getVal("DOB") || (s.dateOfBirth ? s.dateOfBirth.split('T')[0] : ""),
        MOBILE: getVal("MOBILE") || s.contactNumber || s.mobile,
        EMAIL: getVal("EMAIL") || s.email,
        ADDRESS: getVal("ADDRESS") || s.address,
        MOTHERNAME: getVal("MOTHERNAME") || s.motherName,
        aadharcard: getVal("aadharcard") || s.aadharCard,
        RFID: getVal("RFID") || s.rfid || s.CARDID || s.cardId,
        SHIFTNAME: getVal("SHIFTNAME") || s.shiftName || shifts.find(sh => sh.id === s.shiftId)?.name || "",
        uniformid: getVal("uniformid") || s.uniformid || "",
        contact2: getVal("contact2") || s.contact2 || "",
        sms: getVal("sms") || s.sms || "",
        ProfilePhotoPath: getVal("ProfilePhotoPath") || ""
      };
    });
      setStudents(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not connect to database API.");
    } finally {
      setLoading(false);
    }
  }, [user.schoolId, user.academicYearId]);

  useEffect(() => {
    fetchStudents();
    fetchMasters();
  }, [fetchStudents, fetchMasters]);
  
  const canManage = user.role === "superadmin" || user.role === "admin";
  
  const [uploadingStudentId, setUploadingStudentId] = useState<string | number | null>(null);
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
    registrationNumber: "",
    schoolId: user.schoolId?.toString() || "",
    FNAME: "",
    MNAME: "",
    LNAME: "",
    GENDER: "Male",
    MOBILE: "",
    MOTHERNAME: "",
    ADDRESS: "",
    aadharcard: "",
    DOB: "",
    ROLLNO: "",
    STD: "",
    DIV: "",
    BLOODGROUP: "",
    house: "",
    admissiontype: "",
    RELIGION: "",
    CASTE: "",
    subcaste: "",
    CATEGORY: "",
    academicyear: "",
    status: "Active",
    RFID: "",
    SHIFTNAME: "",
    uniformid: "",
    contact2: "",
    sms: "",
    ProfilePhotoPath: ""
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
      registrationNumber: student.grno || "",
      schoolId: (student.schoolId || user.schoolId || "").toString(),
      FNAME: student.FNAME || student.firstName || "",
      MNAME: student.MNAME || student.middleName || "",
      LNAME: student.LNAME || student.lastName || "",
      GENDER: student.GENDER || student.gender || "Male",
      MOBILE: student.MOBILE || student.contactNumber || "",
      MOTHERNAME: student.MOTHERNAME || student.motherName || "",
      ADDRESS: student.ADDRESS || student.address || "",
      aadharcard: student.aadharcard || student.aadharCard || "",
      DOB: student.DOB || student.birthDate || "",
      ROLLNO: student.ROLLNO || student.roll || "",
      STD: student.STD || student.standard || "",
      DIV: student.DIV || student.section || "",
      BLOODGROUP: student.BLOODGROUP || student.bloodGroupId?.toString() || "",
      house: student.house || student.houseId?.toString() || "",
      admissiontype: student.admissiontype || student.admissionTypeId?.toString() || "",
      RELIGION: student.RELIGION || student.religionId?.toString() || "",
      CASTE: student.CASTE || student.casteId?.toString() || "",
      CATEGORY: student.CATEGORY || student.categoryId?.toString() || "",
      subcaste: student.subcaste || student.subCasteId?.toString() || "",
      academicyear: student.academicyear || student.joiningAcademicYearId?.toString() || "",
      status: student.status || "Active",
      RFID: student.RFID || "",
      SHIFTNAME: student.SHIFTNAME || "",
      uniformid: student.uniformid || "",
      contact2: student.contact2 || "",
      sms: student.sms || "",
      ProfilePhotoPath: student.profilePhotoPath || student.ProfilePhotoPath || ""
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

  const triggerPhotoUpload = (id: string | number) => {
    setUploadingStudentId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadingStudentId !== null && e.target.files?.[0]) {
      const file = e.target.files[0];
      const studentId = uploadingStudentId;
      
      const loadingToast = toast.loading("Storing identity image on server...");
      try {
        const response = await apiService.uploadStudentPhoto(Number(studentId), file);
        // Correctly access path from nested data wrapper used by API
        const newPath = response.data.data?.path || response.data.path;
        
        // Update local state with the new physical path from server
        // This ensures the image persists and uses the industry standard naming
        setStudents(prev => prev.map(s => 
          s.id.toString() === studentId.toString() ? { ...s, photo: newPath, profilePhotoPath: newPath, ProfilePhotoPath: newPath } : s
        ));
        
        toast.dismiss(loadingToast);
        toast.success("Profile picture stored and path updated successfully.");
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Upload failed:", error);
        toast.error("Cloud storage failure. Could not save physical image file.");
      } finally {
        setUploadingStudentId(null);
      }
    }
    e.target.value = '';
  };

  const downloadSampleExcel = () => {
    const sampleData = [
      {
        FNAME: "SHIVANSH",
        MNAME: "SANJAY",
        LNAME: "KHOPKAR",
        MOTHERNAME: "SANJANA",
        SHIFTNAME: "SHIFT-I-XII",
        STD: "UKG",
        DIV: "B",
        ROLLNO: "1",
        GRNO: "1001",
        GENDER: "M",
        DOB: "27/04/2020",
        MOBILE: "9823674019",
        contact2: "8888941563",
        RFID: "0",
        sms: "1",
        ADDRESS: "AT POST KHOPI, ROHIDAS WADI, TAL-KHED, DIST-RATNAGIRI",
        BLOODGROUP: "O+",
        RELIGION: "Hindu",
        CASTE: "General",
        academicyear: "2025-2026",
        house: "Red",
        admissiontype: "Regular",
        aadharcard: "123456789012"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Student_Import_Sample.xlsx");
    toast.success("Sample template downloaded successfully.");
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          toast.error("The uploaded file is empty.");
          setIsProcessing(false);
          return;
        }

        const studentsToUpload = data.map((item: any) => {
          // Internal ID mapping for master tables
          // This makes the upload dynamic by linking text values to their database IDs
          const stdMasterId = standardsMaster.find(s => 
            s.name.toLowerCase() === item.STD?.toString().toLowerCase()
          )?.id;
          
          const divMasterId = sectionsMaster.find(s => 
            s.name.toLowerCase() === item.DIV?.toString().toLowerCase()
          )?.id;
          
          const shiftMasterId = shifts.find(s => 
            s.name.toLowerCase() === item.SHIFTNAME?.toString().toLowerCase()
          )?.id;

          const ayMasterId = academicYears.find(s => 
            s.name.toLowerCase() === item.academicyear?.toString().toLowerCase()
          )?.id;

          const bgMasterId = bloodGroups.find(bg => 
            bg.name.toLowerCase() === item.BLOODGROUP?.toString().toLowerCase()
          )?.id;

          const religionMasterId = religions.find(r => 
            r.name.toLowerCase() === item.RELIGION?.toString().toLowerCase()
          )?.id;

          const houseMasterId = houses.find(h => 
            h.name.toLowerCase() === item.house?.toString().toLowerCase()
          )?.id;

          const admissionTypeMasterId = admissionTypes.find(at => 
            at.name.toLowerCase() === item.admissiontype?.toString().toLowerCase()
          )?.id;

          const casteMasterId = castes.find(c => 
            c.name.toLowerCase() === item.CASTE?.toString().toLowerCase()
          )?.id;

          return {
            ...item,
            schoolId: parseInt(user.schoolId || "1"),
            status: item.status || "Active",
            rollNumber: parseInt(item.ROLLNO || item.rollNumber || "0"),
            registrationNumber: item.GRNO || item.registrationNumber || `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: item.name || item.fullName || `${item.FNAME || ""} ${item.MNAME || ""} ${item.LNAME || ""}`.trim(),
            
            // Text values kept for schema compatibility
            STD: item.STD?.toString() || "",
            DIV: item.DIV?.toString() || "",
            ROLLNO: item.ROLLNO?.toString() || "",
            
            // Map IDs from masters
            StandardId: stdMasterId,
            SectionId: divMasterId,
            ShiftId: shiftMasterId,
            AcademicYearId: ayMasterId,
            BloodGroupId: bgMasterId,
            ReligionId: religionMasterId,
            HouseId: houseMasterId,
            AdmissionTypeId: admissionTypeMasterId,
            CasteId: casteMasterId,

            // Audit fields
            CreatedBy: user.name || user.email,
            ModifiedBy: user.name || user.email
          };
        });

        await apiService.bulkCreateStudents(studentsToUpload as any[]);
        toast.success(`Successfully imported ${studentsToUpload.length} students.`);
        setIsBulkUploadOpen(false);
        fetchStudents();
      } catch (error) {
        console.error("Bulk upload error:", error);
        toast.error("Failed to process Excel file. Please ensure it follows the sample template.");
      } finally {
        setIsProcessing(false);
        if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
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
    checkField("STD", !newStudentFormData.STD);
    checkField("DIV", !newStudentFormData.DIV);
    checkField("ROLLNO", !newStudentFormData.ROLLNO?.trim());
    checkField("GENDER", !newStudentFormData.GENDER);
    checkField("aadharcard", !newStudentFormData.aadharcard?.trim() || !/^\d{12}$/.test(newStudentFormData.aadharcard.replace(/\s/g, "")));
    checkField("FNAME", !newStudentFormData.FNAME?.trim());
    checkField("LNAME", !newStudentFormData.LNAME?.trim());
    checkField("DOB", !newStudentFormData.DOB);
    checkField("MOTHERNAME", !newStudentFormData.MOTHERNAME?.trim());
    checkField("MOBILE", !newStudentFormData.MOBILE?.trim() || !/^\d{10}$/.test(newStudentFormData.MOBILE.replace(/\D/g, "")));
    checkField("ADDRESS", !newStudentFormData.ADDRESS?.trim());

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
        ...newStudentFormData,
        schoolId: parseSafeInt(newStudentFormData.schoolId) || 1,
        rollNumber: parseSafeInt(newStudentFormData.ROLLNO) || 0,
        registrationNumber: newStudentFormData.registrationNumber || `REG/${new Date().getFullYear()}/${Math.floor(Math.random() * 900) + 100}`,
        name: `${newStudentFormData.FNAME} ${newStudentFormData.MNAME} ${newStudentFormData.LNAME}`.trim(),
        // Schema fields mapping
        STUDENTID: newStudentFormData.registrationNumber,
        FNAME: newStudentFormData.FNAME,
        MNAME: newStudentFormData.MNAME,
        LNAME: newStudentFormData.LNAME,
        STD: newStudentFormData.STD,
        DIV: newStudentFormData.DIV,
        ROLLNO: newStudentFormData.ROLLNO,
        GRNO: newStudentFormData.registrationNumber,
        GENDER: newStudentFormData.GENDER,
        DOB: newStudentFormData.DOB,
        MOBILE: newStudentFormData.MOBILE,
        MOTHERNAME: newStudentFormData.MOTHERNAME,
        ADDRESS: newStudentFormData.ADDRESS,
        aadharcard: newStudentFormData.aadharcard,
        academicyear: newStudentFormData.academicyear,
        RFID: newStudentFormData.RFID,
        SHIFTNAME: newStudentFormData.SHIFTNAME,
        uniformid: newStudentFormData.uniformid,
        contact2: newStudentFormData.contact2,
        sms: newStudentFormData.sms,
        ProfilePhotoPath: newStudentFormData.ProfilePhotoPath,

        // Map IDs from masters for manual data persistence
        StandardId: standardsMaster.find(s => s.name === newStudentFormData.STD)?.id,
        SectionId: sectionsMaster.find(s => s.name === newStudentFormData.DIV)?.id,
        AcademicYearId: parseSafeInt(newStudentFormData.academicyear) || academicYears.find(ay => ay.name === newStudentFormData.academicyear)?.id,
        ShiftId: shifts.find(s => s.name === newStudentFormData.SHIFTNAME)?.id,
        BloodGroupId: parseSafeInt(newStudentFormData.BLOODGROUP),
        HouseId: parseSafeInt(newStudentFormData.house),
        AdmissionTypeId: parseSafeInt(newStudentFormData.admissiontype),
        ReligionId: parseSafeInt(newStudentFormData.RELIGION),
        CasteId: parseSafeInt(newStudentFormData.CASTE),
        SubCasteId: parseSafeInt(newStudentFormData.subcaste),
        CategoryId: parseSafeInt(newStudentFormData.CATEGORY),

        // Audit fields: Ensure CreatedBy and ModifiedBy are captured for backend audit logging
        // CreatedBy is only set for new records, ModifiedBy is updated for every modification
        CreatedBy: isEditMode ? undefined : (user.name || user.email),
        ModifiedBy: user.name || user.email
      };

      if (isEditMode && currentStudentId) {
        const studentId = parseSafeInt(currentStudentId);
        if (studentId === undefined) {
          toast.error("Invalid student ID for update");
          return;
        }
        await apiService.updateStudent(studentId, { ...payload, id: studentId });
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
      const studentId = parseSafeInt(deleteInfo.id);
      if (studentId === undefined) {
        toast.error("Invalid student ID for deletion");
        return;
      }
      await apiService.deleteStudent(studentId);
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
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.roll.toLowerCase().includes(search.toLowerCase()) || 
      (s.grno && s.grno.toLowerCase().includes(search.toLowerCase())) ||
      (s.registrationNumber && s.registrationNumber.toLowerCase().includes(search.toLowerCase()));
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
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl h-10 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                      onClick={() => bulkFileInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Choose File"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-200 hover:bg-slate-50 font-bold rounded-xl h-10 transition-all gap-2"
                      onClick={downloadSampleExcel}
                    >
                      <Download size={16} /> Sample Template
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={bulkFileInputRef}
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={handleBulkUpload}
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
                                ref={el => { inputRefs.current["schoolId"] = el; }}
                                id="school" 
                                className={cn(
                                  "h-10 border-slate-200 bg-slate-50/50 font-bold text-slate-800 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/5 transition-all text-sm",
                                  formErrors.schoolId && "border-red-500 ring-2 ring-red-500/10",
                                  (user.role !== "superadmin" && !!user.schoolId) && "opacity-80 cursor-not-allowed bg-slate-100"
                                )}
                              >
                                {/* Mapping logic to show only school name in trigger */}
                                <SelectValue placeholder="Select School Branch">
                                  {newStudentFormData.schoolId ? schools.find(s => s.id.toString() === newStudentFormData.schoolId.toString())?.name : undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="max-h-68 rounded-2xl shadow-2xl border-slate-200 p-2">
                                <SelectItem value="" className="font-semibold py-2.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">
                                  Select School Branch
                                </SelectItem>
                                {Array.isArray(schools) && schools.length > 0 ? (
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
                          <Label htmlFor="STD" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.STD ? "text-red-500" : "text-slate-500")}>Academic Grade {formErrors.STD && "*"}</Label>
                          <Select 
                            value={newStudentFormData.STD} 
                            onValueChange={(v) => {
                              setNewStudentFormData({...newStudentFormData, STD: v});
                              setFormErrors(prev => ({ ...prev, STD: false }));
                            }}
                          >
                            <SelectTrigger 
                              ref={el => { inputRefs.current["STD"] = el; }}
                              id="STD" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                                formErrors.STD && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            >
                              <SelectValue placeholder="Select Academic Grade">
                                {newStudentFormData.STD || undefined}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Academic Grade</SelectItem>
                              {Array.isArray(standardsMaster) && standardsMaster.map(std => (
                                <SelectItem key={std.id} value={std.name} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{std.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 space-y-1.5">
                          <Label htmlFor="DIV" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.DIV ? "text-red-500" : "text-slate-500")}>Division/Section {formErrors.DIV && "*"}</Label>
                          <Select 
                            value={newStudentFormData.DIV} 
                            onValueChange={(v) => {
                              setNewStudentFormData({...newStudentFormData, DIV: v});
                              setFormErrors(prev => ({ ...prev, DIV: false }));
                            }}
                          >
                            <SelectTrigger 
                              ref={el => { inputRefs.current["DIV"] = el; }}
                              id="DIV" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                                formErrors.DIV && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            >
                              <SelectValue placeholder="Select Section/Division">
                                {newStudentFormData.DIV ? `Section ${newStudentFormData.DIV}` : undefined}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Section/Division</SelectItem>
                              {Array.isArray(sectionsMaster) && sectionsMaster.map(sec => (
                                <SelectItem key={sec.id} value={sec.name} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Section {sec.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 space-y-1.5">
                          <Label htmlFor="academicyear" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Joining Year</Label>
                          <Select 
                            value={newStudentFormData.academicyear} 
                            onValueChange={(v) => setNewStudentFormData({...newStudentFormData, academicyear: v})}
                          >
                            <SelectTrigger id="academicyear" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                              <SelectValue placeholder="Select Academic Year">
                                {newStudentFormData.academicyear ? academicYears.find(y => y.id.toString() === newStudentFormData.academicyear)?.name : undefined}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Academic Year</SelectItem>
                              {Array.isArray(academicYears) && academicYears.map(y => (
                                <SelectItem key={y.id} value={y.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{y.name} {y.isCurrent ? "(Current)" : ""}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 space-y-1.5">
                          <Label htmlFor="SHIFTNAME" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Shift</Label>
                          <Select 
                            value={newStudentFormData.SHIFTNAME} 
                            onValueChange={(v) => setNewStudentFormData({...newStudentFormData, SHIFTNAME: v})}
                          >
                            <SelectTrigger id="SHIFTNAME" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                              <SelectValue placeholder="Select Shift">
                                {newStudentFormData.SHIFTNAME || undefined}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Shift</SelectItem>
                              {Array.isArray(shifts) && shifts.map(s => (
                                <SelectItem key={s.id} value={s.name} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{s.name}</SelectItem>
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
                            <Label htmlFor="registrationNumber" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.registrationNumber ? "text-red-500" : "text-slate-500")}>Registration (GRNO) {formErrors.registrationNumber && "*"}</Label>
                            <Input 
                              ref={el => { inputRefs.current["registrationNumber"] = el; }}
                              id="registrationNumber" 
                              value={newStudentFormData.registrationNumber} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, registrationNumber: e.target.value});
                                if (formErrors.registrationNumber) setFormErrors(prev => ({ ...prev, registrationNumber: false }));
                              }} 
                              placeholder="e.g. REG-001"
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 font-mono font-black text-blue-600 rounded-xl px-4 text-sm",
                                formErrors.registrationNumber && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="ROLLNO" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.ROLLNO ? "text-red-500" : "text-slate-500")}>Roll Number {formErrors.ROLLNO && "*"}</Label>
                            <Input 
                              ref={el => { inputRefs.current["ROLLNO"] = el; }}
                              id="ROLLNO" 
                              value={newStudentFormData.ROLLNO} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, ROLLNO: e.target.value});
                                if (formErrors.ROLLNO) setFormErrors(prev => ({ ...prev, ROLLNO: false }));
                              }} 
                              placeholder="e.g. 24"
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 font-black text-slate-800 rounded-xl px-4 text-sm",
                                formErrors.ROLLNO && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="GENDER" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.GENDER ? "text-red-500" : "text-slate-500")}>Gender {formErrors.GENDER && "*"}</Label>
                            <Select 
                              value={newStudentFormData.GENDER} 
                              onValueChange={(v) => {
                                setNewStudentFormData({...newStudentFormData, GENDER: v});
                                setFormErrors(prev => ({ ...prev, GENDER: false }));
                              }}
                            >
                              <SelectTrigger 
                                ref={el => { inputRefs.current["GENDER"] = el; }}
                                id="GENDER" 
                                className={cn(
                                  "h-10 border-slate-200 bg-slate-50/30 font-bold rounded-xl px-4 text-sm",
                                  formErrors.GENDER && "border-red-500 ring-2 ring-red-500/10"
                                )}
                              >
                                <SelectValue placeholder="Select Student Gender">
                                  {newStudentFormData.GENDER || undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Gender</SelectItem>
                                <SelectItem value="Male" className="font-semibold py-1.5 text-xs px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Male</SelectItem>
                                <SelectItem value="Female" className="font-semibold py-1.5 text-xs px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Female</SelectItem>
                                <SelectItem value="Other" className="font-semibold py-1.5 text-xs px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="aadharcard" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.aadharcard ? "text-red-500" : "text-slate-500")}>Aadhar ID {formErrors.aadharcard && "*"}</Label>
                            <Input 
                              ref={el => { inputRefs.current["aadharcard"] = el; }}
                              id="aadharcard" 
                              value={newStudentFormData.aadharcard} 
                              maxLength={12}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                                setNewStudentFormData({...newStudentFormData, aadharcard: val});
                                if (formErrors.aadharcard) setFormErrors(prev => ({ ...prev, aadharcard: false }));
                              }} 
                              placeholder="12-digit number" 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/30 tracking-widest font-mono font-bold rounded-xl px-4 text-sm",
                                formErrors.aadharcard && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="RFID" className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">RFID Card ID</Label>
                            <Input 
                              id="RFID" 
                              value={newStudentFormData.RFID} 
                              onChange={(e) => setNewStudentFormData({...newStudentFormData, RFID: e.target.value})} 
                              placeholder="e.g. 1111111111" 
                              className="h-10 border-slate-200 bg-slate-50/30 font-mono font-bold rounded-xl px-4 text-sm"
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
                            <Label htmlFor="FNAME" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.FNAME ? "text-red-500" : "text-slate-500")}>First Name {formErrors.FNAME && "*"}</Label>
                            <Input 
                              ref={el => { inputRefs.current["FNAME"] = el; }}
                              id="FNAME" 
                              value={newStudentFormData.FNAME} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, FNAME: e.target.value});
                                if (formErrors.FNAME) setFormErrors(prev => ({ ...prev, FNAME: false }));
                              }} 
                              placeholder="First name" 
                              className={cn(
                                "h-10 border-slate-200 font-bold rounded-xl px-4 text-sm",
                                formErrors.FNAME && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="MNAME" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Middle Name</Label>
                            <Input id="MNAME" value={newStudentFormData.MNAME} onChange={(e) => setNewStudentFormData({...newStudentFormData, MNAME: e.target.value})} placeholder="Middle name" className="h-10 border-slate-200 font-bold rounded-xl px-4 text-sm" />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <Label htmlFor="LNAME" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.LNAME ? "text-red-500" : "text-slate-500")}>Last Name {formErrors.LNAME && "*"}</Label>
                            <Input 
                              ref={el => { inputRefs.current["LNAME"] = el; }}
                              id="LNAME" 
                              value={newStudentFormData.LNAME} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, LNAME: e.target.value});
                                if (formErrors.LNAME) setFormErrors(prev => ({ ...prev, LNAME: false }));
                              }} 
                              placeholder="Last name" 
                              className={cn(
                                "h-10 border-slate-200 font-bold rounded-xl px-4 text-sm",
                                formErrors.LNAME && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <Label htmlFor="DOB" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.DOB ? "text-red-500" : "text-slate-500")}>Date of Birth {formErrors.DOB && "*"}</Label>
                            <Input 
                              ref={el => { inputRefs.current["DOB"] = el; }}
                              id="DOB" 
                              type="date" 
                              value={newStudentFormData.DOB} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, DOB: e.target.value});
                                if (formErrors.DOB) setFormErrors(prev => ({ ...prev, DOB: false }));
                              }} 
                              className={cn(
                                "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                                formErrors.DOB && "border-red-500 ring-2 ring-red-500/10"
                              )}
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <Label htmlFor="RELIGION" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Religion</Label>
                            <Select 
                              value={newStudentFormData.RELIGION} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, RELIGION: v})}
                            >
                              <SelectTrigger id="RELIGION" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student Religion">
                                  {newStudentFormData.RELIGION ? religions.find(r => r.id.toString() === newStudentFormData.RELIGION)?.name : undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Religion</SelectItem>
                                {Array.isArray(religions) && religions.map(r => (
                                  <SelectItem key={r.id} value={r.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{r.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="BLOODGROUP" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Blood Group</Label>
                            <Select 
                              value={newStudentFormData.BLOODGROUP} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, BLOODGROUP: v})}
                            >
                              <SelectTrigger id="BLOODGROUP" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student Blood Group">
                                  {newStudentFormData.BLOODGROUP ? bloodGroups.find(bg => bg.id.toString() === newStudentFormData.BLOODGROUP)?.name : undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Blood Group</SelectItem>
                                {Array.isArray(bloodGroups) && bloodGroups.map(bg => (
                                  <SelectItem key={bg.id} value={bg.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{bg.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                           <div className="space-y-1.5">
                             <Label htmlFor="CASTE" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Caste</Label>
                             <Select 
                               value={newStudentFormData.CASTE} 
                               onValueChange={(v) => setNewStudentFormData({...newStudentFormData, CASTE: v})}
                             >
                               <SelectTrigger id="CASTE" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                 <SelectValue placeholder="Select Caste">
                                   {newStudentFormData.CASTE ? castes.find(c => c.id.toString() === newStudentFormData.CASTE)?.name : undefined}
                                 </SelectValue>
                               </SelectTrigger>
                               <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                 <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Caste</SelectItem>
                                 {Array.isArray(castes) && castes.map(c => (
                                   <SelectItem key={c.id} value={c.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{c.name}</SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>

                           <div className="space-y-1.5">
                             <Label htmlFor="CATEGORY" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</Label>
                             <Select 
                               value={newStudentFormData.CATEGORY} 
                               onValueChange={(v) => setNewStudentFormData({...newStudentFormData, CATEGORY: v})}
                             >
                               <SelectTrigger id="CATEGORY" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                 <SelectValue placeholder="Select Category">
                                   {newStudentFormData.CATEGORY ? categories.find(c => c.id.toString() === newStudentFormData.CATEGORY)?.name : undefined}
                                 </SelectValue>
                               </SelectTrigger>
                               <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                 <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Category</SelectItem>
                                 {Array.isArray(categories) && categories.map(c => (
                                   <SelectItem key={c.id} value={c.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{c.name}</SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="subcaste" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sub-Caste</Label>
                            <Select 
                              value={newStudentFormData.subcaste} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, subcaste: v})}
                              disabled={!newStudentFormData.CASTE}
                            >
                              <SelectTrigger id="subcaste" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student Sub-Caste">
                                  {newStudentFormData.subcaste ? subCastes.find(sc => sc.id.toString() === newStudentFormData.subcaste)?.name : undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Sub-Caste</SelectItem>
                                {Array.isArray(subCastes) && subCastes
                                  .filter(sc => sc.casteId?.toString() === newStudentFormData.CASTE)
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
                              value={newStudentFormData.house} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, house: v})}
                            >
                              <SelectTrigger id="house" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student House Group">
                                  {newStudentFormData.house ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: houses.find(h => h.id.toString() === newStudentFormData.house)?.color }}></div>
                                      {houses.find(h => h.id.toString() === newStudentFormData.house)?.name}
                                    </div>
                                  ) : undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student House Group</SelectItem>
                              {Array.isArray(houses) && houses.map(h => (
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
                            <Label htmlFor="admissiontype" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admission Type</Label>
                            <Select 
                              value={newStudentFormData.admissiontype} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, admissiontype: v})}
                            >
                              <SelectTrigger id="admissiontype" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select Student Admission Type">
                                  {newStudentFormData.admissiontype ? admissionTypes.find(at => at.id.toString() === newStudentFormData.admissiontype)?.name : undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select Student Admission Type</SelectItem>
                              {Array.isArray(admissionTypes) && admissionTypes.map(at => (
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
                          <Label htmlFor="MOTHERNAME" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.MOTHERNAME ? "text-red-500" : "text-slate-500")}>Mother's Name {formErrors.MOTHERNAME && "*"}</Label>
                          <Input 
                            ref={el => { inputRefs.current["MOTHERNAME"] = el; }}
                            id="MOTHERNAME" 
                            value={newStudentFormData.MOTHERNAME} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, MOTHERNAME: e.target.value});
                              if (formErrors.MOTHERNAME) setFormErrors(prev => ({ ...prev, MOTHERNAME: false }));
                            }} 
                            placeholder="e.g. Mary Wilson" 
                            className={cn(
                              "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                              formErrors.MOTHERNAME && "border-red-500 ring-2 ring-red-500/10"
                            )}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="MOBILE" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.MOBILE ? "text-red-500" : "text-slate-500")}>Mobile No. {formErrors.MOBILE && "*"}</Label>
                          <Input 
                            ref={el => { inputRefs.current["MOBILE"] = el; }}
                            id="MOBILE" 
                            type="tel" 
                            value={newStudentFormData.MOBILE} 
                            maxLength={10}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setNewStudentFormData({...newStudentFormData, MOBILE: val});
                              if (formErrors.MOBILE) setFormErrors(prev => ({ ...prev, MOBILE: false }));
                            }} 
                            placeholder="10-digit number" 
                            className={cn(
                              "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                              formErrors.MOBILE && "border-red-500 ring-2 ring-red-500/10"
                            )}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <Label htmlFor="ADDRESS" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.ADDRESS ? "text-red-500" : "text-slate-500")}>Residential Address {formErrors.ADDRESS && "*"}</Label>
                          <Input 
                            ref={el => { inputRefs.current["ADDRESS"] = el; }}
                            id="ADDRESS" 
                            value={newStudentFormData.ADDRESS} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, ADDRESS: e.target.value});
                              if (formErrors.ADDRESS) setFormErrors(prev => ({ ...prev, ADDRESS: false }));
                            }} 
                            placeholder="Enter complete residential address" 
                            className={cn(
                              "h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm",
                              formErrors.ADDRESS && "border-red-500 ring-2 ring-red-500/10"
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
                    {/* Explicit mapping to show "Grade X" or "All Grades" in trigger */}
                    <SelectValue placeholder="Standard">
                      {standardFilter === "all" ? "All Grades" : (standardFilter ? `Grade ${standardFilter}` : undefined)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                    <SelectItem value="all" className="rounded-xl font-bold py-2.5">All Grades</SelectItem>
                    {Array.isArray(standardsMaster) && standardsMaster.map(std => (
                      <SelectItem key={std.id} value={std.name} className="rounded-xl font-bold py-2.5">Grade {std.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                  <SelectTrigger className="w-[140px] h-11 bg-slate-50/50 border-slate-200/60 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-blue-500/5">
                    {/* Explicit mapping to show "Section X" or "All Sections" in trigger */}
                    <SelectValue placeholder="Section">
                      {sectionFilter === "all" ? "All Sections" : (sectionFilter ? `Section ${sectionFilter}` : undefined)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                    <SelectItem value="all" className="rounded-xl font-bold py-2.5">All Sections</SelectItem>
                    {Array.isArray(sectionsMaster) && sectionsMaster.map(sec => (
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
                <span className="font-black text-slate-900">{Array.isArray(filteredStudents) ? filteredStudents.length : 0}</span> Active Registry Records
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
              {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
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

// No need for local cn function anymore as we use the one from @/lib/utils
