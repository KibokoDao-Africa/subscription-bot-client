// import React, { useState } from "react";
import { ChatInterface } from "../components/Chat/ChatInterface";
export const Subscriptions = () => {
  const initialMessage = {
    id: 1,
    text: "Here are your active subscriptions. What would you like to do?",
    isBot: true,
    action: (
      <div className="space-y-2">
        <button className="w-full text-left text-blue-400 hover:text-blue-300">
          View My Subscriptions
        </button>
        <button className="w-full text-left text-blue-400 hover:text-blue-300">
          Browse Available Channels
        </button>
      </div>
    ),
  };
  const [messages, setMessages] = useState([initialMessage]);
  const handleMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: message,
        isBot: false,
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
