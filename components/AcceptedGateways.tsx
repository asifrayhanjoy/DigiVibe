import React from "react";

export const AcceptedGateways = () => {
  const gateways = [
    { name: "bKash (বিকাশ)", status: "active", color: "border-pink-500/30 bg-pink-500/10 text-pink-400" },
    { name: "Nagad (নগদ)", status: "active", color: "border-orange-500/30 bg-orange-500/10 text-orange-400" },
    { name: "CellFin (সেলফিন)", status: "active", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
    { name: "Rocket (রকেট)", status: "active", color: "border-purple-500/30 bg-purple-500/10 text-purple-400" },
    { name: "Upay (উপায়)", status: "active", color: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
    { name: "Binance Pay (বাইনান্স)", status: "active", color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400" },
    { name: "Bank Transfer (ব্যাংক)", status: "processing", color: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
        Accepted Gateways
      </h4>
      <div className="flex flex-wrap gap-2 text-xs">
        {gateways.map((item, index) => (
          <span
            key={index}
            className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${item.color}`}
          >
            <span>{item.name}</span>
            {item.status === "processing" && (
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Soon
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AcceptedGateways;
