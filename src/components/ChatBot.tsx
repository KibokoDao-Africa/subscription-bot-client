import React, { useState } from "react";
import { ChatInterface } from "./Chat/ChatInterface";
import { Plus, Settings, Trash, Eye, ArrowRight } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { SubscriptionPayment } from "./SubscriptionPayment";
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
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "1",
      name: "Tech News Daily",
      url: "https://t.me/technews",
      subscribers: 150,
      packages: [
        {
          id: "1",
          name: "Basic",
          price: 0.05,
          duration: "1 month",
          features: ["Daily updates", "Basic support"],
        },
      ],
    },
  ]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      channelId: "1",
      packageId: "1",
      startDate: "2024-01-01",
      endDate: "2024-02-01",
      status: "active",
    },
  ]);
  const initialMessage = {
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
  const [messages, setMessages] = useState([initialMessage]);
  const [walletConnection, setWalletConnection] = useState<any>(null);
  const handleClearChat = () => {
    setMessages([initialMessage]);
    setCurrentFlow(null);
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
    setCurrentFlow(null);
  };
  const handleCreateChannelSubmit = async () => {
    if (!walletConnection) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Please connect your wallet first to create a channel",
          isBot: true,
          action: (
            <WalletConnect
              onConnect={setWalletConnection}
              buttonClassName="w-full px-4 py-2 bg-[#2B5278] text-white rounded-lg hover:bg-[#3a6898]"
            />
          ),
        },
      ]);
      return;
    }
    const nameInput = document.getElementById(
      "channelName",
    ) as HTMLInputElement;
    const urlInput = document.getElementById("channelUrl") as HTMLInputElement;
    if (nameInput && urlInput) {
      const newChannel: Channel = {
        id: Date.now().toString(),
        name: nameInput.value,
        url: urlInput.value,
        subscribers: 0,
        packages: [],
      };
      setChannels((prev) => [...prev, newChannel]);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "✅ Channel created successfully!",
          isBot: true,
        },
      ]);
      handleChannelAction("list");
    }
  };
  const handleOptionSelect = (option: string) => {
    setCurrentFlow(option);
    if (option === "channels") {
      handleChannelAction("list");
    } else if (option === "subscriptions") {
      handleSubscriptionAction("view");
    }
  };
  const handleMessage = (message: string) => {
    // ... message handling code
  };
  const handleChannelAction = (action: string, channelId?: string) => {
    if (action === "list") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Channel Management",
          isBot: true,
          action: (
            <div className="space-y-3">
              {channels.length === 0 ? (
                <p className="text-gray-400">
                  No channels yet. Create your first channel!
                </p>
              ) : (
                channels.map((channel) => (
                  <div key={channel.id} className="p-3 bg-[#1f2f3f] rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">📢 {channel.name}</p>
                        <p className="text-sm text-gray-400">
                          Subscribers: {channel.subscribers}
                        </p>
                        <p className="text-xs text-gray-400">{channel.url}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleChannelAction("view", channel.id)
                          }
                          className="p-1 hover:bg-[#2b5278] rounded"
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() =>
                            handleChannelAction("edit", channel.id)
                          }
                          className="p-1 hover:bg-[#2b5278] rounded"
                        >
                          <Settings className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() =>
                            handleChannelAction("delete", channel.id)
                          }
                          className="p-1 hover:bg-[#2b5278] rounded"
                        >
                          <Trash className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <button
                onClick={() => handleChannelAction("create")}
                className="w-full mt-2 p-2 bg-[#2b5278] text-white rounded-lg hover:bg-[#3a6898] flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Channel</span>
              </button>
            </div>
          ),
        },
      ]);
    } else if (action === "create") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Create New Channel",
          isBot: true,
          action: (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Channel Name</label>
                <input
                  id="channelName"
                  placeholder="e.g., Tech News Daily"
                  className="w-full bg-[#242f3d] p-2 rounded text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Channel URL</label>
                <input
                  id="channelUrl"
                  placeholder="https://t.me/yourchannel"
                  className="w-full bg-[#242f3d] p-2 rounded text-white"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Initial Package</p>
                <div className="space-y-2 bg-[#1f2f3f] p-2 rounded">
                  <input
                    placeholder="Package Name"
                    className="w-full bg-[#242f3d] p-2 rounded text-white"
                  />
                  <input
                    type="number"
                    placeholder="Price (ETH)"
                    className="w-full bg-[#242f3d] p-2 rounded text-white"
                  />
                  <input
                    placeholder="Duration (e.g., 1 month)"
                    className="w-full bg-[#242f3d] p-2 rounded text-white"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCreateChannelSubmit()}
                  className="flex-1 bg-[#2b5278] p-2 rounded hover:bg-[#3a6898]"
                >
                  Create Channel
                </button>
                <button
                  onClick={() => handleChannelAction("list")}
                  className="flex-1 bg-[#182533] p-2 rounded hover:bg-[#1f2f3f]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
        },
      ]);
    } else if (action === "edit" && channelId) {
      const channel = channels.find((c) => c.id === channelId);
      if (channel) {
        setEditingChannel(channel);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: `Editing Channel: ${channel.name}`,
            isBot: true,
            action: (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Channel Name</label>
                  <input
                    defaultValue={channel.name}
                    className="w-full bg-[#242f3d] p-2 rounded text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Channel URL</label>
                  <input
                    defaultValue={channel.url}
                    className="w-full bg-[#242f3d] p-2 rounded text-white"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Subscription Packages</p>
                  {channel.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-[#1f2f3f] p-2 rounded space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{pkg.name}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPackage(pkg.id)}
                            className="text-blue-400"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="text-red-400"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <input
                        defaultValue={pkg.name}
                        placeholder="Package Name"
                        className="w-full bg-[#242f3d] p-2 rounded text-white"
                      />
                      <input
                        type="number"
                        defaultValue={pkg.price}
                        placeholder="Price (ETH)"
                        className="w-full bg-[#242f3d] p-2 rounded text-white"
                      />
                      <input
                        defaultValue={pkg.duration}
                        placeholder="Duration"
                        className="w-full bg-[#242f3d] p-2 rounded text-white"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddPackage(channel.id)}
                    className="w-full mt-2 p-2 bg-[#2b5278] rounded flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Package</span>
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateChannel(channel.id)}
                    className="flex-1 bg-[#2b5278] p-2 rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => handleChannelAction("list")}
                    className="flex-1 bg-[#182533] p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ),
          },
        ]);
      }
    } else if (action === "delete" && channelId) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "⚠️ Delete Channel",
          isBot: true,
          action: (
            <div className="space-y-3">
              <p className="text-red-400">
                Are you sure you want to delete this channel? This action cannot
                be undone.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => confirmDeleteChannel(channelId)}
                  className="flex-1 bg-red-500 p-2 rounded hover:bg-red-600"
                >
                  Yes, Delete Channel
                </button>
                <button
                  onClick={() => handleChannelAction("list")}
                  className="flex-1 bg-[#2b5278] p-2 rounded hover:bg-[#3a6898]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
        },
      ]);
    }
  };
  const handleUpdateChannel = (channelId: string) => {
    if (editingChannel) {
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? {
                ...editingChannel,
              }
            : channel,
        ),
      );
      setEditingChannel(null);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "✅ Channel updated successfully!",
          isBot: true,
        },
      ]);
      handleChannelAction("list");
    }
  };
  const confirmDeleteChannel = (channelId: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== channelId));
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "✅ Channel deleted successfully!",
        isBot: true,
      },
    ]);
    handleChannelAction("list");
  };
  const handleSubscriptionAction = (
    action: string,
    subscriptionId?: string,
  ) => {
    if (action === "view") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Your Active Subscriptions",
          isBot: true,
          action: (
            <div className="space-y-3">
              {subscriptions.map((sub) => {
                const channel = channels.find((c) => c.id === sub.channelId);
                const package_ = channel?.packages.find(
                  (p) => p.id === sub.packageId,
                );
                return (
                  <div key={sub.id} className="p-3 bg-[#1f2f3f] rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{channel?.name}</p>
                        <p className="text-sm text-gray-400">
                          Package: {package_?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Expires: {sub.endDate}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleSubscriptionAction("modify", sub.id)
                          }
                          className="p-1 hover:bg-[#2b5278] rounded"
                        >
                          <Settings className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() =>
                            handleSubscriptionAction("cancel", sub.id)
                          }
                          className="p-1 hover:bg-[#2b5278] rounded"
                        >
                          <Trash className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ),
        },
      ]);
    } else if (action === "browse") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Available Channels for Subscription",
          isBot: true,
          action: (
            <div className="space-y-3">
              {channels.map((channel) => (
                <div key={channel.id} className="p-3 bg-[#1f2f3f] rounded">
                  <p className="font-semibold">{channel.name}</p>
                  <p className="text-sm text-gray-400">
                    {channel.subscribers} subscribers
                  </p>
                  <div className="mt-2 space-y-2">
                    {channel.packages.map((pkg) => (
                      <div key={pkg.id} className="p-2 bg-[#2b3b4f] rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{pkg.name}</p>
                            <p className="text-xs text-gray-400">
                              {pkg.price} ETH / {pkg.duration}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSubscribe(channel.id, pkg.id)}
                            className="text-blue-400 text-sm flex items-center space-x-1"
                          >
                            <span>Subscribe</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ),
        },
      ]);
    } else if (action === "cancel" && subscriptionId) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "⚠️ Cancel Subscription",
          isBot: true,
          action: (
            <div className="space-y-3">
              <p className="text-red-400">
                Are you sure you want to cancel this subscription?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => confirmCancelSubscription(subscriptionId)}
                  className="flex-1 bg-red-500 p-2 rounded hover:bg-red-600"
                >
                  Yes, Cancel Subscription
                </button>
                <button
                  onClick={() => handleSubscriptionAction("view")}
                  className="flex-1 bg-[#2b5278] p-2 rounded"
                >
                  No, Keep Subscription
                </button>
              </div>
            </div>
          ),
        },
      ]);
    } else if (action === "modify" && subscriptionId) {
      const subscription = subscriptions.find((s) => s.id === subscriptionId);
      const channel = channels.find((c) => c.id === subscription?.channelId);
      if (subscription && channel) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: `Modify Subscription for ${channel.name}`,
            isBot: true,
            action: (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Available Packages:</p>
                {channel.packages.map((pkg) => (
                  <div key={pkg.id} className="p-2 bg-[#1f2f3f] rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{pkg.name}</p>
                        <p className="text-sm text-gray-400">
                          {pkg.price} ETH / {pkg.duration}
                        </p>
                        <ul className="text-xs text-gray-400 mt-1">
                          {pkg.features.map((feature, i) => (
                            <li key={i}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      {pkg.id !== subscription.packageId && (
                        <button
                          onClick={() =>
                            handleChangePackage(subscription.id, pkg.id)
                          }
                          className="text-blue-400 text-sm hover:text-blue-300"
                        >
                          Switch to this package
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ),
          },
        ]);
      }
    }
  };
  const handleAddPackage = (channelId: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "Add New Subscription Package",
        isBot: true,
        action: (
          <div className="space-y-3">
            <div className="bg-[#1f2f3f] p-3 rounded">
              <div className="space-y-2">
                <input
                  id="packageName"
                  placeholder="Package Name"
                  className="w-full bg-[#242f3d] p-2 rounded text-white"
                />
                <input
                  id="packagePrice"
                  type="number"
                  step="0.001"
                  placeholder="Price (ETH)"
                  className="w-full bg-[#242f3d] p-2 rounded text-white"
                />
                <input
                  id="packageDuration"
                  placeholder="Duration (e.g., 1 month)"
                  className="w-full bg-[#242f3d] p-2 rounded text-white"
                />
                <textarea
                  id="packageFeatures"
                  placeholder="Features (one per line)"
                  className="w-full bg-[#242f3d] p-2 rounded text-white h-24"
                />
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleSaveNewPackage(channelId)}
                  className="flex-1 bg-[#2b5278] p-2 rounded hover:bg-[#3a6898]"
                >
                  Save Package
                </button>
                <button
                  onClick={() => handleChannelAction("edit", channelId)}
                  className="flex-1 bg-[#182533] p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ),
      },
    ]);
  };
  const handleSaveNewPackage = (channelId: string) => {
    const nameInput = document.getElementById(
      "packageName",
    ) as HTMLInputElement;
    const priceInput = document.getElementById(
      "packagePrice",
    ) as HTMLInputElement;
    const durationInput = document.getElementById(
      "packageDuration",
    ) as HTMLInputElement;
    const featuresInput = document.getElementById(
      "packageFeatures",
    ) as HTMLTextAreaElement;
    if (nameInput && priceInput && durationInput && featuresInput) {
      const newPackage: SubscriptionPackage = {
        id: Date.now().toString(),
        name: nameInput.value,
        price: parseFloat(priceInput.value),
        duration: durationInput.value,
        features: featuresInput.value.split("\n").filter((f) => f.trim()),
      };
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                packages: [...channel.packages, newPackage],
              }
            : channel,
        ),
      );
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "✅ Package added successfully!",
          isBot: true,
        },
      ]);
      handleChannelAction("edit", channelId);
    }
  };
  const handleEditPackage = (packageId: string) => {
    // Implementation for editing package
  };
  const handleDeletePackage = (packageId: string) => {
    // Implementation for deleting package
  };
  const handleSubscribe = (channelId: string, packageId: string) => {
    const channel = channels.find((c) => c.id === channelId);
    const package_ = channel?.packages.find((p) => p.id === packageId);
    if (channel && package_) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: `Subscribe to ${channel.name}`,
          isBot: true,
          action: (
            <SubscriptionPayment
              packageDetails={{
                price: package_.price,
                duration: package_.duration,
                name: package_.name,
              }}
              onSuccess={() => handleSubscriptionSuccess(channelId, packageId)}
              onCancel={() => handleSubscriptionAction("browse")}
            />
          ),
        },
      ]);
    }
  };
  const handleSubscriptionSuccess = async (
    channelId: string,
    packageId: string,
  ) => {
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      channelId,
      packageId,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "active",
    };
    setSubscriptions((prev) => [...prev, newSubscription]);
    await addBotToChannel(channelId);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "✅ Subscription successful! The bot has been added to the channel.",
        isBot: true,
      },
    ]);
    handleSubscriptionAction("view");
  };
  const addBotToChannel = async (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId);
    if (channel) {
      try {
        const botService = TelegramBotService.getInstance();
        await botService.addBotToChannel(channel.url);
        await botService.sendChannelMessage(
          channel.url,
          "🎉 Hello! I'm your subscription management bot. " +
            "Use /subscribe to access premium content!",
        );
      } catch (error) {
        console.error("Error adding bot to channel:", error);
      }
    }
  };
  const handleChangePackage = (
    subscriptionId: string,
    newPackageId: string,
  ) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId
          ? {
              ...sub,
              packageId: newPackageId,
              startDate: new Date().toISOString().split("T")[0],
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            }
          : sub,
      ),
    );
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "✅ Subscription package updated successfully!",
        isBot: true,
      },
    ]);
    handleSubscriptionAction("view");
  };
  const confirmCancelSubscription = (subscriptionId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId
          ? {
              ...sub,
              status: "cancelled",
            }
          : sub,
      ),
    );
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "✅ Subscription cancelled successfully",
        isBot: true,
      },
    ]);
    handleSubscriptionAction("view");
  };
  const showCommands = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "Available Commands",
        isBot: true,
        action: (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">
                🤖 Telegram Bot Commands:
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <code>/start</code> - Start the bot
                </p>
                <p>
                  <code>/channels</code> - Manage your channels
                </p>
                <p>
                  <code>/createchannel</code> - Create a new channel
                </p>
                <p>
                  <code>/listchannels</code> - View your channels
                </p>
                <p>
                  <code>/editchannel</code> - Edit a channel
                </p>
                <p>
                  <code>/addpackage</code> - Add subscription package
                </p>
                <p>
                  <code>/subscribe</code> - Subscribe to channels
                </p>
                <p>
                  <code>/mysubs</code> - View your subscriptions
                </p>
                <p>
                  <code>/help</code> - Show this help message
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">
                ⚡ Quick Actions:
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleOptionSelect("channels")}
                  className="px-3 py-1 bg-[#2B5278] rounded-full text-sm hover:bg-[#3a6898]"
                >
                  Manage Channels
                </button>
                <button
                  onClick={() => handleChannelAction("create")}
                  className="px-3 py-1 bg-[#2B5278] rounded-full text-sm hover:bg-[#3a6898]"
                >
                  Create Channel
                </button>
                <button
                  onClick={() => handleSubscriptionAction("view")}
                  className="px-3 py-1 bg-[#2B5278] rounded-full text-sm hover:bg-[#3a6898]"
                >
                  View Subscriptions
                </button>
                <button
                  onClick={() => handleSubscriptionAction("browse")}
                  className="px-3 py-1 bg-[#2B5278] rounded-full text-sm hover:bg-[#3a6898]"
                >
                  Browse Channels
                </button>
              </div>
            </div>
          </div>
        ),
      },
    ]);
  };
  return (
    <div className="h-full">
      <ChatInterface
        messages={messages}
        onSend={handleMessage}
        onClear={handleClearChat}
        onBackToMenu={handleBackToMenu}
      />
    </div>
  );
};
