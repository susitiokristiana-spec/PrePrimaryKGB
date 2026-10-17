/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameItemType, NumberRange, Language } from '../../types/game';
import { GAME_ITEMS, getItemDef, ItemIllustration } from '../ItemIllustrations';
import { soundFx } from '../../utils/audio';
import { Volume2, ArrowUpDown, Check, Sparkles } from 'lucide-react';

interface CompareModeProps {
  range: NumberRange;
  language: Language;
  onCorrectAnswer: () => void;
}

type CompareGoal = 'more' | 'less';

export const CompareMode: React.FC<CompareModeProps> = ({
  range,
  language,
  onCorrectAnswer,
}) => {
  const isId = language === 'id';

  const getMaxNumber = () => {
    if (range === '1-5') return 5;
    if (range === '1-10') return 10;
    return 14;
  };

  const [goal, setGoal] = useState<CompareGoal>('more');
  const [leftItem, setLeftItem] = useState<GameItemType>('apple');
  const [leftCount, setLeftCount] = useState<number>(5);
  const [rightItem, setRightItem] = useState<GameItemType>('bunny');
  const [rightCount, setRightCount] = useState<number>(3);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [leftTapped, setLeftTapped] = useState<number[]>([]);
  const [rightTapped, setRightTapped] = useState<number[]>([]);

  const generateRound = () => {
    const max = getMaxNumber();
    const min = 1;

    let c1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let c2 = Math.floor(Math.random() * (max - min + 1)) + min;
    while (c1 === c2) {
      c2 = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const item1 = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)].id;
    let item2 = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)].id;
    while (item2 === item1) {
      item2 = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)].id;
    }

    const currentGoal: CompareGoal = Math.random() > 0.5 ? 'more' : 'less';

    setGoal(currentGoal);
    setLeftItem(item1);
    setLeftCount(c1);
    setRightItem(item2);
    setRightCount(c2);
    setSelectedSide(null);
    setIsCorrect(null);
    setLeftTapped([]);
    setRightTapped([]);
  };

  const handleLeftItemClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    let next: number[];
    if (leftTapped.includes(index)) {
      next = leftTapped.filter((i) => i !== index);
      soundFx.playPop();
    } else {
      next = [...leftTapped, index];
      soundFx.playObjectClick(leftItem, next.length);
      soundFx.speak(`${next.length}`, language);
    }
    setLeftTapped(next);
  };

  const handleRightItemClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    let next: number[];
    if (rightTapped.includes(index)) {
      next = rightTapped.filter((i) => i !== index);
      soundFx.playPop();
    } else {
      next = [...rightTapped, index];
      soundFx.playObjectClick(rightItem, next.length);
      soundFx.speak(`${next.length}`, language);
    }
    setRightTapped(next);
  };

  useEffect(() => {
    generateRound();
  }, [range]);

  const leftDef = getItemDef(leftItem);
  const rightDef = getItemDef(rightItem);

  const handleChooseSide = (side: 'left' | 'right') => {
    if (selectedSide !== null && isCorrect) return;

    setSelectedSide(side);

    const winningSide =
      goal === 'more'
        ? leftCount > rightCount
          ? 'left'
          : 'right'
        : leftCount < rightCount
        ? 'left'
        : 'right';

    if (side === winningSide) {
      setIsCorrect(true);
      soundFx.playSuccess();
      const text = isId
        ? `Tepat sekali! Kelompok ini ${goal === 'more' ? 'lebih banyak' : 'lebih sedikit'}!`
        : `Spot on! This group has ${goal === 'more' ? 'more' : 'fewer'} items!`;
      soundFx.speak(text, language);
      setTimeout(() => {
        onCorrectAnswer();
      }, 950);
    } else {
      setIsCorrect(false);
      soundFx.playGentleBoing();
      const text = isId
        ? `Coba hitung lagi jumlah kedua kelompok!`
        : `Let's count both groups and try again!`;
      soundFx.speak(text, language);
    }
  };

  const readQuestion = () => {
    const text = isId
      ? `Mana yang LEBIH ${goal === 'more' ? 'BANYAK' : 'SEDIKIT'}? Pilih kelompoknya!`
      : `Which group has ${goal === 'more' ? 'MORE' : 'FEWER'}? Tap the group!`;
    soundFx.speak(text, language);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Question Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-200/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={readQuestion}
            className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-transform active:scale-90"
            title="Listen to question"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                {isId ? 'Latihan Membandingkan' : 'Comparison Challenge'}
              </span>
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-fun">
              {isId
                ? `Mana yang LEBIH ${goal === 'more' ? 'BANYAK' : 'SEDIKIT'}?`
                : `Which group has ${goal === 'more' ? 'MORE' : 'FEWER'}?`}
            </h2>
          </div>
        </div>

        {/* Goal Indicator Badge */}
        <div className={`px-4 py-2 rounded-2xl font-bold font-fun text-sm sm:text-base border shadow-xs ${
          goal === 'more'
            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
            : 'bg-amber-100 text-amber-900 border-amber-300'
        }`}>
          {goal === 'more' ? (isId ? '🔼 Lebih Banyak' : '🔼 MORE') : (isId ? '🔽 Lebih Sedikit' : '🔽 FEWER')}
        </div>
      </div>

      {/* Two Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <button
          onClick={() => handleChooseSide('left')}
          className={`relative p-6 rounded-3xl border-3 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            selectedSide === 'left'
              ? isCorrect
                ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 shadow-md scale-102'
                : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200 animate-wiggle'
              : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-md'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-4">
            <span className="font-fun font-bold text-lg text-slate-800">
              {isId ? leftDef.pluralId : leftDef.pluralEn}
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold font-fun text-lg tabular-nums">
              {leftCount}
            </span>
          </div>

          {/* Items Canvas with Clickable Objects */}
          <div className="min-h-[180px] bg-amber-50/50 rounded-2xl p-4 flex flex-wrap items-center justify-center content-center gap-3">
            {Array.from({ length: leftCount }).map((_, i) => {
              const isTapped = leftTapped.includes(i);
              const tapOrder = leftTapped.indexOf(i) + 1;
              return (
                <div
                  key={i}
                  onClick={(e) => handleLeftItemClick(e, i)}
                  className={`relative p-1.5 rounded-2xl transition-all duration-150 cursor-pointer active:scale-90 ${
                    isTapped ? 'bg-amber-100 ring-2 ring-amber-400 scale-105 shadow-xs' : 'hover:scale-105'
                  }`}
                  title="Click to count!"
                >
                  {isTapped && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-white font-fun font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-white tabular-nums animate-bounce">
                      {tapOrder}
                    </span>
                  )}
                  <ItemIllustration type={leftItem} size={leftCount > 8 ? 44 : 54} isAnimated />
                </div>
              );
            })}
          </div>

          {/* Tap Selection CTA */}
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-white font-fun font-bold text-sm shadow-xs hover:bg-amber-600 transition-colors">
              {isId ? 'Pilih Kelompok Ini 👈' : 'Choose This Side 👈'}
            </span>
          </div>
        </button>

        {/* Right Side */}
        <button
          onClick={() => handleChooseSide('right')}
          className={`relative p-6 rounded-3xl border-3 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            selectedSide === 'right'
              ? isCorrect
                ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 shadow-md scale-102'
                : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200 animate-wiggle'
              : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-md'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-4">
            <span className="font-fun font-bold text-lg text-slate-800">
              {isId ? rightDef.pluralId : rightDef.pluralEn}
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold font-fun text-lg tabular-nums">
              {rightCount}
            </span>
          </div>

          {/* Items Canvas with Clickable Objects */}
          <div className="min-h-[180px] bg-amber-50/50 rounded-2xl p-4 flex flex-wrap items-center justify-center content-center gap-3">
            {Array.from({ length: rightCount }).map((_, i) => {
              const isTapped = rightTapped.includes(i);
              const tapOrder = rightTapped.indexOf(i) + 1;
              return (
                <div
                  key={i}
                  onClick={(e) => handleRightItemClick(e, i)}
                  className={`relative p-1.5 rounded-2xl transition-all duration-150 cursor-pointer active:scale-90 ${
                    isTapped ? 'bg-amber-100 ring-2 ring-amber-400 scale-105 shadow-xs' : 'hover:scale-105'
                  }`}
                  title="Click to count!"
                >
                  {isTapped && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-white font-fun font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-white tabular-nums animate-bounce">
                      {tapOrder}
                    </span>
                  )}
                  <ItemIllustration type={rightItem} size={rightCount > 8 ? 44 : 54} isAnimated />
                </div>
              );
            })}
          </div>

          {/* Tap Selection CTA */}
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-white font-fun font-bold text-sm shadow-xs hover:bg-amber-600 transition-colors">
              {isId ? 'Pilih Kelompok Ini 👉' : 'Choose This Side 👉'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
