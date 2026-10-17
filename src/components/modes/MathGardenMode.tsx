/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameItemType, NumberRange, Language } from '../../types/game';
import { GAME_ITEMS, getItemDef, ItemIllustration } from '../ItemIllustrations';
import { soundFx } from '../../utils/audio';
import { Volume2, Plus, Minus, Equal, Sparkles, RefreshCw } from 'lucide-react';

interface MathGardenModeProps {
  range: NumberRange;
  language: Language;
  onCorrectAnswer: () => void;
}

type Operation = 'add' | 'subtract';

export const MathGardenMode: React.FC<MathGardenModeProps> = ({
  range,
  language,
  onCorrectAnswer,
}) => {
  const isId = language === 'id';

  const getMaxSum = () => {
    if (range === '1-5') return 5;
    if (range === '1-10') return 10;
    return 15;
  };

  const [operation, setOperation] = useState<Operation>('add');
  const [num1, setNum1] = useState<number>(3);
  const [num2, setNum2] = useState<number>(2);
  const [item1, setItem1] = useState<GameItemType>('apple');
  const [item2, setItem2] = useState<GameItemType>('banana');
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateRound = () => {
    const maxSum = getMaxSum();
    const op: Operation = Math.random() > 0.4 ? 'add' : 'subtract';

    let n1: number;
    let n2: number;
    let answer: number;

    if (op === 'add') {
      n1 = Math.floor(Math.random() * (maxSum - 2)) + 1;
      n2 = Math.floor(Math.random() * (maxSum - n1)) + 1;
      answer = n1 + n2;
    } else {
      // subtraction: n1 >= n2
      n1 = Math.floor(Math.random() * (maxSum - 2)) + 2;
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
      answer = n1 - n2;
    }

    const it1 = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)].id;
    let it2 = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)].id;
    if (op === 'subtract') {
      it2 = it1; // subtract same item for clarity in kindergarten
    }

    // Build choices
    const choices = new Set<number>([answer]);
    while (choices.size < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
      const fake = answer + offset;
      if (fake >= 0 && fake <= maxSum && fake !== answer) {
        choices.add(fake);
      } else {
        const fallback = Math.floor(Math.random() * maxSum) + 1;
        if (fallback !== answer) choices.add(fallback);
      }
    }

    setOperation(op);
    setNum1(n1);
    setNum2(n2);
    setItem1(it1);
    setItem2(it2);
    setOptions(Array.from(choices).sort(() => Math.random() - 0.5));
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateRound();
  }, [range]);

  const itemDef1 = getItemDef(item1);
  const itemDef2 = getItemDef(item2);
  const correctAnswer = operation === 'add' ? num1 + num2 : num1 - num2;

  const handleSelectOption = (chosen: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(chosen);

    if (chosen === correctAnswer) {
      setIsCorrect(true);
      soundFx.playSuccess();
      const praise = isId ? 'Jawabanmu benar! Hebat sekali!' : 'Super math whiz! That is correct!';
      soundFx.speak(praise, language);
      setTimeout(() => {
        onCorrectAnswer();
      }, 950);
    } else {
      setIsCorrect(false);
      soundFx.playGentleBoing();
      const retryText = isId ? 'Coba hitung lagi bersama ya!' : 'Let us count them together!';
      soundFx.speak(retryText, language);
    }
  };

  const speakEquation = () => {
    const text = isId
      ? `${num1} ${operation === 'add' ? 'ditambah' : 'dikurang'} ${num2} sama dengan berapa?`
      : `What is ${num1} ${operation === 'add' ? 'plus' : 'minus'} ${num2}?`;
    soundFx.speak(text, language);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Question Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-200/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={speakEquation}
            className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-transform active:scale-90"
            title="Read equation aloud"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              {operation === 'add' ? (isId ? 'Penjumlahan Bergambar' : 'Visual Addition') : (isId ? 'Pengurangan Bergambar' : 'Visual Subtraction')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-fun">
              {isId
                ? `${num1} ${operation === 'add' ? 'tambah (+)' : 'kurang (-)'} ${num2} jadi berapa?`
                : `${num1} ${operation === 'add' ? 'plus (+)' : 'minus (-)'} ${num2} equals what?`}
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedAnswer(null);
            setIsCorrect(null);
            soundFx.playPop();
          }}
          className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Reset round"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Visual Equation Stage */}
      <div className="bg-gradient-to-b from-amber-50/50 via-emerald-50/30 to-amber-50/60 rounded-3xl p-6 sm:p-8 border-2 border-dashed border-amber-200 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6">
        {/* Group 1 */}
        <div className="bg-white/90 rounded-2xl p-4 border border-amber-200 flex flex-col items-center min-w-[140px] shadow-xs">
          <span className="text-2xl font-bold font-fun text-amber-900 mb-2 tabular-nums">{num1}</span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-[160px]">
            {Array.from({ length: num1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  soundFx.playObjectClick(item1, i + 1);
                  soundFx.speak(`${i + 1}`, language);
                }}
                className="p-1 rounded-xl hover:bg-amber-100 transition-transform active:scale-80 cursor-pointer"
                title="Tap to count!"
              >
                <ItemIllustration type={item1} size={42} isAnimated />
              </button>
            ))}
          </div>
        </div>

        {/* Operator Badge */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-fun font-extrabold text-2xl flex items-center justify-center shadow-sm shrink-0">
          {operation === 'add' ? <Plus className="w-7 h-7 stroke-[3]" /> : <Minus className="w-7 h-7 stroke-[3]" />}
        </div>

        {/* Group 2 */}
        <div className="bg-white/90 rounded-2xl p-4 border border-amber-200 flex flex-col items-center min-w-[140px] shadow-xs">
          <span className="text-2xl font-bold font-fun text-amber-900 mb-2 tabular-nums">{num2}</span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-[160px]">
            {Array.from({ length: num2 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  soundFx.playObjectClick(item2, i + 1);
                  soundFx.speak(`${i + 1}`, language);
                }}
                className="relative p-1 rounded-xl hover:bg-amber-100 transition-transform active:scale-80 cursor-pointer"
                title="Tap to count!"
              >
                <ItemIllustration type={item2} size={42} isAnimated />
                {operation === 'subtract' && (
                  <span className="absolute inset-0 flex items-center justify-center text-rose-600 font-extrabold text-2xl">
                    ✕
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Equals Sign */}
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white font-fun font-extrabold text-2xl flex items-center justify-center shadow-sm shrink-0">
          <Equal className="w-7 h-7 stroke-[3]" />
        </div>

        {/* Question Mark Mystery Box */}
        <div className="w-24 h-24 rounded-2xl bg-amber-200/70 border-3 border-dashed border-amber-400 flex items-center justify-center text-amber-900 font-fun font-bold text-4xl shadow-inner animate-pulse">
          ?
        </div>
      </div>

      {/* Answer Choices */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-bold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-fun text-lg">
            {isId ? 'Berapa hasilnya?' : 'What is the answer?'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
          {options.map((optionNum) => {
            const isSelected = selectedAnswer === optionNum;
            let btnClass = 'bg-amber-50 border-2 border-amber-300 text-amber-950 hover:bg-amber-100 hover:border-amber-400';

            if (isSelected) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500 border-2 border-emerald-600 text-white ring-4 ring-emerald-200 scale-105';
              } else {
                btnClass = 'bg-rose-500 border-2 border-rose-600 text-white ring-4 ring-rose-200 animate-wiggle';
              }
            }

            return (
              <button
                key={optionNum}
                onClick={() => handleSelectOption(optionNum)}
                disabled={selectedAnswer !== null && isCorrect === true}
                className={`py-5 sm:py-6 rounded-2xl font-fun font-bold text-3xl sm:text-4xl shadow-sm transition-all duration-150 active:scale-95 flex flex-col items-center justify-center ${btnClass}`}
              >
                <span className="tabular-nums">{optionNum}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
