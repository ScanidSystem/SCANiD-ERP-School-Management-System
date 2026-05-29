import { useState, useEffect } from "react";
import { User, AuditLog, ErrorLog } from "@/types";
import { apiService } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, Trash2, Database, AlertCircle, History, Copy, Check, ChevronRight, Home, Terminal, ChevronLeft, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, ArrowUpDown, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Link, Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SystemLogsProps {
  user: User;
}

export default function SystemLogs({ user }: SystemLogsProps) {
  // INTERNAL RBAC CHECK: Secondary layer of protection for superadmin-only page
  if (user.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditPageSize, setAuditPageSize] = useState(10);
  const [auditSortBy, setAuditSortBy] = useState("timestamp");
  const [auditSortOrder, setAuditSortOrder] = useState<"asc" | "desc">("desc");
  const [auditTotalCount, setAuditTotalCount] = useState(0);
  const [auditTotalPages, setAuditTotalPages] = useState(0);

  const [errorPage, setErrorPage] = useState(1);
  const [errorPageSize, setErrorPageSize] = useState(10);
  const [errorSortBy, setErrorSortBy] = useState("timestamp");
  const [errorSortOrder, setErrorSortOrder] = useState<"asc" | "desc">("desc");
  const [errorTotalCount, setErrorTotalCount] = useState(0);
  const [errorTotalPages, setErrorTotalPages] = useState(0);

  const [appLogs, setAppLogs] = useState<string>("");
  const [dbScript, setDbScript] = useState<string>("");
  const [seedScript, setSeedScript] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [seedCopied, setSeedCopied] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Use Promise.allSettled to ensure one failing endpoint doesn't block the whole page
      const results = await Promise.allSettled([
        apiService.getAuditLogs({
          page: auditPage,
          pageSize: auditPageSize,
          sortBy: auditSortBy,
          sortOrder: auditSortOrder
        }),
        apiService.getErrorLogs({
          page: errorPage,
          pageSize: errorPageSize,
          sortBy: errorSortBy,
          sortOrder: errorSortOrder
        }),
        apiService.getDbScript(),
        apiService.getFileSystemLogs(),
        apiService.getSeedScript()
      ]);

      // Helper to extract data from settled promise
      const getResBody = (result: any) => {
        if (result.status === 'fulfilled') {
          return result.value.data;
        }
        return null;
      };

      const auditRes = getResBody(results[0]);
      const errorRes = getResBody(results[1]);
      const scriptData = getResBody(results[2]);
      const appLogsData = getResBody(results[3]);
      const seedData = getResBody(results[4]);

      // Normalize data (handle array in property or PascalCase)
      const normalizeData = (res: any) => {
        if (!res) return { items: [], total: 0, pages: 0 };
        const data = res.data || res;
        const items = Array.isArray(data) ? data : (data.items || data.$values || []);
        const total = res.pagination?.totalCount || items.length;
        const pages = res.pagination?.totalPages || Math.ceil(total / 10);
        return { items, total, pages };
      };

      const normAudit = normalizeData(auditRes);
      const normError = normalizeData(errorRes);

      setAuditLogs(normAudit.items);
      setAuditTotalCount(normAudit.total);
      setAuditTotalPages(normAudit.pages);

      setErrorLogs(normError.items);
      setErrorTotalCount(normError.total);
      setErrorTotalPages(normError.pages);

      setDbScript(scriptData?.content || "");
      setAppLogs(appLogsData?.content || "");
      setSeedScript(seedData?.content || "");

      if (results.some(r => r.status === 'rejected')) {
        console.warn("Some data sources failed to load:", results.filter(r => r.status === 'rejected'));
      }
    } catch (error) {
      console.error("Error fetching system data:", error);
      toast.error("Failed to load system logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [auditPage, auditPageSize, auditSortBy, auditSortOrder, errorPage, errorPageSize, errorSortBy, errorSortOrder]);

  const handleAuditSort = (key: string) => {
    if (auditSortBy === key) {
      setAuditSortOrder(auditSortOrder === "asc" ? "desc" : "asc");
    } else {
      setAuditSortBy(key);
      setAuditSortOrder("asc");
    }
    setAuditPage(1);
  };

  const handleErrorSort = (key: string) => {
    if (errorSortBy === key) {
      setErrorSortOrder(errorSortOrder === "asc" ? "desc" : "asc");
    } else {
      setErrorSortBy(key);
      setErrorSortOrder("asc");
    }
    setErrorPage(1);
  };

  const clearErrorLogs = async () => {
    if (!confirm("Are you sure you want to clear all error logs?")) return;
    try {
      await apiService.clearErrorLogs();
      setErrorLogs([]);
      toast.success("Error logs cleared");
    } catch (error) {
      toast.error("Failed to clear logs");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dbScript);
    setCopied(true);
    toast.success("Script copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 animate-in fade-in duration-700">
      {/* Breadcrumb Navigation */}
      <div className="px-6 sm:px-10 py-5 flex items-center gap-2 text-[13px] font-bold">
        <Link to="/" className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
          <Home size={14} />
          <span>Home</span>
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="text-indigo-600 font-bold">System Logs</span>
      </div>

      {/* Main Page Header */}
      <div className="px-6 sm:px-10 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/20 rounded-[2rem] blur-xl group-hover:bg-blue-600/30 transition-all duration-500"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 border border-white/20 transition-transform hover:scale-105 duration-300">
              <Terminal size={32} className="sm:size-10" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-slate-900 font-bold pl-0.5 uppercase tracking-wide">System Infrastructure</h1>
            <p className="text-slate-600 font-bold text-xs sm:text-base opacity-90 leading-tight mt-1">Monitor system activities, exceptions, and institutional data health.</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchData} 
          disabled={refreshing}
          className="h-12 px-8 rounded-2xl border-slate-200 bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shrink-0 flex items-center gap-2"
        >
          <RefreshCw className={cn("h-4 w-4 text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase  stroke-[3]", refreshing && "animate-spin")} />
          Sync System Data
        </Button>
      </div>

      <div className="px-6 sm:px-10">
        <Tabs defaultValue="errors" orientation="horizontal" className="w-full">
          <div className="mb-10 overflow-x-auto no-scrollbar">
            <TabsList className="bg-transparent h-auto p-0 gap-4 flex justify-start items-center">
              <TabsTrigger 
                value="audit" 
                className={cn(
                  "h-14 px-8 rounded-xl font-black text-[11px] uppercase transition-all border shrink-0",
                  "bg-white text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide",
                  "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-200 data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-100/50"
                )}
              >
                <History className="mr-3 h-4 w-4 ms-5 stroke-[3]" />
                
                
                Audit Trail
              </TabsTrigger>
              <TabsTrigger 
                value="errors" 
                className={cn(
                  "h-14 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border shrink-0",
                  "bg-white border-slate-100 shadow-sm text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide",
                  "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-200 data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-100/50"
                )}
              >
                <Database className="mr-3 h-4 w-4 ms-5 stroke-[3]" />
                Database Errors
              </TabsTrigger>
              <TabsTrigger 
                value="applogs" 
                className={cn(
                  "h-14 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border shrink-0",
                  "bg-white border-slate-100 shadow-sm text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide",
                  "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-200 data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-100/50"
                )}
              >
                <Terminal className="mr-3 h-4 w-4 ms-5 stroke-[3]" />
                Application Logs
              </TabsTrigger>
              <TabsTrigger 
                value="database" 
                className={cn(
                  "h-14 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border shrink-0",
                  "bg-white border-slate-100 shadow-sm text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide",
                  "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-200 data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-100/50"
                )}
              >
                <Database className="mr-3 h-4 w-4 ms-5 stroke-[3]" />
                DB Schema
              </TabsTrigger>
              <TabsTrigger 
                value="seed" 
                className={cn(
                  "h-14 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border shrink-0",
                  "bg-white border-slate-100 shadow-sm text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide",
                  "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-200 data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-100/50"
                )}
              >
                <RefreshCw className="mr-3 h-4 w-4 ms-5 stroke-[3]" />
                Dummy Data
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="errors" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Card className="shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="px-8 sm:px-12 pt-12 pb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-red-50 rounded-[1.25rem] flex items-center justify-center text-red-500 shadow-sm border border-red-100/50">
                      <Database size={32} className="stroke-[2.5]" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm">
                      <AlertCircle size={10} className="stroke-[3]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl sm:text-3xl font-black font-semibold  text-slate-900 tracking-tight">Database Errors</CardTitle>
                    <CardDescription className="text-slate-700 font-bold uppercase tracking-[0.1em] text-[11px] opacity-80 leading-tight">Exceptions recorded during database operations.</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={clearErrorLogs} 
                  disabled={errorLogs.length === 0}
                  className="h-12 px-8 rounded-2xl bg-[#FFF1F1] hover:bg-red-50 text-red-500 font-black text-[11px] uppercase tracking-widest border border-red-100 shadow-sm transition-all flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4 stroke-[3]" />
                  Flush Logs
                </Button>
              </CardHeader>

              <CardContent className="px-0 pt-0">
                <div className="overflow-x-auto selection:bg-indigo-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 border-y border-slate-100 h-20">
                        <TableHead className="pl-12 w-[240px]">
                          <div className="flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-indigo-600 transition-colors" onClick={() => handleErrorSort('timestamp')}>
                            Event Timestamp
                            <ArrowUpDown size={12} className="opacity-40" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[180px]">
                          <div className="flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-indigo-600 transition-colors" onClick={() => handleErrorSort('level')}>
                            Severity
                            <ArrowUpDown size={12} className="opacity-40" />
                          </div>
                        </TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 min-w-[200px]">
                          Error Origin
                        </TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 min-w-[300px]">
                          Detailed Signal
                        </TableHead>
                        <TableHead className="pr-12 text-right w-20"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(!Array.isArray(errorLogs) || errorLogs.length === 0) ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-32 text-center bg-white">
                            <div className="flex flex-col items-center gap-5">
                              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100/50 shadow-inner">
                                <Database size={48} />
                              </div>
                              <div className="space-y-2">
                                <p className="text-slate-900 font-black text-xl tracking-tight leading-none">All Systems Healthy</p>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.1em] opacity-80">No database exceptions recorded in the current session</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        errorLogs.map((log: any) => (
                          <TableRow key={log.id || log.Id} className="group hover:bg-slate-50/40 transition-all border-b border-slate-50 h-[100px] bg-white">
                            <TableCell className="pl-12">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 group-hover:rotate-6 transition-all duration-500">
                                  <Clock size={18} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[14px] font-black text-slate-900 leading-none tracking-tight">
                                    {new Date(log.timestamp || log.Timestamp || log.dateTime || log.DateTime).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 opacity-70">
                                    {new Date(log.timestamp || log.Timestamp || log.dateTime || log.DateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              { (log.level || log.Level || "Error") === "Warning" ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl w-fit shadow-sm">
                                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Warning</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl w-fit shadow-sm">
                                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Exception</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <span className="text-[13px] font-black text-slate-800 tracking-tight leading-none truncate max-w-[200px]">
                                  {log.properties?.includes('USER:') ? log.properties : (log.properties || "/API/INSTITUTION")}
                                </span>
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50/50 px-2 py-1 rounded-lg w-fit border border-indigo-100/30">
                                  {log.properties?.includes('User') ? "Access Control" : "Data Master"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-[13px] font-bold text-slate-500 max-w-[450px] line-clamp-2 group-hover:text-slate-900 transition-colors leading-relaxed" title={log.message || log.Message}>
                                {log.message || log.Message}
                              </p>
                            </TableCell>
                            <TableCell className="pr-12 text-right">
                               <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                 <ChevronRight size={16} />
                               </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-12 py-10 bg-white border-t border-slate-50 gap-8 mt-6">
                  <div className="text-[12px] font-black text-slate-400 uppercase tracking-[0.15em] opacity-80">
                    Showing <span className="text-slate-900 font-black">{errorLogs.length > 0 ? (errorPage - 1) * errorPageSize + 1 : 0}</span> to <span className="text-slate-900 font-black">{Math.min(errorPage * errorPageSize, errorTotalCount)}</span> of <span className="text-slate-900 font-black">{errorTotalCount}</span> entries
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Rows per page</span>
                      <Select value={errorPageSize.toString()} onValueChange={(v) => { setErrorPageSize(parseInt(v)); setErrorPage(1); }}>
                        <SelectTrigger className="w-[85px] h-11 bg-[#F8FAFC] border-slate-100 rounded-xl text-[13px] font-black text-slate-900 shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                          {[10, 25, 50, 100].map(size => (
                            <SelectItem key={size} value={size.toString()} className="text-[13px] font-bold rounded-xl py-3 px-4 focus:bg-indigo-50 focus:text-indigo-600 transition-all">{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all" onClick={() => setErrorPage(1)} disabled={errorPage === 1}>
                        <ChevronsLeft size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all" onClick={() => setErrorPage(prev => Math.max(1, prev - 1))} disabled={errorPage === 1}>
                        <ChevronLeft size={18} />
                      </Button>
                      <div className="flex items-center justify-center min-w-[44px] h-11 px-4 bg-indigo-600 rounded-2xl text-[13px] font-black text-white shadow-xl shadow-indigo-200">
                        {errorPage}
                      </div>
                      <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all" onClick={() => setErrorPage(prev => Math.min(errorTotalPages, prev + 1))} disabled={errorPage >= errorTotalPages}>
                        <ChevronRight size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all" onClick={() => setErrorPage(errorTotalPages)} disabled={errorPage >= errorTotalPages}>
                        <ChevronsRight size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab - Standardized with new high-fidelity design */}
          <TabsContent value="audit" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-6 duration-700">
             <Card className="shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="px-8 sm:px-12 pt-12 pb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                    <History size={32} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl sm:text-3xl font-black font-semibold  text-slate-900 tracking-tight">Audit Trail</CardTitle>
                    <CardDescription className="text-slate-700 font-bold mt-1 uppercase tracking-[0.1em] text-[11px] opacity-80 leading-tight">Chronological record of data transactions and modifications.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0 pt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 border-y border-slate-100 h-20">
                        <TableHead className="pl-12 w-[240px] text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Event Timestamp</TableHead>
                        <TableHead className="w-[180px] text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Action Type</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 min-w-[200px]">Target Entity</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 w-[120px]">Entity ID</TableHead>
                        <TableHead className="pr-12 text-right text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 min-w-[300px]">Transaction Context</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(!Array.isArray(auditLogs) || auditLogs.length === 0) ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-32 bg-white">
                            <div className="flex flex-col items-center gap-5">
                              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 shadow-inner">
                                <History size={48} />
                              </div>
                              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">No operational history detected yet</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        auditLogs.map((log: any) => (
                          <TableRow key={log.id || log.Id} className="hover:bg-slate-50/40 transition-all border-b border-slate-50 h-[100px] bg-white group">
                            <TableCell className="pl-12">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:rotate-6 transition-all duration-500">
                                  <History size={18} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[14px] font-black text-slate-900 leading-none tracking-tight">
                                    {new Date(log.dateTime || log.DateTime || log.Timestamp || log.timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 opacity-70">
                                    {new Date(log.dateTime || log.DateTime || log.Timestamp || log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-xl border-none transition-all shadow-sm w-fit",
                                (log.type || log.Type) === "Create" ? "bg-emerald-50 text-emerald-600" : 
                                (log.type || log.Type) === "Delete" ? "bg-red-50 text-red-600" : 
                                "bg-indigo-50 text-indigo-600"
                              )}>
                                <div className={cn(
                                   "w-1.5 h-1.5 rounded-full",
                                   (log.type || log.Type) === "Create" ? "bg-emerald-500" : 
                                   (log.type || log.Type) === "Delete" ? "bg-red-500" : 
                                   "bg-indigo-500"
                                )} />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                  {log.type || log.Type}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none uppercase">
                                  {log.tableName || log.TableName}
                                </span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Entity</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-[11px] font-black font-mono text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                                #{log.primaryKey || log.PrimaryKey}
                              </code>
                            </TableCell>
                            <TableCell className="pr-12 text-right">
                              <div className="max-w-[400px] ml-auto text-[13px] font-bold text-slate-500 italic bg-slate-50/50 px-4 py-2 rounded-xl group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all border border-transparent group-hover:border-indigo-100 line-clamp-2" title={log.newValues || log.NewValues || ""}>
                                {(log.affectedColumns || log.AffectedColumns) ? `Modified: ${log.affectedColumns || log.AffectedColumns}` : "System-level state modification"}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Logs Tab - Modern Terminal Design */}
          <TabsContent value="applogs" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-6 duration-700">
             <Card className="shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="px-12 pt-12 pb-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-emerald-400 shadow-2xl shadow-slate-900/10 border border-white/5">
                    <Terminal size={32} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 font-semibold  tracking-tight">Application Runtime Logs</CardTitle>
                    <CardDescription className="text-slate-700 font-bold mt-1 uppercase tracking-[0.1em] text-[11px] opacity-80 leading-tight">Real-time logs captured on the server filesystem.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-12 pb-12 pt-0">
                <div className="relative group p-2 bg-slate-900 rounded-[2.5rem] shadow-[0_45px_70px_-20px_rgba(0,0,0,0.4)] border border-white/5">
                  <ScrollArea className="h-[650px] w-full rounded-[2.2rem] bg-[#020617] p-10 border border-white/5 custom-scrollbar">
                    <div className="flex items-center gap-2.5 mb-10 pb-6 border-b border-white/5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-[0_0_12px_rgba(255,95,86,0.6)]"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-[0_0_12px_rgba(255,189,46,0.6)]"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-[0_0_12px_rgba(39,201,63,0.6)]"></div>
                      <span className="text-[12px] font-black text-slate-500 ml-4 uppercase tracking-[0.3em] font-mono opacity-80 underline decoration-indigo-500/40 decoration-2 underline-offset-8">scanid_log_active • connection_v2.1</span>
                    </div>
                    <pre className="font-mono text-[14px] leading-relaxed text-[#CBD5E1]/90 whitespace-pre-wrap selection:bg-indigo-500/40 tracking-tight">
                      {appLogs || "-- No recent application activity logged yet."}
                    </pre>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Schema Tab */}
          <TabsContent value="database" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-6 duration-700">
             <Card className="shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="px-12 pt-12 pb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-[1.25rem] flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
                    <Database size={32} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 font-semibold tracking-tight">Database Schema</CardTitle>
                    <CardDescription className="text-slate-700 font-bold mt-1 uppercase tracking-[0.1em] text-[11px] opacity-80 leading-tight">Current institutional database structure for environment provisioning.</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="h-12 px-8 rounded-2xl border-slate-200 bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shrink-0 flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500 stroke-[3]" /> : <Copy className="h-4 w-4 stroke-[3]" />}
                  {copied ? "Script Saved" : "Copy Schema SQL"}
                </Button>
              </CardHeader>
              <CardContent className="px-12 pb-12 pt-0">
                <ScrollArea className="h-[600px] w-full rounded-[2.5rem] bg-slate-50/50 border border-slate-100 p-10 font-mono text-[14px] text-slate-700 leading-relaxed shadow-inner selection:bg-indigo-100">
                  <pre className="whitespace-pre-wrap text-indigo-900/80 tracking-tight">
                    {dbScript || "-- The database script could not be loaded at this time."}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dummy Data Tab */}
          <TabsContent value="seed" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-6 duration-700">
             <Card className="shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="px-12 pt-12 pb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-[1.25rem] flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                    <RefreshCw size={32} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl sm:text-3xl font-black font-semibold  text-slate-900 tracking-tight">Seed Master Data</CardTitle>
                    <CardDescription className="text-slate-700 font-bold mt-1 uppercase tracking-[0.1em] text-[11px] opacity-80 leading-tight">SQL script to populate all tables with dummy data for testing.</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(seedScript);
                    setSeedCopied(true);
                    toast.success("Seed script copied");
                    setTimeout(() => setSeedCopied(false), 2000);
                  }}
                  className="h-12 px-8 rounded-2xl border-slate-200 bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shrink-0 flex items-center gap-2"
                >
                  {seedCopied ? <Check className="h-4 w-4 text-emerald-500 text-slate-900 text-xs sm:text-sm font-bold pl-0.5 uppercase tracking-wide stroke-[3]" /> : <Copy className="h-4 w-4 stroke-[3]" />}
                  {seedCopied ? "Data Script Saved" : "Copy Data SQL"}
                </Button>
              </CardHeader>
              <CardContent className="px-12 pb-12 pt-0">
                <ScrollArea className="h-[600px] w-full rounded-[2.5rem] bg-slate-50/50 border border-slate-100 p-10 font-mono text-[14px] text-slate-700 leading-relaxed shadow-inner selection:bg-indigo-100">
                  <pre className="whitespace-pre-wrap text-emerald-900/80 tracking-tight">
                    {seedScript || "-- The seed data script could not be loaded at this time."}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

