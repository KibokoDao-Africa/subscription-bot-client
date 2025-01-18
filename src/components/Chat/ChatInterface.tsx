import React, { useEffect, useState, useRef } from "react";
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
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };
  return (
    <div className="flex flex-col h-full bg-[#0E1621]">
      <div className="bg-[#17212b] p-3 flex justify-between items-center border-b border-gray-800">
        <button
          onClick={onBackToMenu}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Main Menu</span>
        </button>
        <button
          onClick={onClear}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Clear Chat</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.isBot ? "bg-[#182533] text-white" : "bg-[#2B5278] text-white"}`}
            >
              <p>{message.text}</p>
              {message.action && (
                <div className="mt-2 border-t border-gray-700 pt-2">
                  {message.action}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-800 p-4 bg-[#17212b]"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#242f3d] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="p-2 bg-[#2B5278] text-white rounded-lg hover:bg-[#3a6898] transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
