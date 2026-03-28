"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import pusherClient from '@/lib/pusher-client';
import ChatWindow from './ChatWindow';

interface ChatContextType {
    isOpen: boolean;
    openChat: (recipientId: string, productId?: string) => void;
    closeChat: () => void;
    unreadTotal: number;
    activeConversationId: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [recipientInfo, setRecipientInfo] = useState<{ id: string, productId?: string } | null>(null);

    const fetchConversations = async () => {
        if (!session) return;
        try {
            const res = await fetch('/api/chat/conversations');
            
            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error("Invalid response from server");
            }

            if (res.ok) {
                const total = data.conversations.reduce((acc: number, conv: any) => {
                    const userId = (session.user as any).id;
                    return acc + (conv.unreadCount?.[userId] || 0);
                }, 0);
                setUnreadTotal(total);
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    };

    useEffect(() => {
        if (session) {
            fetchConversations();
            
            const userId = (session.user as any).id;
            const channel = pusherClient.subscribe(`user-${userId}`);
            
            channel.bind('notification', (data: any) => {
                if (data.type === 'new_message') {
                    fetchConversations();
                    // Optional: Show a toast or something
                }
            });

            return () => {
                pusherClient.unsubscribe(`user-${userId}`);
            };
        }
    }, [session]);

    const openChat = async (recipientId: string, productId?: string) => {
        if (!session) {
            window.location.href = '/auth/login';
            return;
        }
        
        try {
            const res = await fetch('/api/chat/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipientId, productId })
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error("Server error (Non-JSON)");
            }

            if (res.ok) {
                setActiveConversationId(data.conversation._id);
                setRecipientInfo({ id: recipientId, productId });
                setIsOpen(true);
            }
        } catch (err) {
            console.error('Error opening chat:', err);
        }
    };

    const closeChat = () => {
        setIsOpen(false);
        setActiveConversationId(null);
    };

    return (
        <ChatContext.Provider value={{ isOpen, openChat, closeChat, unreadTotal, activeConversationId }}>
            {children}
            {isOpen && activeConversationId && (
                <ChatWindow 
                    conversationId={activeConversationId} 
                    onClose={closeChat}
                    recipientId={recipientInfo?.id!}
                />
            )}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChatContext must be used within a ChatProvider');
    return context;
};
