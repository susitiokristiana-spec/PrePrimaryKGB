/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameItemType, NumberRange, Language } from '../../types/game';
import { GAME_ITEMS, getItemDef, ItemIllustration } from '../ItemIllustrations';
import { soundFx } from '../../utils/audio';
import { Volume2, CheckCircle2, RotateCcw, Grid3X3, Plus } from 'lucide-react';

interface TenFrameModeProps {
  range: NumberRange;
  language: Language;
  onCorrectAnswer: () => void;
}

export const TenFrameMode: React.FC<TenFrameModeProps> = ({
  range,
  language,
  onCorrectAnswer,
}) => {
  const isId = language === 'id';

  // For 1-5 or 1-10: 1 frame (10 slots). For 1-20: 2 frames (20 slots).
  const maxSlots = range === '1-20' ? 20 : 10;
  const maxTarget = range === '1-5' ? 5 : range === '1-10' ? 10 : 20;
  const minTarget = range === '1-20' ? 11 : 1;

  const [itemType, setItemType] = useState<GameItemType>('strawberry');
  const [targetNumber, setTargetNumber] = useState<number>(6);
  const [filledIndices, setFilledIndices] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const generateRound = () => {
    const target = Math.floor(Math.random() * (maxTarget - minTarget + 1)) + minTarget;
    const randomItem = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)].id;

    setItemType(randomItem);
    setTargetNumber(target);
    setFilledIndices([]);
    setIsSubmitted(false);
    setIsSuccess(null);
  };

  useEffect(() => {
    generateRound();
  }, [range]);

  const itemDef = getItemDef(itemType);

  // Toggle cell filled state
  const handleCellClick = (cellIndex: number) => {
    if (isSuccess) return;

    let nextIndices: number[];
    if (filledIndices.includes(cellIndex)) {
      nextIndices = filledIndices.filter((i) => i !== cellIndex);
      soundFx.playObjectClick(itemType);
      soundFx.playPop();
    } else {
      nextIndices = [...filledIndices, cellIndex];
      soundFx.playObjectClick(itemType, nextIndices.length);
      soundFx.speak(`${nextIndices.length}`, language);
    }
    setFilledIndices(nextIndices);
    setIsSubmitted(false);
  };

  // Quick fill up to next slot
  const handleQuickAdd = () => {
    if (filledIndices.length >= maxSlots || isSuccess) return;
    // Find first empty cell
    for (let i = 0; i < maxSlots; i++) {
      if (!filledIndices.includes(i)) {
        const next = [...filledIndices, i];
        setFilledIndices(next);
        soundFx.playObjectClick(itemType, next.length);
        soundFx.speak(`${next.length}`, language);
        break;
      }
    }
  };

  const handleVerify = () => {
    setIsSubmitted(true);
    if (filledIndices.length === targetNumber) {
      setIsSuccess(true);
      soundFx.playSuccess();
      const praise = isId ? 'Luar biasa! Kotak sepuluh terisi dengan tepat!' : 'Awesome! The Ten-Frame is filled perfectly!';
      soundFx.speak(praise, language);
      setTimeout(() => {
        onCorrectAnswer();
      }, 950);
    } else {
      setIsSuccess(false);
      soundFx.playGentleBoing();
      const hint = isId
        ? `Kamu baru mengisi ${filledIndices.length}, butuh ${targetNumber}. Ayo sesuaikan lagi!`
        : `You have filled ${filledIndices.length}, we need ${targetNumber}. Let's adjust!`;
      soundFx.speak(hint, language);
    }
  };

  const speakPrompt = () => {
    const text = isId
      ? `Isilah kotak sepuluh dengan ${targetNumber} ${itemDef.pluralId}!`
      : `Fill the Ten-Frame with ${targetNumber} ${itemDef.pluralEn}!`;
    soundFx.speak(text, language);
  };

  // Render a 10-frame (2 rows of 5)
  const renderFrame = (startOffset: number, frameLabel: string) => {
    return (
      <div className="flex-1 bg-white/90 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm flex flex-col items-center">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
          {frameLabel}
        </span>
        <div className="grid grid-cols-5 grid-rows-2 gap-2 sm:gap-3 w-full max-w-[340px] aspect-[5/2]">
          {Array.from({ length: 10 }).map((_, cellIdx) => {
            const actualIndex = startOffset + cellIdx;
            const isFilled = filledIndices.includes(actualIndex);

            return (
              <button
                key={actualIndex}
                onClick={() => handleCellClick(actualIndex)}
                className={`relative rounded-xl border-2 transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-90 ${
                  isFilled
                    ? 'bg-amber-100/70 border-amber-400 shadow-xs'
                    : 'bg-amber-50/40 border-dashed border-amber-200 hover:border-amber-400 hover:bg-white'
                }`}
              >
                {isFilled ? (
                  <ItemIllustration type={itemType} size={36} className="animate-gentle-bounce" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-200/60" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={speakPrompt}
            className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-transform active:scale-90"
            title="Listen to goal"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                {isId ? 'Kotak Sepuluh (Ten-Frames)' : 'Ten-Frame Explorer'}
              </span>
              <Grid3X3 className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-fun">
              {isId
                ? `Isi Kotak dengan: ${targetNumber} ${itemDef.pluralId}`
                : `Fill the Frame with: ${targetNumber} ${itemDef.pluralEn}`}
            </h2>
          </div>
        </div>

        {/* Counter & Clear Button */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs uppercase font-bold text-amber-800 block">
              {isId ? 'Terisi' : 'Filled'}
            </span>
            <span className="text-2xl font-bold font-fun text-amber-950 tabular-nums">
              {filledIndices.length} / {targetNumber}
            </span>
          </div>

          <button
            onClick={() => {
              setFilledIndices([]);
              setIsSubmitted(false);
              setIsSuccess(null);
              soundFx.playPop();
            }}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Reset frame"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ten-Frame Stage */}
      <div className="bg-gradient-to-b from-amber-50/40 via-white to-amber-50/60 rounded-3xl p-6 sm:p-8 border-2 border-dashed border-amber-200 flex flex-col md:flex-row gap-6 items-center justify-center">
        {renderFrame(0, isId ? 'Kotak 1 (1 - 10)' : 'Frame 1 (1 - 10)')}
        {maxSlots > 10 && renderFrame(10, isId ? 'Kotak 2 (11 - 20)' : 'Frame 2 (11 - 20)')}
      </div>

      {/* Action Footer */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-amber-200/80 flex flex-wrap items-center justify-center gap-4">
        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="py-3 px-5 rounded-2xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold font-fun text-base flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
          <span>{isId ? `Tambah 1 ${itemDef.nameId}` : `Add 1 ${itemDef.nameEn}`}</span>
        </button>

        {/* Check Answer Button */}
        <button
          onClick={handleVerify}
          className={`py-3.5 px-8 rounded-2xl font-extrabold text-lg shadow-md flex items-center gap-2 font-fun active:scale-95 transition-transform ${
            filledIndices.length === targetNumber
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{isId ? 'Periksa Jawaban' : 'Check My Frame'}</span>
        </button>
      </div>
    </div>
  );
};
