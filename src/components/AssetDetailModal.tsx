import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Globe,
  Star,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { MarketAsset, AIAnalysisState } from '../types';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  watchlist,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [activeTab, setActiveTab] = useState<'chart' | 'ai'>('chart');
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiState, setAiState] = useState<AIAnalysisState>({
    loading: false,
    text: null,
    error: null,
  });

  if (!asset) return null;

  const isStarred = watchlist.includes(asset.symbol);
  const isPositive = asset.changePercent >= 0;

  // Generate synthetic timeframe chart points
  const getChartPoints = () => {
    const base = asset.price;
    const count = timeframe === '1D' ? 12 : timeframe === '1W' ? 20 : timeframe === '1M' ? 30 : 50;
    const pts: number[] = [];
    let current = base * (1 - asset.changePercent / 100);
    for (let i = 0; i < count; i++) {
      const delta = (Math.random() - 0.48) * (base * 0.015);
      current += delta;
      pts.push(current);
    }
    pts[pts.length - 1] = base; // end at current price
    return pts;
  };

  const pointsData = getChartPoints();
  const minVal = Math.min(...pointsData);
  const maxVal = Math.max(...pointsData);
  const range = maxVal - minVal || 1;

  const svgWidth = 600;
  const svgHeight = 220;
  const coordinates = pointsData.map((val, idx) => {
    const x = (idx / (pointsData.length - 1)) * (svgWidth - 20) + 10;
    const y = svgHeight - 20 - ((val - minVal) / range) * (svgHeight - 40);
    return { x, y, val };
  });

  const pathD = coordinates.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const areaD = `${pathD} L ${coordinates[coordinates.length - 1].x} ${svgHeight - 10} L ${coordinates[0].x} ${svgHeight - 10} Z`;

  // Fetch AI Analysis from Express API
  const handleFetchAIAnalysis = async (userQuestion?: string) => {
    setAiState({ loading: true, text: null, error: null });
    setActiveTab('ai');
    try {
      const res = await fetch('/api/gemini/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: asset.symbol,
          name: asset.name,
          category: asset.category,
          question: userQuestion || customPrompt || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch analysis');
      }

      setAiState({
        loading: false,
        text: data.analysis,
        groundingSources: data.groundingSources,
        error: null,
      });
      setCustomPrompt('');
    } catch (err: any) {
      setAiState({
        loading: false,
        text: null,
        error: err.message || 'Error communicating with AI service.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A]/12 bg-[#FAFAF7]">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl bg-[#1A1A1A] text-[#F5F2ED] flex items-center justify-center font-serif font-bold text-base shadow-sm`}
            >
              {asset.badge || asset.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">{asset.name}</h2>
                <span className="text-[10px] font-sans font-bold tracking-wider uppercase px-2 py-0.5 bg-[#E5E0D8] text-[#1A1A1A] rounded-md">
                  {asset.symbol}
                </span>
                <span className="text-[10px] font-sans font-medium uppercase px-2 py-0.5 bg-[#E5E0D8]/50 text-[#1A1A1A]/70 rounded-md">
                  {asset.category}
                </span>
              </div>
              <div className="text-xs font-sans text-[#1A1A1A]/60 mt-0.5">
                {asset.sector || 'Financial Instrument'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              className={`p-2 rounded-xl border transition-colors ${
                isStarred
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                  : 'border-[#1A1A1A]/15 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F5F2ED]'
              }`}
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Sub Header Tabs */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#F5F2ED] border-b border-[#1A1A1A]/10">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-3xl font-serif font-extrabold text-[#1A1A1A] tracking-tight">
                $
                {asset.price > 1000
                  ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })
                  : asset.price.toFixed(2)}
              </span>
              <span
                className={`ml-3 font-sans font-bold text-sm inline-flex items-center gap-0.5 ${
                  isPositive ? 'text-[#1A5E3A]' : 'text-[#A83232]'
                }`}
              >
                {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {isPositive ? '+' : ''}
                {asset.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center bg-[#FFFFFF] p-1 rounded-xl border border-[#1A1A1A]/10">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'chart'
                  ? 'bg-[#1A1A1A] text-[#F5F2ED] shadow-sm'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Technical Chart
            </button>
            <button
              onClick={() => {
                setActiveTab('ai');
                if (!aiState.text && !aiState.loading) {
                  handleFetchAIAnalysis();
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'ai'
                  ? 'bg-[#1A1A1A] text-[#F5F2ED] shadow-sm'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" /> Gemini AI Intelligence
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'chart' ? (
            <div>
              {/* Timeframe Selector */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-sans font-bold text-[#1A1A1A]/50 tracking-widest uppercase">
                  Price History & Volatility
                </span>
                <div className="flex gap-1 bg-[#FAFAF7] p-1 rounded-lg border border-[#1A1A1A]/10">
                  {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 text-xs font-sans font-bold rounded-md transition-colors ${
                        timeframe === tf
                          ? 'bg-[#1A1A1A] text-[#F5F2ED]'
                          : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive SVG Chart */}
              <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-2xl p-4 relative overflow-hidden mb-6">
                <svg className="w-full h-56 overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isPositive ? '#1A5E3A' : '#A83232'}
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={isPositive ? '#1A5E3A' : '#A83232'}
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  {[0.2, 0.5, 0.8].map((ratio, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={svgHeight * ratio}
                      x2={svgWidth}
                      y2={svgHeight * ratio}
                      stroke="#1A1A1A"
                      strokeOpacity="0.08"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Area */}
                  <path d={areaD} fill="url(#chartGradient)" />
                  {/* Path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isPositive ? '#1A5E3A' : '#A83232'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Active Endpoint Dot */}
                  {coordinates.length > 0 && (
                    <circle
                      cx={coordinates[coordinates.length - 1].x}
                      cy={coordinates[coordinates.length - 1].y}
                      r="5"
                      fill={isPositive ? '#1A5E3A' : '#A83232'}
                      className="animate-ping"
                    />
                  )}
                </svg>
              </div>

              {/* Key Statistics Grid */}
              <h4 className="text-sm font-serif font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C4A484]" /> Key Financial Metrics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4 font-sans">
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-3">
                  <div className="text-[#1A1A1A]/60 font-medium">Market Cap</div>
                  <div className="text-[#1A1A1A] font-serif font-bold text-sm mt-1">{asset.marketCap || 'N/A'}</div>
                </div>
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-3">
                  <div className="text-[#1A1A1A]/60 font-medium">24h Volume</div>
                  <div className="text-[#1A1A1A] font-serif font-bold text-sm mt-1">{asset.volume || 'N/A'}</div>
                </div>
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-3">
                  <div className="text-[#1A1A1A]/60 font-medium">24h High</div>
                  <div className="text-[#1A5E3A] font-serif font-bold text-sm mt-1">
                    ${asset.high24h ? asset.high24h.toFixed(2) : asset.price.toFixed(2)}
                  </div>
                </div>
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-3">
                  <div className="text-[#1A1A1A]/60 font-medium">24h Low</div>
                  <div className="text-[#A83232] font-serif font-bold text-sm mt-1">
                    ${asset.low24h ? asset.low24h.toFixed(2) : asset.price.toFixed(2)}
                  </div>
                </div>
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-3">
                  <div className="text-[#1A1A1A]/60 font-medium">P/E Ratio</div>
                  <div className="text-[#1A1A1A] font-serif font-bold text-sm mt-1">
                    {asset.peRatio ? asset.peRatio.toFixed(1) : 'N/A'}
                  </div>
                </div>
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-3">
                  <div className="text-[#1A1A1A]/60 font-medium">Dividend Yield</div>
                  <div className="text-[#1A1A1A] font-serif font-bold text-sm mt-1">
                    {asset.dividendYield ? `${asset.dividendYield.toFixed(2)}%` : '0.00%'}
                  </div>
                </div>
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-3">
                  <div className="text-[#1A1A1A]/60 font-medium">Category</div>
                  <div className="text-[#1A1A1A] font-serif font-bold text-sm mt-1">{asset.category}</div>
                </div>
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-3">
                  <div className="text-[#1A1A1A]/60 font-medium">Sector</div>
                  <div className="text-[#1A1A1A] font-serif font-bold text-sm mt-1">{asset.sector || 'Finance'}</div>
                </div>
              </div>

              {asset.description && (
                <div className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-xl p-4 text-xs font-sans text-[#1A1A1A]/70 leading-relaxed">
                  <span className="font-bold text-[#1A1A1A]">Overview: </span>
                  {asset.description}
                </div>
              )}
            </div>
          ) : (
            /* AI Analysis Tab */
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between bg-[#F5F2ED] border border-[#1A1A1A]/12 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#C4A484]" />
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">Gemini Market Intelligence</h4>
                    <p className="text-xs font-sans text-[#1A1A1A]/60">
                      Real-time Wall Street synthesis powered by Google Search grounding
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleFetchAIAnalysis()}
                  disabled={aiState.loading}
                  className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-[#F5F2ED] rounded-lg text-xs font-sans uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {aiState.loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Regenerate'
                  )}
                </button>
              </div>

              {/* AI Output Content */}
              <div className="bg-[#FAFAF7] border border-[#1A1A1A]/12 rounded-2xl p-5 min-h-[220px] text-sm leading-relaxed text-[#1A1A1A] font-sans overflow-y-auto max-h-[300px]">
                {aiState.loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#1A1A1A] animate-spin" />
                    <p className="text-xs font-sans font-medium text-[#1A1A1A]/60 animate-pulse">
                      Analyzing technical patterns, macro sentiment, and recent news for {asset.symbol}...
                    </p>
                  </div>
                ) : aiState.error ? (
                  <div className="text-[#A83232] text-xs p-3 bg-[#A83232]/10 rounded-xl border border-[#A83232]/20 font-sans">
                    {aiState.error}
                  </div>
                ) : aiState.text ? (
                  <div className="prose max-w-none text-xs sm:text-sm whitespace-pre-line space-y-2 text-[#1A1A1A]">
                    {aiState.text}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#1A1A1A]/60 font-sans text-xs">
                    Click regenerate or ask a question below to analyze {asset.symbol}.
                  </div>
                )}

                {/* Grounding Sources */}
                {aiState.groundingSources && aiState.groundingSources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#1A1A1A]/10 text-xs font-sans">
                    <span className="font-bold text-[#1A1A1A]/70 block mb-2">
                      Sources & Grounding:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {aiState.groundingSources.map((source, idx) => {
                        if (!source.web) return null;
                        return (
                          <a
                            key={idx}
                            href={source.web.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2ED] border border-[#1A1A1A]/10 text-[#1A1A1A] hover:underline rounded-lg text-[11px]"
                          >
                            <span>{source.web.title || source.web.uri}</span>
                            <ExternalLink className="w-3 h-3 text-[#1A1A1A]/60" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Query Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchAIAnalysis(customPrompt)}
                  placeholder={`Ask Gemini about ${asset.symbol} (e.g. "What is the 2026 earnings outlook?")...`}
                  className="flex-1 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 font-sans focus:outline-none focus:border-[#1A1A1A]"
                />
                <button
                  onClick={() => handleFetchAIAnalysis(customPrompt)}
                  disabled={aiState.loading || !customPrompt.trim()}
                  className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-[#F5F2ED] font-sans font-bold uppercase tracking-wider rounded-xl text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
