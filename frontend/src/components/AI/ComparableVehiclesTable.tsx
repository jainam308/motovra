import React from 'react';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';

interface ComparableVehicle {
  marketplace: string;
  year: number;
  mileage: number;
  price: number;
  difference: number;
}

interface ComparableVehiclesTableProps {
  vehicles?: ComparableVehicle[] | null;
}

export const ComparableVehiclesTable: React.FC<ComparableVehiclesTableProps> = ({
  vehicles,
}) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-gray-500 italic bg-white/5 rounded-xl border border-white/5">
        No direct comparable listings found in dataset.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400" />
          Top 5 Comparable Market Listings
        </h4>
        <span className="text-xs text-gray-400">Regional Dataset Match</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-white/5 uppercase text-[10px] font-bold text-gray-400 tracking-wider border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Marketplace Source</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Mileage</th>
              <th className="px-4 py-3">Market Price</th>
              <th className="px-4 py-3 text-right">Price Variance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {vehicles.map((v, index) => {
              const isLower = v.difference > 0;
              const isSame = v.difference === 0;

              return (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </span>
                    {v.marketplace}
                  </td>
                  <td className="px-4 py-3 font-mono">{v.year}</td>
                  <td className="px-4 py-3 font-mono">{v.mileage.toLocaleString()} mi</td>
                  <td className="px-4 py-3 font-mono font-bold text-white">
                    ${Number(v.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">
                    {isSame ? (
                      <span className="text-gray-400">Exact Match</span>
                    ) : isLower ? (
                      <span className="text-emerald-400 flex items-center justify-end gap-1">
                        <TrendingDown className="w-3 h-3" />
                        +${Math.abs(v.difference).toLocaleString()} vs Comp
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                        -${Math.abs(v.difference).toLocaleString()} vs Comp
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
