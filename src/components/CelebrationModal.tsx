/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, BookOpen } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { Language } from '../types/game';

interface CelebrationModalProps {
  isOpen: boolean;
  onNext: () => void;
  onOpenStickerBook: () => void;
  language: Language;
  earnedStars?: number;
  newStickerUnlocked?: string | null;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onNext,
  onOpenStickerBook,
  language,
  earnedStars = 1,
  newStickerUnlocked = null,
}) => {
  const isId = language === 'id';

  useEffect(() => {
    if (isOpen) {
      soundFx.playCelebration();
      // Trigger canvas confetti celebration
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'],
        });
      } catch {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-4 border-amber-300 transform transition-transform animate-gentle-bounce">
        {/* Floating Stars */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <Star className="w-10 h-10 text-amber-400 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <Star className="w-14 h-14 text-yellow-400 fill-yellow-400 -mt-2 animate-bounce" />
          <Star className="w-10 h-10 text-amber-400 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-fun mb-2">
          {isId ? 'Hebat Sekali! 🎉' : 'Super Star! 🎉'}
        </h3>
        <p className="text-slate-600 font-medium mb-4">
          {isId
            ? `Kamu berhasil berhitung dengan benar! Kamu dapat +${earnedStars} Bintang!`
            : `You counted them all correctly! You earned +${earnedStars} Star!`}
        </p>

        {newStickerUnlocked && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-800 block mb-1">
              {isId ? 'Hadiah Stiker Baru Terbuka!' : 'New Sticker Unlocked!'}
            </span>
            <span className="text-3xl block">🎁 🌟</span>
            <p className="text-xs text-amber-700 mt-1">
              {isId ? 'Buka Buku Stiker untuk menempelnya!' : 'Visit your Sticker Book to stick it!'}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={onNext}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 font-fun"
          >
            <span>{isId ? 'Lanjut Bermain' : 'Next Round'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenStickerBook}
            className="py-3 px-4 rounded-2xl border-2 border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isId ? 'Buku Stiker' : 'Sticker Book'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
