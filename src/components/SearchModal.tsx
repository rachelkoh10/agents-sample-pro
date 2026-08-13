import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, TrendingUp } from 'lucide-react';
import { MarketAsset } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? assets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(query.toLowerCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : assets.slice(0, 8); // top 8 trending items when empty query

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#1A1A1A]/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[#1A1A1A]/10">
          <Search className="w-5 h-5 text-[#1A1A1A]/50 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, stock, index, crypto, forex (e.g. NVDA, AAPL, BTC)..."
            className="w-full bg-transparent text-[#1A1A1A] placeholder-[#1A1A1A]/40 text-base font-sans focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#1A1A1A]/50 hover:text-[#1A1A1A] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-sans font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A] bg-[#F5F2ED] border border-[#1A1A1A]/10 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Query Results or Trending */}
        <div className="overflow-y-auto p-2 flex-1 divide-y divide-[#1A1A1A]/8">
          {!query.trim() && (
            <div className="px-3 py-2 text-[10px] font-sans font-bold text-[#1A1A1A]/50 flex items-center gap-1.5 uppercase tracking-[0.2em]">
              <TrendingUp className="w-3.5 h-3.5 text-[#C4A484]" /> Trending & Popular Markets
            </div>
          )}

          {filtered.map((asset) => {
            const isPositive = asset.changePercent >= 0;
            return (
              <div
                key={asset.symbol}
                onClick={() => {
                  onSelectAsset(asset);
                  onClose();
                }}
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#F5F2ED] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] text-[#F5F2ED] font-serif font-bold text-xs flex items-center justify-center group-hover:bg-[#C4A484] group-hover:text-[#1A1A1A] transition-colors">
                    {asset.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] font-serif font-bold text-base flex items-center gap-2 group-hover:italic transition-all">
                      <span>{asset.symbol}</span>
                      <span className="text-[10px] text-[#1A1A1A]/60 font-sans font-medium px-2 py-0.5 bg-[#E5E0D8]/60 rounded">
                        {asset.category}
                      </span>
                    </div>
                    <div className="text-xs font-sans text-[#1A1A1A]/60">{asset.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[#1A1A1A] font-serif font-bold text-base">
                    $
                    {asset.price > 1000
                      ? asset.price.toLocaleString()
                      : asset.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-sans font-bold ${
                      isPositive ? 'text-[#1A5E3A]' : 'text-[#A83232]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-[#1A1A1A]/60 font-sans text-xs">
              No matching assets found for &quot;{query}&quot;. Try searching for AAPL, NVDA, S&amp;P 500, or BTC.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-3 bg-[#FAFAF7] border-t border-[#1A1A1A]/10 text-[11px] font-sans text-[#1A1A1A]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#F5F2ED] border border-[#1A1A1A]/10 rounded text-[10px] font-semibold">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#F5F2ED] border border-[#1A1A1A]/10 rounded text-[10px] font-semibold">↵</kbd> Select
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">
            <ArrowUpRight className="w-3 h-3 text-[#C4A484]" /> Editorial Terminal
          </div>
        </div>
      </div>
    </div>
  );
};
