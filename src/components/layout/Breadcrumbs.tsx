import * as React from "react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Breadcrumbs() {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return [
      { name: "Home", path: "/" },
      ...pathnames.map((value, index) => {
        const path = `/${pathnames.slice(0, index + 1).join("/")}`;
        return { 
          name: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " "), 
          path 
        };
      }),
    ];
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    if (location.pathname === "/") return "Dashboard";
    const pathnames = location.pathname.split("/").filter((x) => x);
    const last = pathnames[pathnames.length - 1];
    if (!last) return "Dashboard";
    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
  }, [location.pathname]);

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 shrink-0 transition-all duration-300">
      <nav className="flex items-center space-x-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <ChevronRight size={10} className="text-slate-300 mx-1 shrink-0" />}
            <Link 
              to={crumb.path}
              className={cn(
                "hover:text-blue-600 transition-colors flex items-center gap-1 shrink-0",
                index === breadcrumbs.length - 1 ? "text-slate-500" : ""
              )}
            >
              {index === 0 && <Home size={10} />}
              {crumb.name}
            </Link>
          </React.Fragment>
        ))}
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{pageTitle}</h1>
      </div>
    </div>
  );
}
