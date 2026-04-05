"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/components/chat/ChatManager";

export const BrokerChatButton = ({ ownerId }: { ownerId: string }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { openChat } = useChatContext();

    const handleChatClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Preemptively stop Link click bubbling
        
        if (!session) {
            router.push('/auth/login?callbackUrl=/brokers');
            return;
        }
        openChat(ownerId, ""); 
    };

    return (
        <button
            onClick={handleChatClick}
            className="shrink-0 flex items-center justify-center px-4 h-9 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors font-medium text-sm"
        >
            Chat
        </button>
    );
};
