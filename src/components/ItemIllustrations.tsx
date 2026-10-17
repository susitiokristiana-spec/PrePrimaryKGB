/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameItemType, GameItemDef } from '../types/game';

export const GAME_ITEMS: GameItemDef[] = [
  // Colorful Fruits
  { id: 'apple', nameEn: 'Apple', nameId: 'Apel', category: 'fruit', color: '#EF4444', pluralEn: 'Apples', pluralId: 'Apel' },
  { id: 'strawberry', nameEn: 'Strawberry', nameId: 'Stroberi', category: 'fruit', color: '#F43F5E', pluralEn: 'Strawberries', pluralId: 'Stroberi' },
  { id: 'banana', nameEn: 'Banana', nameId: 'Pisang', category: 'fruit', color: '#EAB308', pluralEn: 'Bananas', pluralId: 'Pisang' },
  { id: 'orange', nameEn: 'Orange', nameId: 'Jeruk', category: 'fruit', color: '#F97316', pluralEn: 'Oranges', pluralId: 'Jeruk' },
  { id: 'grapes', nameEn: 'Grapes', nameId: 'Anggur', category: 'fruit', color: '#8B5CF6', pluralEn: 'Grapes', pluralId: 'Anggur' },
  { id: 'watermelon', nameEn: 'Watermelon', nameId: 'Semangka', category: 'fruit', color: '#10B981', pluralEn: 'Watermelons', pluralId: 'Semangka' },
  { id: 'pineapple', nameEn: 'Pineapple', nameId: 'Nanas', category: 'fruit', color: '#F59E0B', pluralEn: 'Pineapples', pluralId: 'Nanas' },
  { id: 'blueberry', nameEn: 'Blueberry', nameId: 'Bluberi', category: 'fruit', color: '#3B82F6', pluralEn: 'Blueberries', pluralId: 'Bluberi' },

  // Cute Animals
  { id: 'bunny', nameEn: 'Bunny', nameId: 'Kelinci', category: 'animal', color: '#F472B6', pluralEn: 'Bunnies', pluralId: 'Kelinci' },
  { id: 'panda', nameEn: 'Panda', nameId: 'Panda', category: 'animal', color: '#64748B', pluralEn: 'Pandas', pluralId: 'Panda' },
  { id: 'puppy', nameEn: 'Puppy', nameId: 'Anjing Kecil', category: 'animal', color: '#F59E0B', pluralEn: 'Puppies', pluralId: 'Anjing Kecil' },
  { id: 'kitten', nameEn: 'Kitten', nameId: 'Anak Kucing', category: 'animal', color: '#FB923C', pluralEn: 'Kittens', pluralId: 'Anak Kucing' },
  { id: 'frog', nameEn: 'Frog', nameId: 'Katak', category: 'animal', color: '#22C55E', pluralEn: 'Frogs', pluralId: 'Katak' },
  { id: 'chick', nameEn: 'Chick', nameId: 'Anak Ayam', category: 'animal', color: '#EAB308', pluralEn: 'Chicks', pluralId: 'Anak Ayam' },
  { id: 'lion', nameEn: 'Lion Cub', nameId: 'Anak Singa', category: 'animal', color: '#D97706', pluralEn: 'Lion Cubs', pluralId: 'Anak Singa' },
  { id: 'penguin', nameEn: 'Penguin', nameId: 'Pinguin', category: 'animal', color: '#0284C7', pluralEn: 'Penguins', pluralId: 'Pinguin' },
];

export function getItemDef(type: GameItemType): GameItemDef {
  return GAME_ITEMS.find((it) => it.id === type) || GAME_ITEMS[0];
}

interface ItemIconProps {
  type: GameItemType;
  size?: number;
  className?: string;
  isAnimated?: boolean;
}

export const ItemIllustration: React.FC<ItemIconProps> = ({
  type,
  size = 64,
  className = '',
  isAnimated = false,
}) => {
  const animClass = isAnimated ? 'hover:scale-110 transition-transform duration-200' : '';

  switch (type) {
    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Leaf & Stem */}
          <path d="M50 15 C48 8, 52 4, 54 2 C55 1, 56 3, 55 7 C54 11, 52 14, 50 15 Z" fill="#78350F" />
          <path d="M52 10 C62 5, 68 12, 65 18 C58 19, 54 15, 52 10 Z" fill="#22C55E" />
          {/* Apple Body */}
          <path
            d="M50 25 C30 18, 15 32, 16 55 C17 76, 32 92, 50 88 C68 92, 83 76, 84 55 C85 32, 70 18, 50 25 Z"
            fill="#EF4444"
          />
          {/* Gloss Highlight */}
          <ellipse cx="32" cy="40" rx="8" ry="14" fill="#F87171" opacity="0.6" transform="rotate(-20 32 40)" />
          {/* Cute Face */}
          <circle cx="40" cy="52" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="52" r="3.5" fill="#1E293B" />
          <circle cx="41.5" cy="50.5" r="1.2" fill="#FFFFFF" />
          <circle cx="61.5" cy="50.5" r="1.2" fill="#FFFFFF" />
          {/* Rosy Cheeks */}
          <circle cx="34" cy="57" r="4" fill="#FDA4AF" opacity="0.8" />
          <circle cx="66" cy="57" r="4" fill="#FDA4AF" opacity="0.8" />
          {/* Smile */}
          <path d="M45 58 Q50 64 55 58" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'strawberry':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Strawberry Body */}
          <path
            d="M50 88 C32 78, 18 60, 20 40 C22 25, 36 24, 50 28 C64 24, 78 25, 80 40 C82 60, 68 78, 50 88 Z"
            fill="#E11D48"
          />
          {/* Calyx Leaves */}
          <path d="M50 28 Q42 16 30 20 Q40 28 46 29 Z" fill="#16A34A" />
          <path d="M50 28 Q50 14 50 12 Q50 24 50 28 Z" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 28 Q58 16 70 20 Q60 28 54 29 Z" fill="#16A34A" />
          <path d="M50 28 Q50 18 50 29 Z" fill="#22C55E" />
          {/* Yellow Seeds */}
          <ellipse cx="32" cy="42" rx="1.8" ry="2.8" fill="#FDE047" />
          <ellipse cx="68" cy="42" rx="1.8" ry="2.8" fill="#FDE047" />
          <ellipse cx="28" cy="58" rx="1.8" ry="2.8" fill="#FDE047" />
          <ellipse cx="72" cy="58" rx="1.8" ry="2.8" fill="#FDE047" />
          <ellipse cx="40" cy="72" rx="1.8" ry="2.8" fill="#FDE047" />
          <ellipse cx="60" cy="72" rx="1.8" ry="2.8" fill="#FDE047" />
          {/* Cute Face */}
          <circle cx="42" cy="50" r="3.2" fill="#1E293B" />
          <circle cx="58" cy="50" r="3.2" fill="#1E293B" />
          <circle cx="43" cy="49" r="1.2" fill="#FFFFFF" />
          <circle cx="59" cy="49" r="1.2" fill="#FFFFFF" />
          <circle cx="36" cy="54" r="3.5" fill="#FDA4AF" />
          <circle cx="64" cy="54" r="3.5" fill="#FDA4AF" />
          <path d="M47 55 Q50 59 53 55" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'banana':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Banana Body */}
          <path
            d="M24 74 C16 52, 28 26, 68 18 C72 17, 75 19, 72 23 C40 32, 34 56, 38 78 C38 82, 32 84, 28 82 C25 80, 24 77, 24 74 Z"
            fill="#FACC15"
          />
          {/* Banana Highlight & Tip */}
          <path d="M68 18 L74 14 C75 13, 77 15, 75 17 L72 23 Z" fill="#65A30D" />
          <path d="M24 74 C25 78, 27 82, 29 82 C28 82, 26 80, 24 77 Z" fill="#854D0E" />
          {/* Inner Highlight */}
          <path d="M38 65 C32 50, 40 36, 60 26" stroke="#FEF08A" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Cute Face */}
          <circle cx="42" cy="46" r="3" fill="#1E293B" />
          <circle cx="54" cy="42" r="3" fill="#1E293B" />
          <circle cx="38" cy="49" r="3" fill="#FDA4AF" />
          <circle cx="58" cy="45" r="3" fill="#FDA4AF" />
          <path d="M46 50 Q50 54 52 48" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'orange':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Stem & Leaf */}
          <rect x="48" y="10" width="4" height="12" rx="2" fill="#78350F" />
          <path d="M52 14 C64 8, 70 16, 66 22 C56 22, 53 18, 52 14 Z" fill="#22C55E" />
          {/* Orange Body */}
          <circle cx="50" cy="54" r="36" fill="#F97316" />
          {/* Texture Dimples / Highlight */}
          <ellipse cx="36" cy="38" rx="8" ry="12" fill="#FB923C" opacity="0.7" transform="rotate(-20 36 38)" />
          {/* Face */}
          <circle cx="40" cy="52" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="52" r="3.5" fill="#1E293B" />
          <circle cx="41.5" cy="50.5" r="1.2" fill="#FFFFFF" />
          <circle cx="61.5" cy="50.5" r="1.2" fill="#FFFFFF" />
          <circle cx="33" cy="58" r="4" fill="#FDBA74" />
          <circle cx="67" cy="58" r="4" fill="#FDBA74" />
          <path d="M44 58 Q50 65 56 58" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'grapes':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Stem */}
          <path d="M50 16 C50 8, 55 6, 56 4" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M52 14 C62 8, 66 16, 62 20 C54 20, 52 16, 52 14 Z" fill="#22C55E" />
          {/* Grape Spheres */}
          <circle cx="36" cy="32" r="12" fill="#8B5CF6" />
          <circle cx="52" cy="30" r="12" fill="#9333EA" />
          <circle cx="66" cy="34" r="12" fill="#8B5CF6" />
          <circle cx="30" cy="48" r="12" fill="#7C3AED" />
          <circle cx="48" cy="46" r="13" fill="#A855F7" />
          <circle cx="68" cy="50" r="12" fill="#7C3AED" />
          <circle cx="38" cy="64" r="12" fill="#8B5CF6" />
          <circle cx="56" cy="64" r="12" fill="#9333EA" />
          <circle cx="48" cy="78" r="11" fill="#7C3AED" />
          {/* Face on the main grape */}
          <circle cx="44" cy="45" r="2.5" fill="#FFFFFF" />
          <circle cx="54" cy="45" r="2.5" fill="#FFFFFF" />
          <circle cx="44" cy="45.5" r="1.5" fill="#1E293B" />
          <circle cx="54" cy="45.5" r="1.5" fill="#1E293B" />
          <path d="M47 51 Q49 54 51 51" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'watermelon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Rind Outer */}
          <path d="M15 48 C15 76, 40 88, 50 88 C60 88, 85 76, 85 48 Z" fill="#15803D" />
          {/* White Rind Layer */}
          <path d="M18 48 C18 73, 40 84, 50 84 C60 84, 82 73, 82 48 Z" fill="#DCFCE7" />
          {/* Juicy Red Flesh */}
          <path d="M21 48 C21 70, 40 80, 50 80 C60 80, 79 70, 79 48 Z" fill="#EF4444" />
          {/* Seeds */}
          <ellipse cx="32" cy="58" rx="2" ry="3.5" fill="#1E293B" />
          <ellipse cx="68" cy="58" rx="2" ry="3.5" fill="#1E293B" />
          <ellipse cx="42" cy="70" rx="2" ry="3.5" fill="#1E293B" />
          <ellipse cx="58" cy="70" rx="2" ry="3.5" fill="#1E293B" />
          {/* Cute Face */}
          <circle cx="43" cy="54" r="3" fill="#1E293B" />
          <circle cx="57" cy="54" r="3" fill="#1E293B" />
          <circle cx="44" cy="53" r="1" fill="#FFFFFF" />
          <circle cx="58" cy="53" r="1" fill="#FFFFFF" />
          <circle cx="37" cy="58" r="3" fill="#FDA4AF" />
          <circle cx="63" cy="58" r="3" fill="#FDA4AF" />
          <path d="M47 60 Q50 64 53 60" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'pineapple':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Crown Leaves */}
          <path d="M50 32 L38 12 Q48 18 50 30 Q52 18 62 12 Z" fill="#16A34A" />
          <path d="M50 32 L44 8 Q50 16 50 30 Q50 16 56 8 Z" fill="#22C55E" />
          {/* Pineapple Body */}
          <ellipse cx="50" cy="58" rx="26" ry="30" fill="#F59E0B" />
          {/* Texture Rhombus Lines */}
          <path d="M30 46 L70 70 M30 70 L70 46 M26 58 L74 58" stroke="#D97706" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          {/* Cute Face */}
          <circle cx="42" cy="54" r="3.5" fill="#1E293B" />
          <circle cx="58" cy="54" r="3.5" fill="#1E293B" />
          <circle cx="43" cy="53" r="1.2" fill="#FFFFFF" />
          <circle cx="59" cy="53" r="1.2" fill="#FFFFFF" />
          <circle cx="36" cy="60" r="4" fill="#FDE68A" />
          <circle cx="64" cy="60" r="4" fill="#FDE68A" />
          <path d="M46 62 Q50 66 54 62" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'blueberry':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Berry Body */}
          <circle cx="50" cy="55" r="34" fill="#3B82F6" />
          {/* Star Crown */}
          <path
            d="M50 25 L53 30 L58 29 L55 34 L58 38 L52 37 L50 42 L48 37 L42 38 L45 34 L42 29 L47 30 Z"
            fill="#1D4ED8"
          />
          {/* Highlight */}
          <ellipse cx="36" cy="44" rx="7" ry="11" fill="#60A5FA" opacity="0.6" transform="rotate(-25 36 44)" />
          {/* Cute Face */}
          <circle cx="42" cy="55" r="3.5" fill="#1E293B" />
          <circle cx="58" cy="55" r="3.5" fill="#1E293B" />
          <circle cx="43.5" cy="53.5" r="1.2" fill="#FFFFFF" />
          <circle cx="59.5" cy="53.5" r="1.2" fill="#FFFFFF" />
          <circle cx="35" cy="62" r="4" fill="#93C5FD" />
          <circle cx="65" cy="62" r="4" fill="#93C5FD" />
          <path d="M46 63 Q50 67 54 63" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    // ANIMALS
    case 'bunny':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Bunny Ears */}
          <ellipse cx="36" cy="24" rx="8" ry="20" fill="#FDF2F8" stroke="#F472B6" strokeWidth="2" />
          <ellipse cx="36" cy="24" rx="4.5" ry="14" fill="#F472B6" opacity="0.7" />
          <ellipse cx="64" cy="24" rx="8" ry="20" fill="#FDF2F8" stroke="#F472B6" strokeWidth="2" />
          <ellipse cx="64" cy="24" rx="4.5" ry="14" fill="#F472B6" opacity="0.7" />
          {/* Bunny Head */}
          <ellipse cx="50" cy="58" rx="34" ry="30" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          {/* Big Sparkly Eyes */}
          <circle cx="38" cy="54" r="5" fill="#1E293B" />
          <circle cx="62" cy="54" r="5" fill="#1E293B" />
          <circle cx="40" cy="52" r="2" fill="#FFFFFF" />
          <circle cx="64" cy="52" r="2" fill="#FFFFFF" />
          {/* Rosy Cheeks */}
          <circle cx="30" cy="62" r="6" fill="#FBCFE8" />
          <circle cx="70" cy="62" r="6" fill="#FBCFE8" />
          {/* Pink Nose */}
          <polygon points="50,60 46,56 54,56" fill="#F43F5E" />
          {/* Mouth */}
          <path d="M46 61 Q50 65 50 63 Q50 65 54 61" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          {/* Whiskers */}
          <line x1="26" y1="58" x2="16" y2="56" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="64" x2="16" y2="66" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="74" y1="58" x2="84" y2="56" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="74" y1="64" x2="84" y2="66" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'panda':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Panda Round Ears */}
          <circle cx="28" cy="28" r="14" fill="#1E293B" />
          <circle cx="72" cy="28" r="14" fill="#1E293B" />
          {/* Head */}
          <ellipse cx="50" cy="56" rx="36" ry="32" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Eye Patches */}
          <ellipse cx="36" cy="52" rx="9" ry="12" fill="#1E293B" transform="rotate(-15 36 52)" />
          <ellipse cx="64" cy="52" rx="9" ry="12" fill="#1E293B" transform="rotate(15 64 52)" />
          {/* White Eyes & Pupils */}
          <circle cx="36" cy="52" r="4.5" fill="#FFFFFF" />
          <circle cx="64" cy="52" r="4.5" fill="#FFFFFF" />
          <circle cx="37" cy="52" r="2.5" fill="#0F172A" />
          <circle cx="65" cy="52" r="2.5" fill="#0F172A" />
          <circle cx="38" cy="50.5" r="1" fill="#FFFFFF" />
          <circle cx="66" cy="50.5" r="1" fill="#FFFFFF" />
          {/* Nose */}
          <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="#1E293B" />
          {/* Mouth */}
          <path d="M45 66 Q50 71 55 66" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Rosy Cheeks */}
          <circle cx="24" cy="62" r="5" fill="#FDA4AF" opacity="0.6" />
          <circle cx="76" cy="62" r="5" fill="#FDA4AF" opacity="0.6" />
        </svg>
      );

    case 'puppy':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Floppy Brown Ears */}
          <ellipse cx="22" cy="46" rx="10" ry="22" fill="#D97706" transform="rotate(-15 22 46)" />
          <ellipse cx="78" cy="46" rx="10" ry="22" fill="#D97706" transform="rotate(15 78 46)" />
          {/* Puppy Head */}
          <ellipse cx="50" cy="54" rx="32" ry="28" fill="#FDE68A" />
          {/* White Snout */}
          <ellipse cx="50" cy="64" rx="16" ry="12" fill="#FEF3C7" />
          {/* Eyes */}
          <circle cx="38" cy="48" r="4.5" fill="#451A03" />
          <circle cx="62" cy="48" r="4.5" fill="#451A03" />
          <circle cx="39.5" cy="46.5" r="1.5" fill="#FFFFFF" />
          <circle cx="63.5" cy="46.5" r="1.5" fill="#FFFFFF" />
          {/* Nose */}
          <ellipse cx="50" cy="59" rx="6" ry="4.5" fill="#1E293B" />
          {/* Tongue & Smile */}
          <path d="M46 64 Q50 69 54 64" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 66 C48 72, 52 72, 52 66 Z" fill="#F43F5E" />
          {/* Cheeks */}
          <circle cx="32" cy="58" r="4" fill="#FCD34D" />
          <circle cx="68" cy="58" r="4" fill="#FCD34D" />
        </svg>
      );

    case 'kitten':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Pointed Ears */}
          <polygon points="20,40 32,15 44,34" fill="#FB923C" />
          <polygon points="26,36 33,22 39,33" fill="#FDA4AF" />
          <polygon points="80,40 68,15 56,34" fill="#FB923C" />
          <polygon points="74,36 67,22 61,33" fill="#FDA4AF" />
          {/* Head */}
          <ellipse cx="50" cy="56" rx="33" ry="28" fill="#FDBA74" />
          {/* Striped Forehead */}
          <path d="M50 34 L50 42 M44 36 L46 42 M56 36 L54 42" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sparkly Eyes */}
          <ellipse cx="38" cy="52" rx="5" ry="6" fill="#15803D" />
          <ellipse cx="62" cy="52" rx="5" ry="6" fill="#15803D" />
          <ellipse cx="38" cy="52" rx="2.5" ry="5" fill="#0F172A" />
          <ellipse cx="62" cy="52" rx="2.5" ry="5" fill="#0F172A" />
          <circle cx="40" cy="50" r="1.5" fill="#FFFFFF" />
          <circle cx="64" cy="50" r="1.5" fill="#FFFFFF" />
          {/* Nose */}
          <polygon points="50,60 47,57 53,57" fill="#F43F5E" />
          {/* Mouth */}
          <path d="M46 62 Q50 65 50 63 Q50 65 54 62" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="28" cy="60" r="5" fill="#FDA4AF" opacity="0.8" />
          <circle cx="72" cy="60" r="5" fill="#FDA4AF" opacity="0.8" />
          {/* Whiskers */}
          <line x1="24" y1="58" x2="12" y2="56" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="62" x2="12" y2="64" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="58" x2="88" y2="56" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="62" x2="88" y2="64" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'frog':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Eye bumps */}
          <circle cx="34" cy="32" r="14" fill="#4ADE80" />
          <circle cx="66" cy="32" r="14" fill="#4ADE80" />
          {/* Big White Eyes & Pupils */}
          <circle cx="34" cy="32" r="10" fill="#FFFFFF" />
          <circle cx="66" cy="32" r="10" fill="#FFFFFF" />
          <circle cx="35" cy="32" r="5" fill="#166534" />
          <circle cx="67" cy="32" r="5" fill="#166534" />
          <circle cx="37" cy="30" r="2" fill="#FFFFFF" />
          <circle cx="69" cy="30" r="2" fill="#FFFFFF" />
          {/* Frog Head */}
          <ellipse cx="50" cy="58" rx="38" ry="28" fill="#22C55E" />
          {/* Pale Belly */}
          <ellipse cx="50" cy="68" rx="22" ry="14" fill="#BBF7D0" />
          {/* Cheeks */}
          <circle cx="26" cy="56" r="6" fill="#F472B6" opacity="0.7" />
          <circle cx="74" cy="56" r="6" fill="#F472B6" opacity="0.7" />
          {/* Nostrils */}
          <circle cx="47" cy="48" r="1.5" fill="#15803D" />
          <circle cx="53" cy="48" r="1.5" fill="#15803D" />
          {/* Huge Wide Smile */}
          <path d="M30 56 Q50 72 70 56" fill="none" stroke="#14532D" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'chick':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Top Hair Tuft */}
          <path d="M50 20 Q48 10 44 8 Q50 14 50 20 Q54 10 58 12 Q54 16 50 20 Z" fill="#FACC15" />
          {/* Body */}
          <ellipse cx="50" cy="56" rx="34" ry="32" fill="#FACC15" />
          {/* Flappy Wings */}
          <ellipse cx="22" cy="58" rx="8" ry="14" fill="#EAB308" transform="rotate(-15 22 58)" />
          <ellipse cx="78" cy="58" rx="8" ry="14" fill="#EAB308" transform="rotate(15 78 58)" />
          {/* Big Sparkly Eyes */}
          <circle cx="38" cy="50" r="4.5" fill="#1E293B" />
          <circle cx="62" cy="50" r="4.5" fill="#1E293B" />
          <circle cx="40" cy="48" r="1.8" fill="#FFFFFF" />
          <circle cx="64" cy="48" r="1.8" fill="#FFFFFF" />
          {/* Orange Beak */}
          <polygon points="50,60 43,53 57,53" fill="#F97316" />
          {/* Rosy Cheeks */}
          <circle cx="28" cy="56" r="5" fill="#FDA4AF" />
          <circle cx="72" cy="56" r="5" fill="#FDA4AF" />
          {/* Little Feet */}
          <path d="M42 86 L42 94 M38 94 L46 94" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M58 86 L58 94 M54 94 L62 94" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'lion':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Fluffy Mane */}
          <circle cx="50" cy="52" r="38" fill="#D97706" />
          {/* Ears */}
          <circle cx="26" cy="30" r="10" fill="#F59E0B" />
          <circle cx="26" cy="30" r="5" fill="#78350F" />
          <circle cx="74" cy="30" r="10" fill="#F59E0B" />
          <circle cx="74" cy="30" r="5" fill="#78350F" />
          {/* Face */}
          <circle cx="50" cy="54" r="28" fill="#FCD34D" />
          {/* White Muzzle */}
          <ellipse cx="50" cy="62" rx="14" ry="10" fill="#FEF3C7" />
          {/* Big Eyes */}
          <circle cx="39" cy="48" r="4.5" fill="#451A03" />
          <circle cx="61" cy="48" r="4.5" fill="#451A03" />
          <circle cx="40.5" cy="46.5" r="1.5" fill="#FFFFFF" />
          <circle cx="62.5" cy="46.5" r="1.5" fill="#FFFFFF" />
          {/* Brown Nose */}
          <polygon points="50,60 45,55 55,55" fill="#78350F" />
          {/* Cute Smile */}
          <path d="M46 63 Q50 67 54 63" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="32" cy="56" r="4" fill="#FBBF24" />
          <circle cx="68" cy="56" r="4" fill="#FBBF24" />
        </svg>
      );

    case 'penguin':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`${animClass} ${className}`}>
          {/* Black Body */}
          <ellipse cx="50" cy="54" rx="34" ry="36" fill="#1E293B" />
          {/* White Belly */}
          <ellipse cx="50" cy="58" rx="24" ry="28" fill="#F8FAFC" />
          {/* Orange Flippers */}
          <ellipse cx="20" cy="56" rx="6" ry="16" fill="#0F172A" transform="rotate(20 20 56)" />
          <ellipse cx="80" cy="56" rx="6" ry="16" fill="#0F172A" transform="rotate(-20 80 56)" />
          {/* Cute Eyes */}
          <circle cx="41" cy="46" r="4" fill="#0F172A" />
          <circle cx="59" cy="46" r="4" fill="#0F172A" />
          <circle cx="42.5" cy="44.5" r="1.5" fill="#FFFFFF" />
          <circle cx="60.5" cy="44.5" r="1.5" fill="#FFFFFF" />
          {/* Orange Beak */}
          <polygon points="50,56 44,49 56,49" fill="#F97316" />
          {/* Rosy Cheeks */}
          <circle cx="33" cy="52" r="4" fill="#FDA4AF" />
          <circle cx="67" cy="52" r="4" fill="#FDA4AF" />
          {/* Feet */}
          <ellipse cx="40" cy="88" rx="8" ry="4" fill="#F97316" />
          <ellipse cx="60" cy="88" rx="8" ry="4" fill="#F97316" />
        </svg>
      );

    default:
      return null;
  }
};
