import { useState } from "react";
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
import { Calendar as CalendarIcon, Check, X, Clock, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const initialStudents = [
  { id: "1", grno: "GR001", name: "Alex James Johnson", roll: "101", status: "present" },
  { id: "2", grno: "GR002", name: "Sarah Anne Williams", roll: "102", status: "present" },
  { id: "3", grno: "GR003", name: "Michael Chen", roll: "103", status: "absent" },
  { id: "4", grno: "GR004", name: "Emily Davis", roll: "104", status: "present" },
  { id: "5", grno: "GR005", name: "David Miller", roll: "105", status: "late" },
  { id: "6", grno: "GR006", name: "Jessica Taylor", roll: "106", status: "present" },
];

export default function Attendance({ user }: { user: any }) {
  const [students, setStudents] = useState(initialStudents);
  const [date, setDate] = useState(new Date());

  const updateStatus = (id: string, status: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Attendance Tracker</h1>
          <p className="text-slate-500 mt-1">Daily presence marking and reporting for all classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm">
            <CalendarIcon size={16} className="text-slate-400" />
            <span className="text-sm font-semibold">{format(date, "PPP")}</span>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Class Selection</CardTitle>
            <CardDescription>Select standard and section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Standard</label>
              <Select defaultValue="10">
                <SelectTrigger>
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">Standard 8th</SelectItem>
                  <SelectItem value="9">Standard 9th</SelectItem>
                  <SelectItem value="10">Standard 10th</SelectItem>
                  <SelectItem value="11">Standard 11th</SelectItem>
                  <SelectItem value="12">Standard 12th</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Section</label>
              <Select defaultValue="A">
                <SelectTrigger>
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400">Summary</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-2xl font-bold text-emerald-700">{students.filter(s => s.status === 'present').length}</p>
                        <p className="text-[10px] uppercase font-bold text-emerald-600">Present</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-2xl font-bold text-red-700">{students.filter(s => s.status === 'absent').length}</p>
                        <p className="text-[10px] uppercase font-bold text-red-600">Absent</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Attendance Sheet</CardTitle>
              <CardDescription>Roll call for Class 10th - A</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStudents(s => s.map(x => ({...x, status: 'present'})))}>Select All Present</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">GRNO</TableHead>
                  <TableHead className="w-16">Roll</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-[10px] font-bold text-blue-600">{(student as any).grno || `GR-${student.id}`}</TableCell>
                    <TableCell className="font-mono text-xs font-bold text-slate-400">{student.roll}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{student.name}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "capitalize",
                          student.status === 'present' ? "bg-emerald-100 text-emerald-700" :
                          student.status === 'absent' ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        )}
                        variant="secondary"
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="icon" 
                          variant={student.status === 'present' ? "default" : "outline"} 
                          className={cn("h-8 w-8 rounded-full", student.status === 'present' && "bg-emerald-600 hover:bg-emerald-700")}
                          onClick={() => updateStatus(student.id, 'present')}
                        >
                          <Check size={14} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant={student.status === 'absent' ? "default" : "outline"}
                          className={cn("h-8 w-8 rounded-full", student.status === 'absent' && "bg-red-600 hover:bg-red-700")}
                          onClick={() => updateStatus(student.id, 'absent')}
                        >
                          <X size={14} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant={student.status === 'late' ? "default" : "outline"}
                          className={cn("h-8 w-8 rounded-full", student.status === 'late' && "bg-amber-500 hover:bg-amber-600")}
                          onClick={() => updateStatus(student.id, 'late')}
                        >
                          <Clock size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
