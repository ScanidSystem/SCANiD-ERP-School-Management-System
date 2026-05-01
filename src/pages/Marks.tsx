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
import { Printer, Download, Eye, FileText, ChevronRight, BarChart3, Settings2, Edit3 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportBuilder from "@/components/reports/ReportBuilder";
import MarksEntry from "@/components/reports/MarksEntry";

const marksData = [
  { id: "1", student: "Alex Johnson", roll: "101", class: "10-A", total: "442/500", percentage: "88.4%", grade: "A", status: "Pass" },
  { id: "2", student: "Sarah Williams", roll: "102", class: "10-A", total: "458/500", percentage: "91.6%", grade: "A+", status: "Pass" },
  { id: "3", student: "Michael Chen", roll: "103", class: "10-B", total: "385/500", percentage: "77.0%", grade: "B+", status: "Pass" },
  { id: "4", student: "Emily Davis", roll: "104", class: "9-A", total: "420/500", percentage: "84.0%", grade: "A", status: "Pass" },
];

export default function Marks({ user }: { user: any }) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Academic Reports</h1>
          <p className="text-slate-500 mt-1">Generate, print and export student marksheets and performance cards.</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 gap-2">
          <FileText size={16} /> Bulk Generate
        </Button>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-6">
          <TabsTrigger value="recent" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BarChart3 size={16} /> Recent Results
          </TabsTrigger>
          <TabsTrigger value="entry" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Edit3 size={16} /> Marks Entry
          </TabsTrigger>
          <TabsTrigger value="builder" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Settings2 size={16} /> Custom Report Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Final Term Examination - May 2024</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marksData.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <div className="font-semibold text-slate-900">{result.student}</div>
                          <div className="text-xs text-slate-500">Roll: {result.roll} | Class: {result.class}</div>
                        </TableCell>
                        <TableCell className="font-medium">{result.total}</TableCell>
                        <TableCell className="font-bold text-blue-600">{result.percentage}</TableCell>
                        <TableCell>
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                            {result.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger
                              render={
                                <Button variant="outline" size="sm" onClick={() => setSelectedStudent(result)}>
                                  View Marksheet
                                </Button>
                              }
                            />
                            <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
                              <MarksheetView student={selectedStudent} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                    <p className="text-sm font-semibold mb-2">Quick Export</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" className="justify-between h-auto py-3 px-4">
                        <div className="text-left">
                          <div className="text-sm font-bold">Standard Marksheet</div>
                          <div className="text-[10px] text-slate-400">PDF, Print-ready</div>
                        </div>
                        <ChevronRight size={16} />
                      </Button>
                      <Button variant="outline" className="justify-between h-auto py-3 px-4">
                        <div className="text-left">
                          <div className="text-sm font-bold">Performance Analytics</div>
                          <div className="text-[10px] text-slate-400">Excel, CSV</div>
                        </div>
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Download All Reports</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle className="text-white">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-400 mb-4">Overall school performance has improved by 4.2% compared to last year.</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Pass Percentage</span>
                      <span className="font-bold">98.5%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full">
                      <div className="h-full bg-blue-400 w-[98%] rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>A+ Grades</span>
                      <span className="font-bold">124</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="builder">
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="entry">
          <MarksEntry />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MarksheetView({ student }: { student: any }) {
  if (!student) return null;

  const subjects = [
    { name: "Mathematics", marks: 92, total: 100, grade: "A+" },
    { name: "Science", marks: 88, total: 100, grade: "A" },
    { name: "English", marks: 95, total: 100, grade: "A+" },
    { name: "History", marks: 84, total: 100, grade: "A" },
    { name: "Geography", marks: 83, total: 100, grade: "A" },
  ];

  return (
    <div className="p-6 bg-white space-y-8">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">EduFlow International School</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Campus, Education District 102</p>
        </div>
        <div className="text-right">
          <Badge className="bg-slate-900 text-white">OFFICIAL MARKSHEET</Badge>
          <p className="text-xs mt-2 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400">Student Name</p>
          <p className="font-bold text-lg">{student.student}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400">Roll Number</p>
            <p className="font-bold">{student.roll}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400">Term</p>
            <p className="font-bold">Final Term 2024</p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-slate-900">Subject</TableHead>
            <TableHead className="font-bold text-slate-900">Max Marks</TableHead>
            <TableHead className="font-bold text-slate-900">Marks Obtained</TableHead>
            <TableHead className="font-bold text-slate-900 text-right">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((sub) => (
            <TableRow key={sub.name}>
              <TableCell className="font-semibold">{sub.name}</TableCell>
              <TableCell>{sub.total}</TableCell>
              <TableCell className="font-bold">{sub.marks}</TableCell>
              <TableCell className="text-right">
                <span className="font-black">{sub.grade}</span>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-slate-900 text-white hover:bg-slate-900">
            <TableCell className="font-bold">Grand Total</TableCell>
            <TableCell className="font-bold">500</TableCell>
            <TableCell className="font-bold text-lg">442</TableCell>
            <TableCell className="text-right font-black text-lg">88.4% (A)</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex justify-between items-end pt-12">
        <div className="text-center w-32 border-t border-slate-300 pt-2">
          <p className="text-[10px] uppercase font-bold">Class Teacher</p>
        </div>
        <div className="text-center w-32">
          <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto mb-2 flex items-center justify-center opacity-50 italic text-[8px] text-slate-400">STAMP REQUIRED</div>
          <div className="border-t border-slate-300 pt-2">
            <p className="text-[10px] uppercase font-bold">Principal</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 justify-end no-print">
        <Button variant="outline" className="gap-2"><Printer size={16} /> Print</Button>
        <Button className="bg-slate-900 gap-2"><Download size={16} /> Download PDF</Button>
      </div>
    </div>
  );
}
