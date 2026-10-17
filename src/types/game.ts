/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'count_tap' | 'feed_animal' | 'compare' | 'ten_frame' | 'math_garden' | 'sticker_album';

export type NumberRange = '1-5' | '1-10' | '1-20';

export type Language = 'en' | 'id';

export type ItemCategory = 'fruit' | 'animal';

export type FruitType = 'apple' | 'strawberry' | 'banana' | 'orange' | 'grapes' | 'watermelon' | 'pineapple' | 'blueberry';

export type AnimalType = 'bunny' | 'panda' | 'puppy' | 'kitten' | 'frog' | 'chick' | 'lion' | 'penguin';

export type GameItemType = FruitType | AnimalType;

export interface GameItemDef {
  id: GameItemType;
  nameEn: string;
  nameId: string;
  category: ItemCategory;
  color: string;
  pluralEn: string;
  pluralId: string;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number; // percentage
  y: number; // percentage
  rotation: number;
  scale: number;
}

export interface PlayerStats {
  stars: number;
  unlockedStickers: string[];
  placedStickers: PlacedSticker[];
  albumBackground: 'garden' | 'farm' | 'orchard' | 'picnic';
  questionsCompleted: number;
}
