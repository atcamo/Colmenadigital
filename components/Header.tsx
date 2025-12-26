
import React from 'react';
import { NounsGlasses } from './NounsGlasses';
import { ArrowLeft } from 'lucide-react';
import { AppState } from '../types';

interface Props {
  currentState: AppState;
  onGoHome: () => void;
  onBack: () => void;
}

export const Header: React.FC<Props> = ({ currentState, onGoHome, onBack }) => {
  return (
    <header className="bg-nounYellow border-b-4 border-black p-3 sticky top-0 z-50 shadow-hard-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-4">
          {(currentState === AppState.FORM || currentState === AppState.RESULT) && (
            <button 
              onClick={onBack}
              className="p-2 bg-white border-2 border-black shadow-hard-sm hover:translate-y-1 hover:shadow-none transition-all"
              title="Volver"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <button onClick={onGoHome} className="flex items-center gap-2 group">
            {/* Tamaño re-ajustado: un poco más pequeño para elegancia */}
            <div className="w-8 md:w-12 h-5 md:h-7 relative flex items-center overflow-hidden">
                <NounsGlasses className="w-full h-auto" color="#E63433" />
            </div>
            <span className="hidden sm:inline font-black text-lg md:text-2xl uppercase pixel-font tracking-tighter group-hover:text-nounRed transition-colors -ml-1">
              BeeNouns
            </span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6 font-black uppercase text-sm tracking-widest">
            <span className="text-nounRed pixel-font text-[8px] opacity-70 tracking-tighter">La Colmena Digital</span>
        </div>
      </div>
    </header>
  );
};
