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
          <div className="bg-[#5a67f2] p-4 rounded-2xl text-white shadow-2xl shadow-[#5a67f2]/20 transition-transform hover:rotate-3">
             <MessageSquare size={28} />
          </div>
          <div>

             <div className="space-y-1 sm:space-y-1 overflow-hidden">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight truncate">Communications</h1>
            <p className="text-slate-600 font-medium text-xs sm:text-sm truncate sm:whitespace-normal">Internal messaging and notification center.</p>
          </div>
           
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-280px)] flex bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900 font-semibold tracking-tight">Messages</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#5a67f2] hover:bg-[#5a67f2]/10 rounded-full">
                  <Filter size={16} />
                </Button>
                <Button size="icon" className="h-8 w-8 bg-[#5a67f2] hover:bg-[#4b56d3] text-white shadow-sm shadow-[#5a67f2]/20 rounded-xl transition-all hover:scale-105 rounded-xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                </Button>
              </div>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <Input 
                placeholder="Search contacts..." 
                className="pl-9 bg-white border border-slate-200 rounded-xl h-10 text-sm focus-visible:ring-[#5a67f2]/20 focus-visible:border-[#5a67f2]/50 shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between gap-1 mb-2">
              <Button variant="ghost" className="h-8 rounded-xl bg-indigo-50/50 text-[#5a67f2] font-semibold text-xs px-3 hover:bg-indigo-100/50 flex gap-2 w-full justify-between">
                <span>All</span>

              </Button>
              <Button variant="ghost" className="h-8 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-semibold text-xs px-3 flex gap-2 w-full justify-between">
                <span>Unread</span>
                
              </Button>
              <Button variant="ghost" className="h-8 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-semibold text-xs px-3 w-full text-left justify-start">
                Groups
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
            {Array.isArray(filteredContacts) && filteredContacts.map((contact) => (
              <motion.div
                layout
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "px-4 py-3.5 cursor-pointer flex items-center gap-4 transition-all relative group mx-2 rounded-xl mb-1",
                  selectedContact?.id === contact.id ? "bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] border border-slate-100" : "hover:bg-slate-100/50 border border-transparent"
                )}
              >
                <div className="relative">
                  <Avatar className="h-[46px] w-[46px] shadow-sm">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                      {contact.name ? contact.name.split(" ").map(n => n[0]).join("") : "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-white scale-100 transition-transform group-hover:scale-110",
                    contact.status === "online" ? "bg-[#10b981]" : "bg-slate-300"
                  )}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className={cn(
                        "text-[13px] truncate leading-none font-bold",
                        contact.unreadCount ? "text-slate-900" : "text-slate-800"
                      )}>
                        {contact.name}
                      </p>
                      {contact.status === "online" && <Circle size={6} className="text-[#10b981] fill-[#10b981] flex-shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2 font-medium bg-white px-0.5">{contact.lastMessageTime || "15:24"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] text-slate-500/90 truncate leading-tight font-medium">{contact.lastMessage || contact.role}</p>
                    {contact.unreadCount ? (
                      <Badge className="h-[18px] min-w-[18px] px-1 bg-[#5a67f2] text-white border-none flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm shadow-[#5a67f2]/20 flex-shrink-0">
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
              <div className="flex items-center gap-3.5">
                <Avatar className="h-[46px] w-[46px] shadow-sm">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.name}`} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {selectedContact.name ? selectedContact.name.split(" ").map(n => n[0]).join("") : "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight tracking-tight mb-0.5">{selectedContact.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <Circle size={8} fill={selectedContact.status === "online" ? "#10b981" : "#94a3b8"} className={selectedContact.status === "online" ? "text-[#10b981]" : "text-slate-400"} />
                    <span className="text-[11px] text-slate-500 font-semibold">{selectedContact.status === "online" ? "Active Now" : "Offline"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pr-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#5a67f2]/10 text-[#5a67f2] hover:text-[#5a67f2] transition-colors">
                  <Phone size={18} strokeWidth={2.5} />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#5a67f2]/10 text-[#5a67f2] hover:text-[#5a67f2] transition-colors">
                  <Video size={18} strokeWidth={2.5} />
                </Button>
                <div className="w-px h-5 bg-slate-200 mx-1"></div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-[#5a67f2] hover:text-slate-700 transition-colors">
                  <Search size={18} strokeWidth={2.5} />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-[#5a67f2] hover:text-slate-700 transition-colors">
                  <MoreVertical size={18} strokeWidth={2.5} />
                </Button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-white relative custom-scrollbar"
            >
              
              <div className="flex justify-center mb-6">
                 <div className="bg-white border border-slate-100 px-4 py-1.5 rounded-full text-[11px] font-bold text-slate-400/80 uppercase tracking-widest shadow-sm">Today</div>
              </div>
              {Array.isArray(conversationMessages) && conversationMessages.map((msg, idx) => {
                const isMine = msg.senderId === user.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex w-full mb-6 group",
                      isMine ? "justify-end" : "justify-start gap-3"
                    )}
                  >
                    {!isMine && (
                       <div className="flex-shrink-0 mt-auto mb-5">
                          <Avatar className="h-10 w-10 shadow-sm border border-slate-100">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.name}`} />
                          </Avatar>
                       </div>
                    )}
                    <div className={cn(
                      "flex flex-col relative max-w-[75%]",
                      isMine ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-5 py-3.5 rounded-[22px] text-[13px] leading-relaxed shadow-sm",
                        isMine 
                          ? "bg-[#e5e7ff] text-[#424cb5] rounded-br-[4px] border border-[#d2d6ff]" 
                          : "bg-slate-50/80 border border-slate-100 text-slate-700 rounded-bl-[4px]"
                      )}>
                        {msg.content}
                      </div>
                      <div className={cn(
                        "flex items-center gap-1.5 mt-2 text-[11px] font-bold tracking-tight",
                         isMine ? "text-[#5a67f2]/80 pr-1" : "text-slate-400 pl-1"
                      )}>
                        {format(new Date(msg.createdAt), 'HH:mm')}
                        {isMine && <CheckCheck size={14} className={msg.isRead ? "text-[#5a67f2]" : "text-[#5a67f2]/60"} strokeWidth={3} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-4 md:p-6 bg-white border-t border-slate-100">
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-2 flex items-end gap-2 transition-all focus-within:border-[#5a67f2]/40 focus-within:shadow-[0_4px_20px_rgba(90,103,242,0.08)]">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-slate-400 hover:text-[#5a67f2] hover:bg-slate-50 rounded-xl flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={20} strokeWidth={2.5} />
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
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] md:text-sm font-medium text-slate-700 py-2.5 px-3 resize-none max-h-32 min-h-[44px] focus:outline-none placeholder:text-slate-400"
                />
                 <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl flex-shrink-0"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile size={20} strokeWidth={2.5} />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={cn(
                    "h-10 w-10 md:h-11 md:w-11 rounded-xl p-0 shrink-0 shadow-sm transition-all duration-300",
                    messageText.trim() ? "bg-[#5a67f2] hover:bg-[#4b56d3] shadow-[#5a67f2]/20 hover:scale-105" : "bg-slate-100 text-slate-400"
                  )}
                >
                  <Send size={18} strokeWidth={2.5} className={messageText.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
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
