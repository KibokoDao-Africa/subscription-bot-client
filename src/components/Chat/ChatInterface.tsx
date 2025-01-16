import React, { useState } from "react";
import { Send, Trash2, Home } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  action?: React.ReactNode;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (message: string) => void;
  onClear: () => void;
  onBackToMenu: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSend,
  onClear,
  onBackToMenu,
}) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <button onClick={onBackToMenu}>
          <Home />
        </button>
        <button onClick={onClear}>
          <Trash2 />
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isBot ? "bot" : "user"}`}>
            {msg.text}
            {msg.action && <div className="action">{msg.action}</div>}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>
          <Send />
        </button>
      </div>
    </div>
  );
};