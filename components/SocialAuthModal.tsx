
import React from 'react';
import { BlockCard } from './BlockCard';
import { X as XIcon, Instagram, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProvider: (provider: 'x' | 'instagram' | 'farcaster') => void;
  farmName: string;
}

export const SocialAuthModal: React.FC<Props> = ({ isOpen, onClose, onSelectProvider, farmName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <BlockCard className="relative w-full max-w-md bg-white border-4 border-black overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black uppercase pixel-font leading-none mb-2">Asegura tu Colmena</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conéctate para guardar y editar "{farmName}" en el futuro.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all">
              <XIcon size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Instagram */}
            <button
              onClick={() => onSelectProvider('instagram')}
              className="w-full group flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-4 border-black shadow-hard-sm hover:-translate-y-1 hover:shadow-hard active:translate-y-0 active:shadow-none transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-2 text-white border-2 border-black">
                  <Instagram size={24} />
                </div>
                <div className="text-left">
                  <p className="font-black uppercase text-sm">Instagram</p>
                  <p className="text-[10px] font-bold text-gray-500">ACCESO RÁPIDO</p>
                </div>
              </div>
              <ArrowRight className="text-black/20 group-hover:text-black transition-colors" />
            </button>

            {/* X (Twitter) */}
            <button
              onClick={() => onSelectProvider('x')}
              className="w-full group flex items-center justify-between p-4 bg-gray-50 border-4 border-black shadow-hard-sm hover:-translate-y-1 hover:shadow-hard active:translate-y-0 active:shadow-none transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-black p-2 text-white border-2 border-black">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-black uppercase text-sm">X (Twitter)</p>
                  <p className="text-[10px] font-bold text-gray-500">PARA APICULTORES MODERNOS</p>
                </div>
              </div>
              <ArrowRight className="text-black/20 group-hover:text-black transition-colors" />
            </button>

            {/* Farcaster */}
            <button
              onClick={() => onSelectProvider('farcaster')}
              className="w-full group flex items-center justify-between p-4 bg-[#f1edfb] border-4 border-black shadow-hard-sm hover:-translate-y-1 hover:shadow-hard active:translate-y-0 active:shadow-none transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#855DCD] p-2 text-white border-2 border-black">
                  <Zap size={24} />
                </div>
                <div className="text-left">
                  <p className="font-black uppercase text-sm">Farcaster</p>
                  <p className="text-[10px] font-black text-[#855DCD]">WEB3 NATIVE</p>
                </div>
              </div>
              <ArrowRight className="text-black/20 group-hover:text-black transition-colors" />
            </button>
          </div>

          <div className="mt-8 flex gap-3 p-4 bg-nounBlue/10 border-2 border-nounBlue text-nounBlue">
            <ShieldCheck className="flex-shrink-0" size={20} />
            <p className="text-[10px] font-bold uppercase leading-tight">
              Tus datos están protegidos. Solo usamos esta red para confirmar que eres el dueño legítimo de esta colmena.
            </p>
          </div>
        </div>
      </BlockCard>
    </div>
  );
};
