import React, { useEffect, useState } from "react";
// import { connect, disconnect } from "starknetkit";
interface WalletConnectProps {
  onConnect: (connection: any) => void;
  buttonClassName?: string;
}
const mockConnect = async (options?: { modalMode?: string }) => {
  return {
    isConnected: true,
    account: {
      address: "0x1234...5678",
    },
  };
};

const mockDisconnect = async () => {
  return true;
};
export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  buttonClassName,
}) => {
  const [connection, setConnection] = useState<any>();
  const [address, setAddress] = useState("");
  const connectWallet = async () => {
    try {
      const connection = await mockConnect();
      if (connection && connection.isConnected) {
        setConnection(connection);
        setAddress(connection.account.address);
        onConnect(connection);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };
  const disconnectWallet = async () => {
    await mockDisconnect();
    setConnection(undefined);
    setAddress("");
  };
  useEffect(() => {
    const checkPreviousConnection = async () => {
      try {
        const connection = await mockConnect({
          modalMode: "neverAsk",
        });
        if (connection && connection.isConnected) {
          setConnection(connection);
          setAddress(connection.account.address);
          onConnect(connection);
        }
      } catch (error) {
        console.error("Error checking previous connection:", error);
      }
    };
    checkPreviousConnection();
  }, []);
  return (
    <div>
      {!connection ? (
        <button
          onClick={connectWallet}
          className={
            buttonClassName ||
            "px-4 py-2 bg-[#2B5278] text-white rounded-lg hover:bg-[#3a6898]"
          }
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={disconnectWallet}
          className={
            buttonClassName ||
            "px-4 py-2 bg-[#2B5278] text-white rounded-lg hover:bg-[#3a6898]"
          }
        >
          Disconnect {address.slice(0, 6)}...{address.slice(-4)}
        </button>
      )}
    </div>
  );
};
