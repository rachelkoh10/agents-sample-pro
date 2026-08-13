import React from 'react';
import { AssetCategory } from '../types';

interface CategoryNavProps {
  selectedCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
}

const CATEGORIES: AssetCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full max-w-[1400px] px-4 mb-10 md:mb-14">
      <div className="flex items-center justify-start md:justify-center gap-2 md:gap-2.5 overflow-x-auto hide-scrollbar pb-2 pt-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-sans font-semibold tracking-[0.08em] uppercase transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A1A] text-[#F5F2ED] shadow-sm border border-[#1A1A1A]'
                  : 'bg-[#FFFFFF] text-[#1A1A1A]/70 hover:text-[#1A1A1A] border border-[#1A1A1A]/12 hover:border-[#1A1A1A]/40 hover:bg-[#E5E0D8]/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
