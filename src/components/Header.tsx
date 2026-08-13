import React, { useState, useEffect } from 'react';
import { Search, Globe, User, ChevronDown, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../data/marketData';
import { LanguageOption } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAI: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAI,
  activeNav,
  setActiveNav,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="border-b border-[#1A1A1A]/10 sticky top-0 bg-[#F5F2ED]/95 backdrop-blur-md z-40 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          {/* Logo - Editorial Serif Brand */}
          <a
            className="flex items-center gap-2.5 text-[#1A1A1A] hover:opacity-80 transition-opacity flex-shrink-0 group"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveNav('Markets');
            }}
          >
            <div className="w-7 h-7 bg-[#1A1A1A] text-[#F5F2ED] flex items-center justify-center font-serif text-sm font-bold rounded-sm">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight leading-none text-[#1A1A1A]">
                MARKETS
              </span>
              <span className="text-[9px] font-sans tracking-[0.3em] uppercase opacity-60 leading-none mt-0.5">
                Terminal
              </span>
            </div>
          </a>

          {/* Search trigger */}
          <div
            onClick={onOpenSearch}
            className="hidden md:flex relative group cursor-pointer"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-[#1A1A1A]/50 group-hover:text-[#1A1A1A] transition-colors" />
            </div>
            <div className="bg-[#E5E0D8]/60 hover:bg-[#E5E0D8] transition-colors border border-[#1A1A1A]/10 rounded-full py-1.5 pl-8 pr-4 flex items-center justify-between w-56 lg:w-64">
              <span className="text-xs font-sans text-[#1A1A1A]/70 group-hover:text-[#1A1A1A] select-none">
                Search assets...
              </span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-sans font-bold text-[#1A1A1A]/60 bg-[#F5F2ED] border border-[#1A1A1A]/10 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-xs tracking-[0.2em] uppercase font-semibold">
          {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`transition-colors relative py-1 ${
                activeNav === item ? 'text-[#1A1A1A] font-bold' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              {item}
              {activeNav === item && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A1A1A]" />
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onOpenSearch}
            className="md:hidden text-[#1A1A1A]/70 hover:text-[#1A1A1A] p-1.5"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* AI Market Copilot button */}
          <button
            onClick={onOpenAI}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider font-bold px-3 py-1.5 rounded-full bg-[#1A1A1A]/5 border border-[#1A1A1A]/15 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F2ED] transition-all"
            title="Ask Gemini AI Market Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
            AI Copilot
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors flex items-center gap-1 py-1 px-1.5 rounded hover:bg-[#1A1A1A]/5"
            >
              <Globe className="w-4 h-4 text-[#1A1A1A]/60" />
              <span className="text-xs font-sans font-semibold uppercase tracking-wider">{selectedLang.label}</span>
              <ChevronDown className="w-3 h-3 text-[#1A1A1A]/50" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-xl shadow-xl py-1 z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F2ED] transition-colors ${
                      selectedLang.code === lang.code
                        ? 'text-[#1A1A1A] font-bold'
                        : 'text-[#1A1A1A]/70'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-[10px] text-[#1A1A1A]/40 uppercase">
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenSearch}
            className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors p-1"
            title="Account Profile"
          >
            <User className="w-5 h-5" />
          </button>

          <a
            className="bg-[#1A1A1A] hover:bg-[#333333] text-[#F5F2ED] text-xs font-sans uppercase tracking-widest font-bold py-2 px-4 rounded-full transition-all duration-200 shadow-sm ml-1"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenSearch();
            }}
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
};
