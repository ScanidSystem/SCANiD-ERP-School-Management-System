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
  AlertCircle
} from "lucide-react";

const feeHistory = [
  { id: "1", grno: "GR001", student: "Alex James Johnson", type: "Tuition Fee", amount: "$1,200", date: "May 01, 2024", status: "Paid", method: "Online" },
  { id: "2", grno: "GR002", student: "Sarah Anne Williams", type: "Transport Fee", amount: "$300", date: "Apr 28, 2024", status: "Paid", method: "Bank Transfer" },
  { id: "3", grno: "GR003", student: "Michael Chen", type: "Tuition Fee", amount: "$1,200", date: "Apr 15, 2024", status: "Pending", method: "-" },
  { id: "4", grno: "GR004", student: "Emily Davis", roll: "104", type: "Tuition Fee", amount: "$1,200", date: "May 05, 2024", status: "Paid", method: "Cash" },
  { id: "5", grno: "GR005", student: "David Miller", type: "Late Fee", amount: "$50", date: "May 02, 2024", status: "Overdue", method: "-" },
];

export default function Fees({ user }: { user: any }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fee Management</h1>
          <p className="text-slate-500 mt-1">Track payments, issue invoices and monitor financial health.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2"><History size={16} /> History</Button>
            <Button className="bg-slate-900 hover:bg-slate-800 gap-2"><Plus size={16} /> Collect Fees</Button>
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
                    <h2 className="text-4xl font-black">$142,500</h2>
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
                    <h2 className="text-4xl font-black text-amber-400">$8,420</h2>
                    <p className="text-slate-400 text-sm mt-1">From 24 students</p>
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
                    <h2 className="text-4xl font-black text-slate-900">$12,000</h2>
                    <p className="text-slate-500 text-sm mt-1">Aiding 15 students</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GRNO</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeHistory.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-mono text-[10px] font-bold text-blue-600">{(fee as any).grno || `GR-${fee.id}`}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{fee.student}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{fee.type}</TableCell>
                  <TableCell className="font-bold">{fee.amount}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{fee.date}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{fee.method}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        "font-bold",
                        fee.status === 'Paid' ? "bg-emerald-100 text-emerald-700" :
                        fee.status === 'Pending' ? "bg-slate-100 text-slate-600" :
                        "bg-red-100 text-red-700"
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
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
