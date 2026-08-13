import React from 'react';
import { ArrowUp, ArrowDown, Sparkles, Star } from 'lucide-react';
import { MarketAsset, AssetCategory } from '../types';

interface AssetTableProps {
  category: AssetCategory;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onAnalyzeAI: (asset: MarketAsset) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  category,
  assets,
  onSelectAsset,
  onAnalyzeAI,
  watchlist,
  onToggleWatchlist,
}) => {
  const filtered = assets.filter((a) => a.category === category);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mb-16">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#1A1A1A]/50 block">
            02 / Market Catalogue
          </span>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <span>{category} Index & Listings</span>
            <span className="text-xs font-sans font-semibold text-[#1A1A1A]/60 bg-[#E5E0D8]/60 px-3 py-0.5 rounded-full border border-[#1A1A1A]/10">
              {filtered.length} Assets
            </span>
          </h3>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#1A1A1A]/12 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1A1A1A]">
            <thead className="bg-[#FAFAF7] border-b border-[#1A1A1A]/12 text-[10px] text-[#1A1A1A]/60 tracking-[0.18em] uppercase font-sans font-bold">
              <tr>
                <th scope="col" className="px-5 py-4">
                  Asset
                </th>
                <th scope="col" className="px-5 py-4 text-right">
                  Price
                </th>
                <th scope="col" className="px-5 py-4 text-right">
                  24h Change
                </th>
                <th scope="col" className="px-5 py-4 text-right hidden sm:table-cell">
                  24h Range
                </th>
                <th scope="col" className="px-5 py-4 text-right hidden md:table-cell">
                  Cap / Vol
                </th>
                <th scope="col" className="px-5 py-4 text-center hidden lg:table-cell">
                  7D Trend
                </th>
                <th scope="col" className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 font-sans font-medium text-xs md:text-sm">
              {filtered.map((asset) => {
                const isPositive = asset.changePercent >= 0;
                const isStarred = watchlist.includes(asset.symbol);

                // Build inline SVG sparkline
                const minVal = Math.min(...asset.sparkline);
                const maxVal = Math.max(...asset.sparkline);
                const range = maxVal - minVal || 1;
                const points = asset.sparkline
                  .map((val, idx) => {
                    const x = (idx / (asset.sparkline.length - 1)) * 80;
                    const y = 24 - ((val - minVal) / range) * 20;
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <tr
                    key={asset.symbol}
                    className="hover:bg-[#F5F2ED]/60 transition-colors cursor-pointer group"
                    onClick={() => onSelectAsset(asset)}
                  >
                    {/* Symbol / Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(asset.symbol);
                          }}
                          className={`p-1 rounded hover:bg-[#E5E0D8]/50 transition-colors ${
                            isStarred ? 'text-amber-600' : 'text-[#1A1A1A]/30 hover:text-[#1A1A1A]'
                          }`}
                          title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                        <div>
                          <div className="text-[#1A1A1A] font-bold group-hover:italic transition-all flex items-center gap-1.5 font-sans">
                            {asset.symbol}
                            {asset.badge && (
                              <span className="text-[9px] font-sans font-bold tracking-wider uppercase px-1.5 py-0.2 bg-[#E5E0D8] rounded text-[#1A1A1A]/70">
                                {asset.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#1A1A1A]/60 font-normal max-w-[140px] sm:max-w-[200px] truncate font-sans">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-right font-serif font-bold text-[#1A1A1A] text-base whitespace-nowrap">
                      $
                      {asset.price > 1000
                        ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })
                        : asset.price < 10
                        ? asset.price.toFixed(4)
                        : asset.price.toFixed(2)}
                    </td>

                    {/* Change */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-0.5 font-sans font-bold text-xs px-2.5 py-1 rounded-md ${
                          isPositive
                            ? 'text-[#1A5E3A] bg-[#1A5E3A]/10'
                            : 'text-[#A83232] bg-[#A83232]/10'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                        )}
                        {isPositive ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </div>
                    </td>

                    {/* 24h Range */}
                    <td className="px-5 py-4 text-right hidden sm:table-cell text-xs text-[#1A1A1A]/60 font-sans whitespace-nowrap">
                      {asset.low24h && asset.high24h ? (
                        <span>
                          ${asset.low24h} - ${asset.high24h}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    {/* Market Cap / Vol */}
                    <td className="px-5 py-4 text-right hidden md:table-cell text-xs font-sans whitespace-nowrap">
                      <div className="text-[#1A1A1A] font-semibold">{asset.marketCap || '-'}</div>
                      <div className="text-[#1A1A1A]/50 text-[11px]">{asset.volume}</div>
                    </td>

                    {/* Sparkline */}
                    <td className="px-5 py-4 text-center hidden lg:table-cell">
                      <div className="inline-block w-20 h-6">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 80 24">
                          <polyline
                            fill="none"
                            stroke={isPositive ? '#1A5E3A' : '#A83232'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                          />
                        </svg>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeAI(asset);
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-sans uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 hover:bg-[#1A1A1A] hover:text-[#F5F2ED] transition-all text-[#1A1A1A]"
                        title="AI Analysis"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
                        <span className="hidden sm:inline">AI Insights</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
