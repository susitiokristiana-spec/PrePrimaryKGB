/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameItemType, PlacedSticker, Language } from '../types/game';
import { GAME_ITEMS, ItemIllustration } from './ItemIllustrations';
import { soundFx } from '../utils/audio';
import { Trash2, Sparkles, Image, Check, Volume2 } from 'lucide-react';

interface StickerAlbumProps {
  unlockedStickers: string[];
  placedStickers: PlacedSticker[];
  onUpdatePlacedStickers: (stickers: PlacedSticker[]) => void;
  language: Language;
}

export const StickerAlbum: React.FC<StickerAlbumProps> = ({
  unlockedStickers,
  placedStickers,
  onUpdatePlacedStickers,
  language,
}) => {
  const isId = language === 'id';
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    unlockedStickers[0] || 'apple'
  );
  const [theme, setTheme] = useState<'meadow' | 'farm' | 'orchard' | 'picnic'>('meadow');

  // Handle clicking on canvas to place the selected sticker
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedStickerId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPlaced: PlacedSticker = {
      id: `${Date.now()}-${Math.random()}`,
      stickerId: selectedStickerId,
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
      rotation: Math.floor(Math.random() * 20) - 10,
      scale: 1,
    };

    const updated = [...placedStickers, newPlaced];
    onUpdatePlacedStickers(updated);
    soundFx.playObjectClick(selectedStickerId as GameItemType, updated.length);
  };

  const handleRemoveSticker = (id: string, stickerType: GameItemType, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playObjectClick(stickerType);
    const updated = placedStickers.filter((s) => s.id !== id);
    onUpdatePlacedStickers(updated);
  };

  const handleClearCanvas = () => {
    onUpdatePlacedStickers([]);
    soundFx.playPop();
  };

  const countPlacedItems = () => {
    const text = isId
      ? `Ada ${placedStickers.length} stiker di kanvasmu!`
      : `You have placed ${placedStickers.length} stickers on your canvas!`;
    soundFx.speak(text, language);
  };

  // Background styling classes
  const getThemeBackground = () => {
    switch (theme) {
      case 'meadow':
        return 'bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200';
      case 'farm':
        return 'bg-gradient-to-b from-amber-100 via-emerald-100 to-amber-200';
      case 'orchard':
        return 'bg-gradient-to-b from-teal-100 via-emerald-50 to-lime-200';
      case 'picnic':
        return 'bg-gradient-to-b from-rose-100 via-amber-50 to-emerald-100';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              {isId ? 'Koleksi & Kreasi' : 'Rewards & Album'}
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-fun">
            {isId ? 'Buku Stiker Safari' : 'Safari Sticker Album'}
          </h2>
        </div>

        {/* Theme Selectors & Clear */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="flex items-center bg-amber-50 p-1 rounded-xl border border-amber-200 gap-1 text-xs font-bold text-amber-900">
            <button
              onClick={() => setTheme('meadow')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${theme === 'meadow' ? 'bg-amber-500 text-white shadow-xs' : 'hover:bg-amber-100'}`}
            >
              {isId ? 'Padang Rumput' : 'Meadow'}
            </button>
            <button
              onClick={() => setTheme('farm')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${theme === 'farm' ? 'bg-amber-500 text-white shadow-xs' : 'hover:bg-amber-100'}`}
            >
              {isId ? 'Kebun' : 'Farm'}
            </button>
            <button
              onClick={() => setTheme('orchard')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${theme === 'orchard' ? 'bg-amber-500 text-white shadow-xs' : 'hover:bg-amber-100'}`}
            >
              {isId ? 'Taman Buah' : 'Orchard'}
            </button>
            <button
              onClick={() => setTheme('picnic')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${theme === 'picnic' ? 'bg-amber-500 text-white shadow-xs' : 'hover:bg-amber-100'}`}
            >
              {isId ? 'Piknik' : 'Picnic'}
            </button>
          </div>

          <button
            onClick={countPlacedItems}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
            title="Count placed stickers"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {placedStickers.length > 0 && (
            <button
              onClick={handleClearCanvas}
              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
              title="Clear all stickers"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Sticker Canvas */}
      <div
        onClick={handleCanvasClick}
        className={`relative w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-inner cursor-crosshair transition-colors duration-300 ${getThemeBackground()}`}
      >
        {/* Decorative Scenery Elements */}
        <div className="absolute top-6 left-10 text-4xl opacity-80 pointer-events-none select-none">
          ☀️
        </div>
        <div className="absolute top-10 right-20 text-3xl opacity-70 pointer-events-none select-none">
          ☁️
        </div>
        <div className="absolute top-14 left-44 text-2xl opacity-60 pointer-events-none select-none">
          ☁️
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-around text-2xl opacity-60 pointer-events-none select-none">
          <span>🌿</span>
          <span>🌻</span>
          <span>🌱</span>
          <span>🌷</span>
          <span>🌼</span>
          <span>🌿</span>
        </div>

        {/* Counter Watermark / Hint */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-xs text-xs font-bold text-amber-900 shadow-xs pointer-events-none font-fun">
          {isId ? `Total Stiker: ${placedStickers.length}` : `Stickers Placed: ${placedStickers.length}`}
        </div>

        {placedStickers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none select-none">
            <span className="text-4xl mb-2">🎨 ✨</span>
            <p className="text-base sm:text-lg font-bold text-slate-700 font-fun max-w-xs">
              {isId
                ? 'Pilih stiker di bawah, lalu klik di sini untuk menempelkannya!'
                : 'Pick a sticker below, then tap here on the grass to stick it!'}
            </p>
          </div>
        )}

        {/* Placed Stickers */}
        {placedStickers.map((sticker) => (
          <div
            key={sticker.id}
            onClick={(e) => handleRemoveSticker(sticker.id, sticker.stickerId as GameItemType, e)}
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            }}
            className="absolute group cursor-pointer transition-transform duration-150 hover:scale-125"
            title={isId ? 'Klik untuk mendengar & menghapus stiker' : 'Tap to hear & remove sticker'}
          >
            <ItemIllustration type={sticker.stickerId as GameItemType} size={58} />
            <span className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              ✕
            </span>
          </div>
        ))}
      </div>

      {/* Unlocked Sticker Tray */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-amber-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-amber-950 font-fun">
            {isId ? 'Koleksi Stiker Terbuka (Pilih untuk ditempel):' : 'Unlocked Stickers (Tap to select):'}
          </span>
          <span className="text-xs font-semibold text-slate-500 tabular-nums">
            {unlockedStickers.length} / {GAME_ITEMS.length}
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {GAME_ITEMS.map((item) => {
            const isUnlocked = unlockedStickers.includes(item.id);
            const isSelected = selectedStickerId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isUnlocked) {
                    setSelectedStickerId(item.id);
                    soundFx.playObjectClick(item.id);
                  }
                }}
                disabled={!isUnlocked}
                className={`relative p-2.5 rounded-2xl shrink-0 flex flex-col items-center justify-center transition-all ${
                  isUnlocked
                    ? isSelected
                      ? 'bg-amber-100 ring-4 ring-amber-400 scale-105 shadow-md'
                      : 'bg-amber-50/60 border border-amber-200 hover:bg-amber-100 hover:scale-105'
                    : 'bg-slate-100 border border-slate-200 opacity-40 cursor-not-allowed'
                }`}
              >
                <ItemIllustration type={item.id} size={48} />
                <span className="text-[11px] font-bold text-slate-700 mt-1 font-fun">
                  {isId ? item.nameId : item.nameEn}
                </span>

                {!isUnlocked && (
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px] rounded-2xl text-base">
                    🔒
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
