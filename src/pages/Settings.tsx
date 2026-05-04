import { useState } from "react";
import { User as UserType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Settings as SettingsIcon, 
  Monitor, 
  ShieldCheck, 
  Languages, 
  Mail,
  Smartphone,
  Globe,
  Database
} from "lucide-react";
import { toast } from "sonner";

interface SettingsProps {
  user: UserType;
}

export default function Settings({ user }: SettingsProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: false,
    studentActivity: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your system configurations and personal preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full flex flex-col md:flex-row gap-8">
        <TabsList className="flex md:flex-col items-start justify-start bg-transparent h-auto p-0 gap-1 md:w-64 shrink-0 overflow-x-auto pb-2 md:pb-0">
          <TabsTrigger 
            value="general" 
            className="w-full justify-start gap-3 py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:hover:bg-slate-100 transition-all text-sm font-medium"
          >
            <SettingsIcon size={18} /> General
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="w-full justify-start gap-3 py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:hover:bg-slate-100 transition-all text-sm font-medium"
          >
            <Bell size={18} /> Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="appearance" 
            className="w-full justify-start gap-3 py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:hover:bg-slate-100 transition-all text-sm font-medium"
          >
            <Monitor size={18} /> Appearance
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="w-full justify-start gap-3 py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:hover:bg-slate-100 transition-all text-sm font-medium"
          >
            <ShieldCheck size={18} /> Data & Privacy
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="general" className="space-y-6 m-0 animate-in fade-in duration-300">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Language and Region</CardTitle>
              <CardDescription>Customize how the platform appears for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-medium">
                    <Languages size={16} className="text-slate-400" />
                    Language
                  </div>
                  <p className="text-xs text-slate-500">Select your preferred platform language</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 text-sm font-medium">English (US)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-medium">
                    <Globe size={16} className="text-slate-400" />
                    Timezone
                  </div>
                  <p className="text-xs text-slate-500">Standard timezone for all scheduling</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 text-sm font-medium">UTC+05:30 (IST)</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">System Access</CardTitle>
              <CardDescription>Managed by {user.schoolName || "System Admin"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-4 items-start">
                <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-900">Your role provides specific dashboard permissions</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Some settings are locked by the school administrator. Please contact IT support if you need to change restricted configurations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 m-0">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Notification Channels</CardTitle>
              <CardDescription>Choose how you want to be alerted about updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Mail size={16} className="text-slate-400" /> Email Notifications
                  </Label>
                  <p className="text-sm text-slate-500 leading-relaxed">Receive updates about system maintenance and weekly summaries.</p>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(v) => setNotifications({...notifications, email: v})} 
                />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Smartphone size={16} className="text-slate-400" /> Mobile App Push
                  </Label>
                  <p className="text-sm text-slate-500 leading-relaxed">Get real-time alerts on your mobile device for student attendance.</p>
                </div>
                <Switch 
                  checked={notifications.push} 
                  onCheckedChange={(v) => setNotifications({...notifications, push: v})} 
                />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <Label className="flex items-center gap-2 font-semibold text-blue-600">
                    <Database size={16} /> Automated Backups
                  </Label>
                  <p className="text-sm text-slate-500 leading-relaxed">System-wide data backup completion alerts.</p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 m-0">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Visual Preferences</CardTitle>
              <CardDescription>Customize the interface to your comfortable working environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex flex-col gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-xl text-left">
                  <div className="w-full aspect-video bg-white border border-slate-200 rounded-lg p-2 flex flex-col gap-1">
                    <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-4 bg-slate-100 rounded"></div>
                      <div className="h-4 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-900">Light Mode</p>
                    <p className="text-xs text-blue-600">Default bright theme</p>
                  </div>
                </button>
                <button className="flex flex-col gap-3 p-4 border border-slate-200 bg-white rounded-xl text-left hover:border-slate-300 transition-colors">
                  <div className="w-full aspect-video bg-slate-900 rounded-lg p-2 flex flex-col gap-1">
                    <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-4 bg-slate-800 rounded"></div>
                      <div className="h-4 bg-slate-800 rounded"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">Dark Mode</p>
                    <p className="text-xs text-slate-500">Coming soon</p>
                  </div>
                </button>
                <button className="flex flex-col gap-3 p-4 border border-slate-200 bg-white rounded-xl text-left hover:border-slate-300 transition-colors">
                  <div className="w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-900 rounded-lg p-2 flex flex-col gap-1">
                    <div className="h-2 w-1/2 bg-slate-400 rounded"></div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-4 bg-slate-500 rounded opacity-50"></div>
                      <div className="h-4 bg-slate-500 rounded opacity-50"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">System</p>
                    <p className="text-xs text-slate-500">Sync with OS</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 m-0 animate-in fade-in duration-300">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Data & Privacy</CardTitle>
              <CardDescription>Manage how your data is handled and stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-semibold">Activity Logs</h4>
                    <p className="text-xs text-slate-500">Store history of all your system interactions</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-semibold">Public Profile Visibility</h4>
                    <p className="text-xs text-slate-500">Allow other school administrators to find your profile</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 italic text-xs text-slate-400">
                Last data export was performed on May 1st, 2024.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
    </div>
  );
}
