import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { FileText, Download, Filter, Settings2, FileSpreadsheet, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";

const AVAILABLE_FIELDS = [
  { id: "name", label: "Student Name", group: "Personal" },
  { id: "roll", label: "Roll Number", group: "Personal" },
  { id: "standard", label: "Standard", group: "Academic" },
  { id: "section", label: "Section", group: "Academic" },
  { id: "attendance", label: "Attendance %", group: "Academic" },
  { id: "maths", label: "Mathematics", group: "Marks" },
  { id: "science", label: "Science", group: "Marks" },
  { id: "english", label: "English", group: "Marks" },
  { id: "total", label: "Total Marks", group: "Results" },
  { id: "percentage", label: "Percentage", group: "Results" },
  { id: "grade", label: "Grade", group: "Results" },
];

export default function ReportBuilder() {
  const [selectedFields, setSelectedFields] = useState<string[]>(["name", "roll", "total", "percentage"]);
  const [format, setFormat] = useState("pdf");
  const [grouping, setGrouping] = useState("none");
  const [includeCharts, setIncludeCharts] = useState(false);

  const toggleField = (id: string) => {
    setSelectedFields(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (selectedFields.length === 0) {
      toast.error("Select at least one field", {
        description: "Your report needs data to be useful!"
      });
      return;
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 3000)), {
      loading: `Generating custom ${format.toUpperCase()} report...`,
      success: `Report generated successfully!`,
      error: "Generation failed",
      description: `Includes ${selectedFields.length} fields ${grouping !== 'none' ? `grouped by ${grouping}` : ''}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Settings2 size={18} className="text-blue-600" />
              <div>
                <CardTitle>Report Configurations</CardTitle>
                <CardDescription>Select data points you want to include in your output.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {["Personal", "Academic", "Marks", "Results"].map((group) => (
                <div key={group} className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{group} Data</h3>
                  <div className="space-y-3">
                    {AVAILABLE_FIELDS.filter(f => f.group === group).map((field) => (
                      <div key={field.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleField(field.id)}>
                        <Checkbox 
                          id={field.id} 
                          checked={selectedFields.includes(field.id)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label 
                          htmlFor={field.id} 
                          className="text-sm font-medium leading-none cursor-pointer group-hover:text-blue-600 transition-colors"
                        >
                          {field.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-emerald-600" />
              <div>
                <CardTitle>Advanced Filters & Grouping</CardTitle>
                <CardDescription>Refine your data set for more focused insights.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Group Data By</Label>
                <Select value={grouping} onValueChange={setGrouping}>
                  <SelectTrigger>
                    <SelectValue placeholder="No grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Flat List)</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="section">Section</SelectItem>
                    <SelectItem value="grade">Grade Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Minimum Attendance Filter</Label>
                <Select defaultValue="0">
                  <SelectTrigger>
                    <SelectValue placeholder="All students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Students</SelectItem>
                    <SelectItem value="75">75% and Above</SelectItem>
                    <SelectItem value="90">90% and Above</SelectItem>
                    <SelectItem value="below_75">Below 75% (At Risk)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-base">Include Performance Charts</Label>
                <p className="text-sm text-slate-500 italic">Adds visual analytics to the beginning of the report.</p>
              </div>
              <Switch checked={includeCharts} onCheckedChange={setIncludeCharts} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-slate-900 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Output Settings</CardTitle>
            <CardDescription className="text-slate-400">Choose your preferred file format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormatButton 
                active={format === 'pdf'} 
                onClick={() => setFormat('pdf')}
                icon={FileText}
                label="PDF Document"
              />
              <FormatButton 
                active={format === 'csv'} 
                onClick={() => setFormat('csv')}
                icon={FileSpreadsheet}
                label="Excel / CSV"
              />
              <FormatButton 
                active={format === 'json'} 
                onClick={() => setFormat('json')}
                icon={FileJson}
                label="JSON Data"
              />
              <FormatButton 
                active={format === 'print'} 
                onClick={() => setFormat('print')}
                icon={Download}
                label="Print Ready"
              />
            </div>
            
            <div className="pt-4 border-t border-slate-800">
              <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                  <span>Selected Fields</span>
                  <span>{selectedFields.length}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedFields.map(f => (
                    <span key={f} className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 capitalize">
                      {f.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button 
                onClick={handleGenerate}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg shadow-blue-600/20"
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-slate-50">
           <CardHeader>
             <CardTitle className="text-sm">Scheduled Reports</CardTitle>
           </CardHeader>
           <CardContent className="text-center py-6">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3">
                <Settings2 className="text-slate-300" size={24} />
              </div>
              <p className="text-xs text-slate-400">Automate your reporting. Schedule weekly or monthly student performance exports.</p>
              <Button variant="link" className="text-blue-600 font-bold text-xs mt-2">Setup Automation</Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FormatButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
        active 
          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" 
          : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
      )}
    >
      <Icon size={20} />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
