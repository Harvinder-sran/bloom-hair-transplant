import { useState } from "react";
import { ChatKitPanel } from "./components/ChatKitPanel";
import { WidgetButton } from "./components/WidgetButton";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Widget Popup */}
      <div className={`widget-container ${isOpen ? "widget-open" : "widget-closed"}`}>
        <ChatKitPanel onClose={() => setIsOpen(false)} />
      </div>

      {/* Widget Toggle Button */}
      <WidgetButton onClick={toggleWidget} isOpen={isOpen} />
    </>
  );
}
