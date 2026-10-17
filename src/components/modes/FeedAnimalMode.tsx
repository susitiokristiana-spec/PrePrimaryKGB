/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimalType, FruitType, NumberRange, Language } from '../../types/game';
import { getItemDef, ItemIllustration } from '../ItemIllustrations';
import { soundFx } from '../../utils/audio';
import { Volume2, CheckCircle2, RotateCcw, Heart } from 'lucide-react';

interface FeedAnimalModeProps {
  range: NumberRange;
  language: Language;
  onCorrectAnswer: () => void;
}

const ANIMALS_FOR_FEEDING: AnimalType[] = ['bunny', 'panda', 'puppy', 'kitten', 'frog', 'penguin'];
const FRUITS_FOR_FEEDING: FruitType[] = ['apple', 'strawberry', 'banana', 'orange', 'watermelon', 'blueberry'];

export const FeedAnimalMode: React.FC<FeedAnimalModeProps> = ({
  range,
  language,
  onCorrectAnswer,
}) => {
  const isId = language === 'id';

  const getMaxNumber = () => {
    if (range === '1-5') return 5;
    if (range === '1-10') return 10;
    return 15; // capped at 15 for feeding to keep it fun without taking forever
  };

  const [animal, setAnimal] = useState<AnimalType>('panda');
  const [fruit, setFruit] = useState<FruitType>('banana');
  const [targetCount, setTargetCount] = useState<number>(3);
  const [fedCount, setFedCount] = useState<number>(0);
  const [isChewing, setIsChewing] = useState<boolean>(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'success' | 'too_few' | 'too_many'>('idle');

  const generateRound = () => {
    const max = getMaxNumber();
    const min = 2;
    const count = Math.floor(Math.random() * (max - min + 1)) + min;

    const randomAnimal = ANIMALS_FOR_FEEDING[Math.floor(Math.random() * ANIMALS_FOR_FEEDING.length)];
    const randomFruit = FRUITS_FOR_FEEDING[Math.floor(Math.random() * FRUITS_FOR_FEEDING.length)];

    setAnimal(randomAnimal);
    setFruit(randomFruit);
    setTargetCount(count);
    setFedCount(0);
    setFeedbackState('idle');
  };

  useEffect(() => {
    generateRound();
  }, [range]);

  const animalDef = getItemDef(animal);
  const fruitDef = getItemDef(fruit);

  const handleFeedFruit = () => {
    if (fedCount >= 20 || feedbackState === 'success') return;

    const nextCount = fedCount + 1;
    setFedCount(nextCount);
    setIsChewing(true);
    soundFx.playObjectClick(fruit, nextCount);
    soundFx.playMunch();
    soundFx.speak(`${nextCount}`, language);

    setTimeout(() => {
      setIsChewing(false);
    }, 400);

    // If matches target, automatically check or let child confirm
    if (nextCount === targetCount) {
      setFeedbackState('idle');
    } else if (nextCount > targetCount) {
      setFeedbackState('too_many');
    }
  };

  const handleRemoveFruit = () => {
    if (fedCount <= 0 || feedbackState === 'success') return;
    setFedCount((prev) => Math.max(0, prev - 1));
    soundFx.playObjectClick(fruit);
    soundFx.playPop();
    setFeedbackState('idle');
  };

  const handleVerify = () => {
    if (fedCount === targetCount) {
      setFeedbackState('success');
      soundFx.playSuccess();
      const praise = isId ? 'Nyam nyam! Terima kasih, enak sekali!' : 'Yum yum! Thank you so much!';
      soundFx.speak(praise, language);
      setTimeout(() => {
        onCorrectAnswer();
      }, 1000);
    } else if (fedCount < targetCount) {
      setFeedbackState('too_few');
      soundFx.playGentleBoing();
      const text = isId
        ? `Masih kurang! Ayo tambahkan lagi sampai ${targetCount}.`
        : `Still hungry! Let's add more to make ${targetCount}.`;
      soundFx.speak(text, language);
    } else {
      setFeedbackState('too_many');
      soundFx.playGentleBoing();
      const text = isId
        ? `Ups, terlalu banyak! Kurangi sedikit ya.`
        : `Oops, too many! Tap to remove a few.`;
      soundFx.speak(text, language);
    }
  };

  const speakInstructions = () => {
    const text = isId
      ? `Halo! Tolong beri makan si ${animalDef.nameId} sebanyak ${targetCount} ${fruitDef.pluralId}!`
      : `Hello! Please feed ${animalDef.nameEn} ${targetCount} ${fruitDef.pluralEn}!`;
    soundFx.speak(text, language);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Request Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <button
            onClick={speakInstructions}
            className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-transform active:scale-90"
            title="Listen to request"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-sm font-semibold text-amber-800 uppercase tracking-wide">
                {animalDef.nameEn} {isId ? 'Lapar!' : 'is Hungry!'}
              </span>
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-amber-950 font-fun">
              {isId
                ? `Beri Makan: ${targetCount} ${fruitDef.pluralId}`
                : `Feed: ${targetCount} ${fruitDef.pluralEn}`}
            </h2>
          </div>
        </div>

        {/* Fed Count Display */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-center">
            <span className="text-xs uppercase font-bold text-amber-800 block">
              {isId ? 'Di Piring' : 'In Bowl'}
            </span>
            <span
              className={`text-2xl sm:text-3xl font-bold font-fun tabular-nums ${
                fedCount === targetCount
                  ? 'text-emerald-600'
                  : fedCount > targetCount
                  ? 'text-rose-600'
                  : 'text-amber-900'
              }`}
            >
              {fedCount} / {targetCount}
            </span>
          </div>

          <button
            onClick={() => {
              setFedCount(0);
              setFeedbackState('idle');
              soundFx.playPop();
            }}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Empty bowl"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Animal + Bowl */}
      <div className="bg-gradient-to-b from-sky-50/60 via-amber-50/40 to-emerald-50/60 rounded-3xl p-6 sm:p-8 border-2 border-dashed border-amber-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Cute Animal Mascot with Chewing Animation */}
          <div className="flex flex-col items-center justify-center text-center">
            <button
              onClick={() => {
                soundFx.playObjectClick(animal);
                setIsChewing(true);
                setTimeout(() => setIsChewing(false), 300);
                soundFx.speak(isId ? animalDef.nameId : animalDef.nameEn, language);
              }}
              className={`relative transition-transform duration-200 cursor-pointer ${
                isChewing ? 'scale-115 rotate-3' : 'scale-100 hover:scale-105 active:scale-95'
              }`}
              title="Tap to hear animal!"
            >
              <ItemIllustration type={animal} size={150} />

              {/* Heart bubbles when satisfied */}
              {fedCount === targetCount && (
                <div className="absolute -top-4 -right-2 flex gap-1 animate-bounce">
                  <span className="text-2xl">❤️</span>
                  <span className="text-xl">✨</span>
                </div>
              )}
            </button>

            <div className="mt-3 px-4 py-2 rounded-2xl bg-white/90 shadow-xs border border-amber-200 text-sm font-bold text-amber-900 font-fun">
              {isChewing
                ? isId
                  ? 'Nyam nyam nyam! 😋'
                  : 'Nom nom nom! 😋'
                : fedCount === targetCount
                ? isId
                  ? 'Perutku kenyang dan senang! 🎉'
                  : 'My tummy is full and happy! 🎉'
                : isId
                ? `Tolong ${targetCount} ${fruitDef.pluralId} ya!`
                : `I need ${targetCount} ${fruitDef.pluralEn} please!`}
            </div>
          </div>

          {/* Right: The Food Bowl / Platter */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              {isId ? 'Piring Makan (Klik buah untuk kurangi)' : 'Eating Bowl (Tap fruit to remove)'}
            </span>

            {/* Bowl Container */}
            <div className="w-full min-h-[160px] bg-white/80 rounded-3xl p-4 border-4 border-amber-300 shadow-inner flex flex-wrap items-center justify-center content-center gap-2">
              {fedCount === 0 ? (
                <span className="text-sm font-semibold text-slate-400 italic">
                  {isId ? 'Piring masih kosong...' : 'The bowl is empty...'}
                </span>
              ) : (
                Array.from({ length: fedCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={handleRemoveFruit}
                    className="p-1 rounded-xl hover:bg-rose-100 transition-transform active:scale-90"
                    title="Tap to take away"
                  >
                    <ItemIllustration type={fruit} size={42} />
                  </button>
                ))
              )}
            </div>

            {/* Feeding Action Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 w-full">
              {/* Tap to Feed Fruit */}
              <button
                onClick={handleFeedFruit}
                disabled={feedbackState === 'success'}
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-base sm:text-lg shadow-sm flex items-center justify-center gap-2 font-fun transition-transform"
              >
                <ItemIllustration type={fruit} size={30} />
                <span>{isId ? `+1 ${fruitDef.nameId}` : `+1 ${fruitDef.nameEn}`}</span>
              </button>

              {/* Done / Check button */}
              <button
                onClick={handleVerify}
                className={`py-3 px-6 rounded-2xl font-extrabold text-base sm:text-lg shadow-sm flex items-center justify-center gap-2 font-fun transition-transform active:scale-95 ${
                  fedCount === targetCount
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isId ? 'Sudah Pas!' : 'Done!'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
