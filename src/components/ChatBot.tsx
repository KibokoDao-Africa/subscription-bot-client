import React, { useState } from "react";
import { ChatInterface } from "./Chat/ChatInterface";
import { Plus, Settings, Trash, Eye, ArrowRight } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { SubscriptionPayment } from "./SubscriptionPayment";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  action?: JSX.Element; // Optional action property
}

interface Channel {
  id: string;
  name: string;
  url: string;
  subscribers: number;
  packages: SubscriptionPackage[];
}

interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface Subscription {
  id: string;
  channelId: string;
  packageId: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
}

export const ChatBot = () => {
  const initialMessage: Message = {
    id: 1,
    text: "Welcome to TG Sub Bot! What would you like to do?",
    isBot: true,
    action: (
      <div className="space-y-2">
        <button
          onClick={() => handleOptionSelect("channels")}
          className="w-full text-left text-blue-400 hover:text-blue-300 flex items-center space-x-2"
        >
          <span>📢 Manage Channels</span>
        </button>
        <button
          onClick={() => handleOptionSelect("subscriptions")}
          className="w-full text-left text-blue-400 hover:text-blue-300 flex items-center space-x-2"
        >
          <span>🔔 Manage Subscriptions</span>
        </button>
        <button
          onClick={() => showCommands()}
          className="w-full text-left text-blue-400 hover:text-blue-300 flex items-center space-x-2"
        >
          <span>❓ Show Available Commands</span>
        </button>
      </div>
    ),
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [walletConnection, setWalletConnection] = useState<any>(null);

  const handleClearChat = () => {
    setMessages([initialMessage]);
    setCurrentFlow(null);
  };

  const handleBackToMenu = () => {
    setMessages((prev: Message[]) => [
      ...prev,
      {
        id: Date.now(),
        text: "Returning to main menu...",
        isBot: true,
      },
      initialMessage,
    ]);
    setCurrentFlow(null);
  };

  const handleOptionSelect = (option: string) => {
    setCurrentFlow(option);
    if (option === "channels") {
      handleChannelAction("list");
    } else if (option === "subscriptions") {
      handleSubscriptionAction("view");
    }
  };

  const handleChannelAction = (action: string, channelId?: string) => {
    if (action === "list") {
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: Date.now(),
          text: "Channel Management",
          isBot: true,
          action: (
            <div className="space-y-3">
              {channels.map((channel) => (
                <div key={channel.id} className="p-3 bg-[#1f2f3f] rounded-lg">
                  <p>{channel.name}</p>
                </div>
              ))}
              <button
                onClick={() => handleChannelAction("create")}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Create Channel
              </button>
            </div>
          ),
        },
      ]);
    } else if (action === "create") {
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: Date.now(),
          text: "Create New Channel",
          isBot: true,
        },
      ]);
    }
  };

  const handleSubscriptionAction = (action: string) => {
    if (action === "view") {
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: Date.now(),
          text: "Your Subscriptions",
          isBot: true,
        },
      ]);
    }
  };

  const showCommands = () => {
    setMessages((prev: Message[]) => [
      ...prev,
      {
        id: Date.now(),
        text: "Available Commands",
        isBot: true,
      },
    ]);
  };

  return (
    <div className="h-full">
      <ChatInterface
        messages={messages}
        onSend={() => {}}
        onClear={handleClearChat}
        onBackToMenu={handleBackToMenu}
      />
    </div>
  );
};
