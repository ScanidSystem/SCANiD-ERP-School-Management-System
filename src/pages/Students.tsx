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
  Calendar,
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
  ChevronDown,
  School2,
  BookOpen,
  LayoutGrid,
  Layers3,
  CalendarDays,
  CalendarRange,
  SunMoon,
  Clock3,
  Sparkles,
  Landmark,
  HeartPulse,
  Droplets,
  Users2,
  BadgeInfo,
  Layers,
  Folders,
  Home,
  UserPlus,
  Flag,
  Check,
  Mail,
  Map,
  MapPin,
  Building2,
  Smartphone,
  Users,
  Settings2,
  CircleOff,
  Mars,
  Venus,
  VenusAndMars,
  GitBranch,
  House,
  School,
  ClipboardCheck,
  Church,
  Tags,
  UserCheck,
  UserRound,
  LayoutPanelLeft,
  FileCheck,
  FolderKanban,
  MapPinned
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
          grno: getVal("GRNO") || s.registrationNumber || s.grno || getVal("registrationNumber") || "",
          schoolId: (s.schoolId || s.SchoolId)?.toString() || "",
          firstName: getVal("FNAME") || s.firstName || (s.name || s.fullName)?.split(" ")[0] || "",
          lastName: getVal("LNAME") || s.lastName || (s.name || s.fullName)?.split(" ").slice(-1)[0] || "",
          middleName: getVal("MNAME") || s.middleName || ((s.name || s.fullName)?.split(" ").length > 2 ? (s.name || s.fullName)?.split(" ").slice(1, -1).join(" ") : ""),
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
          digitalUniform: getVal("DigitalUniform") || getVal("digitalUniform") || s.digitalUniform || false,
          digitalNotebook: getVal("DigitalNotebook") || getVal("digitalNotebook") || s.digitalNotebook || false,
          SchoolSectionId: getSafeId(getVal("SchoolSectionId") || getVal("schoolSectionId") || s.schoolSectionId),
          AdmissionDate: getVal("AdmissionDate") || s.admissionDate || "",
          Email: getVal("Email") || s.email || "",
          CityId: getSafeId(getVal("CityId") || getVal("cityId") || s.cityId),
          StateId: getSafeId(getVal("StateId") || getVal("stateId") || s.stateId),
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, any>>({});
  
  const initialFormState = {
    registrationNumber: "",
    schoolId: (user.schoolId && user.schoolId !== "all") ? user.schoolId.toString() : "",
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
    digitalUniform: false,
    digitalNotebook: false,
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
      RFID: student.RFID || student.rfid || "",
      SHIFTNAME: student.SHIFTNAME || "",
      uniformid: student.uniformid || student.uniformId || "",
      contact2: student.contact2 || student.motherContactNo || "",
      sms: student.sms === "true" || student.sms === true,
      isStateBoard: student.isStateBoard === "true" || student.isStateBoard === true,
      digitalUniform: student.digitalUniform === "true" || student.digitalUniform === true || student.DigitalUniform === "true" || student.DigitalUniform === true,
      digitalNotebook: student.digitalNotebook === "true" || student.digitalNotebook === true || student.DigitalNotebook === "true" || student.DigitalNotebook === true,
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
        "RFID", "UniformID", "SecondaryContact", "SecondarySMS"
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
          SecondaryContact: "9876543211",
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
            // Find school id by the provided School Name for institutional compliance
            const schName = item.SchoolName || item.schoolName || item.School;
            const schMasterId = item.SchoolId || (schName ? schools.find((sch: any) => 
              sch.name.toLowerCase() === schName.toString().toLowerCase()
            )?.id : undefined);

            const stdName = item.GradeName || item.STD;
            const stdMasterId = item.StandardId || (stdName ? standardsMaster.find((s: any) => 
              s.name.toLowerCase() === stdName.toString().toLowerCase()
            )?.id : undefined);
            
            const divName = item.SectionName || item.DIV;
            const divMasterId = item.SectionId || (divName ? sectionsMaster.find((s: any) => 
              s.name.toLowerCase() === divName.toString().toLowerCase()
            )?.id : undefined);
            
            const shiftName = item.ShiftName || item.SHIFTNAME;
            const shiftMasterId = item.ShiftId || (shiftName ? shifts.find((s: any) => 
              s.name.toLowerCase() === shiftName.toString().toLowerCase()
            )?.id : undefined);

            const ayName = item.AcademicYear || item.academicyear;
            const ayMasterId = item.AcademicYearId || (ayName ? academicYears.find((s: any) => 
              s.name.toLowerCase() === ayName.toString().toLowerCase()
            )?.id : undefined);

            const bgName = item.BloodGroupName || item.BLOODGROUP;
            const bgMasterId = item.BloodGroupId || (bgName ? bloodGroups.find((bg: any) => 
              bg.name.toLowerCase() === bgName.toString().toLowerCase()
            )?.id : undefined);

            const relName = item.ReligionName || item.RELIGION;
            const religionMasterId = item.ReligionId || (relName ? religions.find((r: any) => 
              r.name.toLowerCase() === relName.toString().toLowerCase()
            )?.id : undefined);

            const houseName = item.HouseName || item.house;
            const houseMasterId = item.HouseId || (houseName ? houses.find((h: any) => 
              h.name.toLowerCase() === houseName.toString().toLowerCase()
            )?.id : undefined);

            const atName = item.AdmissionType || item.admissiontype;
            const admissionTypeMasterId = item.AdmissionTypeId || (atName ? admissionTypes.find((at: any) => 
              at.name.toLowerCase() === atName.toString().toLowerCase()
            )?.id : undefined);

            const cName = item.CasteName || item.CASTE;
            const casteMasterId = item.CasteId || (cName ? castes.find((c: any) => 
              c.name.toLowerCase() === cName.toString().toLowerCase()
            )?.id : undefined);

            const catName = item.CategoryName || item.CATEGORY;
            const categoryMasterId = item.CategoryId || (catName ? categories.find((c: any) => 
              c.name.toLowerCase() === catName.toString().toLowerCase()
            )?.id : undefined);

            return {
              registrationNumber: (item.RegistrationNumber || item.GRNO || item.registrationNumber || `REG-${Date.now()}-${index}`).toString(),
              name: item.Name || `${item.FirstName || item.FNAME || ""} ${item.MiddleName || item.MNAME || ""} ${item.LastName || item.LNAME || ""}`.trim(),
              schoolId: parseInt(schMasterId || item.SchoolId || user.schoolId || "1"),
              rollNumber: parseInt(item.RollNumber || item.ROLLNO || "0"),
              GRNO: (item.GRNO || item.RegistrationNumber || item.registrationNumber || "").toString(),
              GENDER: item.Gender || item.GENDER || "Male",
              DOB: item.DOB || item.DateOfBirth,
              MOBILE: (item.Mobile || item.MOBILE || item.contactNumber || "").toString(),
              EMAIL: item.Email || item.EMAIL,
              ADDRESS: item.Address || item.ADDRESS,
              MOTHERNAME: item.MotherName || item.MOTHERNAME,
              aadharcard: (item.AadharCard || item.aadharcard || "").toString(),
              RFID: (item.RFID || item.CARDID || item.cardId || "").toString(),
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
              
              uniformid: item.UniformID || item.uniformid,
              contact2: item.SecondaryContact || item.contact2,
              sms: item.SecondarySMS || item.sms,
              status: item.Status || "Active",
              CreatedBy: user.name || user.email,
              ModifiedBy: user.name || user.email
            };
          } catch (e) {
            console.error(`Row ${index} mapping error:`, e);
            return null;
          }
        });

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
    const newErrors: Record<string, string> = {};
    let firstErrorField = "";

    const checkField = (field: string, condition: boolean, message: string) => {
      if (condition) {
        newErrors[field] = message;
        if (!firstErrorField) firstErrorField = field;
      }
    };

    checkField("schoolId", !newStudentFormData.schoolId || (schools.length > 0 && !schools.find(s => s.id.toString() === newStudentFormData.schoolId.toString())), "Assigned School Branch required");
    checkField("STD", !newStudentFormData.STD, "Academic Grade required");
    checkField("DIV", !newStudentFormData.DIV, "Division / Section required");
    checkField("ROLLNO", !newStudentFormData.ROLLNO?.trim(), "Roll Number required");
    checkField("GENDER", !newStudentFormData.GENDER, "Gender required");
    checkField("aadharcard", !newStudentFormData.aadharcard?.trim() || !/^\d{12}$/.test(newStudentFormData.aadharcard.replace(/\s/g, "")), "Aadhar ID must be a valid 12-digit number");
    checkField("FNAME", !newStudentFormData.FNAME?.trim(), "First Name required");
    checkField("LNAME", !newStudentFormData.LNAME?.trim(), "Last Name required");
    checkField("DOB", !newStudentFormData.DOB, "Date of Birth required");
    checkField("MOTHERNAME", !newStudentFormData.MOTHERNAME?.trim(), "Mother's Full Name required");
    checkField("MOBILE", !newStudentFormData.MOBILE?.trim() || !/^\d{10}$/.test(newStudentFormData.MOBILE.replace(/\D/g, "")), "Contact Mobile must be a valid 10-digit number");
    checkField("ADDRESS", !newStudentFormData.ADDRESS?.trim(), "Permanent Address required");
    checkField("RELIGION", !newStudentFormData.RELIGION, "Religion required");
    checkField("BLOODGROUP", !newStudentFormData.BLOODGROUP, "Blood Group required");
    checkField("CASTE", !newStudentFormData.CASTE, "Caste required");
    checkField("CATEGORY", !newStudentFormData.CATEGORY, "Category required");
    checkField("house", !newStudentFormData.house, "School House required");
    checkField("admissiontype", !newStudentFormData.admissiontype, "Admission Type required");
    checkField("registrationNumber", !newStudentFormData.registrationNumber?.trim(), "Registration Number required");
    checkField("academicyear", !newStudentFormData.academicyear, "Academic Year required");
    checkField("SHIFTNAME", !newStudentFormData.SHIFTNAME, "Assigned Shift required");
    checkField("SchoolSectionId", !newStudentFormData.SchoolSectionId, "Academic Section required");
    checkField("AdmissionDate", !newStudentFormData.AdmissionDate, "Admission Date required");
    checkField("StateId", !newStudentFormData.StateId, "State required");
    checkField("CityId", !newStudentFormData.CityId, "City required");

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
        DigitalUniform: !!newStudentFormData.digitalUniform,
        DigitalNotebook: !!newStudentFormData.digitalNotebook,

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
        digitalUniform: !!newStudentFormData.digitalUniform,
        digitalNotebook: !!newStudentFormData.digitalNotebook,
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
                          className="flex-1 bg-slate-900 hover:bg-black text-white font-black rounded-xl h-12 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
                          onClick={() => bulkFileInputRef.current?.click()}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing Streams..." : "Browse Local Files"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-slate-200 hover:bg-slate-50 font-black rounded-xl h-12 transition-all gap-2 text-slate-600"
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

                      <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
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

                  <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-xl flex gap-4">
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
              <DialogContent className="sm:max-w-[1000px] w-[95vw] max-h-[96vh] flex flex-col p-0 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden bg-white group/modal">
                {/* Premium Dark Header - Matches Reference */}
                <div className="bg-slate-950 px-10 py-7 text-white relative shrink-0 overflow-hidden border-b border-white/5">
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/10 transition-transform group-hover/modal:scale-105 duration-500">
                        <UserCircle size={32} className="text-white fill-white/10" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <DialogTitle className="text-2xl font-black tracking-tight leading-none">
                          {isEditMode ? "Modify Student Profile" : "Register Student"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm font-medium tracking-tight opacity-90">
                          {isEditMode 
                            ? "Update critical student records and academic history." 
                            : "Create a new permanent digital record for the enrolled student."}
                        </DialogDescription>
                      </div>
                    </div>
                  </div>

                  
                  {/* Atmospheric Glow */}
                  <div className="absolute right-[-5%] top-[-20%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                  <div className="absolute left-[-5%] bottom-[-20%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 bg-[#FDFDFF] custom-scrollbar">
                  <div className="space-y-10">
                    {/* TOP SECTION: Academic + Profile Photo */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      {/* Academic Placement (8/12) */}
                      <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                          <GraduationCap className="size-5 text-indigo-600" />
                          <h3 className="text-base font-black text-slate-900 tracking-tight">Academic Placement</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="school" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Assigned School Branch</Label>
                            <div className="relative group">
                              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 size-5 z-20" />
                            <Select 
  value={newStudentFormData.schoolId}   
  onValueChange={(v) => {
    setNewStudentFormData({
      ...newStudentFormData, 
      schoolId: v
    });

    if (formErrors.schoolId) {
      setFormErrors(prev => ({ 
        ...prev, 
        schoolId: "" 
      }));
    }
  }}
  disabled={user.role !== "superadmin" && !!user.schoolId}
>
  <SelectTrigger 
    ref={el => { inputRefs.current["schoolId"] = el; }}
    id="school" 
    className={cn(
      "relative h-[66px] min-h-[66px] border-2 bg-gradient-to-b from-white to-slate-50/90 font-bold text-slate-800 rounded-2xl pl-14 pr-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)] transition-all duration-300 data-[state=open]:shadow-[0_18px_45px_rgba(99,102,241,0.14)]",
      formErrors.schoolId ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400",
      (user.role !== "superadmin" && !!user.schoolId) && "opacity-80 bg-slate-100 cursor-not-allowed"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-sm">
      <School2 className="w-4 h-4 text-indigo-600" />
    </div>

    {/* Content */}
    <div className="flex flex-col items-start justify-center leading-tight w-full truncate">
      
      

      <div className="truncate text-[14px] font-extrabold text-slate-800">
        <SelectValue placeholder="Select School Branch">
          {newStudentFormData.schoolId
            ? schools.find(
                s =>
                  s.id.toString() ===
                  newStudentFormData.schoolId.toString()
              )?.name
            : "Select School Branch"}
        </SelectValue>
      </div>
    </div>

  </SelectTrigger>

  <SelectContent className="min-w-[320px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
    <SelectItem
      value=""
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all duration-200"
    >
      <span className="text-sm font-bold text-slate-500">
        Select School Branch
      </span>
    </SelectItem>
    
    {schools.map(s => (
      <SelectItem
        key={s.id}
        value={s.id.toString()}
        className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700 transition-all duration-200"
      >
        <div className="flex items-center gap-3">

          {/* Item Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-slate-800">
              {s.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Campus Branch
            </span>
          </div>

        </div>
      </SelectItem>
    ))}

  </SelectContent>
</Select>
                            </div>
                            {formErrors.schoolId && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.schoolId}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="STD" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Standard/Grade</Label>
                            <div className="relative">
                              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 size-5 z-20" />
                            <Select 
  value={newStudentFormData.STD} 
  onValueChange={(v) => {
    setNewStudentFormData({
      ...newStudentFormData, 
      STD: v
    });

    if (formErrors.STD) {
      setFormErrors(prev => ({ 
        ...prev, 
        STD: "" 
      }));
    }
  }}
>
  <SelectTrigger 
    ref={el => { inputRefs.current["STD"] = el; }}
    id="STD" 
    className={cn(
      "relative h-[66px] min-h-[66px] border-2 bg-gradient-to-b from-white to-slate-50/90 font-bold rounded-2xl pl-14 pr-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)] transition-all duration-300 data-[state=open]:shadow-[0_18px_45px_rgba(99,102,241,0.14)]",
      formErrors.STD ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-sm">
      <GraduationCap className="w-4 h-4 text-indigo-600" />
    </div>

    {/* Content */}
    <div className="flex flex-col items-start justify-center leading-tight w-full truncate">

  

      <div className="truncate text-[14px] font-extrabold text-slate-800">
        <SelectValue placeholder="Select Grade">
          {newStudentFormData.STD || "Select Grade"}
        </SelectValue>
      </div>
    </div>

  </SelectTrigger>

  <SelectContent className="min-w-[320px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
    <SelectItem
      value=""
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all duration-200"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Grade
      </span>
    </SelectItem>

    {standardsMaster.map(std => (
      <SelectItem
        key={std.id}
        value={std.name}
        className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700 transition-all duration-200"
      >
        <div className="flex items-center gap-3">

          {/* Item Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-slate-800">
              {std.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Academic Standard
            </span>
          </div>

        </div>
      </SelectItem>
    ))}

  </SelectContent>
</Select>
                            </div>
                            {formErrors.STD && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.STD}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="DIV" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Division/Section</Label>
                            <div className="relative">
                           <Select 
  value={newStudentFormData.DIV} 
  onValueChange={(v) => {
    setNewStudentFormData({
      ...newStudentFormData, 
      DIV: v
    });

    if (formErrors.DIV) {
      setFormErrors(prev => ({ 
        ...prev, 
        DIV: "" 
      }));
    }
  }}
>
  <SelectTrigger 
    ref={el => { inputRefs.current["DIV"] = el; }}
    id="DIV" 
    className={cn(
      "relative h-[66px] min-h-[66px] border-2 bg-gradient-to-b from-white to-slate-50/90 font-bold rounded-2xl pl-14 pr-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)] transition-all duration-300 data-[state=open]:shadow-[0_18px_45px_rgba(99,102,241,0.14)]",
      formErrors.DIV ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-sm">
      <Layers3 className="w-4 h-4 text-indigo-600" />
    </div>

    {/* Content */}
    <div className="flex flex-col items-start justify-center leading-tight w-full truncate">

 

      <div className="truncate text-[14px] font-extrabold text-slate-800">
        <SelectValue placeholder="Select Section">
          {newStudentFormData.DIV || "Select Section"}
        </SelectValue>
      </div>
    </div>

  </SelectTrigger>

  <SelectContent className="min-w-[320px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
    <SelectItem
      value=""
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all duration-200"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Section
      </span>
    </SelectItem>

    {sectionsMaster.map(sec => (
      <SelectItem
        key={sec.id}
        value={sec.name}
        className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700 transition-all duration-200"
      >
        <div className="flex items-center gap-3">

          {/* Item Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
            <LayoutGrid className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-slate-800">
              Section {sec.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Division Group
            </span>
          </div>

        </div>
      </SelectItem>
    ))}

  </SelectContent>
</Select>
                            </div>
                            {formErrors.DIV && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.DIV}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="academicyear" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Joining Year</Label>
                            <div className="relative">
                           <Select 
  value={newStudentFormData.academicyear} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      academicyear: v
    })
  }
>
  <SelectTrigger 
    ref={el => { inputRefs.current["academicyear"] = el; }}
    id="academicyear" 
    className={cn(
      "relative h-[66px] min-h-[66px] border-2 bg-gradient-to-b from-white to-slate-50/90 font-bold rounded-2xl pl-14 pr-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)] transition-all duration-300 data-[state=open]:shadow-[0_18px_45px_rgba(99,102,241,0.14)]",
      formErrors.academicyear ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-sm">
      <CalendarRange className="w-4 h-4 text-indigo-600" />
    </div>

    {/* Content */}
    <div className="flex flex-col items-start justify-center leading-tight w-full truncate">

    

      <div className="truncate text-[14px] font-extrabold text-slate-800">
        <SelectValue placeholder="Select Academic Year">
          {newStudentFormData.academicyear
            ? academicYears.find(
                y =>
                  y.id.toString() ===
                  newStudentFormData.academicyear.toString()
              )?.name
            : "Select Academic Year"}
        </SelectValue>
      </div>
    </div>

  </SelectTrigger>

  <SelectContent className="min-w-[320px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
    <SelectItem
      value=""
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all duration-200"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Academic Year
      </span>
    </SelectItem>

    {academicYears.map(y => (
      <SelectItem
        key={y.id}
        value={y.id.toString()}
        className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700 transition-all duration-200"
      >
        <div className="flex items-center gap-3">

          {/* Item Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-slate-800">
              {y.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              {y.isCurrent ? "Current Academic Session" : "Academic Session"}
            </span>
          </div>

        </div>
      </SelectItem>
    ))}

  </SelectContent>
</Select>
                            </div>
                            {formErrors.academicyear && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.academicyear}</p>}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="SHIFTNAME" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Assigned Shift</Label>
                            <div className="relative">
                              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 size-5 z-20" />
                            <Select 
  value={newStudentFormData.SHIFTNAME} 
  onValueChange={(v) => 
    setNewStudentFormData({...newStudentFormData, SHIFTNAME: v})
  }
>
  <SelectTrigger 
    ref={el => { inputRefs.current["SHIFTNAME"] = el; }}
    id="SHIFTNAME" 
    className={cn(
      "h-[68px] min-h-[68px] border-2 bg-gradient-to-b from-white to-slate-50/80 font-bold rounded-2xl pl-14 pr-5 text-[15px] shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_35px_rgba(99,102,241,0.10)] transition-all duration-300 data-[state=open]:shadow-[0_12px_40px_rgba(99,102,241,0.14)]",
      formErrors.SHIFTNAME ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-4 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-100 shadow-sm">
        <Clock3 className="w-4 h-4 text-indigo-600" />
      </div>

      {/* Content */}
      <div className="flex flex-col text-left leading-tight">
      

        <SelectValue placeholder="Select Assigned Shift" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent className="min-w-[280px] rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] border border-slate-200 p-2 bg-white backdrop-blur-xl">
    <SelectItem value="" className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all duration-200">
      <span className="text-sm font-bold text-slate-500">
        Select Assigned Shift
      </span>
    </SelectItem>
    {Array.isArray(shifts) && shifts.map(s => (
      <SelectItem 
        key={s.id} 
        value={s.name} 
        className="group relative font-semibold py-4 px-4 rounded-2xl focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          
          {/* Shift Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
            <SunMoon className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-slate-800">
              {s.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Timing Schedule
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {formErrors.SHIFTNAME && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.SHIFTNAME}</p>}
                        </div>
                      </div>
                    </div>

                      {/* Photo Section (4/12) */}
                      <div className="lg:col-span-4 flex flex-col space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                          <Camera className="size-5 text-emerald-500" />
                          <h3 className="text-base font-black text-slate-900 tracking-tight">Profile Identity Image</h3>
                        </div>
                        
                        <div 
                          className="flex-1 min-h-[280px] border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-[2rem] bg-indigo-50/10 flex flex-col items-center justify-center p-8 transition-all group cursor-pointer hover:bg-indigo-50/30"
                          onClick={() => triggerPhotoUpload(isEditMode ? currentStudentId! : "new")}
                        >
                          {(localPhotoPreview || newStudentFormData.ProfilePhotoPath) ? (
                            <div className="w-full h-full relative rounded-xl overflow-hidden shadow-xl">
                              <img 
                                src={localPhotoPreview || resolvePhotoUrl(newStudentFormData.ProfilePhotoPath)} 
                                alt="Student Identity" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <Upload className="text-white size-8" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-5 text-center">
                              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center relative">
                                <Camera size={32} className="text-indigo-600" />
                                <div className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-white">
                                  <Plus size={16} />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">No image uploaded</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Click to upload or change</p>
                                <p className="text-[10px] text-slate-300 font-medium">JPG, PNG (Max. 2MB)</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* IDENTITY & LEGAL SECTION */}
                    <div className="grid grid-cols-1 gap-10">
                      {/* Identity Details */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                          <BadgeInfo className="size-5 text-blue-600" />
                          <h3 className="text-base font-black text-slate-900 tracking-tight">Identity Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* GR Number */}
                          <div className="space-y-2">
                            <Label htmlFor="registrationNumber" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Registration (GR No.)</Label>
                            <div className="relative">
                              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 z-20" />
                              <Input 
                                ref={el => { inputRefs.current["registrationNumber"] = el; }}
                                id="registrationNumber" 
                                value={newStudentFormData.registrationNumber} 
                                onChange={(e) => {
                                  setNewStudentFormData({...newStudentFormData, registrationNumber: e.target.value});
                                  if (formErrors.registrationNumber) setFormErrors(prev => ({ ...prev, registrationNumber: "" }));
                                }} 
                                placeholder="G.R. Number" 
                                className={cn(
                                  "h-14 border-2 bg-white font-black text-slate-800 rounded-xl pl-12 text-[15px] shadow-sm focus:outline-none",
                                  formErrors.registrationNumber ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400"
                                )}
                              />
                            </div>
                            {formErrors.registrationNumber && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.registrationNumber}</p>}
                          </div>

                          {/* Roll Number */}
                          <div className="space-y-2">
                            <Label htmlFor="ROLLNO" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Roll Number</Label>
                            <div className="relative">
                              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 z-20 opacity-40" />
                              <Input 
                                ref={el => { inputRefs.current["ROLLNO"] = el; }}
                                id="ROLLNO" 
                                value={newStudentFormData.ROLLNO} 
                                onChange={(e) => {
                                  setNewStudentFormData({...newStudentFormData, ROLLNO: e.target.value});
                                  if (formErrors.ROLLNO) setFormErrors(prev => ({ ...prev, ROLLNO: "" }));
                                }} 
                                placeholder="Roll No" 
                                className={cn(
                                  "h-14 border-2 bg-white font-black text-slate-800 rounded-xl pl-12 text-[15px] shadow-sm focus:outline-none",
                                  formErrors.ROLLNO ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400"
                                )}
                              />
                            </div>
                            {formErrors.ROLLNO && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.ROLLNO}</p>}
                          </div>

                          {/* Gender */}
                          <div className="space-y-2">
                            <Label htmlFor="GENDER" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Gender</Label>
                            <div className="relative">
                             <Select 
  value={newStudentFormData.GENDER} 
  onValueChange={(v) => {
    setNewStudentFormData({
      ...newStudentFormData, 
      GENDER: v
    });

    setFormErrors(prev => ({ 
      ...prev, 
      GENDER: "" 
    }));
  }}
>
  <SelectTrigger 
    ref={el => { inputRefs.current["GENDER"] = el; }}
    id="GENDER" 
    className={cn(
      "relative h-[66px] min-h-[66px] border-2 bg-gradient-to-b from-white to-slate-50/90 font-bold rounded-2xl pl-14 pr-5 text-[14px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)] transition-all duration-300 data-[state=open]:shadow-[0_18px_45px_rgba(99,102,241,0.14)]",
      formErrors.GENDER ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-sm">
      <Users className="w-4 h-4 text-indigo-600" />
    </div>

    {/* Content */}
    <div className="flex flex-col items-start justify-center leading-tight w-full truncate">

      <span className="text-[10px] uppercase tracking-[0.14em] font-black text-slate-400">
        Gender Identity
      </span>

      <div className="truncate text-[14px] font-extrabold text-slate-800">
        <SelectValue placeholder="Select Gender">
          {newStudentFormData.GENDER || "Select Gender"}
        </SelectValue>
      </div>
    </div>

  </SelectTrigger>

  <SelectContent className="min-w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
    <SelectItem
      value=""
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all duration-200"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Gender
      </span>
    </SelectItem>

    {/* Male */}
    <SelectItem
      value="Male"
      className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-700 transition-all duration-200"
    >
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
          <Mars className="w-4 h-4 text-blue-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold text-slate-800">
            Male
          </span>

          <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
            Gender Option
          </span>
        </div>

      </div>
    </SelectItem>

    {/* Female */}
    <SelectItem
      value="Female"
      className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-pink-50 focus:text-pink-700 transition-all duration-200"
    >
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
          <Venus className="w-4 h-4 text-pink-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold text-slate-800">
            Female
          </span>

          <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
            Gender Option
          </span>
        </div>

      </div>
    </SelectItem>

    {/* Other */}
    <SelectItem
      value="Other"
      className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-violet-50 focus:text-violet-700 transition-all duration-200"
    >
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
          <UserRound className="w-4 h-4 text-violet-600" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold text-slate-800">
            Other
          </span>

          <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
            Gender Option
          </span>
        </div>

      </div>
    </SelectItem>

  </SelectContent>
</Select>
                            </div>
                            {formErrors.GENDER && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.GENDER}</p>}
                          </div>

                          {/* Aadhar ID */}
                          <div className="space-y-2">
                            <Label htmlFor="aadharcard" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Aadhar ID</Label>
                            <div className="relative">
                              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 z-20 opacity-40" />
                              <Input 
                                ref={el => { inputRefs.current["aadharcard"] = el; }}
                                id="aadharcard" 
                                value={newStudentFormData.aadharcard} 
                                maxLength={12}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                                  setNewStudentFormData({...newStudentFormData, aadharcard: val});
                                  if (formErrors.aadharcard) setFormErrors(prev => ({ ...prev, aadharcard: "" }));
                                }} 
                                placeholder="12-digit number" 
                                className={cn(
                                  "h-14 border-2 bg-white font-bold rounded-xl pl-12 text-[15px] shadow-sm text-slate-800 focus:outline-none",
                                  formErrors.aadharcard ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                                )}
                              />
                            </div>
                            {formErrors.aadharcard && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.aadharcard}</p>}
                          </div>

                          {/* RFID Card ID */}
                          <div className="space-y-2">
                            <Label htmlFor="RFID" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">RFID Card ID</Label>
                            <div className="relative">
                              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 z-20 opacity-40" />
                              <Input 
                                ref={el => { inputRefs.current["RFID"] = el; }}
                                id="RFID" 
                                value={newStudentFormData.RFID} 
                                onChange={(e) => {
                                  setNewStudentFormData({...newStudentFormData, RFID: e.target.value});
                                  if (formErrors.RFID) setFormErrors(prev => ({ ...prev, RFID: "" }));
                                }} 
                                placeholder="RFID Scan Code" 
                                className={cn(
                                  "h-14 border-2 bg-white font-bold rounded-xl pl-12 text-[15px] shadow-sm text-slate-800 focus:outline-none",
                                  formErrors.RFID ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                                )}
                              />
                            </div>
                          </div>

                          {/* Uniform ID */}
                          <div className="space-y-2">
                            <Label htmlFor="uniformid" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Uniform ID</Label>
                            <div className="relative">
                              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 z-20 opacity-40" />
                              <Input 
                                ref={el => { inputRefs.current["uniformid"] = el; }}
                                id="uniformid" 
                                value={newStudentFormData.uniformid} 
                                onChange={(e) => {
                                  setNewStudentFormData({...newStudentFormData, uniformid: e.target.value});
                                  if (formErrors.uniformid) setFormErrors(prev => ({ ...prev, uniformid: "" }));
                                }} 
                                placeholder="Uniform Tag ID" 
                                className={cn(
                                  "h-14 border-2 bg-white font-bold rounded-xl pl-12 text-[15px] shadow-sm text-slate-800 focus:outline-none",
                                  formErrors.uniformid ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                                )}
                              />
                            </div>
                          </div>

                          {/* School Section */}
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">School Section</Label>
                        <Select 
  value={newStudentFormData.SchoolSectionId} 
  onValueChange={(v) =>
    setNewStudentFormData({
      ...newStudentFormData,
      SchoolSectionId: v || ""
    })
  }
>
  <SelectTrigger 
    ref={el => { inputRefs.current["SchoolSectionId"] = el; }}
    className={cn(
      "relative h-[66px] min-h-[66px] border-2 bg-gradient-to-b from-white to-slate-50/90 font-bold rounded-2xl pl-14 pr-5 text-[14px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_35px_rgba(59,130,246,0.10)] transition-all duration-300 data-[state=open]:shadow-[0_18px_45px_rgba(59,130,246,0.14)]",
      formErrors.SchoolSectionId ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >

    {/* Left Icon */}
    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 shadow-sm">
      <Layers className="w-4 h-4 text-blue-600" />
    </div>

    {/* Content */}
    <div className="flex flex-col items-start justify-center leading-tight w-full truncate">



      <div className="truncate text-[14px] font-extrabold text-slate-800">
        <SelectValue placeholder="Select Section">
          {newStudentFormData.SchoolSectionId
            ? schoolSections.find(
                s =>
                  s.id.toString() ===
                  newStudentFormData.SchoolSectionId.toString()
              )?.name
            : "Select Section"}
        </SelectValue>
      </div>
    </div>

  </SelectTrigger>

  <SelectContent className="min-w-[320px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
    <SelectItem
      value=""
      className="group rounded-2xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all duration-200"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Section
      </span>
    </SelectItem>

    {schoolSections.map(s => (
      <SelectItem
        key={s.id}
        value={s.id.toString()}
        className="group rounded-2xl py-3.5 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-700 transition-all duration-200"
      >
        <div className="flex items-center gap-3">

          {/* Item Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
            <LayoutPanelLeft className="w-4 h-4 text-blue-600" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-slate-800">
              {s.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Academic Section
            </span>
          </div>

        </div>
      </SelectItem>
    ))}

  </SelectContent>
</Select>
                            {formErrors.SchoolSectionId && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.SchoolSectionId}</p>}
                          </div>

                          {/* School House */}
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">School House</Label>
                          <Select 
  value={newStudentFormData.house} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      house: v || ""
    })
  }
>
  <SelectTrigger 
    className={cn(
      "relative h-16 min-h-[64px] border-2",
      "bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5",
      "text-[14px] text-slate-800",
      "shadow-[0_4px_20_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30_rgba(16,185,129,0.10)]",
      "transition-all duration-300",
      "data-[state=open]:shadow-[0_12px_35px_rgba(16,185,129,0.14)]",
      formErrors.house ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-sm border border-emerald-200/50">
        <House className="w-4 h-4 text-emerald-700" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate">
      

        <SelectValue placeholder="Select House" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl"
  >
    <SelectItem 
      value="" 
      className="group rounded-xl py-3.5 px-4 cursor-pointer transition-all focus:bg-slate-50"
    >
      <span className="text-sm font-bold text-slate-500">
        Select House
      </span>
    </SelectItem>

    {houses.map(h => (
      <SelectItem 
        key={h.id} 
        value={h.id.toString()}
        className="group rounded-xl py-3 px-3 cursor-pointer transition-all focus:bg-emerald-50"
      >
        <div className="flex items-center gap-3 w-full">
          
          {/* House Color */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-white shadow-sm overflow-hidden">
            <div 
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: h.color }}
            />
            <House className="relative w-4 h-4 text-white drop-shadow-sm" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800">
              {h.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Student House
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                            {formErrors.house && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.house}</p>}
                          </div>

                          {/* Admission Type */}
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Admission Type</Label>
                           <Select 
  value={newStudentFormData.admissiontype} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      admissiontype: v || ""
    })
  }
>
  <SelectTrigger 
    ref={el => { inputRefs.current["admissiontype"] = el; }}
    className={cn(
      "relative h-16 min-h-[64px] border-2",
      "bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5",
      "text-[14px] text-slate-800",
      "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30px_rgba(59,130,246,0.10)]",
      "transition-all duration-300",
      "data-[state=open]:shadow-[0_12px_35px_rgba(59,130,246,0.14)]",
      formErrors.admissiontype ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-sm border border-blue-200/50">
        <ClipboardCheck className="w-4 h-4 text-blue-700" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate">
       

        <SelectValue placeholder="Select Type" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl"
  >
    <SelectItem 
      value="" 
      className="group rounded-xl py-3.5 px-4 cursor-pointer transition-all focus:bg-slate-50"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Type
      </span>
    </SelectItem>

    {admissionTypes.map(t => (
      <SelectItem 
        key={t.id} 
        value={t.id.toString()}
        className="group rounded-xl py-3 px-3 cursor-pointer transition-all focus:bg-blue-50"
      >
        <div className="flex items-center gap-3 w-full">
          
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm border border-blue-200/40 group-focus:scale-105 transition-transform">
            <FileCheck className="w-4 h-4 text-blue-700" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800">
              {t.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Student Admission
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                            {formErrors.admissiontype && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.admissiontype}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                      {/* Regal Profile */}
                      <div className="space-y-6 pt-5 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                          <Plus className="size-5 text-emerald-500" />
                          <h3 className="text-base font-black text-slate-900 tracking-tight">Regal Profile</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="FNAME" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">First Name</Label>
                            <Input 
                              ref={el => { inputRefs.current["FNAME"] = el; }}
                              id="FNAME" 
                              value={newStudentFormData.FNAME} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, FNAME: e.target.value});
                                if (formErrors.FNAME) setFormErrors(prev => ({ ...prev, FNAME: "" }));
                              }} 
                              placeholder="First name" 
                              className={cn(
                                "h-14 border-2 font-bold rounded-xl px-6 text-[15px] shadow-sm focus:outline-none",
                                formErrors.FNAME ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                              )}
                            />
                            {formErrors.FNAME && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.FNAME}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="MNAME" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Middle Name</Label>
                            <Input id="MNAME" value={newStudentFormData.MNAME} onChange={(e) => setNewStudentFormData({...newStudentFormData, MNAME: e.target.value})} placeholder="Middle name" className="h-14 border-2 border-slate-200 font-bold rounded-xl px-6 text-[15px] shadow-sm" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="LNAME" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Last Name</Label>
                            <Input 
                              ref={el => { inputRefs.current["LNAME"] = el; }}
                              id="LNAME" 
                              value={newStudentFormData.LNAME} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, LNAME: e.target.value});
                                if (formErrors.LNAME) setFormErrors(prev => ({ ...prev, LNAME: "" }));
                              }} 
                              placeholder="Last name" 
                              className={cn(
                                "h-14 border-2 font-bold rounded-xl px-6 text-[15px] shadow-sm focus:outline-none",
                                formErrors.LNAME ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                              )}
                            />
                            {formErrors.LNAME && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.LNAME}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="DOB" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Date of Birth</Label>
                            <Input 
                              ref={el => { inputRefs.current["DOB"] = el; }}
                              id="DOB" 
                              type="date" 
                              value={newStudentFormData.DOB} 
                              onChange={(e) => {
                                setNewStudentFormData({...newStudentFormData, DOB: e.target.value});
                                if (formErrors.DOB) setFormErrors(prev => ({ ...prev, DOB: "" }));
                              }} 
                              className={cn(
                                "h-14 border-2 bg-white font-bold rounded-xl px-6 text-[15px] shadow-sm focus:outline-none",
                                formErrors.DOB ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                              )}
                            />
                            {formErrors.DOB && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.DOB}</p>}
                          </div>
                           <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Religion</Label>
                        <Select 
  value={newStudentFormData.RELIGION} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      RELIGION: v
    })
  }
>
  <SelectTrigger 
    ref={el => { inputRefs.current["RELIGION"] = el; }}
    className={cn(
      "relative h-16 min-h-[64px] border-2",
      "bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5",
      "text-[14px] text-slate-800",
      "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30px_rgba(99,102,241,0.10)]",
      "transition-all duration-300",
      "data-[state=open]:shadow-[0_12px_35px_rgba(99,102,241,0.14)]",
      formErrors.RELIGION ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-sm border border-indigo-200/50">
        <Church className="w-4 h-4 text-indigo-700" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate">
       

        <SelectValue placeholder="Select Religion" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl"
  >
    <SelectItem 
      value="" 
      className="group rounded-xl py-3.5 px-4 cursor-pointer transition-all focus:bg-slate-50"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Religion
      </span>
    </SelectItem>

    {religions.map(r => (
      <SelectItem 
        key={r.id} 
        value={r.id.toString()}
        className="group rounded-xl py-3 px-3 cursor-pointer transition-all focus:bg-indigo-50"
      >
        <div className="flex items-center gap-3 w-full">
          
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shadow-sm border border-indigo-200/40 group-focus:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-indigo-700" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800">
              {r.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Faith & Community
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
{formErrors.RELIGION && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.RELIGION}</p>}
                          </div>
                           <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Blood Group</Label>
                          <Select 
  value={newStudentFormData.BLOODGROUP} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      BLOODGROUP: v
    })
  }
>
  <SelectTrigger 
    ref={el => { inputRefs.current["BLOODGROUP"] = el; }}
    className={cn(
      "relative h-16 min-h-[64px] border-2",
      "bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5",
      "text-[14px] text-slate-800",
      "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30px_rgba(239,68,68,0.10)]",
      "transition-all duration-300",
      "data-[state=open]:shadow-[0_12px_35px_rgba(239,68,68,0.14)]",
      formErrors.BLOODGROUP ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 shadow-sm border border-red-200/50">
        <Droplets className="w-4 h-4 text-red-700" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate">
       

        <SelectValue placeholder="Select Blood Group" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl"
  >
    <SelectItem 
      value="" 
      className="group rounded-xl py-3.5 px-4 cursor-pointer transition-all focus:bg-slate-50"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Blood Group
      </span>
    </SelectItem>

    {bloodGroups.map(bg => (
      <SelectItem 
        key={bg.id} 
        value={bg.id.toString()}
        className="group rounded-xl py-3 px-3 cursor-pointer transition-all focus:bg-red-50"
      >
        <div className="flex items-center gap-3 w-full">
          
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center shadow-sm border border-red-200/40 group-focus:scale-105 transition-transform">
            <HeartPulse className="w-4 h-4 text-red-700" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800">
              {bg.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Health Category
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
{formErrors.BLOODGROUP && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.BLOODGROUP}</p>}
                          </div>
                           <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Caste</Label>
                       <Select 
  value={newStudentFormData.CASTE} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      CASTE: v
    })
  }
>
  <SelectTrigger 
    className={cn(
      "relative h-16 min-h-[64px] border-2 border-slate-200",
      "bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5",
      "text-[14px] text-slate-800",
      "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30px_rgba(16,185,129,0.10)]",
      "transition-all duration-300",
      "focus:ring-4 focus:ring-indigo-500/10",
      "focus:border-indigo-400",
      "data-[state=open]:border-indigo-400",
      "data-[state=open]:shadow-[0_12px_35px_rgba(16,185,129,0.14)]"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-sm border border-emerald-200/50">
        <Users2 className="w-4 h-4 text-emerald-700" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate">
       

        <SelectValue placeholder="Select Caste" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl"
  >
    <SelectItem 
      value="" 
      className="group rounded-xl py-3.5 px-4 cursor-pointer transition-all focus:bg-slate-50"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Caste
      </span>
    </SelectItem>

    {castes.map(c => (
      <SelectItem 
        key={c.id} 
        value={c.id.toString()}
        className="group rounded-xl py-3 px-3 cursor-pointer transition-all focus:bg-emerald-50"
      >
        <div className="flex items-center gap-3 w-full">
          
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center shadow-sm border border-emerald-200/40 group-focus:scale-105 transition-transform">
            <BadgeInfo className="w-4 h-4 text-emerald-700" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800">
              {c.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Social Classification
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
{formErrors.CASTE && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.CASTE}</p>}
                          </div>
                           <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Category</Label>
                      <Select 
  value={newStudentFormData.CATEGORY} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      CATEGORY: v
    })
  }
>
  <SelectTrigger 
    ref={el => { inputRefs.current["CATEGORY"] = el; }}
    className={cn(
      "relative h-16 min-h-[64px] border-2",
      "bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5",
      "text-[14px] text-slate-800",
      "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30px_rgba(249,115,22,0.10)]",
      "transition-all duration-300",
      "data-[state=open]:shadow-[0_12px_35px_rgba(249,115,22,0.14)]",
      formErrors.CATEGORY ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-sm border border-orange-200/50">
        <Tags className="w-4 h-4 text-orange-700" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate">
      

        <SelectValue placeholder="Select Category" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl"
  >
    <SelectItem 
      value="" 
      className="group rounded-xl py-3.5 px-4 cursor-pointer transition-all focus:bg-slate-50"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Category
      </span>
    </SelectItem>

    {categories.map(c => (
      <SelectItem 
        key={c.id} 
        value={c.id.toString()}
        className="group rounded-xl py-3 px-3 cursor-pointer transition-all focus:bg-orange-50"
      >
        <div className="flex items-center gap-3 w-full">
          
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-sm border border-orange-200/40 group-focus:scale-105 transition-transform">
            <FolderKanban className="w-4 h-4 text-orange-700" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800">
              {c.name}
            </span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
              Student Category
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
{formErrors.CATEGORY && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.CATEGORY}</p>}
                          </div>
                           <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Sub-Caste</Label>
                     <Select 
  value={newStudentFormData.subcaste} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      subcaste: v
    })
  } 
  disabled={!newStudentFormData.CASTE}
>
  <SelectTrigger 
    ref={el => { inputRefs.current["subcaste"] = el; }}
    className={cn(
      "relative h-16 min-h-[64px] border-2",
      "bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5",
      "text-[14px] text-slate-800",
      "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
      "hover:shadow-[0_10px_30px_rgba(71,85,105,0.10)]",
      "transition-all duration-300",
      "data-[state=open]:shadow-[0_12px_35px_rgba(71,85,105,0.14)]",
      formErrors.subcaste ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400",
      !newStudentFormData.CASTE && "opacity-60 cursor-not-allowed bg-slate-100"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 shadow-sm border border-slate-200/60">
        <UserCheck className="w-4 h-4 text-slate-700" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          Sub-Caste
        </span>

        <SelectValue 
          placeholder={
            newStudentFormData.CASTE 
              ? "Select Sub-Caste" 
              : "Select Caste First"
          } 
        />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl"
  >
    <SelectItem 
      value="" 
      className="group rounded-xl py-3.5 px-4 cursor-pointer transition-all focus:bg-slate-50"
    >
      <span className="text-sm font-bold text-slate-500">
        Select Sub-Caste
      </span>
    </SelectItem>

    {subCastes
      .filter(
        sc => 
          sc.casteId?.toString() === 
          newStudentFormData.CASTE?.toString()
      )
      .map(sc => (
        <SelectItem 
          key={sc.id} 
          value={sc.id.toString()}
          className="group rounded-xl py-3 px-3 cursor-pointer transition-all focus:bg-slate-50"
        >
          <div className="flex items-center gap-3 w-full">
            
            {/* Icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center shadow-sm border border-slate-200/50 group-focus:scale-105 transition-transform">
              <BadgeCheck className="w-4 h-4 text-slate-700" />
            </div>

            {/* Text */}
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-extrabold text-slate-800">
                {sc.name}
              </span>

              <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
                Sub Classification
              </span>
            </div>
          </div>
        </SelectItem>
      ))
    }
  </SelectContent>
</Select>
                          </div>
                        </div>
                      </div>
                        {/* Family & Contact */}
                    <div className="space-y-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
                        <Users className="size-5 text-pink-500" />
                        <h3 className="text-base font-black text-slate-900 tracking-tight">Family & Contact</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="MOTHERNAME" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Mother's Name</Label>
                          <Input 
                            ref={el => { inputRefs.current["MOTHERNAME"] = el; }}
                            id="MOTHERNAME" 
                            value={newStudentFormData.MOTHERNAME} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, MOTHERNAME: e.target.value});
                              if (formErrors.MOTHERNAME) setFormErrors(prev => ({ ...prev, MOTHERNAME: "" }));
                            }} 
                            placeholder="Mother's Name" 
                            className={cn(
                              "h-14 border-2 font-bold rounded-xl px-6 text-[15px] shadow-sm focus:outline-none",
                              formErrors.MOTHERNAME ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                            )}
                          />
                          {formErrors.MOTHERNAME && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.MOTHERNAME}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Father's Contact No.</Label>
                           <Input 
                            ref={el => { inputRefs.current["MOBILE"] = el; }}
                            value={newStudentFormData.MOBILE} 
                            maxLength={10}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setNewStudentFormData({...newStudentFormData, MOBILE: val});
                              if (formErrors.MOBILE) setFormErrors(prev => ({ ...prev, MOBILE: "" }));
                            }} 
                            placeholder="10-digit number" 
                            className={cn(
                              "h-14 border-2 font-bold rounded-xl px-6 text-[15px] shadow-sm focus:outline-none",
                              formErrors.MOBILE ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                            )}
                          />
                          {formErrors.MOBILE && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.MOBILE}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Mother's Contact No.</Label>
                          <Input 
                            value={newStudentFormData.contact2} 
                            maxLength={10}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setNewStudentFormData({...newStudentFormData, contact2: val});
                            }} 
                            placeholder="10-digit number" 
                            className="h-14 border-2 border-slate-200 font-bold rounded-xl px-6 text-[15px] shadow-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Facility & Affiliation Preferences */}
                    <div className="space-y-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                        <Settings2 className="size-5 text-indigo-600" />
                        <h3 className="text-base font-black text-slate-900 tracking-tight">Facility & Affiliation Preferences</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'sms', label: 'SMS Alert', sub: 'Notifications', color: 'indigo' },
                            { id: 'isStateBoard', label: 'State Board', sub: 'Academics', color: 'indigo' },
                            { id: 'digitalUniform', label: 'Digital Uniform', sub: 'Smart Wear', color: 'indigo' },
                            { id: 'digitalNotebook', label: 'Digital Notebook', sub: 'e-Learning', color: 'indigo' }
                          ].map(pref => (
                            <label key={pref.id} className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50/50 rounded-2xl border-2 border-slate-200/60 hover:bg-white hover:border-indigo-400 transition-all duration-300 select-none">
                              <div className={cn(
                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                                newStudentFormData[pref.id as keyof typeof newStudentFormData] ? "bg-indigo-600 border-indigo-600 shadow-lg" : "bg-white border-slate-300"
                              )}>
                                <input 
                                  type="checkbox"
                                  checked={!!newStudentFormData[pref.id as keyof typeof newStudentFormData]}
                                  onChange={(e) => setNewStudentFormData({...newStudentFormData, [pref.id]: e.target.checked})}
                                  className="hidden"
                                />
                                {newStudentFormData[pref.id as keyof typeof newStudentFormData] && <Check className="w-4 h-4 text-white stroke-[4]" />}
                              </div>
                              <div className="flex flex-col">
                                <span className={cn("text-[12px] font-black tracking-tight leading-none", newStudentFormData[pref.id as keyof typeof newStudentFormData] ? "text-indigo-600" : "text-slate-600")}>{pref.label}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">{pref.sub}</span>
                              </div>
                            </label>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Residential Address</Label>
                          <Input 
                            ref={el => { inputRefs.current["ADDRESS"] = el; }}
                            value={newStudentFormData.ADDRESS} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, ADDRESS: e.target.value});
                              if (formErrors.ADDRESS) setFormErrors(prev => ({ ...prev, ADDRESS: "" }));
                            }} 
                            placeholder="Complete residential address" 
                            className={cn(
                              "h-[104px] border-2 border-slate-200 bg-white font-bold rounded-xl px-6 text-[15px] shadow-sm",
                              formErrors.ADDRESS && "border-red-500"
                            )}
                          />
                          {formErrors.ADDRESS && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.ADDRESS}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Additional & Geographical Information */}
                    <div className="space-y-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-teal-600 rounded-full"></div>
                        <MapPin className="size-5 text-teal-600" />
                        <h3 className="text-base font-black text-slate-900 tracking-tight">Additional & Geographical Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Email Address</Label>
                          <Input 
                            ref={el => { inputRefs.current["Email"] = el; }}
                            value={newStudentFormData.Email} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, Email: e.target.value});
                              if (formErrors.Email) setFormErrors(prev => ({ ...prev, Email: "" }));
                            }} 
                            placeholder="Email address" 
                            className={cn(
                              "h-14 border-2 font-bold rounded-xl px-6 text-[15px] shadow-sm focus:outline-none",
                              formErrors.Email ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Admission Date</Label>
                          <Input 
                            ref={el => { inputRefs.current["AdmissionDate"] = el; }}
                            type="date"
                            value={newStudentFormData.AdmissionDate} 
                            onChange={(e) => {
                              setNewStudentFormData({...newStudentFormData, AdmissionDate: e.target.value});
                              if (formErrors.AdmissionDate) setFormErrors(prev => ({ ...prev, AdmissionDate: "" }));
                            }} 
                            className={cn(
                              "h-14 border-2 font-bold rounded-xl px-6 text-[15px] shadow-sm focus:outline-none",
                              formErrors.AdmissionDate ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
                            )}
                          />
                          {formErrors.AdmissionDate && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.AdmissionDate}</p>}
                        </div>
                         <div className="space-y-2">
                          <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">State Name</Label>
                   <Select 
  value={newStudentFormData.StateId} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      StateId: v, 
      CityId: ""
    })
  }
>
  <SelectTrigger 
    ref={el => { inputRefs.current["StateId"] = el; }}
    className={cn(
      "relative h-16 min-h-[64px] border-2 bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5 text-[14px] text-slate-800",
      "shadow-sm hover:shadow-md transition-all duration-300",
      "data-[state=open]:shadow-lg",
      formErrors.StateId ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 data-[state=open]:border-indigo-400"
    )}
  >
    <div className="flex items-center gap-3 w-full">
      
      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-100 shadow-sm border border-indigo-200/50">
        <MapPinned className="w-4 h-4 text-indigo-600" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate flex-1">
     

        <SelectValue placeholder="Select State" />
      </div>

      {/* Right Arrow */}
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100">
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[260px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
  >
    <SelectItem
      value=""
      className="group rounded-xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all font-bold text-slate-500 text-sm"
    >
      Select State
    </SelectItem>

    {Array.isArray(states) && states.map((st) => (
      <SelectItem 
        key={st.id} 
        value={st.id.toString()}
        className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-indigo-50 transition-all"
      >
        <div className="flex items-center gap-3">
          
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
            <Flag className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-slate-700">
              {st.name}
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              State
            </span>
          </div>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
{formErrors.StateId && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.StateId}</p>}
                        </div>
                         <div className="space-y-2">
                           <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">City Name</Label>
                       <Select 
  value={newStudentFormData.CityId} 
  onValueChange={(v) => 
    setNewStudentFormData({
      ...newStudentFormData, 
      CityId: v
    })
  } 
  disabled={!newStudentFormData.StateId}
>
  <SelectTrigger 
    ref={el => { inputRefs.current["CityId"] = el; }}
    className={cn(
      "relative h-16 min-h-[64px] border-2 bg-gradient-to-b from-white to-slate-50/80",
      "font-bold rounded-2xl pl-14 pr-5 text-[14px] text-slate-800",
      "shadow-sm hover:shadow-md transition-all duration-300",
      "data-[state=open]:shadow-lg",
      formErrors.CityId ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 data-[state=open]:border-red-500" : "border-slate-200 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 data-[state=open]:border-sky-400",
      !newStudentFormData.StateId && "opacity-60 cursor-not-allowed bg-slate-100"
    )}
  >
    <div className="flex items-center gap-3 w-full">

      {/* Left Icon */}
      <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-xl bg-sky-100 shadow-sm border border-sky-200/50">
        <Building2 className="w-4 h-4 text-sky-600" />
      </div>

      {/* Value */}
      <div className="flex flex-col items-start text-left leading-tight truncate flex-1">
       

        <SelectValue 
          placeholder={
            newStudentFormData.StateId 
              ? "Select City" 
              : "Select State First"
          } 
        />
      </div>

      {/* Right Arrow */}
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100">
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </div>
    </div>
  </SelectTrigger>

  <SelectContent 
    className="min-w-[260px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
  >
    <SelectItem
      value=""
      className="group rounded-xl py-3.5 px-4 cursor-pointer focus:bg-slate-50 transition-all font-bold text-slate-500 text-sm"
    >
      Select City
    </SelectItem>

    {Array.isArray(cities) &&
      cities
        .filter(
          (c) => c.stateId?.toString() === newStudentFormData.StateId
        )
        .map((c) => (
          <SelectItem 
            key={c.id} 
            value={c.id.toString()}
            className="group rounded-xl py-3 px-3 cursor-pointer focus:bg-sky-50 transition-all"
          >
            <div className="flex items-center gap-3">

              <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center shadow-sm">
                <MapPin className="w-4 h-4 text-sky-600" />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-bold text-slate-700">
                  {c.name}
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  City
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
  </SelectContent>
</Select>
{formErrors.CityId && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.CityId}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PREMIUM FOOTER */}
                <DialogFooter className="bg-white px-10 py-7 shrink-0 border-t border-slate-100 flex flex-row items-center justify-end gap-5">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAddDialogOpen(false)} 
                    className="h-14 px-10 font-black text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-[13px] uppercase tracking-[0.15em] transition-all active:scale-95"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddStudent} 
                    disabled={isProcessing} 
                    className="h-14 px-12 bg-indigo-600 hover:bg-indigo-700 font-black shadow-2xl shadow-indigo-600/30 rounded-xl transition-all active:scale-[0.98] text-[13px] uppercase tracking-[0.15em] relative group/btn"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white animate-spin rounded-full"></div>
                        <span>Finalizing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus size={20} className="transition-transform group-hover/btn:rotate-90 duration-300" />
                        <span>{isEditMode ? "Update Master" : "Enroll Student"}</span>
                      </div>
                    )}
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
                  className="pl-11 h-11 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium rounded-xl" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={standardFilter} onValueChange={setStandardFilter}>
                  <SelectTrigger className="w-[140px] h-11 bg-slate-50/50 border-slate-200/60 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-blue-500/5">
                    {/* Explicit mapping to show "Grade X" or "All Grades" in trigger */}
                    <SelectValue placeholder="Standard">
                      {standardFilter === "all" ? "All Grades" : (standardFilter ? `Grade ${standardFilter}` : undefined)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-2">
                    <SelectItem value="all" className="rounded-xl font-bold py-2.5">All Grades</SelectItem>
                    {Array.isArray(standardsMaster) && standardsMaster.map(std => (
                      <SelectItem key={std.id} value={std.name} className="rounded-xl font-bold py-2.5">Grade {std.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                  <SelectTrigger className="w-[140px] h-11 bg-slate-50/50 border-slate-200/60 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-blue-500/5">
                    {/* Explicit mapping to show "Section X" or "All Sections" in trigger */}
                    <SelectValue placeholder="Section">
                      {sectionFilter === "all" ? "All Sections" : (sectionFilter ? `Section ${sectionFilter}` : undefined)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-2">
                    <SelectItem value="all" className="rounded-xl font-bold py-2.5">All Sections</SelectItem>
                    {Array.isArray(sectionsMaster) && sectionsMaster.map(sec => (
                      <SelectItem key={sec.id} value={sec.name} className="rounded-xl font-bold py-2.5">Section {sec.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50/80 px-5 py-2.5 rounded-xl border border-slate-100">
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
                        <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-100 shadow-2xl p-2">
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
