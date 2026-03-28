"use client";

import { useState, useEffect, useCallback } from 'react';
import pusherClient from '@/lib/pusher-client';
import { useSession } from 'next-auth/react';

export const useChat = (conversationId?: string) => {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async () => {
        if (!conversationId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/chat/messages/${conversationId}`);
            
            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error("Server error");
            }

            if (res.ok) {
                setMessages(data.messages);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to fetch messages');
        } finally {
            setIsLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchMessages();

        if (conversationId) {
            const channel = pusherClient.subscribe(`chat-${conversationId}`);
            channel.bind('new-message', (newMessage: any) => {
                setMessages((prev) => {
                    // Avoid duplicates
                    if (prev.find(m => m._id === newMessage._id)) return prev;
                    return [...prev, newMessage];
                });
            });

            channel.bind('message-updated', (updatedMessage: any) => {
                setMessages((prev) => prev.map(m => 
                    m._id === updatedMessage._id 
                    ? { ...m, content: updatedMessage.content, isEdited: true } 
                    : m
                ));
            });

            channel.bind('message-deleted', (payload: { _id: string }) => {
                setMessages((prev) => prev.map(m => 
                    m._id === payload._id 
                    ? { ...m, content: 'This message was deleted', isDeleted: true } 
                    : m
                ));
            });

            return () => {
                pusherClient.unsubscribe(`chat-${conversationId}`);
            };
        }
    }, [conversationId, fetchMessages]);

    const sendMessage = async (content: string) => {
        if (!conversationId || !content.trim()) return;
        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, content })
            });
            
            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error("Message send failed (Non-JSON)");
            }
            if (!res.ok) {
                throw new Error(data.error || 'Failed to send message');
            }
            return data.message;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateMessage = async (messageId: string, content: string) => {
        try {
            const res = await fetch(`/api/chat/message/${messageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return data.message;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteMessage = async (messageId: string) => {
        try {
            const res = await fetch(`/api/chat/message/${messageId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return true;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        updateMessage,
        deleteMessage,
        refresh: fetchMessages
    };
};
