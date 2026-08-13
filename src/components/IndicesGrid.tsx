import React from 'react';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { IndexCardData } from '../types';

interface IndicesGridProps {
  indices: IndexCardData[];
  onSelectAsset: (assetSymbol: string) => void;
}

export const IndicesGrid: React.FC<IndicesGridProps> = ({
  indices,
  onSelectAsset,
}) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mb-14">
      {/* Section Header */}
      <a
        className="inline-flex items-center gap-2 group mb-6 cursor-pointer"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectAsset(indices[0]?.symbol || 'SPX');
        }}
      >
        <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#1A1A1A]/50 block">
          01 / Benchmarks
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#1A1A1A] group-hover:italic transition-all">
          Indices Overview
        </h2>
        <ChevronRight className="w-5 h-5 text-[#1A1A1A] transform group-hover:translate-x-1 transition-transform ml-0.5" />
      </a>

      {/* Grid of 3 Index Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {indices.map((item) => {
          const isPositive = item.changePercent >= 0;
          return (
            <div
              key={item.symbol}
              onClick={() => onSelectAsset(item.symbol)}
              className="bg-[#FFFFFF] rounded-2xl p-6 cursor-pointer border border-[#1A1A1A]/12 hover:border-[#1A1A1A]/30 transition-all duration-200 shadow-sm hover:shadow-md group hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3.5 mb-6">
                <div
                  className={`w-11 h-11 rounded-full bg-[#1A1A1A] text-[#F5F2ED] flex items-center justify-center font-serif font-bold text-sm shadow-sm`}
                >
                  {item.badge}
                </div>
                <div>
                  <div className="text-base font-serif font-bold text-[#1A1A1A] group-hover:italic transition-all">
                    {item.name}
                  </div>
                  <div className="text-[11px] font-sans text-[#1A1A1A]/50 tracking-wider uppercase font-semibold">
                    {item.symbol}
                  </div>
                </div>
              </div>

              {/* Sparkline & Price Row */}
              <div className="flex items-end justify-between mt-6 pt-4 border-t border-[#1A1A1A]/8">
                <div>
                  <div className="text-2xl md:text-[28px] font-serif font-bold text-[#1A1A1A] leading-none tracking-tight">
                    {item.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div
                  className={`font-sans text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-0.5 ${
                    isPositive ? 'text-[#1A5E3A] bg-[#1A5E3A]/10' : 'text-[#A83232] bg-[#A83232]/10'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  {isPositive ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
