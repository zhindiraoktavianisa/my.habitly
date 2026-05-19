import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, CheckCircle2, TrendingUp, Plus, Trash2, Calendar, Target, ChevronRight, X, AlertCircle } from 'lucide-react';
import { useHabits } from './hooks/useHabits';
import { useDarkMode } from './hooks/useDarkMode';
import { CATEGORIES, Habit, CATEGORY_COLORS, Category } from './types';
import { cn, getTodayStr, getMotivation } from './lib/utils';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfToday, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

// --- Components ---

const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={cn(
      "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50",
      className
    )}
  />
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800", className)}>
    {children}
  </div>
);

// --- Pages ---

const Dashboard = ({ 
  habits, 
  onToggle, 
  onDelete, 
  filterCategory, 
  setFilterCategory 
}: { 
  habits: Habit[]; 
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filterCategory: Category | 'Semua';
  setFilterCategory: (c: Category | 'Semua') => void;
}) => {
  const todayStr = getTodayStr();
  const filteredHabits = filterCategory === 'Semua' 
    ? habits 
    : habits.filter(h => h.category === filterCategory);

  const completedTodayCount = habits.filter(h => h.completions.includes(todayStr)).length;
  const progressPercent = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Daily Progress */}
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Progres Hari Ini</h2>
            <p className="text-white/80 text-sm">{completedTodayCount} dari {habits.length} habit selesai</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-white"
          />
        </div>
        <p className="mt-4 text-sm font-medium italic text-white/90">"{getMotivation()}"</p>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setFilterCategory('Semua')}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            filterCategory === 'Semua' 
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
              : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700"
          )}
        >
          Semua
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
              filterCategory === cat 
                ? "bg-slate-900 text-white border-transparent dark:bg-white dark:text-slate-900" 
                : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-100 dark:border-slate-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habit List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Daftar Habit 
          <span className="text-sm font-normal text-slate-400">({filteredHabits.length})</span>
        </h3>
        <AnimatePresence mode="popLayout">
          {filteredHabits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-600 dark:text-slate-300">Belum ada habit</p>
                <p className="text-sm text-slate-400">Mulai langkah pertamamu sekarang!</p>
              </div>
            </motion.div>
          ) : (
            filteredHabits.map(habit => {
              const isCompleted = habit.completions.includes(todayStr);
              // Calculate streak
              let streak = 0;
              let checkDate = startOfToday();
              while (habit.completions.includes(format(checkDate, 'yyyy-MM-dd'))) {
                streak++;
                checkDate = subDays(checkDate, 1);
              }

              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="flex items-center justify-between group">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => onToggle(habit.id)}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          isCompleted 
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        )}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", CATEGORY_COLORS[habit.category])}>
                            {habit.category}
                          </span>
                          {streak > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-md">
                              🔥 {streak} Hari
                            </span>
                          )}
                        </div>
                        <h4 className={cn("font-medium transition-all", isCompleted && "line-through text-slate-400")}>
                          {habit.name}
                        </h4>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDelete(habit.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Statistics = ({ habits, onReset }: { habits: Habit[]; onReset: () => void }) => {
  // Aggregate completions per day for the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const count = habits.reduce((acc, h) => acc + (h.completions.includes(dateStr) ? 1 : 0), 0);
    return {
      name: format(d, 'eee', { locale: id }),
      count
    };
  });

  // Category distribution
  const categoryStats = CATEGORIES.map(cat => ({
    name: cat,
    total: habits.filter(h => h.category === cat).length,
    completed: habits.filter(h => h.category === cat).reduce((acc, h) => acc + h.completions.length, 0)
  }));

  const totalCompletions = habits.reduce((acc, h) => acc + h.completions.length, 0);

  return (
    <div className="space-y-6 pb-24">
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Habit</p>
          <p className="text-3xl font-bold">{habits.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Selesai</p>
          <p className="text-3xl font-bold text-emerald-500">{totalCompletions}</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold mb-4">Aktivitas 7 Hari Terakhir</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold mb-4">Distribusi Kategori</h3>
        <div className="space-y-3">
          {categoryStats.map(stat => (
            <div key={stat.name} className="flex items-center gap-3">
              <span className={cn("text-[10px] w-24 font-bold uppercase truncate")}>{stat.name}</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000", CATEGORY_COLORS[stat.name as Category].split(' ')[0].replace('bg-', 'bg-'))}
                  style={{ width: `${habits.length > 0 ? (stat.total / habits.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">{stat.total}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="pt-4">
        <Button 
          onClick={onReset}
          className="w-full bg-red-50 text-red-600 dark:bg-red-950/20 flex items-center justify-center gap-2 py-3"
        >
          <Trash2 className="w-4 h-4" /> Reset Semua Data
        </Button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { habits, addHabit, toggleHabit, deleteHabit, resetData, isLoading } = useHabits();
  const { isDark, toggle: toggleTheme } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'beranda' | 'statistik'>('beranda');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<Category | 'Semua'>('Semua');

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<Category>('Produktivitas');

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName, newHabitCategory);
    setNewHabitName('');
    setShowAddModal(false);
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-slate-50 dark:bg-slate-950 relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Langkah</h1>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        >
          {isDark ? "🔆" : "🌙"}
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'beranda' ? (
          <Dashboard 
            habits={habits} 
            onToggle={toggleHabit} 
            onDelete={deleteHabit} 
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
        ) : (
          <Statistics habits={habits} onReset={resetData} />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto glass rounded-t-3xl px-8 py-4 flex items-center justify-around z-50">
        <button 
          onClick={() => setActiveTab('beranda')}
          className={cn("flex flex-col items-center gap-1 transition-all", activeTab === 'beranda' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")}
        >
          <Layout className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Beranda</span>
        </button>

        <div className="relative -top-8">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 active:scale-90 transition-all border-4 border-slate-50 dark:border-slate-950"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('statistik')}
          className={cn("flex flex-col items-center gap-1 transition-all", activeTab === 'statistik' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")}
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Statistik</span>
        </button>
      </nav>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Habit Baru</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddHabit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Kebiasaan</label>
                  <input
                    autoFocus
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="Contoh: Minum 2L Air"
                    className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Kategori</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewHabitCategory(cat)}
                        className={cn(
                          "px-2 py-3 rounded-xl text-xs font-bold transition-all border-2",
                          newHabitCategory === cat 
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400" 
                            : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 text-lg shadow-lg shadow-indigo-600/20 mt-4"
                >
                  Tambah Habit
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
