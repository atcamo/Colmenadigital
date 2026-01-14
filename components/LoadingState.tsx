
import React from 'react';
import { Sparkles } from 'lucide-react';
import { NounsBee } from './NounsBee';

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-nounYellow flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66 L0 50 L0 16 L28 0 L56 16 L56 50 L28 66 L28 100' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E")`, backgroundSize: '56px 100px' }}>
      </div>

      <div className="relative w-full max-w-xl h-48 mb-6 flex items-center justify-center bg-white/50 border-4 border-black border-dashed overflow-hidden rounded-3xl text-black">
        {/* Central Flower (Target) */}
        <div className="absolute animate-flower-bloom">
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            {/* Petals */}
            <circle cx="50" cy="25" r="20" fill="#E63433" />
            <circle cx="75" cy="50" r="20" fill="#E63433" />
            <circle cx="50" cy="75" r="20" fill="#E63433" />
            <circle cx="25" cy="50" r="20" fill="#E63433" />
            {/* Center */}
            <circle cx="50" cy="50" r="15" fill="#FFFF00" stroke="black" strokeWidth="4" />
          </svg>
        </div>

        {/* Pacman Bee */}
        <div className="absolute z-10 animate-bee-pacman">
          <NounsBee className="w-20 h-auto drop-shadow-xl" />
        </div>

        {/* Decorative Flowers in background */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 scale-50"
            style={{
              left: `${(i * 20)}%`,
              top: i % 2 === 0 ? '10%' : '70%',
              animation: `flower-bloom 3s infinite ${i * 0.5}s`
            }}
          >
            <svg viewBox="0 0 100 100" className="w-16 h-16">
              <circle cx="50" cy="25" r="20" fill="#2D81FF" />
              <circle cx="75" cy="50" r="20" fill="#2D81FF" />
              <circle cx="50" cy="75" r="20" fill="#2D81FF" />
              <circle cx="25" cy="50" r="20" fill="#2D81FF" />
              <circle cx="50" cy="50" r="15" fill="#FFFF00" stroke="black" strokeWidth="2" />
            </svg>
          </div>
        ))}
      </div>

      <div className="max-w-2xl space-y-6 relative z-10 px-4 text-black">
        <h2 className="text-4xl md:text-6xl font-black uppercase pixel-font mb-4 tracking-tighter">
          Recolectando Polen...
        </h2>
        <div className="bg-white border-4 border-black p-6 shadow-hard-sm inline-block">
          <p className="text-xl md:text-2xl font-bold flex items-center justify-center gap-3">
            <Sparkles className="text-nounYellow fill-nounYellow" />
            La IA está destilando tu esencia artesanal
            <Sparkles className="text-nounYellow fill-nounYellow" />
          </p>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-5 h-5 bg-nounRed border-2 border-black shadow-hard-sm animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>

        <p className="text-sm font-black uppercase tracking-widest text-black/40 mt-12 animate-pulse">
          Procesando Trazabilidad • Generando Estrategia • Optimizando Diseño
        </p>
      </div>
    </div>
  );
};
