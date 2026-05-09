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
  UserCircle
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

const COMMON_EMOJIS = ["😊", "😂", "🥰", "😍", "🤩", "😎", "🤔", "🧐", "🙄", "😴", "😮", "😢", "🎉", "✨", "🔥", "👍", "🙌", "👏", "🙏", "❤️", "✅", "🚀", "💡", "📅"];

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
}

interface Contact {
  id: string;
  schoolId: string;
  name: string;
  role: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastMessage?: string;
  unreadCount?: number;
  lastMessageTime?: string;
}

const contacts: Contact[] = [
  { id: "1", schoolId: "SCH001", name: "Prof. Robert Wilson", role: "Principal", status: "online", lastMessage: "Let's discuss the annual report.", unreadCount: 2, lastMessageTime: "10:30 AM" },
  { id: "2", schoolId: "SCH001", name: "Sarah Taylor", role: "Teacher", status: "offline", lastMessage: "The assignment grades are updated.", lastMessageTime: "Yesterday" },
  { id: "3", schoolId: "SCH001", name: "Michael David", role: "Student", status: "online", lastMessage: "Sir, I have a doubt in Physics.", lastMessageTime: "9:45 AM" },
  { id: "4", schoolId: "SCH001", name: "Grade 10-A Group", role: "Classroom", status: "online", lastMessage: "Exam schedule is out!", unreadCount: 5, lastMessageTime: "8:20 AM" },
  { id: "5", schoolId: "SCH001", name: "James Smith", role: "Parent", status: "away", lastMessage: "Thank you for the update.", lastMessageTime: "May 10" },
  { id: "6", schoolId: "SCH002", name: "Emily Brown", role: "Admin", status: "online", lastMessage: "Salary has been credited.", lastMessageTime: "May 09" },
];

const initialMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", senderId: "1", text: "Good morning! Hope you are doing well.", timestamp: "10:25 AM", status: "read" },
    { id: "2", senderId: "me", text: "Good morning Principal. Yes, everything is on track.", timestamp: "10:27 AM", status: "read" },
    { id: "3", senderId: "1", text: "Great. Can we meet at 2 PM to discuss the annual report?", timestamp: "10:28 AM", status: "delivered" },
    { id: "4", senderId: "1", text: "I have some new directives from the board.", timestamp: "10:29 AM", status: "delivered" },
  ],
  "3": [
    { id: "1", senderId: "3", text: "Sir, I'm stuck on the quantum mechanics problem.", timestamp: "9:40 AM", status: "read" },
    { id: "2", senderId: "3", text: "Should I use the Schrodinger equation for this cases?", timestamp: "9:41 AM", status: "read" },
    { id: "3", senderId: "me", text: "Yes Michael, that approach is correct. Check the potential barrier conditions.", timestamp: "9:44 AM", status: "read" },
    { id: "4", senderId: "3", text: "Thank you! I will try again now.", timestamp: "9:45 AM", status: "read" },
  ]
};

export default function Messages({ user }: { user: any }) {
  const [allContacts, setAllContacts] = useState<Contact[]>(() => {
    if (user.role === "superadmin") return contacts;
    return contacts.filter(c => c.schoolId === user.schoolId);
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  useEffect(() => {
    if (allContacts.length > 0 && !selectedContact) {
      setSelectedContact(allContacts[0]);
    }
  }, [allContacts]);

  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: string; url: string } | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const staffMembers = allContacts.filter(c => c.role !== "Student" && c.role !== "Parent" && c.role !== "Classroom");

  // Handle click outside mentions list
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mentionRef.current && !mentionRef.current.contains(event.target as Node)) {
        setShowMentions(false);
      }
    };

    if (showMentions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMentions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedContact, messages, isTyping]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload
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

  const handleSendMessage = () => {
    if ((!messageText.trim() && !attachment) || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
      attachment: attachment || undefined
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));

    // Update last message in contact list
    setAllContacts(prev => prev.map(c => 
      c.id === selectedContact.id ? { 
        ...c, 
        lastMessage: attachment ? `Sent a file: ${attachment.name}` : messageText, 
        lastMessageTime: newMessage.timestamp 
      } : c
    ));

    setMessageText("");
    setAttachment(null);
    setShowMentions(false);
    setShowEmojiPicker(false);
    
    // Simulate reply
    const replyContactId = selectedContact.id;
    setTimeout(() => {
      if (selectedContact?.id === replyContactId) {
        setIsTyping(true);
      }
      
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const replyText = "Understood, thanks for the update!";
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: replyContactId,
          text: replyText,
          timestamp,
          status: "read"
        };
        
        setMessages(prev => ({
          ...prev,
          [replyContactId]: [...(prev[replyContactId] || []), reply]
        }));
        
        setAllContacts(prev => prev.map(c => {
          if (c.id === replyContactId) {
            const isCurrentlySelected = selectedContact?.id === replyContactId;
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: timestamp,
              unreadCount: isCurrentlySelected ? 0 : (c.unreadCount || 0) + 1
            };
          }
          return c;
        }));

        if (selectedContact?.id === replyContactId) {
          setIsTyping(false);
        }
      }, 1500);
    }, 1000);
  };

  const filteredContacts = allContacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || c.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const currentMessages = selectedContact ? (messages[selectedContact.id] || []) : [];

  return (
    <div className="h-[calc(100vh-180px)] flex bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
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
                  <DropdownMenuItem onClick={() => setFilterRole("all")} className={cn("rounded-lg cursor-pointer", filterRole === "all" && "bg-blue-50 text-blue-600 font-bold")}>
                    All Contacts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("Principal")} className={cn("rounded-lg cursor-pointer", filterRole === "Principal" && "bg-blue-50 text-blue-600 font-bold")}>
                    Principal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("Teacher")} className={cn("rounded-lg cursor-pointer", filterRole === "Teacher" && "bg-blue-50 text-blue-600 font-bold")}>
                    Teachers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("Student")} className={cn("rounded-lg cursor-pointer", filterRole === "Student" && "bg-blue-50 text-blue-600 font-bold")}>
                    Students
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("Parent")} className={cn("rounded-lg cursor-pointer", filterRole === "Parent" && "bg-blue-50 text-blue-600 font-bold")}>
                    Parents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("Admin")} className={cn("rounded-lg cursor-pointer", filterRole === "Admin" && "bg-blue-50 text-blue-600 font-bold")}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("Classroom")} className={cn("rounded-lg cursor-pointer", filterRole === "Classroom" && "bg-blue-50 text-blue-600 font-bold")}>
                    Groups
                  </DropdownMenuItem>
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
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Chats</p>
          </div>
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
                  <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                    {contact.name ? contact.name.split(" ").map(n => n[0]).join("") : "C"}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                  contact.status === "online" ? "bg-emerald-500" : 
                  contact.status === "away" ? "bg-amber-500" : "bg-slate-300"
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
                  <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                  {contact.unreadCount ? (
                    <Badge className="h-4 min-w-[16px] px-1 bg-blue-600 text-white border-none flex items-center justify-center text-[10px] rounded-full">
                      {contact.unreadCount}
                    </Badge>
                  ) : null}
                </div>
              </div>
              {selectedContact?.id === contact.id && (
                <motion.div 
                  layoutId="activeContactIndicator"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-full"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col items-stretch bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between backdrop-blur-md bg-white/80 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {selectedContact.name ? selectedContact.name.split(" ").map(n => n[0]).join("") : "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">{selectedContact.name}</h3>
                <div className="flex items-center gap-1.5">
                  <Circle size={8} fill={selectedContact.status === "online" ? "#10b981" : "#94a3b8"} className={selectedContact.status === "online" ? "text-emerald-500" : "text-slate-400"} />
                  <span className="text-xs text-slate-500 font-medium">{selectedContact.status === "online" ? "Active Now" : "Last seen 2h ago"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-500">
                <Phone size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-500">
                <Video size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-500">
                <Search size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 text-slate-500">
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>

          {/* Messages Window */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95"
          >
            <div className="flex flex-col items-center mb-8">
              <Badge variant="outline" className="bg-white/80 text-slate-400 border-slate-100 px-3 py-1 text-[10px] font-bold">
                MAY 12, 2024
              </Badge>
            </div>

            <AnimatePresence mode="popLayout">
              {currentMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex w-full mb-4",
                    msg.senderId === "me" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex flex-col max-w-[70%]",
                    msg.senderId === "me" ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm shadow-sm",
                      msg.senderId === "me" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                    )}>
                      {msg.text && <p>{msg.text}</p>}
                      {msg.attachment && (
                        <div className={cn(
                          "mt-2 p-2 rounded-lg flex items-center gap-2",
                          msg.senderId === "me" ? "bg-blue-700/50" : "bg-slate-50"
                        )}>
                          <Paperclip size={14} className={msg.senderId === "me" ? "text-blue-200" : "text-slate-400"} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold truncate tracking-tight">{msg.attachment.name}</p>
                            <a 
                              href={msg.attachment.url} 
                              download={msg.attachment.name}
                              className={cn(
                                "text-[9px] font-black uppercase hover:underline",
                                msg.senderId === "me" ? "text-blue-200" : "text-blue-600"
                              )}
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] font-medium text-slate-400">{msg.timestamp}</span>
                      {msg.senderId === "me" && (
                        <CheckCheck size={12} className={cn(
                          msg.status === "read" ? "text-blue-500" : "text-slate-300"
                        )} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 relative">
            {showMentions && (
              <motion.div 
                ref={mentionRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-4 bg-white border border-slate-100 rounded-xl shadow-2xl p-2 mb-2 w-64 z-50 overflow-hidden"
              >
                <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-widest">Mention Staff</p>
                <div className="max-h-48 overflow-y-auto custom-scrollbar pt-1">
                  {staffMembers
                    .filter(s => s.name.toLowerCase().includes(mentionSearch.toLowerCase()))
                    .map(staff => (
                      <div 
                        key={staff.id}
                        onClick={() => insertMention(staff.name)}
                        className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 rounded-lg transition-colors group"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[8px] bg-blue-100 text-blue-600">{staff.name ? staff.name.split(" ").map(n => n[0]).join("") : "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700">{staff.name}</p>
                          <p className="text-[9px] text-slate-400 leading-none">{staff.role}</p>
                        </div>
                      </div>
                    ))
                  }
                  {staffMembers.filter(s => s.name.toLowerCase().includes(mentionSearch.toLowerCase())).length === 0 && (
                    <p className="text-[10px] text-slate-400 text-center py-2 italic">No staff found</p>
                  )}
                </div>
              </motion.div>
            )}

            {attachment && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Paperclip size={14} className="text-blue-500" />
                  <p className="text-xs font-medium text-blue-800 truncate">{attachment.name}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full hover:bg-blue-100 text-blue-600"
                  onClick={() => setAttachment(null)}
                >
                  <Filter size={12} className="rotate-45" />
                </Button>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 flex items-end gap-2 shadow-inner group-focus-within:border-blue-200 transition-all">
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex items-center gap-1 pb-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={18} />
                </Button>
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger
                    render={
                      <div className="flex items-center justify-center h-9 w-9 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-none bg-transparent outline-none cursor-pointer">
                        <Smile size={18} />
                      </div>
                    }
                  />
                  <PopoverContent side="top" align="start" className="p-3 w-64 border-slate-100 shadow-2xl rounded-2xl">
                    <div className="grid grid-cols-6 gap-1">
                      {COMMON_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setMessageText(prev => prev + emoji);
                            textareaRef.current?.focus();
                          }}
                          className="h-8 w-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <textarea
                ref={textareaRef}
                rows={1}
                value={messageText}
                onChange={handleTextareaChange}
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
                disabled={!messageText.trim() && !attachment}
                className={cn(
                  "h-10 w-10 rounded-xl p-0 transition-all shrink-0 mb-0.5",
                  messageText.trim() || attachment ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                <Send size={18} />
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-4 px-2">
              <button 
                className="text-[10px] font-bold text-slate-400 flex items-center gap-1 hover:text-blue-600 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Hash size={10} /> ATTACH DOCUMENT
              </button>
              <button 
                className="text-[10px] font-bold text-slate-400 flex items-center gap-1 hover:text-blue-600 transition-colors"
                onClick={() => {
                  setMessageText(prev => prev + "@");
                  setShowMentions(true);
                  textareaRef.current?.focus();
                }}
              >
                <AtSign size={10} /> MENTION STAFF
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-100/50">
            <UserCircle size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Your Inbox</h3>
          <p className="text-slate-500 max-w-sm text-center mt-2 px-6">
            Select a conversation from the sidebar to start messaging with staff, parents, or students.
          </p>
          <Button className="mt-8 bg-blue-600 hover:bg-blue-700" onClick={() => toast.info("New message feature coming soon!")}>
            New Conversation
          </Button>
        </div>
      )}
    </div>
  );
}
