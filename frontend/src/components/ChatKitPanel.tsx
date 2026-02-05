import { useMemo, useEffect } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";
import { X } from "lucide-react";

interface ChatKitPanelProps {
  onClose: () => void;
}

export function ChatKitPanel({ onClose }: ChatKitPanelProps) {
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId),
    []
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
  });

  // Handle Enter key to send message
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Check if target is the chat input textarea
      if (target.tagName === 'TEXTAREA' && (
        target.getAttribute('placeholder')?.toLowerCase().includes('message') ||
        target.closest('.chat-content')
      )) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          // Find the submit button
          const form = target.closest('form');
          const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement;

          if (submitBtn && !submitBtn.disabled) {
            submitBtn.click();
          }
        }
      }
    };

    // Attach to the document or specific container if possible
    // Using capture to ensure we intercept before default behavior
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="agent-info">
          <div className="avatar">
            <img
              src="https://api.dicebear.com/9.x/micah/svg?seed=Riya&backgroundColor=b6e3f4"
              alt="Riya"
            />
          </div>
          <div className="agent-text">
            <h3 className="agent-name">Riya</h3>
            <span className="agent-status">Bloom Hair Transplant</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Content */}
      <div className="chat-content">
        <ChatKit control={chatkit.control} className="h-full w-full" />
      </div>
    </div>
  );
}
