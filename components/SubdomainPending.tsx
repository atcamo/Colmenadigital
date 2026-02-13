
import React from 'react';
import { NounsGlasses } from './NounsGlasses';
import { Construction, Home, Instagram } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface Props {
  subdomain: string;
  onGoHome: () => void;
}

export const SubdomainPending: React.FC<Props> = ({ subdomain, onGoHome }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
      <div className="bg-nounYellow p-8 border-4 border-black shadow-hard-lg max-w-md w-full relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
          <Construction size={120} />
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-24 h-12 relative">
            <NounsGlasses className="w-full h-auto" color="#000" />
          </div>
        </div>

        <h1 className="text-3xl font-black uppercase pixel-font mb-4 leading-tight">
          Colmena en Preparación
        </h1>

        <div className="bg-black text-white px-4 py-2 font-mono text-xs mb-6 inline-block">
          {subdomain}.beenouns.xyz
        </div>

        <p className="font-bold text-sm text-gray-700 mb-8 leading-relaxed">
          Este espacio digital está siendo preparado por un Guardián de Abejas.
          Aún no ha sido verificado o está en proceso de cosecha.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-3 bg-white border-4 border-black py-3 font-black uppercase text-xs hover:bg-gray-50 hover:translate-y-[-2px] hover:shadow-hard-sm transition-all active:translate-y-[0px] active:shadow-none"
          >
            <Home size={16} /> Volver a la Central
          </button>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-black text-white border-4 border-black py-3 font-black uppercase text-xs hover:bg-nounRed transition-all"
          >
            <Instagram size={16} /> Ver novedades en Instagram
          </a>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 opacity-30 grayscale font-black uppercase text-[10px] tracking-widest">
        <span>BeeNouns Hive Network</span>
        <div className="w-1 h-1 bg-black rounded-full"></div>
        <span>Digital Preservation</span>
      </div>
    </div>
  );
};
