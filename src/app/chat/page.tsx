"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/common/navbar';
import { useChatContext } from '@/components/chat/ChatManager';
import { MessageCircle, Search, Clock, ChevronRight, User as UserIcon } from 'lucide-react';

export default function ChatPage() {
    const { data: session } = useSession();
    const { openChat } = useChatContext();
    const [conversations, setConversations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/chat/conversations');
            const data = await res.json();
            if (res.ok) {
                setConversations(data.conversations);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchConversations();
        }
    }, [session]);

    if (!session) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 pt-32">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">Your Messages</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Real-time marketplace communication</p>
                    </div>
                    
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH CONVERSATIONS..."
                            className="bg-white border border-slate-200/80 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black tracking-widest uppercase outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50 transition-all w-full md:w-80 shadow-sm"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 animate-pulse h-24"></div>
                        ))
                    ) : conversations.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 border border-slate-100 text-center space-y-6">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <MessageCircle className="w-10 h-10 text-slate-200" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase">No messages yet</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Start a conversation from any product page</p>
                            </div>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const recipient = conv.participants.find((p: any) => p._id !== (session.user as any).id);
                            const unreadCount = conv.unreadCount?.[(session.user as any).id] || 0;
                            
                            return (
                                <button
                                    key={conv._id}
                                    onClick={() => openChat(recipient._id, conv.productId?._id)}
                                    className="w-full bg-white hover:bg-slate-50/50 active:scale-[0.99] rounded-[2rem] p-4 md:p-5 border border-slate-100 flex items-center gap-3 md:gap-4 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
                                >
                                    {unreadCount > 0 && (
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-600 to-pink-600" />
                                    )}
                                    
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                                            {recipient?.image ? (
                                                <img src={recipient.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-7 h-7 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-[3px] border-white rounded-full" />
                                    </div>

                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`text-sm md:text-base font-black truncate uppercase tracking-tight ${unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {recipient?.name}
                                            </h4>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                                                <Clock className="w-3 h-3" />
                                                {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between gap-4">
                                            <p className={`text-xs truncate ${unreadCount > 0 ? 'font-black text-slate-900' : 'font-medium text-slate-400'}`}>
                                                {conv.lastMessage?.content || 'Started a conversation'}
                                            </p>
                                            {unreadCount > 0 && (
                                                <div className="px-2 py-0.5 bg-violet-600 rounded-full text-[9px] font-black text-white uppercase tracking-widest animate-pulse">
                                                    {unreadCount} New
                                                </div>
                                            )}
                                        </div>
                                        
                                        {conv.productId && (
                                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Regarding:</span>
                                                <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest truncate">{conv.productId.title}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
