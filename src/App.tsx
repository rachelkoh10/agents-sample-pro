import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroTitle } from './components/HeroTitle';
import { CategoryNav } from './components/CategoryNav';
import { IndicesGrid } from './components/IndicesGrid';
import { AssetTable } from './components/AssetTable';
import { SearchModal } from './components/SearchModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import {
  INITIAL_INDICES,
  ALL_MARKET_ASSETS,
  REGIONS,
} from './data/marketData';
import { AssetCategory, MarketAsset, IndexCardData, RegionOption } from './types';

export default function App() {
  const [activeNav, setActiveNav] = useState('Markets');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('US stocks');
  const [currentRegion, setCurrentRegion] = useState<RegionOption>(REGIONS[0]);

  const [indices, setIndices] = useState<IndexCardData[]>(INITIAL_INDICES);
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>(ALL_MARKET_ASSETS);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);

  // Watchlist state synced with localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('markets_watchlist');
      return saved ? JSON.parse(saved) : ['AAPL', 'NVDA', 'BTCUSD', 'SPY'];
    } catch {
      return ['AAPL', 'NVDA', 'BTCUSD', 'SPY'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('markets_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist:', e);
    }
  }, [watchlist]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Real-time market tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Tick indices
      setIndices((prev) =>
        prev.map((idx) => {
          const deltaPct = (Math.random() - 0.49) * 0.1;
          const newPrice = Number((idx.price * (1 + deltaPct / 100)).toFixed(2));
          const newChange = Number((idx.changePercent + deltaPct / 5).toFixed(2));
          return {
            ...idx,
            price: newPrice,
            changePercent: newChange,
            sparkline: [...idx.sparkline.slice(1), newPrice],
          };
        })
      );

      // Tick random market asset
      setMarketAssets((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        return prev.map((asset, i) => {
          if (i !== randomIndex) return asset;
          const deltaPct = (Math.random() - 0.48) * 0.2;
          const newPrice = Number((asset.price * (1 + deltaPct / 100)).toFixed(2));
          const newChangePct = Number((asset.changePercent + deltaPct / 4).toFixed(2));
          return {
            ...asset,
            price: newPrice,
            changePercent: newChangePct,
            sparkline: [...asset.sparkline.slice(1), newPrice],
          };
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleSelectSymbol = (symbol: string) => {
    const found = marketAssets.find((a) => a.symbol === symbol);
    if (found) {
      setSelectedAsset(found);
    } else {
      // Find in indices
      const indexObj = indices.find((i) => i.symbol === symbol);
      if (indexObj) {
        setSelectedAsset({
          symbol: indexObj.symbol,
          name: indexObj.name,
          price: indexObj.price,
          change: Number(((indexObj.price * indexObj.changePercent) / 100).toFixed(2)),
          changePercent: indexObj.changePercent,
          badge: indexObj.badge,
          badgeBg: indexObj.badgeBg,
          category: 'US stocks',
          volume: 'Index Benchmark',
          marketCap: 'Index',
          high24h: Number((indexObj.price * 1.008).toFixed(2)),
          low24h: Number((indexObj.price * 0.992).toFixed(2)),
          sparkline: indexObj.sparkline,
          description: `Major financial market index tracking ${indexObj.name} benchmark components.`,
          sector: 'Index',
        });
      }
    }
  };

  return (
    <div className="antialiased min-h-screen flex flex-col bg-[#F5F2ED] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#F5F2ED] font-sans">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAI={() => setIsAIDrawerOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-8 md:pt-14 pb-16">
        {/* Hero Banner */}
        <HeroTitle
          currentRegion={currentRegion}
          onSelectRegion={(reg) => setCurrentRegion(reg)}
        />

        {/* Category Pill Sub Navigation */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* 3 Indices Cards (S&P 500, Nasdaq 100, Dow 30) */}
        <IndicesGrid
          indices={indices}
          onSelectAsset={handleSelectSymbol}
        />

        {/* Asset Table for Active Category */}
        <AssetTable
          category={selectedCategory}
          assets={marketAssets}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onAnalyzeAI={(asset) => {
            setSelectedAsset(asset);
          }}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#1A1A1A]/12 bg-[#FAFAF7] py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#1A1A1A] text-[#F5F2ED] flex items-center justify-center font-serif text-xs font-bold rounded-xs">
                M
              </div>
              <span className="font-serif text-base font-bold tracking-tight text-[#1A1A1A]">
                MARKETS TERMINAL
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A]/60 max-w-md font-sans leading-relaxed">
              Real-time market analytics, financial indices, and Wall Street synthesis powered by Gemini AI market intelligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-sans">
            <div>
              <div className="font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 text-[10px]">Markets</div>
              <ul className="space-y-1 text-[#1A1A1A]/60">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('US stocks'); }} className="hover:text-[#1A1A1A]">US Stocks</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('World stocks'); }} className="hover:text-[#1A1A1A]">World Equities</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Crypto'); }} className="hover:text-[#1A1A1A]">Digital Assets</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 text-[10px]">Intelligence</div>
              <ul className="space-y-1 text-[#1A1A1A]/60">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setIsAIDrawerOpen(true); }} className="hover:text-[#1A1A1A]">Gemini Copilot</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setIsSearchOpen(true); }} className="hover:text-[#1A1A1A]">Asset Search (⌘K)</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto mt-8 pt-6 border-t border-[#1A1A1A]/8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#1A1A1A]/50 font-sans">
          <span>© 2026 Markets Terminal. All rights reserved.</span>
          <span>Designed with Editorial Aesthetic</span>
        </div>
      </footer>

      {/* Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={marketAssets}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      {/* Asset Detail & Chart Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />

      {/* Gemini AI Copilot Drawer */}
      <AIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
      />
    </div>
  );
}
