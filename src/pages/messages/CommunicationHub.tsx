import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  User, 
  Search as SearchIcon, 
  Filter, 
  Plus,
  MessageSquare,
  Check,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { apiService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  subject: string;
  content: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

interface User {
  id: number;
  fullName: string;
  role: string;
  avatar?: string;
  online?: boolean;
}

export default function CommunicationHub() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock current user - in real app would come from auth context
  const currentUser = { id: 1, name: "Super Admin" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [msgRes, usersRes] = await Promise.all([
          apiService.getMessages({ userId: currentUser.id }),
          apiService.getUsers()
        ]);
        
        const mData = Array.isArray(msgRes.data) ? msgRes.data : (msgRes.data?.data || []);
        const uData = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || []);
        
        setMessages(mData);
        setUsers(uData.filter((u: any) => u.id !== currentUser.id));
        
        if (uData.length > 0 && !selectedUserId) {
          setSelectedUserId(uData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load communications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedUserId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      const msgData = {
        senderId: currentUser.id,
        receiverId: selectedUserId,
        subject: "Direct Message",
        content: newMessage,
        type: "Direct"
      };

      const res = await apiService.sendMessage(msgData);
      const savedMsg = res.data?.data || res.data;
      
      setMessages(prev => [...prev, savedMsg]);
      setNewMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Message delivery failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = users.find(u => u.id === selectedUserId);
  const conversationMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === selectedUserId) ||
    (m.senderId === selectedUserId && m.receiverId === currentUser.id)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="flex h-[calc(100vh-100px)] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
      {/* Users Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={cn(
          "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden",
          !isSidebarOpen && "absolute inset-y-0 left-0 z-10"
        )}
      >
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Messages</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Plus size={18} />
            </Button>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input 
              placeholder="Search contacts..." 
              className="pl-9 h-9 bg-slate-50 border-none text-xs font-medium focus:ring-2 focus:ring-blue-500/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs text-slate-400">No contacts found</p>
            </div>
          ) : (
            filteredUsers.map((u) => {
              const lastMsg = messages
                .filter(m => m.senderId === u.id || m.receiverId === u.id)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
              
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUserId(u.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors relative",
                    selectedUserId === u.id && "bg-blue-50/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-600"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 border border-slate-100">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`} />
                      <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                    </Avatar>
                    {u.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{u.fullName}</p>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {format(new Date(lastMsg.createdAt), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">
                      {lastMsg ? lastMsg.content : u.role}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {!isSidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 left-4 z-20 bg-white shadow-md border border-slate-100 rounded-full h-9 w-9 hover:bg-slate-50"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MessageSquare size={18} className="text-slate-600" />
          </Button>
        )}

        {selectedUser ? (
          <>
            {/* Chat Header */}
            <header className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-slate-100">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.fullName}`} />
                  <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">{selectedUser.fullName}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-full">
                  <Search size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-full">
                  <Settings size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-full">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </header>

            {/* Messages List */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar"
            >
              {conversationMessages.map((msg, idx) => {
                const isMine = msg.senderId === currentUser.id;
                const prevMsg = conversationMessages[idx - 1];
                const showDate = !prevMsg || format(new Date(prevMsg.createdAt), 'yyyy-MM-dd') !== format(new Date(msg.createdAt), 'yyyy-MM-dd');
                
                return (
                  <div key={msg.id} className="space-y-4">
                    {showDate && (
                      <div className="flex justify-center">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                          {format(new Date(msg.createdAt), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                    <div className={cn("flex items-end gap-2", isMine ? "justify-end" : "justify-start")}>
                      {!isMine && (
                        <Avatar className="h-8 w-8 border border-slate-200 shrink-0 mb-1">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.fullName}`} />
                          <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn("max-w-[70%] group relative")}>
                        <div className={cn(
                          "p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                          isMine 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                        )}>
                          {msg.content}
                        </div>
                        <div className={cn(
                          "mt-1.5 flex items-center gap-1.5",
                          isMine ? "justify-end" : "justify-start"
                        )}>
                          <span className="text-[10px] font-bold text-slate-400">
                            {format(new Date(msg.createdAt), 'HH:mm')}
                          </span>
                          {isMine && (
                            msg.isRead ? <CheckCircle2 size={12} className="text-blue-500" /> : <Check size={12} className="text-slate-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500/20 transition-all duration-300"
              >
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                >
                  <Paperclip size={20} />
                </Button>
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1 border-none bg-transparent focus-visible:ring-0 shadow-none h-10 font-medium text-slate-900 placeholder:text-slate-400"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 animate-pulse">
              <MessageSquare size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Communication Hub</h3>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
              Connect with teachers, parents, and administrators. Select a conversation to start messaging.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <Avatar key={i} className="h-10 w-10 border-4 border-white shadow-sm">
                    <AvatarImage src={`https://i.pravatar.cc/100?u=${i}`} />
                  </Avatar>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">
                84 Team Members<br />Active Now
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
