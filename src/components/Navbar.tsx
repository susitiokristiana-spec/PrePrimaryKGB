/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameMode, Language } from '../types/game';
import { Star, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  stars,
  soundEnabled,
  onToggleSound,
  language,
  onToggleLanguage,
}) => {
  const isId = language === 'id';

  const navItems: { id: GameMode; label: string }[] = [
    { id: 'count_tap', label: isId ? 'Hitung Benda' : 'Count & Tap' },
    { id: 'feed_animal', label: isId ? 'Beri Makan' : 'Feed Animal' },
    { id: 'compare', label: isId ? 'Bandingkan' : 'Compare' },
    { id: 'ten_frame', label: isId ? 'Kotak Sepuluh' : 'Ten-Frames' },
    { id: 'math_garden', label: isId ? 'Taman Math' : 'Math Garden' },
    { id: 'sticker_album', label: isId ? 'Buku Stiker' : 'Sticker Book' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectMode('count_tap')}
          className="text-xl sm:text-2xl font-bold tracking-tight text-amber-900 font-fun whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="text-2xl sm:text-3xl">🐾</span>
          <span>KinderMath</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                  isActive
                    ? 'text-amber-800 border-amber-600 font-bold'
                    : 'text-slate-600 border-transparent hover:text-amber-900 hover:border-amber-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Sound & Lang Toggles */}
          <button
            onClick={onToggleLanguage}
            title={isId ? 'Ganti ke Bahasa Inggris' : 'Switch to Indonesian'}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0"
          >
            {isId ? '🇮🇩 ID' : '🇬🇧 EN'}
          </button>

          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-1.5 rounded-lg border border-amber-200 text-slate-700 hover:bg-amber-100 transition-colors shrink-0"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Stars display button navigating to sticker book */}
          <button
            onClick={() => onSelectMode('sticker_album')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-xs transition-transform active:scale-95 whitespace-nowrap shrink-0"
          >
            <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
            <span className="font-fun tabular-nums">{stars}</span>
            <Sparkles className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scrollable Mode Bar */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-amber-50/70 border-t border-amber-100 scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
