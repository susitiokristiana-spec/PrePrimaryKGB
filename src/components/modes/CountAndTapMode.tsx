/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameItemType, NumberRange, Language } from '../../types/game';
import { GAME_ITEMS, getItemDef, ItemIllustration } from '../ItemIllustrations';
import { soundFx } from '../../utils/audio';
import { RefreshCw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface CountAndTapModeProps {
  range: NumberRange;
  language: Language;
  onCorrectAnswer: () => void;
}

export const CountAndTapMode: React.FC<CountAndTapModeProps> = ({
  range,
  language,
  onCorrectAnswer,
}) => {
  const isId = language === 'id';

  // Determine max number based on range
  const getMaxNumber = () => {
    if (range === '1-5') return 5;
    if (range === '1-10') return 10;
    return 20;
  };

  const [itemType, setItemType] = useState<GameItemType>('strawberry');
  const [targetCount, setTargetCount] = useState<number>(4);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Generate a new round
  const generateNewRound = () => {
    const max = getMaxNumber();
    const min = range === '1-20' ? 6 : 1;
    const count = Math.floor(Math.random() * (max - min + 1)) + min;

    // Pick random item
    const randomItem = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)].id;

    // Generate 3 unique choices including targetCount
    const choices = new Set<number>([count]);
    while (choices.size < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      const fakeChoice = count + offset;
      if (fakeChoice >= 1 && fakeChoice <= max && fakeChoice !== count) {
        choices.add(fakeChoice);
      } else {
        const fallback = Math.floor(Math.random() * max) + 1;
        if (fallback !== count) choices.add(fallback);
      }
    }

    setItemType(randomItem);
    setTargetCount(count);
    setTappedIndices([]);
    setOptions(Array.from(choices).sort(() => Math.random() - 0.5));
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  useEffect(() => {
    generateNewRound();
  }, [range]);

  const itemDef = getItemDef(itemType);

  // When child taps on an individual object to count it
  const handleItemClick = (index: number) => {
    if (selectedAnswer !== null) return; // locked after answer

    let newTapped: number[];
    if (tappedIndices.includes(index)) {
      // Untap if clicked again
      newTapped = tappedIndices.filter((i) => i !== index);
      setTappedIndices(newTapped);
      soundFx.playPop();
    } else {
      // Tap new item
      newTapped = [...tappedIndices, index];
      setTappedIndices(newTapped);
      const countNum = newTapped.length;
      soundFx.playObjectClick(itemType, countNum);
      // Speak number
      soundFx.speak(`${countNum}`, language);
    }
  };

  // When child selects their final answer
  const handleSelectOption = (num: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(num);

    if (num === targetCount) {
      setIsAnswerCorrect(true);
      soundFx.playSuccess();
      const praise = isId ? 'Bagus sekali! Tepat!' : 'Awesome job! That is correct!';
      soundFx.speak(praise, language);
      setTimeout(() => {
        onCorrectAnswer();
      }, 900);
    } else {
      setIsAnswerCorrect(false);
      soundFx.playGentleBoing();
      const tryAgain = isId ? 'Ayo coba hitung lagi ya!' : 'Let us count them together again!';
      soundFx.speak(tryAgain, language);
    }
  };

  const readPromptVoice = () => {
    const text = isId
      ? `Berapa banyak ${itemDef.pluralId} yang ada? Sentuh untuk menghitung!`
      : `How many ${itemDef.pluralEn} are there? Tap each one to count!`;
    soundFx.speak(text, language);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Question Header & Voice Assist */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <button
            onClick={readPromptVoice}
            className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-transform active:scale-90"
            title="Listen to question"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950 font-fun">
              {isId
                ? `Berapa jumlah ${itemDef.pluralId}?`
                : `How many ${itemDef.pluralEn} do you see?`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {isId
                ? 'Sentuh tiap benda satu per satu untuk menghitungnya!'
                : 'Tap each item one by one to count them!'}
            </p>
          </div>
        </div>

        {/* Counter Badge & Recount Button */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              {isId ? 'Dihitung' : 'Counted'}:
            </span>
            <span className="text-xl font-bold font-fun text-amber-900 tabular-nums">
              {tappedIndices.length} / {targetCount}
            </span>
          </div>

          <button
            onClick={() => {
              setTappedIndices([]);
              setSelectedAnswer(null);
              setIsAnswerCorrect(null);
              soundFx.playPop();
            }}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Reset count"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Object Counting Meadow */}
      <div className="relative min-h-[280px] sm:min-h-[340px] bg-gradient-to-b from-amber-50/50 via-emerald-50/30 to-amber-50/60 rounded-3xl p-6 sm:p-8 border-2 border-dashed border-amber-200 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {Array.from({ length: targetCount }).map((_, idx) => {
          const isTapped = tappedIndices.includes(idx);
          const tapOrder = tappedIndices.indexOf(idx) + 1;

          return (
            <button
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={`relative p-2.5 rounded-2xl transition-all duration-200 transform cursor-pointer active:scale-90 ${
                isTapped
                  ? 'bg-amber-100/80 ring-4 ring-amber-400 scale-105 shadow-md'
                  : 'hover:scale-105 hover:bg-white/60 bg-white/40 shadow-xs'
              }`}
            >
              {/* Number Badge on Tap */}
              {isTapped && (
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md animate-bounce ring-2 ring-white font-fun tabular-nums">
                  {tapOrder}
                </span>
              )}

              <ItemIllustration
                type={itemType}
                size={targetCount > 10 ? 56 : 72}
                className={isTapped ? 'animate-gentle-bounce' : ''}
              />
            </button>
          );
        })}
      </div>

      {/* Answer Choices */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-bold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-fun text-lg">
            {isId ? 'Pilih angka yang tepat:' : 'Choose the matching number:'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
          {options.map((optionNum) => {
            const isSelected = selectedAnswer === optionNum;
            let btnClass = 'bg-amber-50 border-2 border-amber-300 text-amber-950 hover:bg-amber-100 hover:border-amber-400';

            if (isSelected) {
              if (isAnswerCorrect) {
                btnClass = 'bg-emerald-500 border-2 border-emerald-600 text-white ring-4 ring-emerald-200 scale-105';
              } else {
                btnClass = 'bg-rose-500 border-2 border-rose-600 text-white ring-4 ring-rose-200 animate-wiggle';
              }
            }

            return (
              <button
                key={optionNum}
                onClick={() => handleSelectOption(optionNum)}
                disabled={selectedAnswer !== null && isAnswerCorrect === true}
                className={`py-5 sm:py-6 rounded-2xl font-fun font-bold text-3xl sm:text-4xl shadow-sm transition-all duration-150 active:scale-95 flex flex-col items-center justify-center ${btnClass}`}
              >
                <span className="tabular-nums">{optionNum}</span>
              </button>
            );
          })}
        </div>

        {/* Retry prompt if wrong */}
        {selectedAnswer !== null && !isAnswerCorrect && (
          <div className="pt-2 animate-in fade-in">
            <button
              onClick={() => {
                setSelectedAnswer(null);
                setIsAnswerCorrect(null);
                soundFx.playPop();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xs transition-transform active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isId ? 'Coba Pilih Lagi' : 'Try Another Number'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
