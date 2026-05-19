/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Kesehatan' | 'Produktivitas' | 'Belajar' | 'Mindfulness' | 'Lainnya';

export interface Completion {
  date: string; // ISO string (YYYY-MM-DD)
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  category: Category;
  createdAt: string;
  completions: string[]; // List of YYYY-MM-DD date strings
}

export interface DailyStats {
  date: string;
  count: number;
}

export const CATEGORIES: Category[] = ['Kesehatan', 'Produktivitas', 'Belajar', 'Mindfulness', 'Lainnya'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Kesehatan: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Produktivitas: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Belajar: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Mindfulness: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Lainnya: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};
