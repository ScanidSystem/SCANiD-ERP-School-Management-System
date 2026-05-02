import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Role } from "@/App";
import { GraduationCap } from "lucide-react";
import logo from "@/assets/SCANiD_Logo.png";

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("admin");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0] || "Demo User",
      email: email || "demo@school.com",
      role: role
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
              src={logo}
              alt="SCANID Logo" 
              className="h-auto w-full max-w-[200px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <CardDescription className="text-slate-400">School Management, Simplified.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@school.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-slate-300">Login Role (For Testing)</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["admin", "teacher", "parent", "student"] as Role[]).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={role === r ? "default" : "outline"}
                    className={role === r ? "bg-blue-600 hover:bg-blue-700" : "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"}
                    onClick={() => setRole(r)}
                  >
                    <span className="capitalize">{r}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-lg font-medium shadow-lg shadow-blue-500/20">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-xs">
            Secure, Encypted & Scalable School Management Solutions
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
