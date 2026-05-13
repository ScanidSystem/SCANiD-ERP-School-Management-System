import { useState } from "react";
import { User as UserType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  MapPin, 
  Phone, 
  Calendar,
  Building2,
  Key
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileProps {
  user: UserType;
}

export default function Profile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: "+91 98765 43210",
    location: "Mumbai, India",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-slate-900 p-4 rounded-[1.25rem] text-white shadow-2xl shadow-slate-200 transition-transform hover:rotate-3">
             <User size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">My Profile</h1>
            <p className="text-slate-400 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">Manage your personal information and security settings.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Card */}
        <Card className="w-full md:w-80 shrink-0 border-slate-200">
          <CardContent className="pt-6 text-center">
            <div className="relative inline-block group mb-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 text-sm mb-3 capitalized">{user.role}</p>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-4 px-3 py-0.5">
              {user.schoolName || "System Administrator"}
            </Badge>
            
            <div className="space-y-3 pt-4 border-t border-slate-100 mt-4 text-left">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Building2 size={16} className="text-slate-400" />
                <span>{user.academicYearName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-6 w-full">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
                <CardDescription>Manage your profile details and preferences</CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"}
                className={cn("w-full sm:w-auto", isEditing ? "bg-blue-600 hover:bg-blue-700" : "")}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-600">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                      className="pl-10 bg-slate-50/50 border-slate-200" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-600">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input 
                      id="email" 
                      value={formData.email} 
                      disabled={true}
                      className="pl-10 bg-slate-50/50 border-slate-200 cursor-not-allowed" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-600">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData({...formData, phone: val});
                      }}
                      disabled={!isEditing}
                      className="pl-10 bg-slate-50/50 border-slate-200" 
                      placeholder="10-digit number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-600">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input 
                      id="location" 
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      disabled={!isEditing}
                      className="pl-10 bg-slate-50/50 border-slate-200" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Key className="text-blue-600" size={20} />
                Security & Authentication
              </CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex gap-4 items-center">
                  <div className="p-2 bg-white rounded-md border border-slate-200">
                    <Shield className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-500">Security layer for your account access</p>
                  </div>
                </div>
                <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">Disabled</Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button variant="outline" className="flex-1">Change Password</Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">Deactivate Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
