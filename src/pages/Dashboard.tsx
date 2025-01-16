import React from "react";
import { Users, Radio, CreditCard, TrendingUp } from "lucide-react";
export const Dashboard = () => {
  const stats = [
    {
      icon: Users,
      label: "Total Subscribers",
      value: "1,234",
      change: "+12%",
    },
    {
      icon: Radio,
      label: "Active Channels",
      value: "56",
      change: "+3%",
    },
    {
      icon: CreditCard,
      label: "Revenue",
      value: "$12,345",
      change: "+23%",
    },
    {
      icon: TrendingUp,
      label: "Growth",
      value: "89%",
      change: "+5%",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                </div>
                <Icon className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                {stat.change} from last month
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
