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
  IndianRupee, 
  CreditCard, 
  Download, 
  Plus,
  ArrowUpRight,
  History,
  AlertCircle,
  Loader2
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
          <div className="bg-[#5a67f2] p-4 rounded-[1.25rem] text-white shadow-2xl shadow-[#5a67f2]/20 transition-transform hover:rotate-3">
             <DollarSign size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">Fee Management</h1>
            <p className="text-slate-400 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">Track payments, issue invoices and monitor financial health.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user.role === "superadmin" && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Branch:</span>
              <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                <SelectTrigger className="h-9 w-[180px] border-none bg-slate-50 font-bold text-xs rounded-xl focus:ring-0">
                  {/* Explicitly show school name to avoid ID display issues */}
                  <SelectValue placeholder="Select School Branch">
                    {selectedSchoolId ? schools.find(s => s.id.toString() === selectedSchoolId)?.name : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 shadow-2xl p-2">
                  <SelectItem value="" className="font-semibold py-2 px-3 rounded-lg text-slate-400 italic">Select School Branch</SelectItem>
                  {Array.isArray(schools) && schools.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()} className="font-semibold py-2 px-3 rounded-lg">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center gap-2">
              {isManagement && (
                <>
                  <Button variant="outline" className="gap-2"><History size={16} /> History</Button>
                  <Button className="bg-slate-900 hover:bg-slate-800 gap-2"><Plus size={16} /> Collect Fees</Button>
                </>
              )}
              {isParent && (
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2"><CreditCard size={16} /> Pay Online</Button>
              )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-600 text-white shadow-xl shadow-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-100 text-xs uppercase tracking-widest font-bold">Total Collection (Term 1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-black">₹{(Array.isArray(fees) ? fees : []).reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString()}</h2>
                    <p className="text-blue-200 text-sm mt-1 flex items-center gap-1">
                        <ArrowUpRight size={14} /> 12% increase from last term
                    </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                    <IndianRupee size={24} />
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
                    <h2 className="text-4xl font-black text-amber-400">₹{(Array.isArray(fees) ? fees : []).reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0).toLocaleString()}</h2>
                    <p className="text-slate-400 text-sm mt-1">From {Array.isArray(fees) ? fees.length : 0} students</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl">
                    <AlertCircle size={24} className="text-amber-400" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl shadow-slate-200/60 border-none rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Scholarships Issued</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">₹0</h2>
                    <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Financial Aid</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl shadow-sm">
                    <CreditCard size={28} className="text-slate-400" />
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
                <TableRow className="bg-slate-50/50 h-14">
                  <TableHead className="pl-8 text-xs font-black text-slate-500 uppercase tracking-widest">Digital ID</TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Student Profile</TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Billing Term</TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Invoice</TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Paid to Date</TableHead>
                  <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest">Standing</TableHead>
                  <TableHead className="text-right pr-8 text-xs font-black text-slate-500 uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(fees) && fees.map((fee) => (
                  <TableRow key={fee.id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                    <TableCell className="pl-8 font-mono text-xs font-black text-blue-600 italic">GR-{fee.studentId}</TableCell>
                    <TableCell className="font-black text-slate-900 group-hover:text-blue-700 transition-colors">{fee.student?.fullName || "Student"}</TableCell>
                    <TableCell className="text-slate-500 font-bold text-sm tracking-tight">{fee.term}</TableCell>
                    <TableCell className="font-black text-slate-900">₹{fee.totalAmount}</TableCell>
                    <TableCell className="font-black text-emerald-600">₹{fee.paidAmount}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "font-black text-[10px] uppercase tracking-wider px-3",
                          fee.status === 'Paid' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}
                      >
                        {fee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="sm" className="text-blue-600 font-black hover:bg-blue-50">Print Receipt</Button>
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
