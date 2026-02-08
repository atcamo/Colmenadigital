
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { NounsBee } from './NounsBee';

import { useTranslation } from '../context/LanguageContext';

export const LoadingState: React.FC = () => {
  const { t } = useTranslation();
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = t('loading.messages') || [];

  useEffect(() => {
    if (messages.length === 0) return;

    const msgTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => {
      clearInterval(msgTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-nounYellow flex flex-col items-center justify-center p-8 text-center overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66 L0 50 L0 16 L28 0 L56 16 L56 50 L28 66 L28 100' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E")`, backgroundSize: '56px 100px' }}>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
                @keyframes bee-pacman {
                    0% { transform: translateX(-150%) rotate(0deg); }
                    45% { transform: translateX(0%) rotate(0deg); }
                    55% { transform: translateX(0%) rotate(180deg); }
                    100% { transform: translateX(-150%) rotate(180deg); }
                }
                .animate-bee-pacman {
                    animation: bee-pacman 4s infinite linear;
                }
                @keyframes flower-bloom {
                    0%, 100% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
                .animate-flower-bloom {
                    animation: flower-bloom 2s infinite ease-in-out;
                }
            ` }} />

      <div className="relative w-full max-w-xl h-48 mb-12 flex items-center justify-center bg-white/50 border-4 border-black border-dashed overflow-hidden rounded-3xl text-black">
        {/* Central Flower */}
        <div className="absolute animate-flower-bloom">
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <circle cx="50" cy="25" r="20" fill="#E63433" />
            <circle cx="75" cy="50" r="20" fill="#E63433" />
            <circle cx="50" cy="75" r="20" fill="#E63433" />
            <circle cx="25" cy="50" r="20" fill="#E63433" />
            <circle cx="50" cy="50" r="15" fill="#FFFF00" stroke="black" strokeWidth="4" />
          </svg>
        </div>

        {/* Pacman Bee */}
        <div className="absolute z-10 animate-bee-pacman">
          <NounsBee className="w-24 h-auto drop-shadow-xl" />
        </div>
      </div>

      <div className="max-w-2xl space-y-8 relative z-10 px-4 text-black text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase pixel-font mb-4 tracking-tighter">
          {t('loading.title')}
        </h2>

        <div className="bg-white border-4 border-black p-8 shadow-hard w-full max-w-lg transition-all duration-500 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Loader2 className="animate-spin text-amber-600" size={32} />
            <p className="text-2xl font-black uppercase tracking-tight">
              {messages[messageIndex]}
            </p>
          </div>
          <div className="w-full h-3 bg-gray-100 border-2 border-black overflow-hidden">
            <div className="h-full bg-amber-400 animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>

        <p className="text-xs font-black uppercase tracking-[0.3em] text-black/40 mt-6 animate-pulse">
          Procesando Trazabilidad • Generando Estrategia • Optimizando Diseño
        </p>

        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-nounRed border-2 border-black shadow-hard-sm animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
