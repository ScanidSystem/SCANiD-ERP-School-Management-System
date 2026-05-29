import { useState, useEffect } from "react";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  Download, 
  Plus,
  ArrowUpRight,
  History,
  AlertCircle,
  Loader2,
  Wallet,
  Clock,
  IndianRupee,
  Building2,
  Globe2,
  School2,
  ArrowRight
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { cn, parseSafeInt } from "@/lib/utils";

export default function Fees({ user }: { user: any }) {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(user.schoolId?.toString() || "");
  const isManagement = user.role === "superadmin" || user.role === "admin";
  const isParent = user.role === "parent";

  useEffect(() => {
    const fetchSchools = async () => {
      if (user.role === "superadmin") {
        try {
          const res = await apiService.getSchools();
          const schoolData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          setSchools(schoolData);
        } catch (error) {
          console.error("Failed to fetch schools", error);
        }
      }
    };
    fetchSchools();
  }, [user.role]);
  
  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const schoolIdToUse = user.role === "superadmin" ? parseSafeInt(selectedSchoolId) : parseSafeInt(user.schoolId);
        const academicYearIdToUse = parseSafeInt(user.academicYearId);
        const res = await apiService.getFees(schoolIdToUse, academicYearIdToUse);
        setFees(res.data);
      } catch (error) {
        console.error("Fees error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isManagement) fetchFees();
  }, [user.schoolId, user.academicYearId, isManagement, selectedSchoolId, user.role]);

  if (!isManagement && !isParent) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-[#5a67f2] p-3 rounded-2xl text-white shadow-xl shadow-[#5a67f2]/20 transition-transform hover:rotate-3">
             <IndianRupee size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight truncate">Fee Management</h1>
            <p className="text-slate-600 font-bold mt-1 text-xs sm:text-sm uppercase  leading-none">Track payments, issue invoices and monitor financial health.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
        {user.role === "superadmin" && (
  <div
    className={cn(
      "flex items-center gap-2 md:gap-4",
      
   
      "transition-all duration-300"
    )}
  >

  


    {/* Select */}
    <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
      
      <SelectTrigger
        className={cn(
          "relative h-10 min-h-[40px] w-[140px] sm:w-[180px] lg:w-[220px]",
          "border border-slate-200",
          "bg-white",
          "rounded-xl pl-10 pr-4",
          "font-bold text-[14px] text-slate-800",
          "shadow-sm",
          "hover:border-indigo-300",
          "focus:ring-4 focus:ring-indigo-500/10",
          "focus:border-indigo-400",
          "transition-all duration-300",
          "data-[state=open]:border-indigo-400",
          "data-[state=open]:shadow-[0_14px_35px_rgba(99,102,241,0.14)]"
        )}
      >

        {/* Inner Left Icon */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100/50 shadow-sm text-indigo-600">
          <School2 className="w-3.5 h-3.5" />
        </div>

        {/* Value */}
        <div className="flex flex-col items-start text-left leading-tight truncate flex-1">
          
        

          <div className="truncate text-[13px] font-bold text-slate-800">
            <SelectValue placeholder="Select School Branch">
              {selectedSchoolId
                ? schools.find(
                    s => s.id.toString() === selectedSchoolId
                  )?.name
                : "Select School Branch"}
            </SelectValue>
          </div>
        </div>

       

      </SelectTrigger>

      <SelectContent className="min-w-[320px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">

        {/* Default Option */}
        <SelectItem
          value=""
          className="group rounded-2xl py-3 px-3 cursor-pointer transition-all duration-200 focus:bg-slate-50"
        >
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
              <Globe2 className="w-4 h-4 text-slate-500" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold text-slate-700">
                Select School Branch
              </span>

              <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
                Campus Directory
              </span>
            </div>
          </div>
        </SelectItem>

        {/* School Items */}
        {Array.isArray(schools) && schools.map(s => (
          <SelectItem
            key={s.id}
            value={s.id.toString()}
            className="group rounded-2xl py-3 px-3 cursor-pointer transition-all duration-200 focus:bg-indigo-50 focus:text-indigo-700"
          >
            <div className="flex items-center gap-3">

              {/* Item Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200/40 flex items-center justify-center shadow-sm group-focus:scale-105 transition-transform">
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
)}
          <div className="flex items-center gap-2">
              {isManagement && (
                <>
              <Button
  variant="outline"
  className={cn(
    "relative h-10 px-3 md:px-5 gap-1.5 md:gap-3",
    "rounded-xl border border-slate-200",
    "bg-gradient-to-b from-white to-slate-50/90",
    "font-black text-[11px] uppercase tracking-[0.16em]",
    "text-slate-700",
    "shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
    "hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)]",
    "hover:border-indigo-300 hover:text-indigo-700",
  
    
  )}
>

  {/* Left Icon */}
  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100/50 shadow-sm group-hover:scale-105 transition-transform duration-300">
    <History 
      size={14} 
      className="text-indigo-600 stroke-[2.5]" 
    />
  </div>

  {/* Text */}
  <span className="relative z-10">
    History
  </span>

  {/* Right Arrow Icon */}
  <div className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 transition-colors duration-300">
    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
  </div>

  {/* Hover Glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-50/40 via-transparent to-violet-50/40 pointer-events-none" />

</Button>
                <Button
  className={cn(
    "relative h-10 px-3 md:px-5 gap-1.5 md:gap-3",
    "rounded-xl border border-slate-800",
    "bg-gradient-to-b from-slate-900 to-slate-800",
    "font-black text-[11px] uppercase tracking-[0.16em]",
    "text-white",
    "shadow-[0_10px_30px_rgba(15,23,42,0.18)]",
    
    "transition-all duration-300",
    "group overflow-hidden"
  )}
>

  {/* Left Icon */}
  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 border border-white/10 backdrop-blur-sm shadow-sm group-hover:scale-105 transition-transform duration-300">
    <Plus 
      size={14} 
      className="text-white stroke-[2.7]" 
    />
  </div>

  {/* Text */}
  <span className="relative z-10">
    Collect Fees
  </span>

  {/* Right Icon */}
  <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-md bg-white/10 border border-white/10 group-hover:bg-white/15 transition-colors duration-300">
    <Wallet className="w-3 h-3 text-white/90" />
  </div>

 

</Button>
                </>
              )}
              {isParent && (
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2"><CreditCard size={16} /> Pay Online</Button>
              )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#5a67f2] text-white shadow-xl shadow-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-100 text-xs uppercase tracking-widest font-bold">Total Collection (Term 1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-semibold font-black">₹{(Array.isArray(fees) ? fees : []).reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString()}</h2>
                    <p className="text-blue-200 text-sm mt-1 flex items-center gap-1">
                        <ArrowUpRight size={14} /> 12% increase from last term
                    </p>
                </div>
                <div className="p-3 bg-[#9ca5ff]    rounded-xl">
                    <Wallet size={24} />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white shadow-xl shadow-slate-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-xs uppercase tracking-widest font-bold">Pending Dues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-semibold font-black text-amber-400">₹{(Array.isArray(fees) ? fees : []).reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0).toLocaleString()}</h2>
                    <p className="text-slate-400 text-sm mt-1">From {Array.isArray(fees) ? fees.length : 0} students</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl">
                    <Clock size={24} className="text-amber-400" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl shadow-slate-200/60 border-none rounded-[2.5rem] overflow-hidden bg-white group hover:shadow-indigo-500/10 transition-all duration-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black group-hover:text-indigo-600 transition-colors">Scholarships Issued</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-semibold font-black text-slate-900 tracking-tight group-hover:scale-105 transition-transform origin-left italic">₹0</h2>
                    <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Financial Aid</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl shadow-sm group-hover:bg-indigo-50 group-hover:rotate-6 transition-all duration-500">
                    <CreditCard size={28} className="text-emerald-400 group-hover:text-indigo-600" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl shadow-slate-200/60 border-none rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100 bg-white px-8 pt-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900">Financial Ledger</CardTitle>
            <CardDescription className="text-slate-500 font-medium tracking-tight">Consolidated payment history for current session.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200 font-bold hover:bg-slate-50">
            <Download size={16} /> Export Records
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-12 flex justify-center">
               <Loader2 className="animate-spin text-slate-300" size={32} />
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 h-20 border-slate-100">
                  <TableHead className="pl-10 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Digital ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 min-w-[200px]">Student Identity</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Billing Cycle</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Total Invoice</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Paid Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Standing</TableHead>
                  <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(fees) && fees.map((fee) => (
                  <TableRow key={fee.id} className="hover:bg-slate-50/40 transition-all group border-b border-slate-50 h-[88px] bg-white">
                    <TableCell className="pl-10">
                       <code className="text-[11px] font-black font-mono text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-100/40 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                         GR-{fee.studentId}
                       </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                          {fee.student?.fullName || "Verified Student"}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-0.5">Identity Protocol</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-black text-[12px] uppercase tracking-widest">
                      {fee.term}
                    </TableCell>
                    <TableCell className="font-black text-slate-900 text-[15px]">₹{fee.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="font-black text-emerald-600 text-[15px]">₹{fee.paidAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl border-none transition-all shadow-sm w-fit",
                        fee.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      )}>
                         <div className={cn(
                           "w-1.5 h-1.5 rounded-full animate-pulse",
                           fee.status === 'Paid' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                         )} />
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {fee.status}
                         </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100">
                         <Download size={16} />
                       </Button>
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
