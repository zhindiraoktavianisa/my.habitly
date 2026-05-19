import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function getMotivation() {
  const motivations = [
    "Langkah kecil hari ini adalah lompatan besar besok.",
    "Konsistensi adalah kunci keberhasilan.",
    "Jangan berhenti sampai kamu bangga.",
    "Satu kebiasaan baik bisa mengubah hidupmu.",
    "Hari yang produktif dimulai dari kebiasaan yang tepat.",
    "Kamu lebih kuat dari yang kamu bayangkan.",
    "Fokus pada proses, bukan hanya hasil."
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}
