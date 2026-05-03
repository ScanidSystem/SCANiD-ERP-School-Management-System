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
  Plus, 
  Search, 
  School, 
  Settings, 
  ShieldCheck, 
  MoreVertical,
  Globe,
  Mail,
  MapPin,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Navigate } from "react-router-dom";
import { User as UserType } from "@/App";
import { cn } from "@/lib/utils";

export default function Schools({ user }: { user: UserType }) {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await apiService.getSchools();
        setSchools(res.data);
      } catch (error) {
        console.error("Schools error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user.role === "superadmin") {
      fetchSchools();
    }
  }, [user.role]);

  if (user.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 mt-1">Configure and monitor all registered educational institutions.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-lg shadow-blue-200">
          <Plus size={18} /> Register New School
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatItem title="Total Schools" value={schools.length.toString()} icon={School} color="text-blue-600 bg-blue-50" />
        <StatItem title="Active License" value={schools.filter(s => s.status === 'Active').length.toString()} icon={Globe} color="text-emerald-600 bg-emerald-50" />
        <StatItem title="System Health" value="99.9%" icon={ShieldCheck} color="text-purple-600 bg-purple-50" />
      </div>

      <Card>
        <CardHeader className="border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Find school by name, ID or city..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex justify-center">
               <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[100px] pl-6 font-bold">School ID</TableHead>
                  <TableHead className="font-bold">Institution Name</TableHead>
                  <TableHead className="font-bold">Database ID</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id} className="hover:bg-slate-50 transition-colors group">
                    <TableCell className="pl-6 font-mono text-xs font-bold text-blue-600">SCH-{school.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{school.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin size={10} /> {school.address || "Main Branch"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">{school.id}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "font-bold",
                          school.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}
                        variant="secondary"
                      >
                        {school.status || "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer outline-none">
                              <MoreVertical size={16} />
                            </div>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="gap-2"><Settings size={14} /> School Settings</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600">Suspend Access</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

function StatItem({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-2xl", color)}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
