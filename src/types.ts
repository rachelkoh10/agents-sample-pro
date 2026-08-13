export type AssetCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  category: AssetCategory;
  volume?: string;
  marketCap?: string;
  high24h?: number;
  low24h?: number;
  peRatio?: number;
  dividendYield?: number;
  sparkline: number[];
  description?: string;
  sector?: string;
}

export interface IndexCardData {
  symbol: string;
  name: string;
  badge: string;
  badgeBg: string;
  price: number;
  changePercent: number;
  sparkline: number[];
}

export interface RegionOption {
  code: string;
  name: string;
  flag: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  label: string;
}

export interface AIAnalysisState {
  loading: boolean;
  text: string | null;
  groundingSources?: Array<{ web?: { uri: string; title: string } }>;
  error: string | null;
}
