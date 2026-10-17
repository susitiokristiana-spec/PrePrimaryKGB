/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameMode, NumberRange, Language, PlacedSticker } from './types/game';
import { Navbar } from './components/Navbar';
import { CountAndTapMode } from './components/modes/CountAndTapMode';
import { FeedAnimalMode } from './components/modes/FeedAnimalMode';
import { CompareMode } from './components/modes/CompareMode';
import { TenFrameMode } from './components/modes/TenFrameMode';
import { MathGardenMode } from './components/modes/MathGardenMode';
import { StickerAlbum } from './components/StickerAlbum';
import { CelebrationModal } from './components/CelebrationModal';
import { GAME_ITEMS } from './components/ItemIllustrations';
import { soundFx } from './utils/audio';
import { Sparkles, Star, Award, Layers } from 'lucide-react';

const STORAGE_KEY_STARS = 'kindermath_stars_v1';
const STORAGE_KEY_STICKERS = 'kindermath_stickers_v1';
const STORAGE_KEY_PLACED = 'kindermath_placed_v1';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('count_tap');
  const [numberRange, setNumberRange] = useState<NumberRange>('1-10');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('kindermath_lang_pref');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STARS);
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [unlockedStickers, setUnlockedStickers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STICKERS);
      return saved ? JSON.parse(saved) : ['apple', 'bunny', 'strawberry', 'panda'];
    } catch {
      return ['apple', 'bunny', 'strawberry', 'panda'];
    }
  });

  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLACED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [newlyUnlockedSticker, setNewlyUnlockedSticker] = useState<string | null>(null);

  // Sync stars and stickers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STARS, stars.toString());
    } catch {
      // ignore
    }
  }, [stars]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STICKERS, JSON.stringify(unlockedStickers));
    } catch {
      // ignore
    }
  }, [unlockedStickers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLACED, JSON.stringify(placedStickers));
    } catch {
      // ignore
    }
  }, [placedStickers]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setSoundEnabled(next);
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'en' ? 'id' : 'en';
    setLanguage(nextLang);
    try {
      localStorage.setItem('kindermath_lang_pref', nextLang);
    } catch {
      // ignore
    }
    soundFx.playPop();
  };

  const handleCorrectAnswer = () => {
    const nextStars = stars + 1;
    setStars(nextStars);

    // Check if new sticker is unlocked (every 2 stars)
    let unlockedNew: string | null = null;
    const remainingToUnlock = GAME_ITEMS.filter((it) => !unlockedStickers.includes(it.id));
    if (remainingToUnlock.length > 0 && nextStars % 2 === 0) {
      unlockedNew = remainingToUnlock[0].id;
      setUnlockedStickers((prev) => [...prev, unlockedNew!]);
    }

    setNewlyUnlockedSticker(unlockedNew);
    setIsCelebrationOpen(true);
  };

  const handleNextRound = () => {
    setIsCelebrationOpen(false);
    // Force re-render of current mode with fresh puzzle
    setNumberRange((prev) => prev);
  };

  const isId = language === 'id';

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800">
      {/* Navbar with 3-zone contract */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          soundFx.playPop();
        }}
        stars={stars}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Difficulty / Number Range Bar (visible in quiz modes) */}
        {currentMode !== 'sticker_album' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-xs p-3 sm:p-4 rounded-3xl border border-amber-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950 font-fun">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>{isId ? 'Rentang Angka TK-B:' : 'Number Range (Kindergarten B):'}</span>
            </div>

            {/* Segmented control for range */}
            <div className="flex items-center gap-1.5 p-1 bg-amber-100/70 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => {
                  setNumberRange('1-5');
                  soundFx.playPop();
                }}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  numberRange === '1-5'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                {isId ? '1 – 5 (Awal)' : '1 – 5 (Beginner)'}
              </button>
              <button
                onClick={() => {
                  setNumberRange('1-10');
                  soundFx.playPop();
                }}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  numberRange === '1-10'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                {isId ? '1 – 10 (Standar TK)' : '1 – 10 (Standard)'}
              </button>
              <button
                onClick={() => {
                  setNumberRange('1-20');
                  soundFx.playPop();
                }}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  numberRange === '1-20'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                {isId ? '1 – 20 (Juara)' : '1 – 20 (Advanced)'}
              </button>
            </div>
          </div>
        )}

        {/* Active Game Mode Component */}
        <section className="animate-in fade-in duration-200">
          {currentMode === 'count_tap' && (
            <CountAndTapMode
              key={`${currentMode}-${numberRange}-${stars}`}
              range={numberRange}
              language={language}
              onCorrectAnswer={handleCorrectAnswer}
            />
          )}

          {currentMode === 'feed_animal' && (
            <FeedAnimalMode
              key={`${currentMode}-${numberRange}-${stars}`}
              range={numberRange}
              language={language}
              onCorrectAnswer={handleCorrectAnswer}
            />
          )}

          {currentMode === 'compare' && (
            <CompareMode
              key={`${currentMode}-${numberRange}-${stars}`}
              range={numberRange}
              language={language}
              onCorrectAnswer={handleCorrectAnswer}
            />
          )}

          {currentMode === 'ten_frame' && (
            <TenFrameMode
              key={`${currentMode}-${numberRange}-${stars}`}
              range={numberRange}
              language={language}
              onCorrectAnswer={handleCorrectAnswer}
            />
          )}

          {currentMode === 'math_garden' && (
            <MathGardenMode
              key={`${currentMode}-${numberRange}-${stars}`}
              range={numberRange}
              language={language}
              onCorrectAnswer={handleCorrectAnswer}
            />
          )}

          {currentMode === 'sticker_album' && (
            <StickerAlbum
              unlockedStickers={unlockedStickers}
              placedStickers={placedStickers}
              onUpdatePlacedStickers={setPlacedStickers}
              language={language}
            />
          )}
        </section>
      </main>

      {/* Celebration Modal when winning a round */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        onNext={handleNextRound}
        onOpenStickerBook={() => {
          setIsCelebrationOpen(false);
          setCurrentMode('sticker_album');
        }}
        language={language}
        earnedStars={1}
        newStickerUnlocked={newlyUnlockedSticker}
      />

      {/* Quiet, clean educational footer */}
      <footer className="border-t border-amber-200/80 bg-white/70 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-600">
            {isId
              ? 'Belajar Berhitung Interaktif untuk Anak Usia TK-B (5-6 Tahun)'
              : 'Interactive Early Counting Game for Kindergarten B (Ages 5-6)'}
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Fruits & Animals Math</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio Synthesizer</span>
            <span aria-hidden="true">·</span>
            <span>Ten-Frames & 1-to-1 Correspondence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
