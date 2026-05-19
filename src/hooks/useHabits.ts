import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { getTodayStr } from '../lib/utils';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('langkah_habits');
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse habits', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('langkah_habits', JSON.stringify(habits));
    }
  }, [habits, isLoading]);

  const addHabit = (name: string, category: Habit['category']) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      category,
      createdAt: new Date().toISOString(),
      completions: [],
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  const toggleHabit = (id: string, dateStr: string = getTodayStr()) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completions.includes(dateStr);
        return {
          ...habit,
          completions: isCompleted 
            ? habit.completions.filter(d => d !== dateStr)
            : [...habit.completions, dateStr]
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    if (window.confirm('Hapus kebiasaan ini?')) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const resetData = () => {
    if (window.confirm('Hapus semua data kebiasaan? Tindakan ini tidak bisa dibatalkan.')) {
      setHabits([]);
    }
  };

  return { habits, addHabit, toggleHabit, deleteHabit, resetData, isLoading };
}
