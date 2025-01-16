import React, { useState } from "react";
import { ChatInterface } from "../components/Chat/ChatInterface";
import { Plus } from "lucide-react";
export const Channels = () => {
  const initialMessage = {
    id: 1,
    text: "Welcome! Would you like to create a new channel or manage existing ones?",
    isBot: true,
    action: (
      <button
        onClick={() => handleCreateChannel()}
        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
      >
        <Plus className="w-4 h-4" />
        <span>Create New Channel</span>
      </button>
    ),
  };
  const [channels, setChannels] = useState<any[]>([]);
  const [messages, setMessages] = useState([initialMessage]);
  const handleCreateChannel = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "Please enter your channel name:",
        isBot: true,
      },
    ]);
  };
  const handleMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: message,
        isBot: false,
      },
      {
        id: Date.now() + 1,
        text: "Great! Now please enter your channel URL:",
        isBot: true,
      },
    ]);
  };
  const handleClearChat = () => {
    setMessages([initialMessage]);
  };
  const handleBackToMenu = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "Returning to main menu...",
        isBot: true,
      },
      initialMessage,
    ]);
  };
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ChatInterface
          messages={messages}
          onSend={handleMessage}
          onClear={handleClearChat}
          onBackToMenu={handleBackToMenu}
        />
      </div>
    </div>
  );
};
