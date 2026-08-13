import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { REGIONS } from '../data/marketData';
import { RegionOption } from '../types';

interface HeroTitleProps {
  currentRegion: RegionOption;
  onSelectRegion: (region: RegionOption) => void;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({
  currentRegion,
  onSelectRegion,
}) => {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  return (
    <div className="relative text-center mb-10 md:mb-14 max-w-3xl mx-auto px-4">
      {/* Editorial Issue Header Tag */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-[#1A1A1A]/60 font-semibold">
          Issue No. 042
        </span>
        <div className="h-[1px] w-10 bg-[#1A1A1A]/20" />
        <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-[#1A1A1A]/60 font-semibold">
          Autumn 2026 Edition
        </span>
      </div>

      {/* Main Serif Headline */}
      <div
        onClick={() => setShowRegionDropdown(!showRegionDropdown)}
        className="inline-flex items-center justify-center gap-3 cursor-pointer group select-none py-1 px-3 rounded-2xl hover:bg-[#1A1A1A]/5 transition-all"
      >
        <h1 className="text-4xl sm:text-5xl md:text-[76px] font-serif font-medium text-[#1A1A1A] tracking-tight leading-[0.95] group-hover:opacity-80 transition-opacity">
          Markets, <span className="italic font-normal">everywhere</span>
        </h1>
        <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-[#1A1A1A]/70 group-hover:text-[#1A1A1A] transition-colors transform group-hover:translate-y-1 duration-200 mt-2" />
      </div>

      <p className="mt-3 text-xs md:text-sm font-sans text-[#1A1A1A]/70 flex items-center justify-center gap-2 font-medium">
        <span className="text-base">{currentRegion.flag}</span>
        <span>Viewing data for <strong className="text-[#1A1A1A] font-semibold">{currentRegion.name}</strong></span>
      </p>

      {/* Region selector dropdown */}
      {showRegionDropdown && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-72 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
          <div className="text-[11px] font-sans font-bold tracking-wider uppercase text-[#1A1A1A]/50 px-3 py-2 border-b border-[#1A1A1A]/10 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Select Market Region
          </div>
          <div className="mt-1 space-y-0.5">
            {REGIONS.map((region) => (
              <button
                key={region.code}
                onClick={() => {
                  onSelectRegion(region);
                  setShowRegionDropdown(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-sans transition-colors ${
                  currentRegion.code === region.code
                    ? 'bg-[#1A1A1A] text-[#F5F2ED] font-bold shadow-sm'
                    : 'text-[#1A1A1A]/80 hover:bg-[#F5F2ED] hover:text-[#1A1A1A]'
                }`}
              >
                <span className="text-base">{region.flag}</span>
                <span className="flex-1 text-left">{region.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
