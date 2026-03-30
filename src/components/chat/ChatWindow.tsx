"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useChat } from '@/hooks/use-chat';
import { 
    X, 
    Send, 
    Smile, 
    Paperclip, 
    MoreVertical, 
    ChevronLeft,
    ChevronRight,
    User as UserIcon,
    Loader2,
    Pencil,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatWindowProps {
    conversationId: string;
    recipientId: string;
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, recipientId, onClose }) => {
    const { data: session } = useSession();
    const { messages, isLoading, sendMessage } = useChat(conversationId);
    const [input, setInput] = useState('');
    const [recipient, setRecipient] = useState<any>(null);
    const [conversation, setConversation] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { updateMessage, deleteMessage } = useChat(conversationId);
    const [editingMsgId, setEditingMsgId] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Conversation details (for product info)
                const convRes = await fetch(`/api/chat/conversations/${conversationId}`);
                const convData = await convRes.json();
                if (convRes.ok) setConversation(convData.conversation);

                // Fetch Recipient details
                const res = await fetch(`/api/user/${recipientId}`);
                const data = await res.json();
                if (res.ok) setRecipient(data.user);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, [conversationId, recipientId]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        const content = input;
        
        try {
            if (editingMsgId) {
                await updateMessage(editingMsgId, content);
                setEditingMsgId(null);
            } else {
                await sendMessage(content);
            }
            setInput('');
        } catch (err) {
            console.error("Failed to process message:", err);
            // On error, we keep the input so user can retry
        }
    };

    const startEditing = (msg: any) => {
        setEditingMsgId(msg._id);
        setInput(msg.content);
    };

    const cancelEditing = () => {
        setEditingMsgId(null);
        setInput('');
    };

    const handleDelete = async (msgId: string) => {
        if (window.confirm("Delete this message?")) {
            try {
                await deleteMessage(msgId);
            } catch (err) {
                console.error("Failed to delete:", err);
            }
        }
    };

    return (
        <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] animate-in fade-in duration-300" onClick={onClose} />
        
        <div className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[100] p-0 sm:p-6 pointer-events-none">
            <div className="w-full sm:w-[500px] h-[600px] sm:h-[700px] max-h-screen sm:max-h-[85vh] bg-white sm:rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-hidden border border-slate-100 pointer-events-auto">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="sm:hidden p-1 hover:bg-white/10 rounded-lg">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
                        {recipient?.image ? (
                            <img src={recipient.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest">{recipient?.name || 'Loading...'}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Active Now</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors hidden sm:block">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {conversation?.productId && (
                    <div className="mb-6 animate-fade-in">
                        <div className="bg-white rounded-2xl p-3 border border-slate-100 flex gap-3 shadow-sm hover:shadow-md transition-all">
                            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-50">
                                {conversation.productId.thumbnail ? (
                                    <img src={conversation.productId.thumbnail} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">🏪</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 py-0.5">
                                <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-0.5">Item in discussion</p>
                                <h5 className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{conversation.productId.title}</h5>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-sm font-black text-slate-900 tracking-tighter">{conversation.productId.price.toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-slate-400">ETB</span>
                                </div>
                            </div>
                            <div className="flex items-center pr-1">
                                <button 
                                    className="p-1.5 rounded-full text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors" 
                                    onClick={() => window.open(`/products/${conversation.productId._id}`, '_blank')}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId?.toString() === (session?.user as any)?.id?.toString();
                        return (
                            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group/msg`}>
                                <div className={`relative max-w-[80%] p-2.5 md:p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    isMe 
                                    ? 'bg-gradient-to-br from-violet-600 to-pink-600 text-white rounded-br-none' 
                                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                                }`}>
                                    {msg.isDeleted ? (
                                        <span className="italic opacity-60 text-xs">This message was deleted</span>
                                    ) : (
                                        <>
                                            {msg.content}
                                            {msg.isEdited && (
                                                <span className={`text-[8px] ml-1.5 opacity-50 font-black uppercase tracking-tighter`}>
                                                    (edited)
                                                </span>
                                            )}
                                        </>
                                    )}

                                    <div className={`text-[9px] mt-1.5 font-bold uppercase tracking-widest ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    {/* Action Icons (Desktop Hover Only) */}
                                    {isMe && !msg.isDeleted && (
                                        <div className="absolute top-1/2 -translate-y-1/2 -left-12 opacity-0 group-hover/msg:opacity-100 transition-opacity flex gap-1 p-1">
                                            <button 
                                                onClick={() => startEditing(msg)}
                                                className="p-1 px-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-slate-400 hover:text-violet-600 border border-slate-100 shadow-sm transition-all"
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(msg._id)}
                                                className="p-1 px-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-slate-400 hover:text-rose-600 border border-slate-100 shadow-sm transition-all"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                {editingMsgId && (
                    <div className="mb-2 px-3 py-1 bg-violet-50 rounded-lg flex items-center justify-between animate-in slide-in-from-bottom-2">
                        <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1.5">
                            <Pencil className="w-3 h-3" /> Editing message
                        </span>
                        <button onClick={cancelEditing} className="text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase underline tracking-widest">Cancel</button>
                    </div>
                )}
                <form onSubmit={handleSend} className={`flex gap-2 items-center bg-slate-50 rounded-2xl p-2 pl-4 border ${editingMsgId ? 'border-violet-300' : 'border-slate-200/50'} focus-within:border-violet-400 transition-all`}>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-600 py-2"
                    />
                    <div className="flex items-center gap-1 pr-1">
                        <button type="button" className="p-2 text-slate-400 hover:text-violet-600 transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button 
                            type="submit"
                            disabled={!input.trim()}
                            className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-md shadow-violet-100 disabled:opacity-50 disabled:scale-100"
                        >
                            <Send className="w-5 h-5" fill="currentColor" />
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </>
    );
};

export default ChatWindow;
