import { MessageCircle } from "lucide-react";

interface WidgetButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

export function WidgetButton({ onClick, isOpen }: WidgetButtonProps) {
    return (
        <button
            onClick={onClick}
            className="widget-button"
            aria-label={isOpen ? "Close chat" : "Open chat"}
        >
            {isOpen ? (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            ) : (
                <img src="/widget-icon.png" alt="Chat" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            )}
        </button>
    );
}
