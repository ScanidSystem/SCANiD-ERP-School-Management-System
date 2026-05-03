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
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  Download, 
  Plus,
  ArrowUpRight,
  History,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Fees({ user }: { user: any }) {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isManagement = user.role === "superadmin" || user.role === "admin";
  const isParent = user.role === "parent";
  
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await apiService.getFees(user.schoolId ? parseInt(user.schoolId) : undefined);
        setFees(res.data);
      } catch (error) {
        console.error("Fees error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isManagement) fetchFees();
  }, [user.schoolId, isManagement]);

  if (!isManagement && !isParent) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 mt-1">Track payments, issue invoices and monitor financial health.</p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-600 text-white shadow-xl shadow-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-100 text-xs uppercase tracking-widest font-bold">Total Collection (Term 1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-black">${fees.reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString()}</h2>
                    <p className="text-blue-200 text-sm mt-1 flex items-center gap-1">
                        <ArrowUpRight size={14} /> 12% increase from last term
                    </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                    <DollarSign size={24} />
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
                    <h2 className="text-4xl font-black text-amber-400">${fees.reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0).toLocaleString()}</h2>
                    <p className="text-slate-400 text-sm mt-1">From {fees.length} students</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl">
                    <AlertCircle size={24} className="text-amber-400" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-xs uppercase tracking-widest font-bold">Scholarships Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-black text-slate-900">$0</h2>
                    <p className="text-slate-500 text-sm mt-1">Aiding students</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                    <CreditCard size={24} className="text-slate-600" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Overview of latest fee payments across all classes.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} /> Export CSV
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
                <TableRow>
                  <TableHead>GRNO</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-mono text-[10px] font-bold text-blue-600 italic">GR-{fee.studentId}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{fee.student?.fullName || "Student"}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{fee.term}</TableCell>
                    <TableCell className="font-bold">${fee.totalAmount}</TableCell>
                    <TableCell className="font-bold text-emerald-600">${fee.paidAmount}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "font-bold",
                          fee.status === 'Paid' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}
                      >
                        {fee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600 font-bold">Print Receipt</Button>
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
