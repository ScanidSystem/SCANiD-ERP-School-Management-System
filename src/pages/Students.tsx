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
  GraduationCap,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { cn, parseSafeInt, resolvePhotoUrl } from "@/lib/utils";

export default function Students({ user }: { user: UserType }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [standardFilter, setStandardFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [schoolSections, setSchoolSections] = useState<any[]>([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  const fetchMasters = useCallback(async () => {
    // Robust master data fetching: wrap each call to handle failure gracefully and prevent Promise.all crash
    const safeFetch = async (promise: Promise<any>, masterName: string) => {
      try {
        return await promise;
      } catch (err) {
        console.warn(`Failed to fetch master [${masterName}] from API:`, err);
        return { data: [] };
      }
    };

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
        categoriesRes,
        statesRes,
        citiesRes,
        schoolSectionsRes
      ] = await Promise.all([
        safeFetch(apiService.getStandards(), "standards"),
        safeFetch(apiService.getSections(), "sections"),
        safeFetch(apiService.getSchools(), "schools"),
        safeFetch(apiService.getBloodGroups(), "bloodGroups"),
        safeFetch(apiService.getHouses(), "houses"),
        safeFetch(apiService.getAdmissionTypes(), "admissionTypes"),
        safeFetch(apiService.getReligions(), "religions"),
        safeFetch(apiService.getCastes(), "castes"),
        safeFetch(apiService.getSubCastes(), "subCastes"),
        safeFetch(apiService.getAcademicYears(), "academicYears"),
        safeFetch(apiService.getShifts(), "shifts"),
        safeFetch(apiService.getCategories(), "categories"),
        safeFetch(apiService.getStates(), "states"),
        safeFetch(apiService.getCities(), "cities"),
        safeFetch(apiService.getSchoolSections(), "schoolSections")
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
      setStates(normalize(statesRes));
      setCities(normalize(citiesRes));
      setSchoolSections(normalize(schoolSectionsRes));
    } catch (error) {
      console.error("Fetch masters error:", error);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getStudents(
        parseSafeInt(user.schoolId),
        parseSafeInt(user.academicYearId),
        {
          page,
          pageSize,
          sortBy,
          sortOrder,
          search,
          // @ts-ignore - adding filters to params
          standard: standardFilter === "all" ? undefined : standardFilter,
          section: sectionFilter === "all" ? undefined : sectionFilter
        }
      );
      
      const responseData = response.data;
      
      // Support both { data: [...], pagination: {...} } envelope and raw array [...] formats
      const rawStudentsList = Array.isArray(responseData) 
        ? responseData 
        : (responseData && Array.isArray(responseData.data) ? responseData.data : []);
      
      const formatted = rawStudentsList.map((s: any) => {
        // Helper to fetch data by ensuring case-insensitive property access for specific schema fields
        const getVal = (prop: string, fallback?: any) => {
          if (!s) return fallback;
          const keys = Object.keys(s);
          const match = keys.find(k => k.toLowerCase() === prop.toLowerCase());
          return match ? s[match] : fallback;
        };

        // Robust helper to safely extract an ID from standard values, numbers or nested objects to avoid leaks
        const getSafeId = (val: any): string => {
          if (!val) return "";
          if (typeof val === "object") {
            return val.id?.toString() || val.id || "";
          }
          return val.toString();
        };

        return {
          id: s.id?.toString() || "",
          grno: getVal("GrNo") || getVal("GRNO") || s.registrationNumber || s.grno || getVal("registrationNumber") || "",
          schoolId: (s.schoolId || s.SchoolId)?.toString() || "",
          firstName: getVal("FirstName") || getVal("FNAME") || s.firstName || (s.name || s.fullName)?.split(" ")[0] || "",
          lastName: getVal("LastName") || getVal("LNAME") || s.lastName || (s.name || s.fullName)?.split(" ").slice(-1)[0] || "",
          middleName: getVal("MiddleName") || getVal("MNAME") || s.middleName || ((s.name || s.fullName)?.split(" ").length > 2 ? (s.name || s.fullName)?.split(" ").slice(1, -1).join(" ") : ""),
          name: s.name || s.fullName || s.FullName || getVal("FullName") || getVal("Name") || "",
          standard: typeof getVal("STD") === "object" ? getVal("STD")?.name : (getVal("STD") || s.standard?.name || s.Standard?.name || s.standard || ""),
          section: typeof getVal("DIV") === "object" ? getVal("DIV")?.name : (getVal("DIV") || s.section?.name || s.Section?.name || s.section || ""),
          bloodGroupId: getSafeId(getVal("bloodGroupId") || getVal("BLOODGROUP") || s.bloodGroupId),
          houseId: getSafeId(getVal("houseId") || getVal("house") || s.houseId),
          admissionTypeId: getSafeId(getVal("admissionTypeId") || getVal("admissiontype") || s.admissionTypeId),
          religionId: getSafeId(getVal("religionId") || getVal("RELIGION") || s.religionId),
          casteId: getSafeId(getVal("casteId") || getVal("CASTE") || s.casteId),
          subCasteId: getSafeId(getVal("subCasteId") || getVal("subcaste") || s.subCasteId),
          joiningAcademicYearId: getSafeId(getVal("academicYearId") || getVal("academicyear") || s.joiningAcademicYearId),
          roll: getVal("ROLLNO") || s.rollNumber?.toString() || s.roll?.toString() || "0",
          address: getVal("Address") || getVal("ADDRESS") || s.address || "N/A",
          birthDate: getVal("DateOfBirth") || getVal("DOB") || (s.dateOfBirth ? s.dateOfBirth.split('T')[0] : ""),
          gender: getVal("Gender") || getVal("GENDER") || s.gender || "male",
          contactNumber: getVal("FatherContactNo") || getVal("MOBILE") || s.contactNumber || s.mobile || "",
          fatherContactNo: getVal("FatherContactNo") || getVal("MOBILE") || s.fatherContactNo || s.contactNumber || s.mobile || "",
          motherContactNo: getVal("MotherContactNo") || getVal("contact2") || s.motherContactNo || s.contact2 || "",
          motherName: getVal("MotherName") || getVal("MOTHERNAME") || s.motherName || "",
          aadharCard: getVal("AadharCard") || getVal("aadharcard") || s.aadharCard || "",
          profilePhotoPath: getVal("ProfilePhotoPath") || s.profilePhotoPath || "",
          photo: getVal("ProfilePhotoPath") || s.profilePhotoPath || s.photo || s.Photo || "", 
          attendance: "100%", 
          performance: "Excellent", 
          // Schema properties explicitly mapped for forms and legacy compat
          STUDENTID: getVal("STUDENTID") || s.registrationNumber,
          FNAME: getVal("FirstName") || getVal("FNAME") || s.firstName,
          MNAME: getVal("MiddleName") || getVal("MNAME") || s.middleName,
          LNAME: getVal("LastName") || getVal("LNAME") || s.lastName,
          STD: typeof getVal("STD") === "object" ? getVal("STD")?.name : (getVal("STD") || s.standard?.name || s.standard || ""),
          DIV: typeof getVal("DIV") === "object" ? getVal("DIV")?.name : (getVal("DIV") || s.section?.name || s.section || ""),
          ROLLNO: getVal("ROLLNO") || s.rollNumber?.toString(),
          GRNO: getVal("GrNo") || getVal("GRNO") || s.registrationNumber,
          RELIGION: getSafeId(getVal("religionId") || getVal("RELIGION") || s.religionId),
          CASTE: getSafeId(getVal("casteId") || getVal("CASTE") || s.casteId),
          subcaste: getSafeId(getVal("subCasteId") || getVal("subcaste") || s.subCasteId),
          BLOODGROUP: getSafeId(getVal("bloodGroupId") || getVal("BLOODGROUP") || s.bloodGroupId),
          house: getSafeId(getVal("houseId") || getVal("house") || s.houseId),
          admissiontype: getSafeId(getVal("admissionTypeId") || getVal("admissiontype") || s.admissionTypeId),
          academicyear: getSafeId(getVal("academicYearId") || getVal("academicyear") || s.joiningAcademicYearId),
          CATEGORY: getSafeId(getVal("categoryId") || getVal("CATEGORY") || s.categoryId),
          DOB: getVal("DateOfBirth") || getVal("DOB") || (s.dateOfBirth ? s.dateOfBirth.split('T')[0] : ""),
          MOBILE: getVal("FatherContactNo") || getVal("MOBILE") || s.contactNumber || s.mobile,
          EMAIL: getVal("EMAIL") || s.email,
          ADDRESS: getVal("Address") || getVal("ADDRESS") || s.address,
          MOTHERNAME: getVal("MotherName") || getVal("MOTHERNAME") || s.motherName,
          aadharcard: getVal("AadharCard") || getVal("aadharcard") || s.aadharCard,
          RFID: getVal("Rfid") || getVal("RFID") || s.rfid || s.CARDID || s.cardId,
          SHIFTNAME: typeof getVal("shiftId") === "object" ? getVal("shiftId")?.name : (getVal("SHIFTNAME") || s.shiftName || shifts.find(sh => sh.id === s.shiftId)?.name || ""),
          uniformid: getVal("UniformId") || getVal("uniformid") || s.uniformid || "",
          contact2: getVal("MotherContactNo") || getVal("contact2") || s.contact2 || "",
          sms: getVal("Sms") || getVal("sms") || s.sms || false,
          isStateBoard: getVal("IsStateBoard") || getVal("isStateBoard") || s.isStateBoard || false,
          ProfilePhotoPath: getVal("ProfilePhotoPath") || s.profilePhotoPath || ""
        };
      });

      const isServerPaged = responseData && !!responseData.pagination;
      
      if (!isServerPaged) {
        // Apply robust client-side filters, search, sorting and pagination
        let filtered = [...formatted];
        
        // Search
        const searchLower = search.trim().toLowerCase();
        if (searchLower) {
          filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchLower) ||
            item.grno.toLowerCase().includes(searchLower) ||
            item.roll.toLowerCase().includes(searchLower) ||
            item.standard.toLowerCase().includes(searchLower) ||
            item.section.toLowerCase().includes(searchLower)
          );
        }
        
        // Standard (Grade) Filter
        if (standardFilter !== "all") {
          filtered = filtered.filter(item => item.standard === standardFilter);
        }
        
        // Section Filter
        if (sectionFilter !== "all") {
          filtered = filtered.filter(item => item.section === sectionFilter);
        }
        
        // Sort
        if (sortBy) {
          filtered.sort((a: any, b: any) => {
            const valA = a[sortBy] || "";
            const valB = b[sortBy] || "";
            
            if (valA === valB) return 0;
            let comparison = 0;
            if (typeof valA === "string" && typeof valB === "string") {
              comparison = valA.localeCompare(valB);
            } else {
              comparison = valA < valB ? -1 : 1;
            }
            return sortOrder === "desc" ? comparison * -1 : comparison;
          });
        }
        
        // Paginate
        const total = filtered.length;
        setTotalCount(total);
        setTotalPages(Math.ceil(total / pageSize));
        
        const startIndex = (page - 1) * pageSize;
        setStudents(filtered.slice(startIndex, startIndex + pageSize));
      } else {
        // Server-side did paging and filtering
        setTotalCount(responseData.pagination.totalCount);
        setTotalPages(responseData.pagination.totalPages);
        setStudents(formatted);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not connect to database API.");
    } finally {
      setLoading(false);
    }
  }, [user.schoolId, user.academicYearId, page, pageSize, sortBy, sortOrder, search, standardFilter, sectionFilter, shifts.length]);

  useEffect(() => {
    fetchMasters();
  }, [fetchMasters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1); // Reset to first page on sort
  };

  const canManage = user.role === "superadmin" || user.role === "admin";
  
  const [uploadingStudentId, setUploadingStudentId] = useState<string | number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<{ id: string; name: string } | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState<any[]>([]);
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
    sms: false,
    isStateBoard: false,
    ProfilePhotoPath: "",
    SchoolSectionId: "",
    AdmissionDate: "",
    Email: "",
    CityId: "",
    StateId: ""
  };

  const [newStudentFormData, setNewStudentFormData] = useState(initialFormState);

  const openAddDialog = () => {
    setIsEditMode(false);
    setCurrentStudentId(null);
    setNewStudentFormData(initialFormState);
    setFormErrors({});
    setSelectedPhotoFile(null);
    setLocalPhotoPreview(null);
    setIsAddDialogOpen(true);
    fetchMasters();
  };

  const openEditDialog = (student: any) => {
    setIsEditMode(true);
    setCurrentStudentId(student.id);
    setFormErrors({});
    setSelectedPhotoFile(null);
    setLocalPhotoPreview(null);
    setNewStudentFormData({
      registrationNumber: student.grno || "",
      schoolId: (student.schoolId || user.schoolId || "").toString(),
      FNAME: student.FNAME || student.firstName || "",
      MNAME: student.MNAME || student.middleName || "",
      LNAME: student.LNAME || student.lastName || "",
      GENDER: student.GENDER || student.gender || "Male",
      MOBILE: student.MOBILE || student.contactNumber || student.fatherContactNo || "",
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
      RFID: student.RFID || student.rfid || "",
      SHIFTNAME: student.SHIFTNAME || "",
      uniformid: student.uniformid || student.uniformId || "",
      contact2: student.contact2 || student.motherContactNo || "",
      sms: student.sms === "true" || student.sms === true,
      isStateBoard: student.isStateBoard === "true" || student.isStateBoard === true,
      ProfilePhotoPath: student.profilePhotoPath || student.ProfilePhotoPath || "",
      SchoolSectionId: student.schoolSectionId?.toString() || (student.schoolSection ? schoolSections.find((s: any) => s.name === student.schoolSection)?.id?.toString() : "") || "",
      AdmissionDate: student.admissionDate || student.AdmissionDate || "",
      Email: student.email || student.Email || student.EMAIL || "",
      CityId: student.cityId?.toString() || student.CityId?.toString() || "",
      StateId: student.stateId?.toString() || student.StateId?.toString() || ""
    });
    setIsAddDialogOpen(true);
    fetchMasters();
  };

  const handleExport = async () => {
    try {
      // Prepare data for export including all important student fields
      const exportData = filteredStudents.map(s => ({
        "Registration Number": s.grno || s.registrationNumber,
        "Roll Number": s.roll,
        "First Name": s.FNAME || s.firstName,
        "Middle Name": s.MNAME || s.middleName,
        "Last Name": s.LNAME || s.lastName,
        "Gender": s.GENDER || s.gender,
        "Date of Birth": s.DOB || s.birthDate,
        "Mobile": s.MOBILE || s.contactNumber,
        "Email": s.EMAIL || s.email,
        "Standard": s.STD || s.standard,
        "Division": s.DIV || s.section,
        "Mother Name": s.MOTHERNAME || s.motherName,
        "Address": s.ADDRESS || s.address,
        "Aadhar Card": s.aadharcard || s.aadharCard,
        "Blood Group": s.BLOODGROUP || s.bloodGroupId ? (bloodGroups.find(bg => bg.id?.toString() === (s.BLOODGROUP || s.bloodGroupId)?.toString())?.name || s.BLOODGROUP || s.bloodGroupId) : "",
        "House": s.house || s.houseId ? (houses.find(h => h.id?.toString() === (s.house || s.houseId)?.toString())?.name || s.house || s.houseId) : "",
        "Admission Type": s.admissiontype || s.admissionTypeId ? (admissionTypes.find(at => at.id?.toString() === (s.admissiontype || s.admissionTypeId)?.toString())?.name || s.admissiontype || s.admissionTypeId) : "",
        "Religion": s.RELIGION || s.religionId ? (religions.find(r => r.id?.toString() === (s.RELIGION || s.religionId)?.toString())?.name || s.RELIGION || s.religionId) : "",
        "Caste": s.CASTE || s.casteId ? (castes.find(c => c.id?.toString() === (s.CASTE || s.casteId)?.toString())?.name || s.CASTE || s.casteId) : "",
        "Sub-Caste": s.subcaste || s.subCasteId ? (subCastes.find(sc => sc.id?.toString() === (s.subcaste || s.subCasteId)?.toString())?.name || s.subcaste || s.subCasteId) : "",
        "Academic Year": s.academicyear || s.joiningAcademicYearId ? (academicYears.find(ay => ay.id?.toString() === (s.academicyear || s.joiningAcademicYearId)?.toString())?.name || s.academicyear || s.joiningAcademicYearId) : "",
        "Category": s.CATEGORY || s.categoryId ? (categories.find(c => c.id?.toString() === (s.CATEGORY || s.categoryId)?.toString())?.name || s.CATEGORY || s.categoryId) : "",
        "RFID": s.RFID,
        "Shift Name": s.SHIFTNAME,
        "Status": s.status
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, "Students Registry");

      // Set column widths for better readability
      const wscols = [
        {wch: 20}, {wch: 12}, {wch: 15}, {wch: 15}, {wch: 15},
        {wch: 10}, {wch: 12}, {wch: 15}, {wch: 25}, {wch: 12},
        {wch: 10}, {wch: 20}, {wch: 40}, {wch: 15}, {wch: 15}
      ];
      ws['!cols'] = wscols;

      // Generate download
      XLSX.writeFile(wb, `Students_Registry_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Students registry exported to Excel successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to generate Excel export.");
    }
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
      
      if (uploadingStudentId === "new") {
        setSelectedPhotoFile(file);
        setLocalPhotoPreview(URL.createObjectURL(file));
        toast.success("Image selected. It will be uploaded when you enroll the student.");
        setUploadingStudentId(null);
        e.target.value = '';
        return;
      }

      const studentId = uploadingStudentId;
      const loadingToast = toast.loading("Storing identity image on server...");
      try {
        const response = await apiService.uploadStudentPhoto(Number(studentId), file);
        const newPath = response.data.data?.path || response.data.path;
        
        // Update both the list and the form data immediately to reflect the change
        setStudents(prev => prev.map(s => 
          s.id.toString() === studentId.toString() ? { ...s, photo: newPath, profilePhotoPath: newPath, ProfilePhotoPath: newPath } : s
        ));
        setNewStudentFormData(prev => ({
          ...prev,
          profilePhotoPath: newPath,
          ProfilePhotoPath: newPath
        }));
        
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

  const downloadSampleExcel = async () => {
    try {
      // Define standard headers based on all current student table fields
      // Using user-friendly names that the mapper will convert to IDs
      const headers = [
        "SchoolName", "RegistrationNumber", "RollNumber", "FirstName", "MiddleName", "LastName", 
        "Gender", "Mobile", "Email", "MotherName", "Address", "AadharCard", "DOB",
        "GradeName", "SectionName", "BloodGroupName", "HouseName", 
        "AdmissionType", "ReligionName", "CasteName", "SubCasteName", 
        "CategoryName", "AcademicYear", "ShiftName", "Status",
        "RFID", "UniformID", "SecondaryMobile", "SecondarySMS"
      ];
      
      const sampleData = [
        {
          SchoolName: schools.find(sch => sch.id?.toString() === user.schoolId?.toString())?.name || schools[0]?.name || "Main Campus",
          RegistrationNumber: "REG1001",
          RollNumber: "1",
          FirstName: "John",
          MiddleName: "Doe",
          LastName: "Smith",
          Gender: "Male",
          Mobile: "9876543210",
          Email: "john.smith@example.com",
          MotherName: "Jane Smith",
          Address: "123 Education Lane, Sector 4",
          AadharCard: "123456789012",
          DOB: "2010-05-20",
          GradeName: standardsMaster[0]?.name || "10th",
          SectionName: sectionsMaster[0]?.name || "A",
          BloodGroupName: bloodGroups[0]?.name || "O+",
          HouseName: houses[0]?.name || "Blue House",
          AdmissionType: admissionTypes[0]?.name || "Regular",
          ReligionName: religions[0]?.name || "Hindu",
          CasteName: castes[0]?.name || "General",
          SubCasteName: subCastes[0]?.name || "None",
          CategoryName: categories[0]?.name || "General",
          AcademicYear: academicYears.find(ay => ay.isCurrent)?.name || academicYears[0]?.name || "2024-25",
          ShiftName: shifts[0]?.name || "Morning",
          Status: "Active",
          RFID: "RF99221",
          UniformID: "UNIF-001",
          SecondaryMobile: "9876543211",
          SecondarySMS: "Yes"
        }
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });
      
      // Add a hidden sheet or comments with available master data values to help user
      XLSX.utils.book_append_sheet(wb, ws, "Students Template");
      
      XLSX.writeFile(wb, "Student_Import_Template.xlsx");
      toast.success("Student import template generated. Please fill actual names for masters.");
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Failed to generate sample template.");
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadResults([]);
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);

        if (rawData.length === 0) {
          toast.error("The uploaded file is empty.");
          setIsProcessing(false);
          return;
        }

        // Initialize status tracking
        const initialResults = rawData.map((item: any, index: number) => ({
          id: index,
          name: `${item.FirstName || ""} ${item.LastName || ""}`.trim() || item.RegistrationNumber || `Row ${index + 1}`,
          status: 'pending',
          error: null
        }));
        setUploadResults(initialResults);

        const processedStudents = rawData.map((item: any, index: number) => {
          try {
            // Helper helper to dynamically lookup keys case-insensitively and trim spaces
            const getFieldCleanVal = (keysToSearch: string[]): string => {
              for (const key of keysToSearch) {
                const matchKey = Object.keys(item).find(k => k.toLowerCase() === key.toLowerCase());
                if (matchKey && item[matchKey] !== undefined && item[matchKey] !== null) {
                  return item[matchKey].toString().trim();
                }
              }
              return "";
            };

            // 1. School Name Resolution
            const schName = getFieldCleanVal(["SchoolName", "School", "school_name"]);
            const schMasterId = item.SchoolId || (schName ? schools.find((sch: any) => 
              sch.name.toLowerCase().trim() === schName.toLowerCase()
            )?.id : undefined);

            // 2. Class/Grade/Standard Resolution
            const stdName = getFieldCleanVal(["GradeName", "STD", "standard", "grade"]);
            const stdMasterId = item.StandardId || (stdName ? standardsMaster.find((s: any) => 
              s.name.toLowerCase().trim() === stdName.toLowerCase()
            )?.id : undefined);
            
            // 3. Section/Division Resolution
            const divName = getFieldCleanVal(["SectionName", "DIV", "section", "division"]);
            const divMasterId = item.SectionId || (divName ? sectionsMaster.find((s: any) => 
              s.name.toLowerCase().trim() === divName.toLowerCase()
            )?.id : undefined);
            
            // 4. Shift Resolution
            const shiftName = getFieldCleanVal(["ShiftName", "SHIFTNAME", "shift"]);
            const shiftMasterId = item.ShiftId || (shiftName ? shifts.find((s: any) => 
               s.name.toLowerCase().trim() === shiftName.toLowerCase()
            )?.id : undefined);

            // 5. Academic Year Resolution
            const ayName = getFieldCleanVal(["AcademicYear", "academicyear", "academic_year"]);
            const ayMasterId = item.AcademicYearId || (ayName ? academicYears.find((s: any) => 
              s.name.toLowerCase().trim() === ayName.toLowerCase()
            )?.id : undefined);

            // 6. Blood Group Resolution
            const bgName = getFieldCleanVal(["BloodGroupName", "BLOODGROUP", "blood_group"]);
            const bgMasterId = item.BloodGroupId || (bgName ? bloodGroups.find((bg: any) => 
              bg.name.toLowerCase().trim() === bgName.toLowerCase()
            )?.id : undefined);

            // 7. Religion Resolution
            const relName = getFieldCleanVal(["ReligionName", "RELIGION", "religion"]);
            const religionMasterId = item.ReligionId || (relName ? religions.find((r: any) => 
              r.name.toLowerCase().trim() === relName.toLowerCase()
            )?.id : undefined);

            // 8. House Resolution
            const houseName = getFieldCleanVal(["HouseName", "house"]);
            const houseMasterId = item.HouseId || (houseName ? houses.find((h: any) => 
              h.name.toLowerCase().trim() === houseName.toLowerCase()
            )?.id : undefined);

            // 9. Admission Type Resolution
            const atName = getFieldCleanVal(["AdmissionType", "admissiontype", "admission_type"]);
            const admissionTypeMasterId = item.AdmissionTypeId || (atName ? admissionTypes.find((at: any) => 
              at.name.toLowerCase().trim() === atName.toLowerCase()
            )?.id : undefined);

            // 10. Caste Resolution
            const cName = getFieldCleanVal(["CasteName", "CASTE", "caste"]);
            const casteMasterId = item.CasteId || (cName ? castes.find((c: any) => 
              c.name.toLowerCase().trim() === cName.toLowerCase()
            )?.id : undefined);

            // 11. Category Resolution
            const catName = getFieldCleanVal(["CategoryName", "CATEGORY", "category"]);
            const categoryMasterId = item.CategoryId || (catName ? categories.find((c: any) => 
              c.name.toLowerCase().trim() === catName.toLowerCase()
            )?.id : undefined);

            // Map standard fields for DB persistence
            const regNum = getFieldCleanVal(["RegistrationNumber", "GRNO", "registration_number", "student_id"]);
            const fName = getFieldCleanVal(["FirstName", "FNAME", "first_name"]);
            const mName = getFieldCleanVal(["MiddleName", "MNAME", "middle_name"]);
            const lName = getFieldCleanVal(["LastName", "LNAME", "last_name"]);

            return {
              registrationNumber: regNum || `REG-${Date.now()}-${index}`,
              name: `${fName} ${mName} ${lName}`.trim() || item.Name || `Student ${index + 1}`,
              schoolId: parseInt(schMasterId || item.SchoolId || user.schoolId || "1"),
              rollNumber: parseInt(getFieldCleanVal(["RollNumber", "ROLLNO", "roll_number"]) || "0"),
              GRNO: regNum,
              GENDER: getFieldCleanVal(["Gender", "GENDER"]) || "Male",
              DOB: getFieldCleanVal(["DOB", "DateOfBirth", "dob", "birth_date"]),
              MOBILE: getFieldCleanVal(["Mobile", "MOBILE", "contact_number"]),
              EMAIL: getFieldCleanVal(["Email", "EMAIL"]),
              ADDRESS: getFieldCleanVal(["Address", "ADDRESS"]),
              MOTHERNAME: getFieldCleanVal(["MotherName", "MOTHERNAME"]),
              aadharcard: getFieldCleanVal(["AadharCard", "aadharcard", "aadhar_card"]),
              RFID: getFieldCleanVal(["RFID", "CARDID", "card_id"]),
              SHIFTNAME: shiftName,
              
              StandardId: stdMasterId,
              SectionId: divMasterId,
              ShiftId: shiftMasterId,
              AcademicYearId: ayMasterId,
              BloodGroupId: bgMasterId,
              ReligionId: religionMasterId,
              HouseId: houseMasterId,
              AdmissionTypeId: admissionTypeMasterId,
              CasteId: casteMasterId,
              CategoryId: categoryMasterId,
              
              uniformid: getFieldCleanVal(["UniformID", "uniformid", "uniform_id"]),
              contact2: getFieldCleanVal(["SecondaryMobile", "SecondaryContact", "SecondaryPhone", "contact2"]),
              sms: getFieldCleanVal(["SecondarySMS", "sms"]),
              status: getFieldCleanVal(["Status", "status"]) || "Active",
              CreatedBy: user.name || user.email,
              ModifiedBy: user.name || user.email
            };
          } catch (e) {
            console.error(`Row ${index} mapping error:`, e);
            return null;
          }
        });

        // 1) Fetch existing students from the database for comprehensive pre-validation checks
        let existingStudentsDbList: any[] = [];
        try {
          const allRes = await apiService.getStudents(
            parseSafeInt(user.schoolId),
            parseSafeInt(user.academicYearId),
            { page: 1, pageSize: 100000 }
          );
          const allData = allRes.data;
          existingStudentsDbList = Array.isArray(allData) 
            ? allData 
            : (allData && Array.isArray(allData.data) ? allData.data : []);
        } catch (fetchErr) {
          console.error("Could not load existing records for pre-validation:", fetchErr);
        }

        // Build Sets of existing unique identifiers for fast O(1) lookup
        const existingRegs = new Set<string>();
        const existingAadhars = new Set<string>();
        const existingRfids = new Set<string>();
        const existingUniforms = new Set<string>();

        existingStudentsDbList.forEach((s: any) => {
          const getVal = (prop: string, fallback?: any) => {
            if (!s) return fallback;
            const keys = Object.keys(s);
            const match = keys.find(k => k.toLowerCase() === prop.toLowerCase());
            return match ? s[match] : fallback;
          };
          const reg = (getVal("GRNO") || s.registrationNumber || s.grno || "").toString().trim().toLowerCase();
          const aadhar = (getVal("aadharcard") || s.aadharCard || "").toString().trim().toLowerCase();
          const rfidVal = (getVal("RFID") || s.rfid || s.CARDID || s.cardId || "").toString().trim().toLowerCase();
          const uniformVal = (getVal("uniformid") || s.uniformid || "").toString().trim().toLowerCase();

          if (reg) existingRegs.add(reg);
          if (aadhar) existingAadhars.add(aadhar);
          if (rfidVal) existingRfids.add(rfidVal);
          if (uniformVal) existingUniforms.add(uniformVal);
        });

        // Set up sets for in-batch duplicates check
        const batchRegs = new Set<string>();
        const batchAadhars = new Set<string>();
        const batchRfids = new Set<string>();
        const batchUniforms = new Set<string>();

        let totalValidationErrorsFound = 0;
        const validatedResults = initialResults.map((result: any, idx: number) => {
          const s = processedStudents[idx];
          if (!s) return { ...result, status: 'error', error: 'Invalid record format' };

          const reg = (s.registrationNumber || s.GRNO || "").toString().trim().toLowerCase();
          const aadhar = (s.aadharcard || "").toString().trim().toLowerCase();
          const rfid = (s.RFID || "").toString().trim().toLowerCase();
          const uniform = (s.uniformid || "").toString().trim().toLowerCase();

          let rowError = "";

          // a) RegistrationNumber/GRNO
          if (reg) {
            if (batchRegs.has(reg)) {
              rowError = `Duplicate Registration Number/GRNO '${s.registrationNumber}' in uploaded file.`;
            } else if (existingRegs.has(reg)) {
              rowError = `Registration Number/GRNO '${s.registrationNumber}' already exists in database.`;
            } else {
              batchRegs.add(reg);
            }
          }

          // b) AadharCard
          if (!rowError && aadhar) {
            if (batchAadhars.has(aadhar)) {
              rowError = `Duplicate Aadhar Card '${s.aadharcard}' in uploaded file.`;
            } else if (existingAadhars.has(aadhar)) {
              rowError = `Aadhar Card '${s.aadharcard}' already exists in database.`;
            } else {
              batchAadhars.add(aadhar);
            }
          }

          // c) RFID
          if (!rowError && rfid) {
            if (batchRfids.has(rfid)) {
              rowError = `Duplicate RFID/CardID '${s.RFID}' in uploaded file.`;
            } else if (existingRfids.has(rfid)) {
              rowError = `RFID/CardID '${s.RFID}' already exists in database.`;
            } else {
              batchRfids.add(rfid);
            }
          }

          // d) UniformID
          if (!rowError && uniform) {
            if (batchUniforms.has(uniform)) {
              rowError = `Duplicate UniformID '${s.uniformid}' in uploaded file.`;
            } else if (existingUniforms.has(uniform)) {
              rowError = `UniformID '${s.uniformid}' already exists in database.`;
            } else {
              batchUniforms.add(uniform);
            }
          }

          if (rowError) {
            totalValidationErrorsFound++;
            return {
              ...result,
              status: 'error',
              error: rowError
            };
          }
          return { ...result, status: 'pending' };
        });

        if (totalValidationErrorsFound > 0) {
          setUploadResults(validatedResults);
          setIsProcessing(false);
          toast.error(`Validation failed: ${totalValidationErrorsFound} unique field conflict(s) detected. Please correct the fields in your datasheet and try again.`);
          if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";
          return;
        }

        // Dynamic upload process: Sequential or Chunked to update UI
        let successCount = 0;
        let failCount = 0;

        // Process in chunks of 5 for balance between speed and UI responsiveness
        const chunkSize = 5;
        for (let i = 0; i < processedStudents.length; i += chunkSize) {
          const chunk = processedStudents.slice(i, i + chunkSize);
          const chunkIndices = Array.from({length: chunk.length}, (_, k) => i + k);
          
          // Filter out failed mapping rows
          const validRows = chunk.filter(s => s !== null);
          const validIndices = chunkIndices.filter(idx => processedStudents[idx] !== null);
          
          setUploadResults(prev => prev.map(res => 
            chunkIndices.includes(res.id) ? { ...res, status: 'processing' } : res
          ));

          try {
            await apiService.bulkCreateStudents(validRows);
            
            setUploadResults(prev => prev.map(res => 
              validIndices.includes(res.id) ? { ...res, status: 'success' } : res
            ));
            
            // Mark failed mapping rows
            const invalidIndices = chunkIndices.filter(idx => processedStudents[idx] === null);
            if (invalidIndices.length > 0) {
              setUploadResults(prev => prev.map(res => 
                invalidIndices.includes(res.id) ? { ...res, status: 'error', error: 'Invalid data format' } : res
              ));
              failCount += invalidIndices.length;
            }

            successCount += validRows.length;
          } catch (error: any) {
            console.error(`Chunk ${i} upload error:`, error);
            setUploadResults(prev => prev.map(res => 
              chunkIndices.includes(res.id) ? { ...res, status: 'error', error: error.response?.data?.message || 'Server error' } : res
            ));
            failCount += chunk.length;
          }
        }

        if (failCount === 0) {
          toast.success(`Successfully imported all ${successCount} students.`);
          setTimeout(() => setIsBulkUploadOpen(false), 2000);
        } else {
          toast.warning(`Imported ${successCount} students, but ${failCount} failed.`);
        }
        
        fetchStudents();
      } catch (error) {
        console.error("Bulk upload reading error:", error);
        toast.error("Failed to read Excel file.");
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
        schoolId: parseSafeInt(newStudentFormData.schoolId) || 1,
        rollNumber: parseSafeInt(newStudentFormData.ROLLNO) || 0,
        registrationNumber: newStudentFormData.registrationNumber || `REG/${new Date().getFullYear()}/${Math.floor(Math.random() * 900) + 100}`,
        name: `${newStudentFormData.FNAME} ${newStudentFormData.MNAME} ${newStudentFormData.LNAME}`.trim(),
        status: newStudentFormData.status || "Active",
        
        // Dynamic fields mapping supporting both legacy and unified standard naming
        FirstName: newStudentFormData.FNAME,
        MiddleName: newStudentFormData.MNAME,
        LastName: newStudentFormData.LNAME,
        GrNo: newStudentFormData.registrationNumber,
        Gender: newStudentFormData.GENDER,
        DateOfBirth: newStudentFormData.DOB,
        FatherContactNo: newStudentFormData.MOBILE,
        MotherContactNo: newStudentFormData.contact2,
        MotherName: newStudentFormData.MOTHERNAME,
        Address: newStudentFormData.ADDRESS,
        AadharCard: newStudentFormData.aadharcard,
        Rfid: newStudentFormData.RFID,
        UniformId: newStudentFormData.uniformid,
        Sms: !!newStudentFormData.sms,
        IsStateBoard: !!newStudentFormData.isStateBoard,

        // Legacy database fields mapping for safe proxying/SP support
        STUDENTID: newStudentFormData.registrationNumber,
        FNAME: newStudentFormData.FNAME,
        MNAME: newStudentFormData.MNAME,
        LNAME: newStudentFormData.LNAME,
        GRNO: newStudentFormData.registrationNumber,
        GENDER: newStudentFormData.GENDER,
        DOB: newStudentFormData.DOB,
        MOBILE: newStudentFormData.MOBILE,
        MOTHERNAME: newStudentFormData.MOTHERNAME,
        ADDRESS: newStudentFormData.ADDRESS,
        aadharcard: newStudentFormData.aadharcard,
        RFID: newStudentFormData.RFID,
        uniformid: newStudentFormData.uniformid,
        contact2: newStudentFormData.contact2,
        sms: !!newStudentFormData.sms,
        isStateBoard: !!newStudentFormData.isStateBoard,
        ProfilePhotoPath: newStudentFormData.ProfilePhotoPath,
        SchoolSectionId: parseSafeInt(newStudentFormData.SchoolSectionId) || null,
        AdmissionDate: newStudentFormData.AdmissionDate,
        Email: newStudentFormData.Email,
        CityId: parseSafeInt(newStudentFormData.CityId) || null,
        StateId: parseSafeInt(newStudentFormData.StateId) || null,

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
        const response = await apiService.createStudent(payload);
        const createdStudent = response.data.data || response.data;
        const studentId = createdStudent?.id;
        
        if (selectedPhotoFile && studentId) {
          try {
            await apiService.uploadStudentPhoto(studentId, selectedPhotoFile);
          } catch (uploadErr) {
            console.error("Delayed student photo upload failed:", uploadErr);
          }
        }
        toast.success("Student registered successfully!");
      }
      
      setIsAddDialogOpen(false);
      setSelectedPhotoFile(null);
      setLocalPhotoPreview(null);
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

  const filteredStudents = students; // Server now handles filtering, sorting and pagination

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
            <Dialog open={isBulkUploadOpen} onOpenChange={(open) => {
              if (!isProcessing) {
                setIsBulkUploadOpen(open);
                if (!open) setUploadResults([]);
              }
            }}>
              <SimpleTooltip content="Import students from Excel" side="bottom">
                <DialogTrigger
                  render={
                    <div className="flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 outline-none cursor-pointer text-sm font-medium" aria-label="Bulk upload students">
                      <Upload size={16} /> Bulk Upload
                    </div>
                  }
                />
              </SimpleTooltip>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-3xl rounded-[2rem]">
                <div className="bg-slate-900 px-8 py-5 text-white shrink-0">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                       <div className="p-2 bg-blue-500 rounded-xl">
                          <Upload size={20} className="text-white" />
                       </div>
                       Batch Student Onboarding
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                      Synchronize your physical register with the digital campus database using our high-speed Excel importer.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
                  {uploadResults.length === 0 ? (
                    <div className="p-10 border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-6 bg-slate-50/30 transition-all hover:bg-slate-50 hover:border-blue-100 group">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <FileText className="text-blue-500" size={32} />
                      </div>
                      <div className="text-center space-y-2">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Drop your datasheet here</h4>
                        <p className="text-xs text-slate-400 font-bold max-w-xs leading-relaxed uppercase tracking-widest">
                          Strictly supports .XLSX and .XLS formats. Follow the system-defined schema for 100% precision.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <Button 
                          className="flex-1 bg-slate-900 hover:bg-black text-white font-black rounded-2xl h-12 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
                          onClick={() => bulkFileInputRef.current?.click()}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing Streams..." : "Browse Local Files"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-slate-200 hover:bg-slate-50 font-black rounded-2xl h-12 transition-all gap-2 text-slate-600"
                          onClick={downloadSampleExcel}
                        >
                          <Download size={18} /> Sample Sheet
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
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Import Stream Activity</h4>
                        <div className="flex gap-2">
                           <Badge className="bg-emerald-500 hover:bg-emerald-600 font-black px-2 py-0.5 rounded-lg text-[10px]">
                              {uploadResults.filter(r => r.status === 'success').length} SUCCESS
                           </Badge>
                           <Badge className="bg-rose-500 hover:bg-rose-600 font-black px-2 py-0.5 rounded-lg text-[10px]">
                              {uploadResults.filter(r => r.status === 'error').length} FAILED
                           </Badge>
                        </div>
                      </div>

                      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/50">
                          <Table>
                            <TableHeader className="bg-white sticky top-0 z-10 shadow-sm">
                              <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-6">Row</TableHead>
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Signature</TableHead>
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-6">Activity State</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {uploadResults.map((result) => (
                                <TableRow key={result.id} className="group border-slate-100 bg-white/50 hover:bg-slate-50 transition-colors">
                                  <TableCell className="pl-6 font-mono text-[10px] text-slate-400">{(result.id + 1).toString().padStart(3, '0')}</TableCell>
                                  <TableCell className="py-3">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{result.name}</span>
                                      {result.error && (
                                        <span className="text-[9px] text-rose-500 font-bold uppercase tracking-tight truncate max-w-[200px]">{result.error}</span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right pr-6">
                                    {result.status === 'pending' && <Badge variant="outline" className="text-[9px] font-black tracking-tight border-slate-300 text-slate-400 bg-transparent">QUEUED</Badge>}
                                    {result.status === 'processing' && (
                                      <div className="flex items-center justify-end gap-2">
                                         <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                                         <span className="text-[9px] font-black text-blue-600 tracking-tight">SYNCING...</span>
                                      </div>
                                    )}
                                    {result.status === 'success' && (
                                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                        <span className="text-[9px] font-black uppercase tracking-tight">VERIFIED</span>
                                      </div>
                                    )}
                                    {result.status === 'error' && (
                                      <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full border border-rose-100">
                                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></div>
                                        <span className="text-[9px] font-black uppercase tracking-tight">FAILED</span>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl flex gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                        <Filter className="text-amber-500" size={18} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Master Data Integrity</p>
                        <p className="text-xs text-amber-700/80 leading-relaxed font-medium">
                          The importer automatically maps names (e.g., "10th Standard") to system IDs. Ensure spelling exactly matches the Master Configuration to avoid orphan records.
                        </p>
                     </div>
                  </div>
                </div>

                {uploadResults.length > 0 && !isProcessing && (
                  <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                    <Button 
                      className="w-full bg-slate-900 hover:bg-black font-black rounded-xl h-10 transition-all"
                      onClick={() => {
                        setIsBulkUploadOpen(false);
                        setUploadResults([]);
                      }}
                    >
                      Close Summary
                    </Button>
                  </div>
                )}
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Form Fields Column (8/12 width) */}
                        <div className="md:col-span-8">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                            <div className="md:col-span-12 space-y-1.5">
                              <Label htmlFor="school" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned School Branch</Label>
                                <Select 
                                  value={newStudentFormData.schoolId} 
                                  onValueChange={(v) => {
                                    setNewStudentFormData({...newStudentFormData, schoolId: v || ""});
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

                            <div className="md:col-span-6 space-y-1.5">
                              <Label htmlFor="STD" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.STD ? "text-red-500" : "text-slate-500")}>Academic Grade {formErrors.STD && "*"}</Label>
                              <Select 
                                value={newStudentFormData.STD} 
                                onValueChange={(v) => {
                                  setNewStudentFormData({...newStudentFormData, STD: v || ""});
                                  if (formErrors.STD) setFormErrors(prev => ({ ...prev, STD: false }));
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

                            <div className="md:col-span-6 space-y-1.5">
                              <Label htmlFor="DIV" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.DIV ? "text-red-500" : "text-slate-500")}>Division/Section {formErrors.DIV && "*"}</Label>
                              <Select 
                                value={newStudentFormData.DIV} 
                                onValueChange={(v) => {
                                  setNewStudentFormData({...newStudentFormData, DIV: v || ""});
                                  if (formErrors.DIV) setFormErrors(prev => ({ ...prev, DIV: false }));
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

                            <div className="md:col-span-6 space-y-1.5">
                              <Label htmlFor="academicyear" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Joining Year</Label>
                              <Select 
                                value={newStudentFormData.academicyear} 
                                onValueChange={(v) => setNewStudentFormData({...newStudentFormData, academicyear: v || ""})}
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

                            <div className="md:col-span-6 space-y-1.5">
                              <Label htmlFor="SHIFTNAME" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Shift</Label>
                              <Select 
                                value={newStudentFormData.SHIFTNAME} 
                                onValueChange={(v) => setNewStudentFormData({...newStudentFormData, SHIFTNAME: v || ""})}
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
                        </div>

                        {/* Profile Image Display Section (4/12 width) - Available in Add & Edit Mode */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center border-l border-slate-100 pl-6">
                           <div className="text-center space-y-4">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile Identity Image</Label>
                              
                              <div 
                                className="relative group cursor-pointer"
                                onClick={() => triggerPhotoUpload(isEditMode ? currentStudentId! : "new")}
                              >
                                <div className="w-44 h-44 rounded-3xl overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-200 bg-slate-50 flex items-center justify-center transition-all duration-300 group-hover:shadow-blue-200/50 group-hover:scale-[1.02]">
                                  {(localPhotoPreview || newStudentFormData.ProfilePhotoPath) ? (
                                    <img 
                                      src={localPhotoPreview || resolvePhotoUrl(newStudentFormData.ProfilePhotoPath)} 
                                      alt="Student Identity" 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + newStudentFormData.FNAME;
                                      }}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-300">
                                      <div className="p-4 bg-slate-100 rounded-2xl">
                                        <Edit2 size={32} className="opacity-20" />
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest">No Image Found</span>
                                    </div>
                                  )}

                                  {/* Update Overlay */}
                                  <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[2px]">
                                    <div className="p-2 bg-white/20 rounded-full">
                                      <Edit2 size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                                  </div>
                                </div>
                                
                                {(localPhotoPreview || newStudentFormData.ProfilePhotoPath) && (
                                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[180px] mx-auto">
                                Click the identity frame to upload or change the physical photograph.
                              </p>
                           </div>
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
                                setNewStudentFormData({...newStudentFormData, GENDER: v || ""});
                                setNewStudentFormData(prev => ({ ...prev, GENDER: v || "" }));
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
                          
                          <div className="space-y-1.5">
                            <Label htmlFor="SchoolSection" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">School Section</Label>
                            <Select 
                              value={newStudentFormData.SchoolSectionId} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, SchoolSectionId: v || ""})}
                            >
                              <SelectTrigger id="SchoolSection" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                                <SelectValue placeholder="Select School Section">
                                  {schoolSections.find(s => s.id.toString() === newStudentFormData.SchoolSectionId)?.name || undefined}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                                <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select School Section</SelectItem>
                                {Array.isArray(schoolSections) && schoolSections.map(sec => (
                                  <SelectItem key={sec.id} value={sec.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{sec.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="house" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">School House</Label>
                            <Select 
                              value={newStudentFormData.house} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, house: v || ""})}
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
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, admissiontype: v || ""})}
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
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, RELIGION: v || ""})}
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
                            <Label htmlFor="BLOODGROUP" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</Label>
                            <Select 
                              value={newStudentFormData.BLOODGROUP} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, BLOODGROUP: v || ""})}
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
                               onValueChange={(v) => setNewStudentFormData({...newStudentFormData, CASTE: v || ""})}
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
                               onValueChange={(v) => setNewStudentFormData({...newStudentFormData, CATEGORY: v || ""})}
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

                          <div className="md:col-span-2 space-y-1.5">
                            <Label htmlFor="subcaste" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sub-Caste</Label>
                            <Select 
                              value={newStudentFormData.subcaste} 
                              onValueChange={(v) => setNewStudentFormData({...newStudentFormData, subcaste: v || ""})}
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
                          <Label htmlFor="MOBILE" className={cn("text-[10px] font-black uppercase tracking-widest ml-1", formErrors.MOBILE ? "text-red-500" : "text-slate-500")}>Father's Contact No. {formErrors.MOBILE && "*"}</Label>
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
                        <div className="space-y-1.5">
                          <Label htmlFor="contact2" className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">Mother's Contact No.</Label>
                          <Input 
                            id="contact2" 
                            type="tel" 
                            value={newStudentFormData.contact2} 
                            maxLength={10}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setNewStudentFormData({...newStudentFormData, contact2: val});
                            }} 
                            placeholder="Optional 10-digit number" 
                            className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                          />
                        </div>

                        {/* Double Interactive Communication & Affiliation Preferences check-buttons */}
                        <div className="space-y-1.5 flex flex-col justify-end">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-10 items-center">
                            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all select-none">
                              <input 
                                type="checkbox"
                                checked={!!newStudentFormData.sms}
                                onChange={(e) => setNewStudentFormData({...newStudentFormData, sms: e.target.checked})}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 accent-blue-600 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-700">SMS Notification</span>
                            </label>

                            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all select-none">
                              <input 
                                type="checkbox"
                                checked={!!newStudentFormData.isStateBoard}
                                onChange={(e) => setNewStudentFormData({...newStudentFormData, isStateBoard: e.target.checked})}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 accent-blue-600 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-700">State Board Affiliated</span>
                            </label>
                          </div>
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

                    <section className="mt-6">
                      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                        <div className="w-1.5 h-5 bg-teal-600 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Additional & Geographic Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label htmlFor="Email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</Label>
                          <Input 
                            id="Email" 
                            type="email"
                            value={newStudentFormData.Email} 
                            onChange={(e) => setNewStudentFormData({...newStudentFormData, Email: e.target.value})} 
                            placeholder="e.g. email@domain.com" 
                            className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="AdmissionDate" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admission Date</Label>
                          <Input 
                            id="AdmissionDate" 
                            type="date"
                            value={newStudentFormData.AdmissionDate} 
                            onChange={(e) => setNewStudentFormData({...newStudentFormData, AdmissionDate: e.target.value})} 
                            className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="StateId" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State Name</Label>
                          <Select 
                            value={newStudentFormData.StateId} 
                            onValueChange={(v) => setNewStudentFormData({...newStudentFormData, StateId: v || "", CityId: ""})}
                          >
                            <SelectTrigger id="StateId" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                              <SelectValue placeholder="Select State">
                                {newStudentFormData.StateId ? states.find(st => st.id.toString() === newStudentFormData.StateId)?.name : "Select State"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select State</SelectItem>
                              {Array.isArray(states) && states.map(st => (
                                <SelectItem key={st.id} value={st.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{st.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="CityId" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City Name</Label>
                          <Select 
                            value={newStudentFormData.CityId} 
                            onValueChange={(v) => setNewStudentFormData({...newStudentFormData, CityId: v || ""})}
                            disabled={!newStudentFormData.StateId}
                          >
                            <SelectTrigger id="CityId" className="h-10 border-slate-200 bg-slate-50/50 font-bold rounded-xl px-4 text-sm">
                              <SelectValue placeholder="Select City">
                                {newStudentFormData.CityId ? cities.find(c => c.id.toString() === newStudentFormData.CityId)?.name : "Select City"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                              <SelectItem value="" className="font-semibold py-1.5 px-3 rounded-lg focus:bg-slate-50 text-slate-400 italic">Select City</SelectItem>
                              {Array.isArray(cities) && cities
                                .filter(c => c.stateId?.toString() === newStudentFormData.StateId)
                                .map(c => (
                                  <SelectItem key={c.id} value={c.id.toString()} className="font-semibold py-1.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
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
                <TableHead 
                  className="w-[140px] pl-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("grno")}
                >
                  <div className="flex items-center gap-1">
                    Registry #
                    {sortBy === "grno" ? (sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ArrowUpDown size={10} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[80px] hidden md:table-cell text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("roll")}
                >
                  <div className="flex items-center gap-1">
                    Roll
                    {sortBy === "roll" ? (sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ArrowUpDown size={10} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("fullName")}
                >
                  <div className="flex items-center gap-1">
                    Profile Information
                    {sortBy === "fullName" ? (sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ArrowUpDown size={10} className="opacity-30" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="hidden lg:table-cell text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("standard")}
                >
                  <div className="flex items-center gap-1">
                    Placement
                    {sortBy === "standard" ? (sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ArrowUpDown size={10} className="opacity-30" />}
                  </div>
                </TableHead>
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
                            <AvatarImage src={resolvePhotoUrl(student.profilePhotoPath)} alt={student.name} />
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

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-slate-100 gap-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Showing <span className="text-slate-900 font-black">{students.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to <span className="text-slate-900 font-black">{Math.min(page * pageSize, totalCount)}</span> of <span className="text-slate-900 font-black">{totalCount}</span> entries
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows per page</span>
                <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setPage(1); }}>
                  <SelectTrigger className="w-[70px] h-8 bg-white border-slate-200 rounded-lg text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {[10, 25, 50, 100].map(size => (
                      <SelectItem key={size} value={size.toString()} className="text-xs font-bold">{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 disabled:opacity-30"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  <ChevronsLeft size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 disabled:opacity-30"
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={14} />
                </Button>

                <div className="flex items-center px-3 h-8 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-900 mx-1">
                  Page {page} of {totalPages || 1}
                </div>

                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 disabled:opacity-30"
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                >
                  <ChevronRight size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 disabled:opacity-30"
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                >
                  <ChevronsRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// No need for local cn function anymore as we use the one from @/lib/utils
