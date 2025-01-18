import React, { useState } from "react";
import { WalletConnect } from "./WalletConnect";
interface SubscriptionPaymentProps {
  packageDetails: {
    price: number;
    duration: string;
    name: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}
export const SubscriptionPayment: React.FC<SubscriptionPaymentProps> = ({
  packageDetails,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  const handlePayment = async () => {
    if (!connection) return;
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4 p-4 bg-[#1f2f3f] rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{packageDetails.name}</h3>
        <p className="text-sm text-gray-400">
          {packageDetails.price} ETH / {packageDetails.duration}
        </p>
      </div>
      {!connection ? (
        <WalletConnect
          onConnect={setConnection}
          buttonClassName="w-full px-4 py-2 bg-[#2B5278] text-white rounded-lg hover:bg-[#3a6898]"
        />
      ) : (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full px-4 py-2 bg-[#2B5278] text-white rounded-lg hover:bg-[#3a6898] disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      )}
      <button
        onClick={onCancel}
        className="w-full px-4 py-2 bg-[#182533] text-white rounded-lg hover:bg-[#1f2f3f]"
      >
        Cancel
      </button>
    </div>
  );
};
