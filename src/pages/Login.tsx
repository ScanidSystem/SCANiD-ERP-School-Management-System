import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Role, User } from "@/types";
import { GraduationCap, School, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface LoginProps {
  onLogin: (user: User) => void;
}

const MOCK_SCHOOLS = [
  { id: "1", name: "Green Valley High School" },
  { id: "2", name: "St. Xavier's International" },
  { id: "3", name: "Oakridge Academy" },
];

const MOCK_YEARS = [
  { id: "1", name: "2024-2025" },
  { id: "2", name: "2025-2026" },
  { id: "3", name: "2026-2027" },
];

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [selectedSchool, setSelectedSchool] = useState("1");
  const [selectedYear, setSelectedYear] = useState("1");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAll = selectedSchool === "all";
    const school = MOCK_SCHOOLS.find(s => s.id === selectedSchool);
    const year = MOCK_YEARS.find(y => y.id === selectedYear);

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0] || "Demo User",
      email: email || "demo@school.com",
      role: role,
      schoolId: isAll ? undefined : selectedSchool,
      schoolName: isAll ? "All Schools" : school?.name,
      academicYearId: selectedYear,
      academicYearName: year?.name
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[128px]"></div>
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl relative z-10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-full flex items-center justify-center p-2">
            <img 
              src="https://ais-dev-qbyadn55tzqynrpuxuan4r-416405542511.asia-southeast1.run.app/artifact/logo_scanid_logo.png" 
              alt="SCANID Logo" 
              className="h-auto w-full max-w-[200px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <CardDescription className="text-slate-400">Multi-Institution Enterprise Portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-xs">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@school.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {role === "superadmin" ? (
                <div className="space-y-2 col-span-1">
                  <Label className="text-slate-300 text-xs flex items-center gap-2">
                    <School size={12} /> Target School
                  </Label>
                  <Select 
                    defaultValue="all"
                    value={selectedSchool} 
                    onValueChange={(v) => v && setSelectedSchool(v)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-9 text-xs">
                      <SelectValue placeholder="Select School" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="all" className="text-xs font-bold text-blue-400">All Schools (System-wide)</SelectItem>
                      {MOCK_SCHOOLS.map(s => (
                        <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2 col-span-1">
                  <Label className="text-slate-500 text-xs flex items-center gap-2">
                    <School size={12} /> Current School
                  </Label>
                  <div className="h-9 flex items-center px-3 rounded-md bg-slate-800/30 border border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {MOCK_SCHOOLS[0].name}
                  </div>
                </div>
              )}

              <div className="space-y-2 col-span-1">
                <Label className="text-slate-300 text-xs flex items-center gap-2">
                  <Calendar size={12} /> Academic Year
                </Label>
                <Select value={selectedYear} onValueChange={(v) => v && setSelectedYear(v)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-9 text-xs">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {MOCK_YEARS.map(y => (
                      <SelectItem key={y.id} value={y.id} className="text-xs">{y.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <Label className="text-slate-300 text-xs">Select Role</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["superadmin", "admin", "teacher"] as Role[]).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={role === r ? "default" : "outline"}
                    className={cn(
                      "h-8 text-[10px] uppercase tracking-wider font-bold",
                      role === r ? "bg-blue-600 hover:bg-blue-700" : "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["parent", "student"] as Role[]).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={role === r ? "default" : "outline"}
                    className={cn(
                      "h-8 text-[10px] uppercase tracking-wider font-bold",
                      role === r ? "bg-blue-600 hover:bg-blue-700" : "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-bold shadow-lg shadow-blue-500/20 mt-4 uppercase tracking-widest">
              Sign In to Portal
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-xs text-slate-500">
            Secure, Encypted & Scalable School Management Solutions
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
