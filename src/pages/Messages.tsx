import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Smile, 
  CheckCheck, 
  Clock,
  Filter,
  Circle,
  Hash,
  AtSign,
  UserCircle,
  MessageSquare
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { toast } from "sonner";
import { apiService } from "@/lib/api";
import { format } from "date-fns";

const COMMON_EMOJIS = ["😊", "😂", "🥰", "😍", "🤩", "😎", "🤔", "🧐", "🙄", "😴", "😮", "😢", "🎉", "✨", "🔥", "👍", "🙌", "👏", "🙏", "❤️", "✅", "🚀", "💡", "📅"];

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

interface Contact {
  id: number;
  name: string;
  role: string;
  status: "online" | "offline" | "away";
  lastMessage?: string;
  unreadCount?: number;
  lastMessageTime?: string;
}

export default function Messages({ user }: { user: any }) {
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: string; url: string } | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [msgRes, usersRes] = await Promise.all([
          apiService.getMessages({ userId: user.id }),
          apiService.getUsers()
        ]);
        
        const mData = Array.isArray(msgRes.data) ? msgRes.data : (msgRes.data?.data || []);
        const uData = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || []);
        
        // Transform users to contacts
        const contactsList: Contact[] = uData
          .filter((u: any) => u.id !== user.id)
          .map((u: any) => {
            const userMessages = mData.filter((m: any) => m.senderId === u.id || m.receiverId === u.id);
            const lastMsg = userMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
            
            return {
              id: u.id,
              name: u.fullName || u.username,
              role: u.role,
              status: "online", // Mock status
              lastMessage: lastMsg?.content,
              unreadCount: userMessages.filter((m: any) => m.receiverId === user.id && !m.isRead).length,
              lastMessageTime: lastMsg ? format(new Date(lastMsg.createdAt), 'HH:mm') : undefined
            };
          });

        setMessages(mData);
        setAllContacts(contactsList);
        
        if (contactsList.length > 0 && !selectedContact) {
          setSelectedContact(contactsList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load communications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedContact, messages, isTyping]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !attachment) || !selectedContact) return;

    try {
      const msgData = {
        senderId: user.id,
        receiverId: selectedContact.id,
        subject: "Direct Message",
        content: messageText,
        type: "Direct"
      };

      const res = await apiService.sendMessage(msgData);
      const savedMsg = res.data?.data || res.data;
      
      setMessages(prev => [...prev, savedMsg]);
      
      // Update contact list
      setAllContacts(prev => prev.map(c => 
        c.id === selectedContact.id ? { 
          ...c, 
          lastMessage: messageText, 
          lastMessageTime: format(new Date(), 'HH:mm') 
        } : c
      ));

      setMessageText("");
      setAttachment(null);
      toast.success("Message sent");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Message delivery failed");
    }
  };

  const filteredContacts = allContacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || c.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const conversationMessages = selectedContact ? messages.filter(m => 
    (m.senderId === user.id && m.receiverId === selectedContact.id) ||
    (m.senderId === selectedContact.id && m.receiverId === user.id)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      });
      toast.success(`File "${file.name}" attached`);
    }
  };

  const insertMention = (staffName: string) => {
    const textBeforeMention = messageText.substring(0, messageText.lastIndexOf("@"));
    const newText = textBeforeMention + "@" + staffName + " ";
    setMessageText(newText);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessageText(value);

    const lastChar = value[value.length - 1];
    const atIndex = value.lastIndexOf("@");
    
    if (atIndex !== -1 && (atIndex === 0 || value[atIndex - 1] === " ")) {
      const search = value.substring(atIndex + 1);
      if (!search.includes(" ")) {
        setShowMentions(true);
        setMentionSearch(search);
        return;
      }
    }
    setShowMentions(false);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Inaugurating Channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-blue-600 p-4 rounded-[1.25rem] text-white shadow-2xl shadow-blue-200 transition-transform hover:rotate-3">
             <MessageSquare size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">Communications</h1>
            <p className="text-slate-400 font-bold mt-1 text-xs sm:text-sm uppercase tracking-widest leading-none">Internal messaging and notification center.</p>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-280px)] flex bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Messages</h2>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <div className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-full transition-colors border-none bg-transparent outline-none cursor-pointer",
                      filterRole !== "all" ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-100"
                    )}>
                      <Filter size={18} />
                    </div>
                  }
                />
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1">Filter by Role</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100" />
                    {["all", "superadmin", "admin", "teacher", "parent", "student"].map((r) => (
                      <DropdownMenuItem 
                        key={r}
                        onClick={() => setFilterRole(r)} 
                        className={cn("rounded-lg cursor-pointer capitalize", filterRole === r && "bg-blue-50 text-blue-600 font-bold")}
                      >
                        {r === "all" ? "All Contacts" : r}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search contacts..." 
                className="pl-9 bg-slate-50 border-none focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
            {filteredContacts.map((contact) => (
              <motion.div
                layout
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "px-4 py-3 cursor-pointer flex items-center gap-3 transition-all relative group mx-2 rounded-xl mb-1",
                  selectedContact?.id === contact.id ? "bg-white shadow-sm ring-1 ring-slate-100" : "hover:bg-slate-100"
                )}
              >
                <div className="relative">
                  <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                      {contact.name ? contact.name.split(" ").map(n => n[0]).join("") : "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                    contact.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                  )}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn(
                      "text-sm truncate leading-none",
                      contact.unreadCount ? "font-bold text-slate-900" : "font-medium text-slate-700"
                    )}>
                      {contact.name}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{contact.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 truncate">{contact.lastMessage || contact.role}</p>
                    {contact.unreadCount ? (
                      <Badge className="h-4 min-w-[16px] px-1 bg-blue-600 text-white border-none flex items-center justify-center text-[10px] rounded-full">
                        {contact.unreadCount}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col items-stretch bg-white">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.name}`} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {selectedContact.name ? selectedContact.name.split(" ").map(n => n[0]).join("") : "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">{selectedContact.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <Circle size={8} fill={selectedContact.status === "online" ? "#10b981" : "#94a3b8"} className={selectedContact.status === "online" ? "text-emerald-500" : "text-slate-400"} />
                    <span className="text-xs text-slate-500 font-medium">{selectedContact.status === "online" ? "Active Now" : "Offline"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-400">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-400">
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-400">
                  <Search size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-400">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar"
            >
              {conversationMessages.map((msg, idx) => {
                const isMine = msg.senderId === user.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex w-full mb-4",
                      isMine ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex flex-col max-w-[70%]",
                      isMine ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-sm shadow-sm",
                        isMine 
                          ? "bg-blue-600 text-white rounded-br-none" 
                          : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                      )}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 px-1 text-[10px] font-bold text-slate-400 tracking-tighter">
                        {format(new Date(msg.createdAt), 'HH:mm')}
                        {isMine && <CheckCheck size={12} className={msg.isRead ? "text-blue-500" : "text-slate-300"} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 flex items-end gap-2 transition-all focus-within:border-blue-200">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-slate-400 hover:text-blue-600 rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={18} />
                </Button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 resize-none max-h-32 min-h-[40px] focus:outline-none"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={cn(
                    "h-10 w-10 rounded-xl p-0 shrink-0",
                    messageText.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-200 text-slate-400"
                  )}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <UserCircle size={60} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Your Communication Hub</h3>
            <p className="text-slate-500 text-center mt-2 px-12">
              Select a staff member or student to start a secure conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
